import { generateMealPlan } from "../service/EdamamService.js";
import { saveOrUpdateMealPlanInDb, getSaveMealPlanFromDb } from "../service/MealPlanService.js";
import Users from "../models/UserModel.js";
import MealRequests from "../models/MealRequest.js";

const getMealPlan = async (req, res) => {
    try {
        const { minCalories, maxCalories, timeFrame, diets, selectedMeals, selectedDishes } = req.body;

        if (typeof minCalories !== 'number' || typeof maxCalories !== 'number' || typeof timeFrame !== 'number') {
            return res.status(400).json({
                status: "error",
                message: "Kalori dan waktu harus berupa angka"
            });
        }

        if (minCalories > maxCalories) {
            return res.status(400).json({
                status: "error",
                message: "Kalori minimum harus lebih kecil atau sama dengan kalori maksimum"
            });
        }

        // Validasi selectedMeals
        const validMeals = ['breakfast', 'lunch', 'dinner'];
        const filteredMeals = Array.isArray(selectedMeals)
            ? selectedMeals.filter(meal => validMeals.includes(meal))
            : [];

        if (filteredMeals.length < 2 || filteredMeals.length > 3) {
            return res.status(400).json({
                status: "error",
                message: "Anda harus memilih dua makanan dari Breakfast, Lunch, Dinner"
            });
        }

        // Validasi selectedDishes
        if (
            !selectedDishes ||
            typeof selectedDishes !== 'object' ||
            Array.isArray(selectedDishes) ||
            Object.keys(selectedDishes).length === 0
        ) {
            return res.status(400).json({
                status: "error",
                message: "Jenis Makanan tidak boleh kosong"
            });
        }


        const mealPlan = await generateMealPlan({
            minCalories: minCalories,
            maxCalories: maxCalories,
            timeFrame: timeFrame,
            diets: diets ?? [],
            selectedMeals: filteredMeals,
            selectedDishes: selectedDishes
        });

        res.status(200).json({
            status: "success",
            message: "Berhasil membuat rencana makan",
            data: mealPlan
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            message: "Gagal membuat rencana makan",
            error: error.message
        });
    }
}

const saveMealPlan = async (req, res) => {
    try {
        const { mealPlan, minCalories, maxCalories, timeFrame, diets, selectedMeals, selectedDishes } = req.body;
        const user = await Users.findByPk(req.userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Cek apakah user sudah punya meal request
        const existingMealRequest = await MealRequests.findOne({
            where: { userId: user.id }
        });

        let currentMealRequest;

        if (existingMealRequest) {
            // Jika sudah ada, update meal request yang ada
            await existingMealRequest.update({
                minCalories: minCalories,
                maxCalories: maxCalories,
                timeFrame: timeFrame,
                diets: diets ?? [],
                selectedMeals: selectedMeals ?? ['Breakfast', 'Lunch', 'Dinner'],
                selectedDishes: selectedDishes ?? {}
            });
            currentMealRequest = existingMealRequest; // Gunakan yang sudah diupdate
        } else {
            // Jika belum ada, buat meal request baru
            currentMealRequest = await MealRequests.create({
                userId: user.id,
                minCalories: minCalories,
                maxCalories: maxCalories,
                timeFrame: timeFrame,
                diets: diets ?? [],
                selectedMeals: selectedMeals ?? ['Breakfast', 'Lunch', 'Dinner'],
                selectedDishes: selectedDishes ?? {}
            });
        }

        // Gunakan saveOrUpdateMealPlanInDb untuk menyimpan atau mengupdate meals dan meal items
        await saveOrUpdateMealPlanInDb(mealPlan, currentMealRequest.id);

        res.status(200).json({
            status: "success",
            message: existingMealRequest ? "Rencana makan berhasil diperbarui" : "Rencana makan berhasil dibuat",
            data: {
                mealRequestId: currentMealRequest.id,
                minCalories: currentMealRequest.minCalories,
                maxCalories: currentMealRequest.maxCalories,
                timeFrame: currentMealRequest.timeFrame,
                diets: currentMealRequest.diets,
                selectedMeals: currentMealRequest.selectedMeals,
                selectedDishes: currentMealRequest.selectedDishes,
                mealPlan: mealPlan // Kirim mealPlan yang baru di-generate sebagai bagian dari data
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            message: "Terjadi kesalahan server",
            error: error.message
        });
    }
}

const getSaveMealPlan = async (req, res) => {
    try {
        const response = await getSaveMealPlanFromDb(req.userId);
        if (!response) {
            return res.status(404).json({
                status: "error",
                message: response.message,
            });
        }
        res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            message: "Failed to fetch saved meal plan",
            error: error.message
        });
    }
}

export default {
    getMealPlan,
    saveMealPlan,
    getSaveMealPlan
};