import Meals from '../models/MealModel.js';
import MealItems from '../models/MealItemModel.js';

export async function saveMealPlanToDb(mealPlan, userId) {
    for (const day of mealPlan) {
        const meal = await Meals.create({
            userId,
            day: day.day,
        });

        for (const mealType of ['Breakfast', 'Lunch', 'Dinner']) {
            const item = day.meals[mealType];
            await MealItems.create({
                mealId: meal.id,
                mealType,
                label: item.label,
                imageUrl: item.image, // filename / URL yang sudah dari Firebase
                calories: item.calories,
                protein: item.protein,
                fat: item.fat,
                carbs: item.carbs,
                servings: item.servings,
            });
        }
    }
}