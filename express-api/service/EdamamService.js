import axios from 'axios';

export async function generateMealPlan(calories = 2000, timeFrame = 2) {
    const url = `https://api.edamam.com/api/meal-planner/v1/${process.env.EDAMAM_APP_ID}/select`;

    const payload = {
        size: timeFrame,
        plan: {
            accept: { all: [] },
            fit: {
                ENERC_KCAL: { min: 1000, max: calories },
                PROCNT: { min: 10 }
            },
            sections: {
                Breakfast: {
                    accept: {
                        all: [
                            { dish: ["main course", "bread", "cereals", "egg", "pancake", "pastry", "sandwiches"] },
                            { meal: ["breakfast"] }
                        ]
                    },
                    fit: { ENERC_KCAL: { min: 100, max: 600 } }
                },
                Lunch: {
                    accept: {
                        all: [
                            { dish: ["main course", "pasta", "pizza", "salad", "sandwiches", "soup"] },
                            { meal: ["lunch/dinner"] }
                        ]
                    },
                    fit: { ENERC_KCAL: { min: 300, max: 900 } }
                },
                Dinner: {
                    accept: {
                        all: [
                            { dish: ["main course", "pasta", "pizza", "salad", "sandwiches", "soup"] },
                            { meal: ["lunch/dinner"] }
                        ]
                    },
                    fit: { ENERC_KCAL: { min: 200, max: 900 } }
                }
            }
        }
    };

    const response = await axios.post(url, payload, {
        headers: {
            'Content-Type': 'application/json',
            'Edamam-Account-User': 'meal-plan'
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

        for (const mealType of ['Breakfast', 'Lunch', 'Dinner']) {
            const recipeLink = sections[mealType]?._links?.self?.href;
            if (recipeLink) {
                try {
                    const detailUrl = `${recipeLink}?type=public&app_id=${process.env.EDAMAM_APP_ID}&app_key=${process.env.EDAMAM_APP_KEY}`;

                    const detailRes = await axios.get(detailUrl, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Edamam-Account-User': 'meal-plan'
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
