// components/AuthGuard.jsx
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { jwtDecode } from "jwt-decode"
import { API_URL } from "../api"

const AuthGuard = () => {
    const navigate = useNavigate()

    useEffect(() => {
        const checkToken = async () => {
            try {
                const response = await axios.get(`${API_URL.REFRESH_TOKEN}`, {
                    withCredentials: true, // penting untuk kirim cookie
                });
                const token = response.data.accessToken;
                const decoded = jwtDecode(token);
                const currentTime = Date.now() / 1000;

                if (decoded.exp > currentTime) {
                    navigate("/dashboard");
                }
            } catch (error) {
                // Jika gagal, biarkan tetap di login page
                console.log("Token check failed");
            }
        };

        checkToken();
    }, []);

    return null;
};

export default AuthGuard;
