'use strict';

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import JwtService from '../libs/jwt';
import AppMailer from '../libs/appMailer';
import encryptor from 'simple-encryptor';
import { VALIDATIONSECRET, RESETEMAILSECRET } from '../../src/config';
import * as validations from '../../src/libs/validations';

let Schema = mongoose.Schema;
const PASSWORD_MIN_LENGTH = 6;
const PASSWORD_MAX_LENGTH = 30;

const userSchema = new Schema({
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    last_ip: String,
    verified: Boolean,
    validation_link: String,
    reset_link: String,
    admin: Boolean,
    profile_photo_url: String,
    meta: {
        age: Number,
        gender: String
    },
    created_at: Date,
    updated_at: Date
});

userSchema.pre('save', function(next) {
    let currentDate = new Date();
    this.updated_at = currentDate;
    if (!this.created_at) this.created_at = currentDate;
    next();
});

/**
 * Find user by id
 */

userSchema.statics.findUserById = function(id, options = {}) {
    return new Promise((res, rej) => {
        this.model('User').findById(id, options, (err, user) => {
            if (err) {
                rej({ status: 500, message: "Internal Server Error. Please try again." });
            } else if (!user) {
                rej({ status: 400, message: "User does not exist" });
            } else {
                res({ status: 200, user });
            }
        });
    });
};

/**
 * Find user by email
 */

userSchema.statics.findUserByEmail = function(email, options = {}) {
    return new Promise((res, rej) => {
        this.model('User').findOne({ email }, options, (err, user) => {
            if (err) {
                rej({ status: 500, message: "Internal Server Error. Please try again." });
            } else if (!user) {
                rej({ status: 400, message: "User does not exist" });
            } else {
                res({ status: 200, user });
            }
        });
    });
}

/**
 * Reset Password
 */

userSchema.statics.resetPassword = function(email) {
    return this.model('User').findUserByEmail(email.toLowerCase(), { email: true, reset_link: true, fname: true })
        .then(({ user }) => {
            if (user.reset_link) {
                return AppMailer.sendResetPasswordEmail(user.email, user.reset_link, user.fname);
            } else {
                const resetLink = encryptor(RESETEMAILSECRET).encrypt(`${user._id}-${Date.now()}`);
                user.reset_link = resetLink;
                user.save((err, update) => {
                    if (err) {
                        return Promise.rej({ status: 500, message: 'Internal Server Error' });
                    } else {
                        return AppMailer.sendResetPasswordEmail(user.email, user.reset_link, user.fname);
                    }
                });
            }

        });
}

/**
 * Set new password
 */

userSchema.statics.newPassword = function(password, reset_link) {
    return new Promise((res, rej) => {
        this.model('User').findOne({ reset_link }, { _id: true, password: true, reset_link: true }, (err, user) => {
            if (err) {
                rej({ status: 500, message: 'Internal Server Error' });
            } else if (!user) {
                rej({ status: 400, message: 'User does not exist' });
            } else {
                if (!validations.minLength(PASSWORD_MIN_LENGTH)(password)) {
                    rej({ status: 400, message: `Password must be at least ${PASSWORD_MIN_LENGTH} characters` });
                } else if (!validations.maxLength(PASSWORD_MAX_LENGTH)(password)) {
                    rej({ status: 400, message: `Password must be less than ${PASSWORD_MIN_LENGTH} characters` });
                } else if (!validations.passwordValidation(password)) {
                    rej({ status: 400, message: "Password must contain at least one letter, one number and one special character" });
                } else {
                    user.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
                    user.reset_link = '';
                    user.save((err) => {
                        if (err) {
                            rej({ status: 500, message: 'Internal Server Error' });
                        } else {
                            res({ status: 200, message: 'Password has been updated' });
                        }
                    });
                }
            }
        });
    });
}

/**
 * Validate password reset link
 */

userSchema.statics.validateResetLink = function(reset_link) {
    return new Promise((res, rej) => {
        if (!reset_link) {
            rej({ status: 400, message: 'Reset link is empty' });
        } else {
            this.model('User').findOne({ reset_link }, { fname: true, lname: true }, (err, user) => {
                if (err) {
                    rej({ status: 500, message: 'Internal Server Error' });
                } else if (!user) {
                    rej({ status: 400, message: 'Invalid Reset Link' });
                } else {
                    res({ status: 200, user, message: 'Reset link has been validated.' });
                }
            });
        }
    })

}

/**
 * Validate email address
 */

userSchema.statics.validateUser = function(c) {
    return new Promise((res, rej) => {
        const email = encryptor(VALIDATIONSECRET).decrypt(c);
        if (!email) {
            rej({ status: 400, message: "Invalid validation link" });
        }
        this.model('User').findOne({ email }, { verified: true, validation_link: true }, (err, user) => {
            if (err) {
                rej({ status: 500, message: 'Internal Server Error' });
            } else if (!user) {
                res({ status: 400, message: 'Invalid validation link' });
            } else if (user.verified) {
                res({ status: 200, message: 'Email has already been verified' });
            } else {
                user.validation_link = '';
                user.verified = true;
                user.save((err, user) => {
                    if (err) {
                        rej({ status: 500, message: 'Internal Server Error' });
                    } else {
                        res({
                            status: 200,
                            message: 'Email has been validated'
                        });
                    }
                });
            }
        });
    });
}

