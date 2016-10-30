import Mailer from './mailer';
import ValidationEmail from '../templates/ValidationEmail';
import ResetPasswordEmail from '../templates/ResetPasswordEmail';
import { BASE_URL } from '../../src/config';

class AppMailer extends Mailer {

    constructor() {
        super();
    }

    sendValidationEmail(to, { name, validation_link }) {
        const link = `${BASE_URL}/validate?c=${encodeURIComponent(validation_link)}`;
    	return this.sendMail({ 
    		from: 'noreply@agape.io',
    		to,
    		subject: 'Welcome to Agape Communion! Please validate your account.',
    		html: ValidationEmail(name, link),
            errorMsg: "Sorry, we failed to send you a validation email. Please try logging in with your account few minutes later."
    	});
    }

    sendResetPasswordEmail(to, resetLink, name){
        const link = `${BASE_URL}/newpassword?c=${encodeURIComponent(resetLink)}`;
        return this.sendMail({
            from: 'noreply@agape.io',
            to,
            subject: 'Password reset from Agape Communion!',
            html: ResetPasswordEmail(name, link),
            errorMsg: 'Failed to send password reset email.'
        });
    }

    static getInstance(){
    	return new AppMailer();
    }

}

export default AppMailer.getInstance();

