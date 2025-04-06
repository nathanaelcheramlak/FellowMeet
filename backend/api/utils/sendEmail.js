import nodemailer from 'nodemailer';

const sendEmail = async (to, subject, emailType, link) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    const htmlContent = generateEmailTemplate(emailType, link);
    const text = `${subject}\n Click the link below\n ${link}`;
    const mailOptions = {
        from: process.env.EMAIL,
        to,
        subject,
        text,
        html: htmlContent,
    };
};

export default sendEmail;