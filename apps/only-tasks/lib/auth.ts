import bcrypt from 'bcryptjs'
import crypto from 'crypto'

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12)
  return bcrypt.hash(password, salt)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function generateToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

export function generateUserId(): string {
  return `user-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`
}

export function generateTokenId(): string {
  return `token-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function createTokenExpiry(hours: number = 24): Date {
  const expiry = new Date()
  expiry.setHours(expiry.getHours() + hours)
  return expiry
}