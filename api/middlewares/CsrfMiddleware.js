'use strict';

import JwtService from '../libs/jwt';

export default function(req, res, next) {
    const cookie = req.cookies.csrf;
    const header = req.headers.csrf;
    if(cookie === header) {
    	next();
    } else {
    	res.json({ success: false, message: 'Could not validate token.' });
    }
}