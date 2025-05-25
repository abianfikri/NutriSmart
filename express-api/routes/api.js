import express from 'express';
import authRoute from './authRoute.js';
import userRoute from './userRoute.js';
import { verifyToken } from '../middleware/VerifyToken.js';

const router = express.Router();

// Auth routes
router.use('/api/auth', authRoute);
// User routes
router.use('/api/users', verifyToken, userRoute);

export default router;