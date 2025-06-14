import express from 'express';
import userController from '../controller/UserController.js';
import FoodController from '../controller/FoodController.js';

const router = express.Router();

router.get('/', userController.getUsers);
router.get('/me', userController.getUserProfileByToken);
router.get('/analysis', userController.calculateTDDE);
router.get('/meal-plan', FoodController.getSaveMealPlan);

router.post('/recommendation', FoodController.getMealPlan);
router.post('/meal-plan/save', FoodController.saveMealPlan);
router.patch('/me', userController.updateProfile);

export default router;