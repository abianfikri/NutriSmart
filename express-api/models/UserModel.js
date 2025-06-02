import { Sequelize } from "sequelize";
import db from "../config/database.js";

const { DataTypes } = Sequelize;

const Users = db.define('users', {
    name: {
        type: DataTypes.STRING,
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
    },
    refresh_token: {
        type: DataTypes.TEXT,
    },
    gender: {
        type: DataTypes.ENUM('L', 'P'),
        allowNull: false,
        defaultValue: () => {
            // random gender antara 'L' atau 'P'
            return Math.random() < 0.5 ? 'L' : 'P';
        }
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    weight: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    height: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    activityLevel: {
        type: DataTypes.ENUM('Tidak Aktif', 'Ringan', 'Sedang', 'Berat', 'Sangat Berat'),
        allowNull: true,
    }
}, {
    freezeTableName: true,
});

export default Users;