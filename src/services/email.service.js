const nodemailer = require('nodemailer');
const { AppError } = require('../utils/errorHandler');

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });
    }

    async sendEmail(options) {
        try {
            const mailOptions = {
                from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
                to: options.to,
                subject: options.subject,
                text: options.text,
                html: options.html
            };

            const info = await this.transporter.sendMail(mailOptions);
            console.log('Email sent: %s', info.messageId);
            return info;
        } catch (error) {
            console.error('Error sending email:', error);
            throw new AppError(500, 'Error sending email');
        }
    }

    async sendPasswordResetEmail(user, resetToken) {
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
        
        const html = `
            <h1>Password Reset Request</h1>
            <p>You requested to reset your password. Click the link below to reset it:</p>
            <a href="${resetUrl}">Reset Password</a>
            <p>This link is valid for 1 hour.</p>
            <p>If you didn't request this, please ignore this email.</p>
        `;

        await this.sendEmail({
            to: user.email,
            subject: 'Password Reset Request',
            text: `Reset your password: ${resetUrl}`,
            html
        });
    }

    async sendVerificationEmail(user, verificationToken) {
        const verifyUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;
        
        const html = `
            <h1>Verify Your Email</h1>
            <p>Thanks for registering! Please click the link below to verify your email:</p>
            <a href="${verifyUrl}">Verify Email</a>
            <p>This link is valid for 24 hours.</p>
        `;

        await this.sendEmail({
            to: user.email,
            subject: 'Email Verification',
            text: `Verify your email: ${verifyUrl}`,
            html
        });
    }
}

module.exports = new EmailService();