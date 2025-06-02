import { generateMealPlan, saveMealPlanToDb } from "../service/EdamamService.js";
import Users from "../models/UserModel.js";

const getMealPlan = async (req, res) => {
    try {
        const { calories, timeFrame } = req.body;
        const mealPlan = await generateMealPlan(calories, timeFrame);

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