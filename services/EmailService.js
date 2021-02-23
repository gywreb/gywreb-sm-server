const nodemailer = require("nodemailer");

exports.EmailService = class EmailService {
  static init() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_PASSWORD,
      },
    });
    return this;
  }

  static async sendEmail(email, subject, message, next) {
    try {
      return await this.transporter.sendMail({
        from: `${process.env.SENDER_NAME} <${process.env.SENDER_EMAIL}>`,
        to: email,
        subject,
        text: message,
      });
    } catch (error) {
      next(error);
    }
  }
};
