import nodemailer from 'nodemailer'

const SMTP_CONFIG = {
  host: 'email-smtp.us-east-1.amazonaws.com',
  port: 587,
  secure: false,
  auth: {
    user: 'AKIAQQIGIQ3E6V2TZIIR',
    pass: 'BNz3/VmUR/ToEwTTlTyGIxxXw1BPuk2+cX5UuxR6pBg+'
  }
}

const transporter = nodemailer.createTransport(SMTP_CONFIG)

export async function sendPasswordResetEmail(email: string, token: string, spaceId: string) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/${spaceId}?token=${token}`
  
  const mailOptions = {
    from: 'noreply@only-tasks.com',
    to: email,
    subject: `Password Reset for Space "${spaceId}"`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Password Reset Request</h2>
        <p>You requested a password reset for your account in space "${spaceId}".</p>
        <p>Click the link below to reset your password:</p>
        <p><a href="${resetUrl}" style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Reset Password</a></p>
        <p>This link will expire in 24 hours.</p>
        <p>If you didn't request this reset, you can ignore this email.</p>
      </div>
    `
  }

  await transporter.sendMail(mailOptions)
}

export async function sendLoginTokenEmail(email: string, token: string, spaceId: string) {
  const loginUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/${spaceId}?token=${token}`
  
  const mailOptions = {
    from: 'noreply@only-tasks.com',
    to: email,
    subject: `Login Link for Space "${spaceId}"`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Secure Login Link</h2>
        <p>Click the link below to access your space "${spaceId}":</p>
        <p><a href="${loginUrl}" style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Access Space</a></p>
        <p>This link will expire in 24 hours.</p>
        <p>If you didn't request this login link, you can ignore this email.</p>
      </div>
    `
  }

  await transporter.sendMail(mailOptions)
}

export async function sendEmailVerificationPin(email: string, pin: string, spaceId: string) {
  const mailOptions = {
    from: 'noreply@only-tasks.com',
    to: email,
    subject: `Email Verification for Space "${spaceId}"`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Email Verification</h2>
        <p>To verify your email and create space "${spaceId}", please use the following 6-digit PIN:</p>
        <div style="background: #f8f9fa; border: 2px solid #007bff; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
          <h1 style="font-size: 32px; letter-spacing: 8px; margin: 0; color: #007bff;">${pin}</h1>
        </div>
        <p>This PIN will expire in 15 minutes.</p>
        <p>If you didn't request this verification, you can ignore this email.</p>
      </div>
    `
  }

  await transporter.sendMail(mailOptions)
}