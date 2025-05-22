import express from 'express';
import userController from '../controller/UserController.js';
import { refreshToken } from '../controller/RefreshTokenController.js';

const router = express.Router();

router.get('/token', refreshToken);
router.post('/login', userController.loginUser);
router.post('/register', userController.registerUser);
router.delete('/logout', userController.logoutUser);


export default router;
