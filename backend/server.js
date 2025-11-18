import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import db from './config/db.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// GET endpoint to validate player login
// Query params: ?email=<email>&password=<password>
app.get('/auth/validate', async (req, res) => {
  const { email, password } = req.query;

  // Validation
  if (!email || !password) {
    return res.status(400).json({ 
      error: 'Missing required parameters: email, password' 
    });
  }

  try {
    const query = 'SELECT id, email, password_hash, name, phone FROM players WHERE email = ?';

    db.query(query, [email], async (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database query failed' });
      }

      if (results.length === 0) {
        return res.status(401).json({ 
          error: 'Invalid email or password',
          authenticated: false 
        });
      }

      const user = results[0];
      
      // Compare password using bcrypt
      try {
        const passwordMatch = await bcrypt.compare(password, user.password_hash);
        
        if (passwordMatch) {
          return res.status(200).json({ 
            authenticated: true,
            message: 'Authentication successful',
            userId: user.id,
            email: user.email,
            name: user.name
          });
        } else {
          return res.status(401).json({ 
            error: 'Invalid email or password',
            authenticated: false 
          });
        }
      } catch (bcryptErr) {
        console.error('Bcrypt error:', bcryptErr);
        return res.status(500).json({ error: 'Password comparison failed' });
      }
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST endpoint for player signup
// Body: { email, password, name, phone (optional) }
app.post('/auth/signup', async (req, res) => {
  const { email, password, name, phone } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json({ 
      error: 'Email and password are required' 
    });
  }

  // Password strength validation (minimum 6 characters)
  if (password.length < 6) {
    return res.status(400).json({ 
      error: 'Password must be at least 6 characters long' 
    });
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      error: 'Invalid email format' 
    });
  }

  try {
    // Check if email already exists
    db.query('SELECT id FROM players WHERE email = ?', [email], async (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database query failed' });
      }

      if (results.length > 0) {
        return res.status(409).json({ 
          error: 'Email already registered' 
        });
      }

      // Hash password
      try {
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // Insert new player with columns: email, phone, name, password_hash, is_active, created_at, updated_at
        const insertQuery = 'INSERT INTO players (email, password_hash, name, phone, is_active) VALUES (?, ?, ?, ?, 1)';
        db.query(insertQuery, [email, passwordHash, name || null, phone || null], (err, result) => {
          if (err) {
            console.error('Database insert error:', err);
            return res.status(500).json({ error: 'Failed to create account' });
          }

          return res.status(201).json({ 
            message: 'Player account created successfully',
            userId: result.insertId,
            email: email,
            name: name || null,
            phone: phone || null
          });
        });
      } catch (bcryptErr) {
        console.error('Bcrypt error:', bcryptErr);
        return res.status(500).json({ error: 'Password hashing failed' });
      }
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
