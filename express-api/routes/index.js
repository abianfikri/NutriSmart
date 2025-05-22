import express from 'express';
import userController from '../controller/UserController.js';
import { verifyToken } from '../middleware/VerifyToken.js';
import { refreshToken } from '../controller/RefreshTokenController.js';
const router = express.Router();

router.get('/users', verifyToken, userController.getUsers);
router.get('/token', refreshToken);
router.delete('/logout', userController.logoutUser);
router.post('/users', userController.registerUser);
router.post('/login', userController.loginUser);

export default router;