import Users from "../models/UserModel.js";
import { Op } from "sequelize";

const getUsers = async (req, res) => {
    try {
        const currentEmail = req.email;
        const users = await Users.findAll(
            {
                where: {
                    email: {
                        [Op.ne]: currentEmail
                    }
                },
                attributes: {
                    exclude: ["password", "refresh_token", "createdAt", "updatedAt"]
                }
            }
        );
        res.status(200).json(
            {
                status: "success",
                message: "Get all users successfully",
                data: users,
            }
        );
    } catch (error) {
        console.log(error);
    }
};

const getUserProfileByToken = async (req, res) => {
    try {
        const user = await Users.findOne({
            where: {
                id: req.userId
            },
            attributes: {
                exclude: ["password", "refresh_token", "createdAt", "updatedAt"]
            }
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            status: "success",
            message: "Profile fetched successfully",
            data: user
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

const updateProfile = async (req, res) => {
    try {
        const user = await Users.findByPk(req.userId);
        if (!user) {
            return res.status(404).json(
                {
                    status: "error",
                    message: "User not found"
                }
            );
        }

        const { name, email, gender, age, weight, height } = req.body;
        user.name = name;
        user.email = email;
        user.gender = gender;
        user.age = age;
        user.weight = weight;
        user.height = height;

        await user.save();

        res.status(200).json({
            status: "success",
            message: `Profile ${user.name} updated successfully`,
            data: {
                id: user.id,
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: "Something went wrong" });
    }
};


export default {
    getUsers,
    getUserProfileByToken, // tambahkan ini
    updateProfile
};

