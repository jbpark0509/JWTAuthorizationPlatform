import jwt from 'jsonwebtoken';
import csrf from 'csrf';
import encryptor from 'simple-encryptor';
import { ATOKENSECRET, RTOKENSECRET, RTOKENENCRYPTKEY, CSRFSECRET, BASE_URL, host } from '../../src/config';
import moment from 'moment';
import Token from '../models/Token';

class JwtService {

    generateRefreshToken(id) {
        return new Promise((res, rej) => {
            jwt.sign({ sub: id, iss: BASE_URL, type: 'refresh_token', scope: 'api/request_new_access_token' }, RTOKENSECRET, {
                expiresIn: "30d"
            }, (err, rtoken) => {
                if (err) {
                    rej({ status: 500, message: 'Could not generate refresh token.' });
                } else {
                    const rEncryptor = encryptor(RTOKENENCRYPTKEY);
                    res(rEncryptor.encrypt(rtoken));
                }
            });
        });
    }

    validateRefreshToken(token) {
        return Token.notBanned(token)
            .then(() => {
                return new Promise((res, rej) => {
                    token = encryptor(RTOKENENCRYPTKEY).decrypt(token);
                    jwt.verify(token, RTOKENSECRET, (err, rData) => {
                        if (err) {
                            rej({ status: 401, message: "Failed to authenticate refresh token." });
                        } else {
                            res({ status: 200, rData });
                        }
                    });
                });
            })
    }

    generateAccessToken(id) {
        return new Promise((res, rej) => {
            jwt.sign({ sub: id, iss: BASE_URL, type: 'access_token', scope: 'api/update_profile' }, ATOKENSECRET, {
                expiresIn: "600000"
            }, (err, atoken) => {
                if (err) {
                    rej({ status: 500, message: 'Could not generate access token.' });
                } else {
                    res(atoken);
                }
            });
        });
    }

    validateAccessToken(token) {
        return new Promise((res, rej) => {
            jwt.verify(token, ATOKENSECRET, (err, aData) => {
                if (err) {
                    rej({ status: 401, message: "Failed to authenticate access token." });
                } else {
                    res({ status: 200, aData });
                }
            });
        });
    }

    generateCsrfToken(id) {
        let Token = new csrf();
        return new Promise((res, rej) => {
            const secret = Token.secretSync();
            const token = Token.create(secret);
            res(token);
        })
    }

    static getInstance() {
        return new JwtService();
    }

}

export default JwtService.getInstance();
