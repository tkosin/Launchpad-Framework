import sqlite3 from "sqlite3"
import { open, type Database } from "sqlite"
import bcrypt from "bcryptjs"

let db: Database | null = null

export type UserRole = "user" | "admin"

export interface User {
  id: number
  name: string
  email: string
  password: string
  role: UserRole
  avatar?: string
  company?: string
}

export async function getDb() {
  if (!db) {
    // In a real app, you'd use a persistent file path
    // For this demo, we'll use an in-memory database
    db = await open({
      filename: ":memory:",
      driver: sqlite3.Database,
    })

    // Create tables
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL,
        avatar TEXT,
        company TEXT
      )
    `)

    // Create demo users if they don't exist
    const adminUser = await db.get("SELECT * FROM users WHERE email = ?", ["admin@facgure.com"])
    if (!adminUser) {
      const hashedPassword = await bcrypt.hash("admin123", 10)
      await db.run("INSERT INTO users (name, email, password, role, avatar, company) VALUES (?, ?, ?, ?, ?, ?)", [
        "Admin User",
        "admin@facgure.com",
        hashedPassword,
        "admin",
        "/avatars/avatar-1.png",
        "Facgure Technologies",
      ])
    }

    const regularUser = await db.get("SELECT * FROM users WHERE email = ?", ["user@facgure.com"])
    if (!regularUser) {
      const hashedPassword = await bcrypt.hash("user123", 10)
      await db.run("INSERT INTO users (name, email, password, role, avatar, company) VALUES (?, ?, ?, ?, ?, ?)", [
        "อภิชาติ นิลมณีติ",
        "user@facgure.com",
        hashedPassword,
        "user",
        "/diverse-group.png",
        "บริษัท โซลาร์เอเชีย.เท็ค จำกัด",
      ])
    }
  }

  return db
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  const db = await getDb()
  return db.get<User>("SELECT * FROM users WHERE email = ?", [email])
}

export async function verifyPassword(user: User, password: string): Promise<boolean> {
  return bcrypt.compare(password, user.password)
}
