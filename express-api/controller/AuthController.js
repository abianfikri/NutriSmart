import { registerUserService, loginUserService, logoutUserService } from "../service/AuthService.js";

const registerUser = async (req, res) => {
    try {
        const response = await registerUserService(req.body);
        if (response.status === "error") {
            return res.status(400).json(...response);
        }
        res.status(200).json({
            status: response.status,
            message: response.message,
            data: response.data
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
}

const loginUser = async (req, res) => {
    try {
        const response = await loginUserService(req.body, res.cookie.bind(res));
        if (response.status === "error") {
            return res.status(400).json(...response);
        }
        res.status(200).json({
            status: response.status,
            message: response.message,
            data: response.data
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
}

const logoutUser = async (req, res) => {
    try {
        const response = await logoutUserService(req.cookies.refreshToken, res.clearCookie.bind(res));

        if (response.status === "error") {
            return res.status(400).json(...response);
        }

        res.status(200).json({
            status: response.status,
            message: response.message,
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
}

export default {
    registerUser,
    loginUser,
    logoutUser
}
