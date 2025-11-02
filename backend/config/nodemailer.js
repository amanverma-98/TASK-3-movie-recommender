// import nodemailer from "nodemailer";

// const transporter = nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     port: 465,
//     secure: true,
//     auth:{
//         user: process.env.SENDER_EMAIL,
//         pass: process.env.EMAIL_APP_PASSWORD
//     }
// })

// export default transporter;

import sgMail from '@sendgrid/mail';


sgMail.setApiKey(process.env.SENDGRID_API_KEY);


const sendMail = async (mailOptions) => {
   
    const msg = {
        to: mailOptions.to,
        from: process.env.SENDER_EMAIL, 
        subject: mailOptions.subject,
        text: mailOptions.text,

    };

    try {
        await sgMail.send(msg);
        console.log('Email sent successfully via SendGrid');
    } catch (error) {
        console.error('Failed to send email via SendGrid:', error.response ? error.response.body : error);
        throw new Error('Failed to send email.');
    }
};

const transporter = {
    sendMail: sendMail
};

export default transporter;