import Users from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function registerUserService(userData) {
    const { name, email, password, confirmPassword, gender, age, weight, height, activityLevel } = userData;

    if (!name || !email || !password || !confirmPassword, !gender, !age, !weight, !height, !activityLevel) {
        throw {
            status: "error",
            message: "Tidak boleh ada bagian yang kosong"
        }
    }

    // age harus berupa angka
    if (isNaN(age) || isNaN(weight) || isNaN(height)) {
        throw {
            status: "error",
            message: "Age, Weight, dan Height harus berupa angka"
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
            message: "Email sudah terdaftar"
        }
    }

    // password harus minimal 6 karakter
    if (password.length < 6) {
        throw {
            status: "error",
            message: "Password harus minimal 6 karakter"
        }
    }

    if (password !== confirmPassword) {
        throw {
            status: "error",
            message: "Password tidak sama"
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
        message: "Pendaftaran berhasil",
        data: user
    };
}

export async function loginUserService(userData, setCookie) {
    const { email, password } = userData;

    if (!email || !password) {
        throw {
            status: "error",
            message: "Tidak boleh ada bagian yang kosong"
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
            message: "Email tidak terdaftar"
        }
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
        throw {
            status: "error",
            message: "Password salah"
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
        message: "Login berhasil. Selamat datang kembali, " + name + "!",
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
            message: "Tidak ada user yang terkait dengan token ini"
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
        message: "Logout berhasil. Sampai jumpa kembali, " + user.name + "!"
    };
}
