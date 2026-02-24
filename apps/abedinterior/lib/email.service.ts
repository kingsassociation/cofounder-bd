import nodemailer from "nodemailer";
interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}
class EmailService {
  private transporter: nodemailer.Transporter | null = null;
  constructor() {
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SERVICE } =
      process.env;
    if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
      const port = parseInt(SMTP_PORT || "587");
      this.transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: port,
        secure: port === 465,
        auth: {
          user: SMTP_USER,
          pass: SMTP_PASS,
        },
        ...(SMTP_SERVICE ? { service: SMTP_SERVICE } : {}),
      });
    } else {
      console.warn("Email service not configured: SMTP credentials missing");
    }
  }
  async sendEmail(options: EmailOptions): Promise<boolean> {
    if (!this.transporter) {
      console.warn("Email service not configured, skipping email send");
      return false;
    }
    try {
      const from = process.env.SMTP_USER || "noreply@abedinterior.com";
      const mailOptions = {
        from: `"StyleHunt BD" <${from}>`,
        to: Array.isArray(options.to) ? options.to.join(", ") : options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      };
      const info = await this.transporter.sendMail(mailOptions);
      console.log(`Email sent successfully: ${info.messageId}`);
      return true;
    } catch (error) {
      console.error(`Failed to send email: ${error}`);
      return false;
    }
  }
  async sendOrderCompletedEmail(
    userEmail: string,
    userName: string,
    orderDetails: {
      orderId: string;
      totalPrice: number;
      status: string;
      itemsCount: number;
    },
  ): Promise<boolean> {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Order Completed successfully</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #2c3e50;">Order Completed successfully</h2>
            <p>Dear ${userName},</p>
            <p>Your order has been completed!</p>
            <div style="background-color: #f4f4f4; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Order Details:</h3>
              <p><strong>Order ID:</strong> #${orderDetails.orderId.slice(-6)}</p>
              <p><strong>Items:</strong> ${orderDetails.itemsCount}</p>
              <p><strong>Total:</strong> ৳${orderDetails.totalPrice.toLocaleString()}</p>
              <p><strong>Status:</strong> ${orderDetails.status}</p>
            </div>
            <p>Thank you for shopping with StyleHunt BD!</p>
            <p>Best regards,<br>StyleHunt BD Team</p>
          </div>
        </body>
      </html>
    `;
    return this.sendEmail({
      to: userEmail,
      subject: "Order Completed successfully - StyleHunt BD",
      html,
    });
  }
  async sendOrderStatusUpdate(
    userEmail: string,
    userName: string,
    orderDetails: {
      orderId: string;
      status: string;
    },
  ): Promise<boolean> {
    const statusMessages: Record<string, string> = {
      PROCESSING: "Your order is being processed.",
      SHIPPED: "Your order has been shipped!",
      DELIVERED: "Your order has been delivered using our fast delivery.",
      CANCELLED: "Your order has been cancelled.",
    };
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Order Status Update</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #2c3e50;">Order Status Update</h2>
            <p>Dear ${userName},</p>
            <p>${statusMessages[orderDetails.status] ||
      "Your order status has been updated."
      }</p>
            <div style="background-color: #f4f4f4; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p><strong>Order ID:</strong> #${orderDetails.orderId.slice(-6)}</p>
              <p><strong>Status:</strong> ${orderDetails.status}</p>
            </div>
            <p>Thank you for shopping with StyleHunt BD!</p>
            <p>Best regards,<br>StyleHunt BD Team</p>
          </div>
        </body>
      </html>
    `;
    return this.sendEmail({
      to: userEmail,
      subject: `Order Status Update - ${orderDetails.status} - StyleHunt BD`,
      html,
    });
  }
  async sendPasswordResetEmail(
    userEmail: string,
    resetLink: string,
  ): Promise<boolean> {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Reset Your Password</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #2c3e50;">Reset Your Password</h2>
            <p>We received a request to reset your password for your StyleHunt BD account.</p>
            <p>Click the button below to reset it:</p>
            <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; background-color: #0ea5e9; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0;">Reset Password</a>
            <p>Or copy and paste this link into your browser:</p>
            <p>${resetLink}</p>
            <p>If you didn't request this, you can safely ignore this email.</p>
            <p>This link will expire in 1 hour.</p>
            <p>Best regards,<br>StyleHunt BD Team</p>
          </div>
        </body>
      </html>
    `;
    return this.sendEmail({
      to: userEmail,
      subject: "Reset Your Password - StyleHunt BD",
      html,
    });
  }
}
export const emailService = new EmailService();
