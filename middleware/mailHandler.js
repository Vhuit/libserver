const nodemailer = require('nodemailer');

// to load environment variables from a .env file into process.env
const dotenv = require('dotenv');
dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

const sendMail = async ({ to, subject, text, from ='no-reply@testapp.com'}, next) => {
    try {
        const mailOptions = {
            from,
            to,
            subject,
            text
        };
        await transporter.sendMail(mailOptions);
    } catch (error) {
        next(error);
    }
}

module.exports = sendMail;