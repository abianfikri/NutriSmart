import express from 'express';
import userController from '../controller/UserController.js';

const router = express.Router();

router.get('/', userController.getUsers);

export default router;