'use strict';

import express from 'express';
import AuthController from '../controllers/AuthController';
import AuthMiddleware from '../middlewares/AuthMiddleware';
import CsrfMiddleware from '../middlewares/CsrfMiddleware';

const router = express.Router();

router.route('/register')
.post(AuthController.register);

router.route('/login')
.post(AuthController.login);

router.route('/logout')
.post(AuthController.logout);

router.route('/resetpassword')
.post(AuthController.resetPassword);

router.route('/validateresetlink')
.get(AuthController.validateResetLink);

router.route('/newpassword')
.post(AuthController.newPassword);

router.route('/validate')
.get(AuthController.validate);

router.route('/validate/c')
.get(AuthMiddleware, AuthController.jwtValidation);

export default router;
