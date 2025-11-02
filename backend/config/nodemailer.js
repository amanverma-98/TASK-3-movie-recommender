import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user: process.env.SENDER_EMAIL,
        pass: process.env.EMAIL_APP_PASSWORD
    }
})

export default transporter;