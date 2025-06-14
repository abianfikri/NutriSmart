import { Sequelize } from "sequelize";
import db from "../config/database.js";

const { DataTypes } = Sequelize;

const MealRequests = db.define('meal_requests', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userId: {
        type: DataTypes.INTEGER,
    },
    minCalories: DataTypes.INTEGER,
    maxCalories: DataTypes.INTEGER,
    timeFrame: DataTypes.STRING,
    diets: DataTypes.JSON,
    selectedMeals: DataTypes.JSON,
    selectedDishes: DataTypes.JSON,
}, {
    freezeTableName: true,
});

export default MealRequests;