/**
 * Validate JWT tokens
 */

userSchema.statics.validateJwt = function(atoken, rtoken, id) {
    return new Promise((res, rej) => {
        JwtService.validateAccessToken(atoken, id)
            .then((status, aData) => {
                //Access token validated. Resolve promise
                res({ status, aData, message: 'Valid access token.' });
            })
            .catch(() => {
                //Failed to validate access token. Validate refresh token
                return JwtService.validateRefreshToken(rtoken, id);
            })
            .then(() => {
                //Refresh token is valid. Issue a new access token.
                return JwtService.generateAccessToken(id);
            })
            .catch(() => {
                //Failed to validate refresh token. Redirect.
                rej({ status: 401, message: 'Failed to validate token' });
            })
            .then((status, atoken) => {
                res({ status, atoken, message: 'Access token expired. Issuing a new access token.' });
            });
    });
}

/**
 * Register User
 */

userSchema.methods.register = function() {
    return new Promise((res, rej) => {
            if (this.fname && this.lname && this.email && this.password) {
                //Password validations
                if (!validations.minLength(PASSWORD_MIN_LENGTH)(this.password)) {
                    rej({ status: 400, message: `Password must be at least ${PASSWORD_MIN_LENGTH} characters` });
                } else if (!validations.maxLength(PASSWORD_MAX_LENGTH)(this.password)) {
                    rej({ status: 400, message: `Password must be less than ${PASSWORD_MIN_LENGTH} characters` });
                } else if (!validations.passwordValidation(this.password)) {
                    rej({ status: 400, message: "Password must contain at least one letter, one number and one special character" });
                }
                this.email = this.email.toLowerCase();
                this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(10));
                this.validation_link = encryptor(VALIDATIONSECRET).encrypt(this.email);
                const admin = false;
                this.save((err, user) => {
                    if (err) {
                        let error = "Internal Server Error.";
                        let status = 500;
                        if (err.code === 11000) {
                            error = 'That email is already taken. Please try with another email address.';
                            status = 409;
                        }
                        rej({ status, message: error });
                    } else if (!user) {
                        rej({ status: 500, message: 'Internal Server Error.' });
                    } else {
                        res();
                    }
                })
            } else {
                rej({ status: 400, message: "Please complete all fields in registeration." });
            }
        })
        //Send validation email
        .then(() => {
            return AppMailer.sendValidationEmail(this.email, { name: this.fname, validation_link: this.validation_link });
        })
        //Generate tokens
        .then(() => {
            return Promise.all([JwtService.generateRefreshToken(this._id), JwtService.generateAccessToken(this._id), JwtService.generateCsrfToken(this._id)]);
        })
        .then((tokens) => {
            return {
                rtoken: tokens[0],
                atoken: tokens[1],
                csrftoken: tokens[2],
                message: "Email has been sent to validate your account.",
                status: 201
            };
        })
};

/**
 * Login User
 */

userSchema.methods.login = function() {
    return new Promise((res, rej) => {
            if (this.email && this.password) {
                this.email = this.email.toLowerCase();
                this.model('User').findOne({ email: this.email }, {}, (err, user) => {
                    if (err) {
                        rej({ status: 500, message: "Internal Server Error." });
                    } else if (!user) {
                        rej({ status: 400, message: "Email does not exist." });
                    } else if (!user.verified) {
                        //Send another validation email.
                        AppMailer.sendValidationEmail(user.email, { name: user.fname, validation_link: user.validation_link });
                        rej({ status: 400, message: "Your account is not yet verified. Verification email has been sent again." });
                    } else {
                        if (!bcrypt.compareSync(this.password, user.password)) {
                            rej({ status: 400, message: "Password does not match" });
                        } else {
                            this._id = user._id;
                            this.fname = user.fname;
                            this.lname = user.lname;
                            this.verified = user.verified;
                            res();
                        }
                    }
                });
            } else {
                rej({ status: 400, message: "Email and/or password is missing." })
            }
        })
        .then(() => {
            return Promise.all([JwtService.generateRefreshToken(this._id), JwtService.generateAccessToken(this._id), JwtService.generateCsrfToken(this._id)]);
        })
        .then((tokens) => {
            return {
                rtoken: tokens[0],
                atoken: tokens[1],
                csrftoken: tokens[2],
                user: {
                    id: this._id,
                    fname: this.fname,
                    lname: this.lname,
                    email: this.email,
                    verified: this.verified
                },
                status: 200
            };
        });
}

let User = mongoose.model('User', userSchema);

export default User;
