import { Sequelize } from "sequelize";
import db from "../config/database.js";
import MealItems from "./MealItemModel.js";

const { DataTypes } = Sequelize;

const Meals = db.define('meals', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userId: {
        type: DataTypes.INTEGER,
    },
    day: {
        type: DataTypes.INTEGER,
    }
},
    {
        freezeTableName: true,
    }
);

Meals.hasMany(MealItems, { foreignKey: 'mealId' });
MealItems.belongsTo(Meals, { foreignKey: 'mealId' });

export default Meals;