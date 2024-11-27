const nodemailer = require("nodemailer");

const config = require("./config/config");

const transporter = nodemailer.createTransport({
  host: config.smtp.host,
  port: config.smtp.port,
  secure: true, // true for port 465, false for other ports
  auth: {
    user: config.smtp.username,
    pass: config.smtp.password,
  },
});

const sendEmail = async ({ to, subject, text, html }) => {
  return transporter.sendMail({
    from: config.smtp.username,
    to,
    subject,
    text,
    html,
  });
};

module.exports = {
  sendEmail,
};
