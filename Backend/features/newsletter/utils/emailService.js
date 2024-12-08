const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables from a .env file

// Configure email transporter
const transporter = nodemailer.createTransport({
    service: 'gmail', // Or use 'Yahoo', 'Outlook', etc.
    auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS, // Your email password or app-specific password
    },
});

// Send an email
async function sendEmail(to, subject, text, html = null) {
    const mailOptions = {
        from: process.env.EMAIL_USER, // Sender email
        to, // Recipient(s)
        subject, // Email subject
        text, // Plain text body
        html, // Optional HTML body
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to: ${to}`);
}

module.exports = {
    sendEmail,
};
