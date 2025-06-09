import { generateMealPlan } from "../service/EdamamService.js";
import { saveMealPlanToDb } from "../service/MealPlanService.js";
import Users from "../models/UserModel.js";

const getMealPlan = async (req, res) => {
    try {
        const { minCalories, maxCalories, timeFrame, diets, selectedMeals, selectedDishes } = req.body;
        const mealPlan = await generateMealPlan({
            minCalories: minCalories,
            maxCalories: maxCalories,
            timeFrame: timeFrame,
            diets: diets ?? [],
            selectedMeals: selectedMeals ?? ['Breakfast', 'Lunch', 'Dinner'],
            selectedDishes: selectedDishes ?? {}
        });

        res.status(200).json({
            status: "success",
            message: "Meal plan generated successfully",
            data: mealPlan
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            message: "Failed to generate meal plan",
            error: error.message
        });
    }
}

const saveMealPlan = async (req, res) => {
    try {
        const { mealPlan } = req.body;
        const user = await Users.findByPk(req.userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        await saveMealPlanToDb(mealPlan, user.id);

        res.status(200).json({
            status: "success",
            message: "Meal plan saved successfully",
            data: mealPlan
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            message: "Failed to save meal plan",
            error: error.message
        });
    }
}

export default {
    getMealPlan,
    saveMealPlan
};