require('dotenv').config({ path: '.env.local' });
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

async function run() {
  try {
    const info = await transporter.sendMail({
      from: \"Ventoo Calendar" <\>\,
      to: process.env.GMAIL_USER,
      subject: "Test email",
      text: "Test email content"
    });
    console.log("Email sent:", info.response);
  } catch(e) {
    console.error("Email Error:", e);
  }
}
run();
