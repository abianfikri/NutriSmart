import { Sequelize } from "sequelize";
import db from "../config/database.js";

const { DataTypes } = Sequelize;

const Meals = db.define('meals', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    mealRequestId: {
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

export default Meals;