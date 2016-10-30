import nodemailer from 'nodemailer';
import smtpTransport from "nodemailer-smtp-transport";

const TRANSPORT = new WeakMap();

class Mailer {

    constructor() {
        const transport = nodemailer.createTransport(smtpTransport({
            host: "mailtrap.io",
            secureConnection: false,
            port: 2525,
            auth: {
                user: "bb3be4e863905f",
                pass: "fd0cafae17d789"
            }
        }));
        TRANSPORT.set(this, transport);
    }

    sendMail({ from, to, subject, html, errorMsg }) {
        return new Promise((res, rej) => {
            const mailOptions = { from, to, subject, html };
            TRANSPORT.get(this).sendMail(mailOptions, function(error, info) {
                if (error) {
                	rej({ status: 500, message: errorMsg });
                } else {
                    res(info);
                }
            });
        });
    }

}

export default Mailer;
