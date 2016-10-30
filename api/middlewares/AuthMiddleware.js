'use strict';

import JwtService from '../libs/jwt';

export default function(req, res, next) {
    const atoken = req.cookies.a || req.headers['x-access-token'];
    const rtoken = req.cookies.r || req.headers['x-refresh-token'];
    if (rtoken) {
        JwtService.validateAccessToken(atoken)
            .then(({ status, aData }) => {
                req.id = aData.sub;
                next();
            })
            .catch(() => {
                JwtService.validateRefreshToken(rtoken)
                    .then(({ rData }) => {
                        req.id = rData.sub;
                        return JwtService.generateAccessToken(rData.sub);
                    })
                    .then((aToken) => {
                        res.cookie('a', aToken, { maxAge: 60000, httpOnly: true });
                        next();
                    })
                    .catch(() => {
                        res.clearCookie('a');
                        res.clearCookie('r');
                        res.clearCookie('csrf');
                        res.status(400).json({
                            success: false,
                            message: 'Failed to authenticate token.'
                        });
                    });
            });
    } else {
        res.status(400).json({
            success: false,
            message: 'Token missing.'
        });
    }
}