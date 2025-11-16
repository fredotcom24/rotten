import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
})

const APP_URL = process.env.APP_URL || 'http://localhost:3000'
const EMAIL_FROM = process.env.EMAIL_FROM || 'noreply@rottentomatoes.com'

export async function sendVerificationEmail(email, token, name) {
  const verificationUrl = `${APP_URL}/auth/verify-email?token=${token}`

  const mailOptions = {
    from: EMAIL_FROM,
    to: email,
    subject: 'Verify Your Email - Rotten Tomatoes',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #1a1a1a; color: #ffffff; padding: 20px; border-radius: 8px;">
        <h2 style="color: #e50914;">Welcome to Rotten Tomatoes${name ? `, ${name}` : ''}!</h2>
        <p style="color: #e0e0e0;">Thank you for registering. Please verify your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}"
             style="background-color: #e50914; color: white; padding: 12px 30px;
                    text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
            Verify Email
          </a>
        </div>
        <p style="color: #e0e0e0;">Or copy and paste this link in your browser:</p>
        <p style="color: #b0b0b0; word-break: break-all; background-color: #2a2a2a; padding: 10px; border-radius: 4px;">${verificationUrl}</p>
        <p style="color: #888888; font-size: 12px; margin-top: 30px;">
          This link will expire in 24 hours. If you didn't create an account, please ignore this email.
        </p>
      </div>
    `
  }

  await transporter.sendMail(mailOptions)
}

export async function sendEmailChangeVerification(currentEmail, newEmail, token, name) {
  const verificationUrl = `${APP_URL}/auth/verify-email-change?token=${token}`

  const mailOptions = {
    from: EMAIL_FROM,
    to: newEmail,
    subject: 'Verify Email Change - Rotten Tomatoes',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #1a1a1a; color: #ffffff; padding: 20px; border-radius: 8px;">
        <h2 style="color: #e50914;">Email Change Request</h2>
        <p style="color: #e0e0e0;">Hello${name ? ` ${name}` : ''},</p>
        <p style="color: #e0e0e0;">You requested to change your email from <strong style="color: #ffffff;">${currentEmail}</strong> to <strong style="color: #ffffff;">${newEmail}</strong>.</p>
        <p style="color: #e0e0e0;">Please verify this change by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}"
             style="background-color: #e50914; color: white; padding: 12px 30px;
                    text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
            Verify Email Change
          </a>
        </div>
        <p style="color: #e0e0e0;">Or copy and paste this link in your browser:</p>
        <p style="color: #b0b0b0; word-break: break-all; background-color: #2a2a2a; padding: 10px; border-radius: 4px;">${verificationUrl}</p>
        <p style="color: #888888; font-size: 12px; margin-top: 30px;">
          This link will expire in 1 hour. If you didn't request this change, please ignore this email.
        </p>
      </div>
    `
  }

  await transporter.sendMail(mailOptions)
}

export async function sendPasswordChangeVerification(email, token, name) {
  const verificationUrl = `${APP_URL}/auth/verify-password-change?token=${token}`

  const mailOptions = {
    from: EMAIL_FROM,
    to: email,
    subject: 'Verify Password Change - Rotten Tomatoes',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #1a1a1a; color: #ffffff; padding: 20px; border-radius: 8px;">
        <h2 style="color: #e50914;">Password Change Request</h2>
        <p style="color: #e0e0e0;">Hello${name ? ` ${name}` : ''},</p>
        <p style="color: #e0e0e0;">You requested to change your password. Please verify this change by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}"
             style="background-color: #e50914; color: white; padding: 12px 30px;
                    text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
            Verify Password Change
          </a>
        </div>
        <p style="color: #e0e0e0;">Or copy and paste this link in your browser:</p>
        <p style="color: #b0b0b0; word-break: break-all; background-color: #2a2a2a; padding: 10px; border-radius: 4px;">${verificationUrl}</p>
        <p style="color: #888888; font-size: 12px; margin-top: 30px;">
          This link will expire in 1 hour. If you didn't request this change, please secure your account immediately.
        </p>
      </div>
    `
  }

  await transporter.sendMail(mailOptions)
}

export function generateVerificationToken() {
  return Math.random().toString(36).substring(2) +
         Math.random().toString(36).substring(2) +
         Date.now().toString(36)
}
