import mysql from 'mysql2/promise';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config(); // load .env variables

const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

async function runDDL() {
  const ddl = fs.readFileSync('./sql/courtify_db.sql', 'utf8');

  // Connect without a database first to create it
  const conn = await mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    multipleStatements: true
  });

  // Separate CREATE DATABASE from the rest
  const statements = ddl.split(/;\s*\n/); // split on semicolon+newline
  await conn.query(statements[0]); // CREATE DATABASE
  await conn.end();

  // Connect to the new database
  const dbConn = await mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    multipleStatements: true
  });

  // Run the rest of the SQL (skip CREATE DATABASE)
  await dbConn.query(statements.slice(1).join(';\n'));
  await dbConn.end();
}

runDDL().catch(console.error);
