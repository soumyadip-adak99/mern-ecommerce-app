import nodemailer from "nodemailer";
import { welcomeMailHtmlBody } from "./mailHtmlTemplate.js";

const transporter = nodemailer.createTransport({
    service: "gmail",
    pool: true,
    pool: true,
    maxConnections: 5,
    maxMessages: 100,
    rateLimit: 10,
    secure: true,
    auth: {
        user: process.env.MAIL_ID,
        pass: process.env.MAIL_APP_PASSWORD,
    },
});

export const sendWelcomeEmail = async (to, name) => {
    try {
        if (!to) {
            throw new Error("Email not get");
        }

        let selfName = String(name || "").toUpperCase();

        let subject = `Welcome to ShopHub ${selfName}`;
        let html = welcomeMailHtmlBody(selfName);

        const mailOption = {
            from: process.env.MAIL_ID,
            to: to,
            subject: subject,
            html: html,
        };

        const info = await transporter.sendMail(mailOption);
        console.log("Email send successfully: ", info.messageId);
        return info;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
