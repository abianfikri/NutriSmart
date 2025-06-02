import { generateMealPlan } from "../service/EdamamService.js";

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

export default {
    getMealPlan
};