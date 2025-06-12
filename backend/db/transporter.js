const nodemailer = require("nodemailer");
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST, // Mercury działa lokalnie
  port: 465, // lub inny ustawiony port
  secure: true, // Mercury nie używa TLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  }
});

module.exports = transporter;