import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import db from './config/db.js';
import sendVerificationEmail from './utils/sendMail.js';
import path from "path";
import { fileURLToPath } from "url";

// =====================================
// Resolve __dirname (required for ES Modules)
// =====================================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

// =====================================
// Initialize server
// =====================================
const app = express();

// =====================================
// Static file hosting (Assets folder)
// Accessible as: http://localhost:5000/assets/xxx.jpg
// =====================================
app.use('/assets', express.static(path.join(__dirname, 'assets')));


app.use(cors());
app.use(express.json());

// ------------------------ 
// LOGIN
// ------------------------
app.get('/auth/validate', async (req, res) => {
  const { email, password, userType } = req.query;

  if (!email || !password)
    return res.status(400).json({ error: "Email and password required" });

  if (userType === 'player'){
    const query = "SELECT id, email, password_hash, name, phone, is_active FROM players WHERE email = ?";

    db.query(query, [email], async (err, results) => {
      if (err) return res.status(500).json({ error: "Database error" });

      if (results.length === 0)
        return res.status(401).json({ error: "Invalid email or password" });

      const user = results[0];

      if (user.is_active === 0)
        return res.status(403).json({ error: "Please verify your email first" });

      const match = await bcrypt.compare(password, user.password_hash);

      if (!match)
        return res.status(401).json({ error: "Invalid email or password" });

      return res.json({
        authenticated: true,
        message: "Login successful",
        userId: user.id,
        email: user.email,
        name: user.name
      });
    });
  } else if (userType === 'owner') {
    const query = "SELECT id, name, email, phone, password_hash FROM arena_owners WHERE email = ?";
    db.query(query, [email], async (err, results) => {
      if (err) return res.status(500).json({ error: "Database error" });
      if (results.length === 0)
        return res.status(401).json({ error: "Invalid email or password" });
      const user = results[0];
      if(user.is_active === 0)
        return res.status(403).json({ error: "Please verify your email first" });
      const match = await bcrypt.compare(password, user.password_hash);
      if (!match)
        return res.status(401).json({ error: "Invalid email or password" });
      return res.json({
        authenticated: true,
        message: "Login successful",
        userId: user.id,
        email: user.email,
        name: user.name
      });
    });
  } else {
    return res.status(400).json({ error: "Invalid user type" });
  }  
});

// ------------------------
// SIGNUP
// ------------------------
app.post('/auth/signup', async (req, res) => {
  const { email, password, name, phone, userType } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Email and password required" });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email))
    return res.status(400).json({ error: "Invalid email format" });

  if (userType === 'player') {
    db.query("SELECT id FROM players WHERE email = ?", [email], async (err, results) => {
      if (results.length > 0)
        return res.status(409).json({ error: "Email already registered" });

      const passwordHash = await bcrypt.hash(password, 10);
      const token = crypto.randomBytes(32).toString("hex");

      const insert = `
        INSERT INTO players (email, password_hash, name, phone, is_active, verification_token)
        VALUES (?, ?, ?, ?, 0, ?)
      `;

      db.query(insert, [email, passwordHash, name, phone, token], async (err, _) => {
        if (err) return res.status(500).json({ error: "Database insert failed" });

        await sendVerificationEmail(email, token);

        return res.status(201).json({
          message: "Account created. Check your email to verify."
        });
      });
    });
  } else if (userType === 'owner') {
    db.query("SELECT id FROM arena_owners WHERE email = ?", [email], async (err, results) => {
      if (results.length > 0)
        return res.status(409).json({ error: "Email already registered" });

      const passwordHash = await bcrypt.hash(password, 10);
      const token = crypto.randomBytes(32).toString("hex");

      const insert = `
        INSERT INTO arena_owners (name, email, phone, password_hash,  is_active, verification_token)
        VALUES (?, ?, ?, ?, 0, ?)
      `;

      db.query(insert, [name, email, phone, passwordHash, token], async (err, _) => {
        if (err) return res.status(500).json({ error: "Database insert failed" });

        await sendVerificationEmail(email, token);

        return res.status(201).json({
          message: "Account created. Check your email to verify."
        });
      });
    });
  } else {
    return res.status(400).json({ error: "Invalid user type" });
  }
});

// ------------------------
// VERIFY EMAIL FOR BOTH USERS
// ------------------------
app.get('/auth/verify', (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).send('Invalid verification link');
  }

  // Query 1: Check in players
  const verifyPlayer = `
    UPDATE players 
    SET is_active = 1, verification_token = NULL 
    WHERE verification_token = ?
  `;

  // Query 2: Check in arena_owners
  const verifyOwner = `
    UPDATE arena_owners 
    SET is_active = 1, verification_token = NULL 
    WHERE verification_token = ?
  `;

  // Try verifying as a player first
  db.query(verifyPlayer, [token], (err, playerResult) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send('Server error');
    }

    if (playerResult.affectedRows > 0) {
      // Player verified successfully
      return res.redirect(`${process.env.FRONTEND_URL}/?verified=1&type=player`);
    }

    // If no player was verified, try arena owner
    db.query(verifyOwner, [token], (err, ownerResult) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).send('Server error');
      }

      if (ownerResult.affectedRows > 0) {
        // Owner verified successfully
        return res.redirect(`${process.env.FRONTEND_URL}/?verified=1&type=owner`);
      }

      // If token matches neither table
      return res.status(400).send('Invalid or expired token');
    });
  });
});

// =====================================
// GET ALL ARENAS + main arena image
// =====================================
app.get('/arenas', (req, res) => {
  const query = `
    SELECT 
      a.id,
      a.name,
      a.city AS location,
      a.pricePerHour,
      a.availability,
      a.rating,
      (
        SELECT ai.image_path
        FROM arena_images ai
        WHERE ai.arena_id = a.id
        ORDER BY ai.id ASC
        LIMIT 1
      ) AS image_path
    FROM arenas a
    LEFT JOIN arena_images ai ON ai.arena_id = a.id
    ORDER BY a.id DESC
  `;

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });

    return res.json(results);
  });
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
