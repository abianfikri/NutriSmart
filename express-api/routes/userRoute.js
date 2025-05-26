import express from 'express';
import userController from '../controller/UserController.js';

const router = express.Router();

router.get('/', userController.getUsers);
router.get('/me', userController.getUserProfileByToken);
router.patch('/me', userController.updateProfile);

export default router;