import express from 'express';
import authController from '../controller/AuthController.js';
import { refreshToken } from '../controller/RefreshTokenController.js';

const router = express.Router();

router.get('/token', refreshToken);
router.post('/login', authController.loginUser);
router.post('/register', authController.registerUser);
router.delete('/logout', authController.logoutUser);


export default router;
