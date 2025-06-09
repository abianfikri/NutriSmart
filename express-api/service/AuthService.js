import Users from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function registerUserService(userData) {
    const { name, email, password, confirmPassword, gender, age, weight, height, activityLevel } = userData;

    if (!name || !email || !password || !confirmPassword, !gender, !age, !weight, !height, !activityLevel) {
        throw {
            status: "error",
            message: "Please fill in all fields"
        }
    }

    // age harus berupa angka
    if (isNaN(age) || isNaN(weight) || isNaN(height)) {
        throw {
            status: "error",
            message: "Age must be a number"
        }
    }

    const emailExist = await Users.findOne({
        where: {
            email: email
        }
    });

    if (emailExist) {
        throw {
            status: "error",
            message: "Email already exists"
        }
    }

    // password harus minimal 6 karakter
    if (password.length < 6) {
        throw {
            status: "error",
            message: "Password must be at least 6 characters"
        }
    }

    if (password !== confirmPassword) {
        throw {
            status: "error",
            message: "Password and Confirm Password do not match"
        }
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await Users.create({
        name: name,
        email: email,
        password: hashedPassword,
        gender: gender,
        age: age,
        weight: weight,
        height: height,
        activityLevel: activityLevel
    });

    return {
        status: "success",
        message: "Register successfully",
        data: user
    };
}

export async function loginUserService(userData, setCookie) {
    const { email, password } = userData;

    if (!email || !password) {
        throw {
            status: "error",
            message: "Please fill in all fields"
        }
    }

    const user = await Users.findOne({
        where: {
            email: email
        }
    });

    if (!user) {
        throw {
            status: "error",
            message: "Email not found"
        }
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
        throw {
            status: "error",
            message: "Wrong password"
        }
    }

    const userId = user.id;
    const name = user.name;

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

    setCookie('refreshToken', refreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    });

    return {
        status: "success",
        message: "Login successfully",
        data: {
            accessToken: accessToken
        }
    };
}

export async function logoutUserService(refreshToken, clearCookie) {
    if (!refreshToken) {
        throw {
            status: "error",
            message: "No token found"
        }
    }

    const user = await Users.findOne({
        where: {
            refresh_token: refreshToken
        }
    });

    if (!user) {
        throw {
            status: "error",
            message: "No user found"
        }
    }

    await Users.update({ refresh_token: null }, {
        where: {
            id: user.id
        }
    });
    clearCookie('refreshToken');

    return {
        status: "success",
        message: "Logout successfully"
    };
}
