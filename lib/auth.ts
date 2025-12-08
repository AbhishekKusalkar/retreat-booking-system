import * as crypto from "crypto"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"

export interface AuthPayload {
  adminId: string
  email: string
  role: string
}

export function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex")
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash
}

export function generateToken(payload: AuthPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" })
}

export function verifyToken(token: string): AuthPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthPayload
    return decoded
  } catch {
    return null
  }
}
