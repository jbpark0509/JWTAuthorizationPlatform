'use strict';

import User from '../models/User';
import Token from '../models/Token';
import moment from 'moment';

class AuthController {

    constructor() {

    }

    /**
     * Registers a new user and sends verification email
     */

    register(req, res) {
        const { fname, lname, email, password, profile_photo_url, gender } = req.body;
        const last_ip = req.ip;
        const verified = false;
        const user = new User({ fname, lname, email, password, profile_photo_url, 'meta.gender' : gender, verified, last_ip });
        if (fname, lname, email, password) {
            user.register()
                .then((resp) => {
                    //If Production set secure to true
                    res.cookie('r', resp.rtoken, { maxAge: 2592000000, httpOnly: true });
                    res.cookie('a', resp.atoken, { maxAge: 600000, httpOnly: true });
                    res.cookie('csrf', resp.csrftoken, { maxAge: 2592000000 });
                    res.status(resp.status).json({ success: true, message: resp.message });
                })
                .catch((err) => {
                    res.status(err.status).json({ success: false, message: err.message });
                });
        } else {
            res.status(400).json({ success: false, message: 'Please complete all fields in registeration.' });
        }

    }

    /**
     * Login user and set cookies to browser
     */

    login(req, res) {
        const { email, password } = req.body;
        const last_ip = req.ip;
        const user = new User({ email, password, last_ip, updated_at: new Date() });
        if (email && password) {
            user.login()
                .then((resp) => {
                    res.cookie('r', resp.rtoken, { maxAge: 2592000000, httpOnly: true });
                    res.cookie('a', resp.atoken, { maxAge: 600000, httpOnly: true });
                    res.cookie('csrf', resp.csrftoken, { maxAge: 2592000000 });
                    res.status(resp.status).json({ success: true, user: resp.user });
                })
                .catch((err) => {
                    res.status(err.status).json({ success: false, message: err.message });
                })
        } else {
            res.status(400).json({ success: false, message: 'Email and/or password is missing.' });
        }

    }

    /**
     * Logout User
     */
    
    logout(req, res) {
        const rtoken = req.cookies.r;
        Token.getTokenInfo(rtoken)
        .then(({ status, rData }) => {
            const newToken = new Token({ value: rtoken, expireAt: moment.unix(rData.exp).toDate() });
            newToken.addToken();
        })
        .catch(() => {
        })
        .then(() => {
            res.clearCookie('a');
            res.clearCookie('r');
            res.clearCookie('csrf');
            res.status(200).json("Logout");
        });
    }

    /**
     * Send email for new password
     */

    resetPassword(req, res) {
        const { email } = req.body;
        if (email) {
            User.resetPassword(email)
                .then(() => {
                    res.status(200).json({ success: true, message: 'Reset email has been sent' });
                })
                .catch(({ status, message }) => {
                    res.status(status).json({ success: false, message });
                });
        } else {
            res.status(400).json({ success: false, message: 'Email is missing' });
        }

    }

    /**
     * Validate password reset link
     */

    validateResetLink(req, res) {
        const link = req.query.c;
        if (link) {
            User.validateResetLink(link)
                .then(({ status, user, message }) => {
                    res.status(status).json({ success: true, user, message });
                })
                .catch(({ status, message }) => {
                    res.status(status).json({ success: false, message });
                })
        } else {
            res.status(400).json({ success: false, message: 'Password reset code is missing' });
        }

    }

    /**
     * Reset password
     */

    newPassword(req, res) {
        const { password, link } = req.body;
        if (password && link) {
            User.newPassword(password, link)
                .then(({ status, message }) => {
                    res.status(status).json({ success: true, message });
                })
                .catch(({ status, message }) => {
                    res.status(status).json({ success: false, message });
                });
        } else {
            res.status(400).json({ success: false, message: 'Could not reset password.' });
        }

    }

    /**
     * Validates new user
     */

    validate(req, res) {
        User.validateUser(req.query.c)
            .then(({ status, message, user }) => {
                res.status(status).json({ success: true, message, user });
            })
            .catch(({ status, message }) => {
                res.status(status).json({ success: false, message });
            });
    }

    /**
     * Validate JWT tokens
     */

    jwtValidation(req, res) {
        const userId = req.id;
        if (userId) {
            User.findUserById(userId, { email: true, fname: true, lname: true, verified: true })
                .then(({ user }) => {
                    res.json({ success: true, user });
                })
                .catch(({ status, message }) => {
                    res.status(status).json({ success: false, id: userId, message });
                });
        } else {
            res.status(401).json({ success: false, message: 'Could not validate token' });
        }
    }

    static getInstance() {
        return new AuthController();
    }

}

export default AuthController.getInstance();
