import Meals from '../models/MealModel.js';
import MealItems from '../models/MealItemModel.js';
import { uploadImageToFirebase } from '../helper/FirebaseUpload.js';
import MealRequests from '../models/MealRequest.js';

export async function saveOrUpdateMealPlanInDb(mealPlanData, mealRequestId) {

    // 1. Ambil semua Meal ID yang terkait dengan mealRequestId ini
    const existingMeals = await Meals.findAll({
        where: { mealRequestId: mealRequestId },
        attributes: ['id'] // Hanya ambil ID
    });
    const mealIdsToDelete = existingMeals.map(meal => meal.id);

    // 2. Hapus semua MealItems yang terkait dengan Meal ID tersebut
    if (mealIdsToDelete.length > 0) {
        await MealItems.destroy({
            where: { mealId: mealIdsToDelete }
        });
    }

    // 3. Hapus semua Meals yang terkait dengan mealRequestId ini
    await Meals.destroy({ where: { mealRequestId: mealRequestId } });

    // 4. Buat ulang data meal plan
    for (const day of mealPlanData) {
        const meal = await Meals.create({
            mealRequestId: mealRequestId,
            day: day.day,
        });

        for (const mealType of ['breakfast', 'lunch', 'dinner']) {
            const item = day.meals[mealType];
            if (item) {
                let firebaseImageUrl = null;
                // Cek apakah item.image adalah URL Firebase yang sudah ada
                // atau data base64/buffer yang perlu diupload
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
                    mealType: mealType,
                    label: item.label,
                    imageUrl: firebaseImageUrl,
                    calories: item.calories,
                    protein: item.protein,
                    fat: item.fat,
                    carbs: item.carbs,
                    servings: item.servings,
                });
            }
        }
    }
}

export async function getSaveMealPlanFromDb(userId) {
    try {
        const mealRequest = await MealRequests.findOne(
            {
                where:
                {
                    userId: userId,
                }
            });

        if (!mealRequest) {
            return {
                status: "error",
                message: "Meal request not found",
            }
        }

        const meals = await Meals.findAll({
            where: {
                mealRequestId: mealRequest.id
            }
        });

        const fullMealPlan = [];

        for (const meal of meals) {
            const mealItems = await MealItems.findAll({
                where: { mealId: meal.id }
            });

            const mealsByType = {
                breakfast: null,
                lunch: null,
                dinner: null
            };

            mealItems.forEach(item => {
                const type = item.mealType.toLowerCase();
                mealsByType[type] = {
                    label: item.label,
                    image: item.imageUrl,
                    calories: item.calories,
                    protein: item.protein,
                    fat: item.fat,
                    carbs: item.carbs,
                    servings: item.servings
                };
            });

            fullMealPlan.push({
                day: meal.day,
                meals: mealsByType
            });
        }

        return {
            status: "success",
            message: "Fetched saved meal plan",
            data: {
                mealRequestId: mealRequest.id,
                minCalories: mealRequest.minCalories,
                maxCalories: mealRequest.maxCalories,
                timeFrame: mealRequest.timeFrame,
                diets: mealRequest.diets,
                selectedMeals: mealRequest.selectedMeals,
                selectedDishes: mealRequest.selectedDishes,
                mealPlan: fullMealPlan
            }
        };
    } catch (error) {
        return {
            status: "error",
            message: "Failed to fetch saved meal plan",
            error: error.message
        }
    }
}