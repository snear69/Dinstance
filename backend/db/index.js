import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { v4 as uuidv4 } from 'uuid';

const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, 'db.json');

// Default data structure
const defaultData = { 
  users: [], 
  wallets: [], 
  transactions: [], 
  carts: [],
  otps: [],
  admins: [
    // Default admin account
    {
      id: 'admin-001',
      email: 'admin@oracle.dev',
      // Password: OracleAdmin2025! (hashed with bcrypt)
      passwordHash: '$2a$10$placeholder', // Will be set on first run
      name: 'Oracle Admin',
      role: 'super_admin',
      createdAt: new Date().toISOString()
    }
  ]
};

const adapter = new JSONFile(file);
const db = new Low(adapter, defaultData);

// Initialize database
export async function initDB() {
  await db.read();
  db.data ||= defaultData;
  await db.write();
  return db;
}

// Helper to get or initialize DB connection
export async function getDB() {
  await db.read();
  return db;
}

// Helper to generate IDs
export function generateId() {
  return uuidv4();
}

// Helper to get current timestamp
export function timestamp() {
  return new Date().toISOString();
}

export default db;
