import Users from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const registerUser = async (req, res) => {
    const { name, email, password, confirmPassword, gender, age, weight, height } = req.body;

    if (!name || !email || !password || !confirmPassword, !gender, !age, !weight, !height) return res.status(400).json(
        {
            status: "error",
            message: "Please fill in all fields"
        }
    );

    // age harus berupa angka
    if (isNaN(age) || isNaN(weight) || isNaN(height)) return res.status(400).json(
        {
            status: "error",
            message: "Age must be a number"
        }
    );

    const emailExist = await Users.findOne({
        where: {
            email: email
        }
    });

    if (emailExist) return res.status(400).json(
        {
            status: "error",
            message: "Email already exists"
        }
    );

    if (password !== confirmPassword) return res.status(400).json(
        {
            status: "error",
            message: "Password and Confirm Password do not match"
        }
    );

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
        await Users.create({
            name: name,
            email: email,
            password: hashedPassword,
            gender: gender,
            age: age,
            weight: weight,
            height: height
        });

        res.status(201).json(
            {
                status: "success",
                message: "Register successfully"
            }
        );
    } catch (error) {

        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json(
        {
            status: "error",
            message: "Please fill in all fields"
        }
    );
    try {
        const user = await Users.findOne({
            where: {
                email: req.body.email
            }
        });

        if (!user) return res.status(404).json(
            {
                status: "error",
                message: "Email not found"
            }
        );

        const match = await bcrypt.compare(req.body.password, user.password);
        if (!match) return res.status(400).json(
            {
                status: "error",
                message: "Wrong password"
            }
        );

        const userId = user.id;
        const name = user.name;
        const email = user.email;
        const accessToken = jwt.sign(
            { userId, name, email },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '30s' }
        );
        const refreshToken = jwt.sign(
            { userId, name, email },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );

        await Users.update({ refresh_token: refreshToken }, {
            where: {
                id: userId
            }
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        res.status(200).json(
            {
                status: "success",
                message: "Login successfully",
                data: {
                    accessToken,
                }
            }
        );
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

const logoutUser = async (req, res) => {
    try {
        const refresh_token = req.cookies.refreshToken;
        if (!refresh_token) return res.sendStatus(204);

        const user = await Users.findOne({
            where: {
                refresh_token: refresh_token
            }
        });

        if (!user) return res.sendStatus(204);

        const userId = user.id;
        await Users.update({ refresh_token: null }, {
            where: {
                id: userId
            }
        });

        res.clearCookie('refreshToken');
        return res.status(200).json(
            {
                status: "success",
                message: "Logout successfully",
                data: {
                    userId: userId
                }
            }
        );
    } catch (error) {
        console.log(error);
    }
}

export default {
    registerUser,
    loginUser,
    logoutUser
}
