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

export default {
    getUsers,
};
