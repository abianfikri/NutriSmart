import Meals from '../models/MealModel.js';
import MealItems from '../models/MealItemModel.js';
import { uploadImageToFirebase } from '../helper/FirebaseUpload.js';

export async function saveMealPlanToDb(mealPlan, userId) {
    for (const day of mealPlan) {
        const meal = await Meals.create({
            userId,
            day: day.day,
        });

        for (const mealType of ['Breakfast', 'Lunch', 'Dinner']) {
            const item = day.meals[mealType];

            let firebaseImageUrl = null;
            if (item.image) {
                try {
                    const filename = `meal-images/${Date.now()}-${day.day}-${mealType}.jpg`;
                    firebaseImageUrl = await uploadImageToFirebase(item.image, filename);
                } catch (error) {
                    console.error('Error uploading image to Firebase:', error);
                }
            }
            await MealItems.create({
                mealId: meal.id,
                mealType,
                label: item.label,
                imageUrl: firebaseImageUrl, // filename / URL yang sudah dari Firebase
                calories: item.calories,
                protein: item.protein,
                fat: item.fat,
                carbs: item.carbs,
                servings: item.servings,
            });
        }
    }
}