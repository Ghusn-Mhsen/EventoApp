const nodemailer = require('nodemailer');

require('dotenv').config();


async function sendEmail(email, subject, message) {
    try {


        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return false
        }

        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.MAIL_USER,
            to: email,
            subject,
            text: message,
        }

        await transporter.sendMail(mailOptions);
        console.log(`Email sent successfully to ${email}`);
        return true; 
    } catch (error) {
        return false
    }
}


module.exports = sendEmail;