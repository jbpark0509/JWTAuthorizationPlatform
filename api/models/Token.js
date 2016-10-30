'use strict';

import mongoose from 'mongoose';
import JwtService from '../libs/jwt';

let Schema = mongoose.Schema;

const TokenSchema = new mongoose.Schema({
    value: {
        type: String,
        required: true
    },
    expireAt: {
        type: Date,
        required: true
    }
});

// Expire at the time indicated by the expireAt field
TokenSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

TokenSchema.statics.getTokenInfo = function(rtoken) {
    return JwtService.validateRefreshToken(rtoken);
}

TokenSchema.statics.notBanned = function(value) {
    return new Promise((res, rej) => {
        this.model('Token').findOne({ value }, (err, token) => {
            if (err) {
                rej({ status: 500, message: 'Internal Server Error.' });
            } else if (token) {
            	rej({ status: 400, message: 'Token has been banned' });
            } else {
            	res({ status: 200, message: 'Token not banned' });
            }
        })
    });
}

TokenSchema.methods.addToken = function() {
    return new Promise((res, rej) => {
        if (this.value && this.expireAt) {
            this.save((err, token) => {
                if (err) {
                    rej({ status: 500, message: 'Internal Server Error.' });
                } else if (!token) {
                    rej({ status: 400, message: 'Could not add token.' });
                } else {
                    res({ status: 200, token });
                }
            });
        } else {
            rej({ status: 400, message: 'Value and/or expire date is not set' });
        }
    });
}

const Token = mongoose.model('Token', TokenSchema);

export default Token;
