import { Sequelize } from "sequelize";
import db from "../config/database.js";

const { DataTypes } = Sequelize;

const MealItems = db.define('meal_items', {
    mealId: DataTypes.INTEGER,
    mealType: DataTypes.ENUM('Breakfast', 'Lunch', 'Dinner'),
    label: DataTypes.STRING,
    imageUrl: DataTypes.TEXT,
    calories: DataTypes.FLOAT,
    protein: DataTypes.FLOAT,
    fat: DataTypes.FLOAT,
    carbs: DataTypes.FLOAT,
    servings: DataTypes.INTEGER
}, {
    freezeTableName: true
});

export default MealItems;