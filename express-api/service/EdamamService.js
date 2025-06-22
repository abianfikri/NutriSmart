import axios from 'axios';

export async function generateMealPlan({
    minCalories = 1000,
    maxCalories = 2000,
    timeFrame = 2,
    diets = [],
    selectedMeals = [], // Default to Breakfast, Lunch, Dinner
    selectedDishes = {}
}) {
    const url = `https://api.edamam.com/api/meal-planner/v1/${process.env.EDAMAM_APP_ID}/select`;

    // Construct sections dynamically
    const sections = {};
    const mealFitDefaults = {
        Breakfast: { min: 100, max: 600 },
        Lunch: { min: 300, max: 900 },
        Dinner: { min: 200, max: 900 }
    };

    for (const meal of selectedMeals) {
        const dish = selectedDishes[meal]; // e.g. 'egg' or undefined
        const mealType = meal === 'Breakfast' ? 'breakfast' : 'lunch/dinner';

        const acceptConditions = [
            { meal: [mealType] }
        ];
        if (dish) {
            acceptConditions.unshift({ dish: [dish] });
        }

        sections[meal] = {
            accept: { all: acceptConditions },
            fit: {
                ENERC_KCAL: mealFitDefaults[meal]
            }
        };
    }

    const payload = {
        size: timeFrame,
        plan: {
            accept: {
                all: diets.length > 0 ? [{ diet: diets }] : []
            },
            fit: {
                ENERC_KCAL: { min: minCalories, max: maxCalories },
                PROCNT: { min: 10 }
            },
            sections
        }
    };

    const response = await axios.post(url, payload, {
        headers: {
            'Content-Type': 'application/json',
            'Edamam-Account-User': 'nutrismart'
        },
        params: {
            app_id: process.env.EDAMAM_APP_ID,
            app_key: process.env.EDAMAM_APP_KEY,
            type: 'public',
            beta: true
        }
    });

    const selection = response.data.selection;
    const results = [];

    for (let i = 0; i < selection.length; i++) {
        const sections = selection[i].sections;
        const dayMeals = { day: i + 1, meals: {} };

        for (const mealType of selectedMeals) {
            const recipeLink = sections[mealType]?._links?.self?.href;
            if (recipeLink) {
                try {
                    const detailUrl = `${recipeLink}?type=public&app_id=${process.env.EDAMAM_APP_ID}&app_key=${process.env.EDAMAM_APP_KEY}`;

                    const detailRes = await axios.get(detailUrl, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Edamam-Account-User': 'nutrismart'
                        }
                    });

                    const recipe = detailRes.data.recipe;

                    dayMeals.meals[mealType] = {
                        label: recipe.label,
                        image: recipe.image,
                        calories: Math.round(recipe.calories),
                        protein: +(recipe.totalNutrients?.PROCNT?.quantity ?? 0).toFixed(1),
                        fat: +(recipe.totalNutrients?.FAT?.quantity ?? 0).toFixed(1),
                        carbs: +(recipe.totalNutrients?.CHOCDF?.quantity ?? 0).toFixed(1),
                        servings: recipe.yield ?? 1
                    };
                } catch (err) {
                    dayMeals.meals[mealType] = fallbackMeal();
                }
            } else {
                dayMeals.meals[mealType] = fallbackMeal();
            }
        }

        results.push(dayMeals);
    }

    return results;
}

function fallbackMeal() {
    return {
        label: 'Unknown',
        image: null,
        calories: 0,
        protein: 0,
        fat: 0,
        carbs: 0,
        servings: 0
    };
}
