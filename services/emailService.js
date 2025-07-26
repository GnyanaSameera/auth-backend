import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransporter({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  generateVerificationEmail(firstName, verificationLink) {
    return {
      subject: 'Verify Your Email Address - SecureAuth',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb;">Welcome, ${firstName}!</h1>
          <p>Thank you for registering with SecureAuth. Please verify your email address by clicking the button below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationLink}" 
               style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Verify Email Address
            </a>
          </div>
          <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #6b7280;">${verificationLink}</p>
          <p>If you did not request this email, you can safely ignore it.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px;">This is an automated email from SecureAuth.</p>
        </div>
      `,
      text: `Welcome, ${firstName}!\n\nPlease verify your email by visiting: ${verificationLink}\n\nIf you did not request this, please ignore this email.`
    };
  }

  generateApprovalEmail(firstName, lastName, loginLink) {
    return {
      subject: '🎉 Account Approved - Welcome to SecureAuth!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #059669;">Congratulations, ${firstName} ${lastName}!</h1>
          <p>Your account has been approved! 🎉</p>
          <p>You can now log in to your account using the button below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${loginLink}" 
               style="background-color: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Login Now
            </a>
          </div>
          <p>Thank you for joining SecureAuth!</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px;">This is an automated email from SecureAuth.</p>
        </div>
      `,
      text: `Congratulations, ${firstName} ${lastName}!\n\nYour account has been approved!\nLogin: ${loginLink}\n\nThank you for joining SecureAuth!`
    };
  }

  generateRejectionEmail(firstName, reason) {
    return {
      subject: 'Account Application Update - SecureAuth',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #dc2626;">Hello ${firstName},</h1>
          <p>We appreciate your interest in SecureAuth. Unfortunately, your account application was not approved at this time.</p>
          ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
          <p>If you have any questions or believe this was a mistake, please feel free to reach out to our support team.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px;">This is an automated email from SecureAuth.</p>
        </div>
      `,
      text: `Hello ${firstName},\n\nUnfortunately, your application was not approved.${reason ? `\nReason: ${reason}` : ''}\n\nIf you have questions, please contact our support team.`
    };
  }

  generateAdminNotificationEmail(adminName, newUser, adminPanelLink) {
    return {
      subject: '🔔 New User Registration Pending Approval - SecureAuth',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #7c3aed;">Hello ${adminName},</h1>
          <p>A new user has registered and is awaiting approval:</p>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 6px; margin: 20px 0;">
            <p><strong>Name:</strong> ${newUser.firstName} ${newUser.lastName}</p>
            <p><strong>Email:</strong> ${newUser.email}</p>
            <p><strong>Registered At:</strong> ${new Date(newUser.createdAt).toLocaleString()}</p>
          </div>
          <p>Please log in to the admin panel to review and take action:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${adminPanelLink}" 
               style="background-color: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Open Admin Panel
            </a>
          </div>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px;">This is an automated email from SecureAuth.</p>
        </div>
      `,
      text: `Hello ${adminName},\n\nA new user is waiting for approval:\nName: ${newUser.firstName} ${newUser.lastName}\nEmail: ${newUser.email}\nRegistered At: ${new Date(newUser.createdAt).toLocaleString()}\n\nAdmin Panel: ${adminPanelLink}`
    };
  }

  async sendEmail(to, template) {
    try {
      const mailOptions = {
        from: `"SecureAuth" <${process.env.EMAIL_USER}>`,
        to,
        subject: template.subject,
        text: template.text,
        html: template.html,
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('✅ Email sent:', result.messageId);
      return true;
    } catch (error) {
      console.error('❌ Failed to send email:', error);
      return false;
    }
  }
}

export default new EmailService(); 