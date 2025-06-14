import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { AnimatePresence } from 'framer-motion';
import { API_URL } from '../../api';
import ProfileSidebar from './Components/ProfileSidebar';
import ProfileInfoCard from './Components/ProfileInfoCard';
import ProfileEditForm from './Components/ProfileEditForm';

// Pastikan window.Swal tersedia, atau import jika Anda menggunakannya sebagai modul
// import Swal from 'sweetalert2'; // Contoh jika menggunakan sweetalert2 sebagai modul

const Profile = () => {
    const [activeTab, setActiveTab] = useState('profile'); // 'profile' or 'edit'
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [age, setAge] = useState('');
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [gender, setGender] = useState('');
    const [activityLevel, setActivityLevel] = useState('');
    const [calorieAnalysisData, setCalorieAnalysisData] = useState([]);
    const [editMode, setEditMode] = useState(false); // Awalnya, form tidak dalam mode edit

    const [token, setToken] = useState('');
    const [expired, setExpired] = useState('');

    const navigate = useNavigate();

    // Fungsi refreshToken tetap sama
    const refreshToken = async () => {
        try {
            const response = await axios.get(`${API_URL.REFRESH_TOKEN}`);
            setToken(response.data.accessToken);
            const decoded = jwtDecode(response.data.accessToken);
            // setName(decoded.name); // Sebaiknya name di-set dari getProfile
            setExpired(decoded.exp);
            return response.data.accessToken; // Return token untuk chaining
        } catch (error) {
            if (error.response) {
                navigate('/');
            }
            throw error; // Re-throw error untuk ditangani oleh pemanggil
        }
    };

    // axiosJwt instance dan interceptor tetap sama
    const axiosJwt = axios.create();

    axiosJwt.interceptors.request.use(async (config) => {
        const currentDate = new Date();
        if (expired * 1000 < currentDate.getTime()) {
            try {
                const newAccessToken = await refreshToken(); // Memanggil refreshToken yang sudah di-update
                config.headers['Authorization'] = `Bearer ${newAccessToken}`;
            } catch (error) {
                // Jika refresh token gagal, mungkin redirect ke login
                console.error("Session expired or refresh failed, redirecting to login.");
                navigate('/'); // Arahkan ke login jika refresh gagal
                return Promise.reject(error); // Batalkan request
            }
        } else if (token && !config.headers['Authorization']) { // Pastikan token ada dan header belum di-set
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    }, (error) => {
        return Promise.reject(error);
    });


    // Fungsi getProfile tetap sama, tetapi pastikan menggunakan token yang valid
    const getProfile = async (currentToken) => {
        const tokenToUse = currentToken || token;
        if (!tokenToUse) {
            try {
                const refreshedToken = await refreshToken();
                if (!refreshedToken) {
                    navigate('/');
                    return;
                }
                // Lanjutkan dengan token yang baru di-refresh
                const response = await axiosJwt.get(`${API_URL.GET_USER}`, {
                    headers: { Authorization: `Bearer ${refreshedToken}` }
                });

                const user = response.data.data;
                setName(user.name || '');
                setEmail(user.email || '');
                setAge(user.age || '');
                setWeight(user.weight || '');
                setHeight(user.height || '');
                setGender(user.gender || '');
                setActivityLevel(user.activityLevel || '');

                // Analisis TDDE 
                const responseAnalysis = await axiosJwt.get(`${API_URL.GET_ANALYSIS}`, {
                    headers: {
                        Authorization: `Bearer ${refreshedToken}`
                    }
                });

                const analysisData = responseAnalysis.data.data;
                setCalorieAnalysisData(analysisData);
            } catch (error) {
                console.error("Failed to fetch profile after attempting refresh", error);
                navigate('/');
            }
            return;
        }

        try {
            const response = await axiosJwt.get(`${API_URL.GET_USER}`, {
                headers: {
                    Authorization: `Bearer ${tokenToUse}`
                }
            });
            const user = response.data.data;
            setName(user.name || '');
            setEmail(user.email || '');
            setAge(user.age || '');
            setWeight(user.weight || '');
            setHeight(user.height || '');
            setGender(user.gender || '');
            setActivityLevel(user.activityLevel || '');

            // Analisis TDDE
            const responseAnalysis = await axiosJwt.get(`${API_URL.GET_ANALYSIS}`, {
                headers: {
                    Authorization: `Bearer ${tokenToUse}`
                }
            });
            const analysisData = responseAnalysis.data.data;
            setCalorieAnalysisData(analysisData);
        } catch (error) {
            console.error("Failed to fetch profile", error);
            navigate('/');
        }
    };

    // Fungsi handleSubmit tetap sama
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosJwt.patch(`${API_URL.UPDATE_USER}`, {
                name,
                email,
                gender,
                age: age ? parseInt(age) : null, // Pastikan age, weight, height dikirim sebagai number jika ada
                weight: weight ? parseFloat(weight) : null,
                height: height ? parseFloat(height) : null,
                activityLevel,
            }, {
                // Header Authorization akan ditambahkan oleh interceptor
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data.status === "success") {
                await refreshToken();
                await getProfile();

                window.Swal.fire({
                    icon: "success",
                    title: "Berhasil",
                    text: response.data.message,
                    confirmButtonText: "OK",
                    confirmButtonColor: '#3085d6',
                }).then((result) => {
                    if (result.isConfirmed) {
                        setEditMode(false);
                        setActiveTab("profile");
                    }
                });
            } else {
                window.Swal.fire({
                    icon: "error",
                    title: "Gagal",
                    text: response.data.message || "Update profil gagal.",
                    confirmButtonText: "OK",
                    confirmButtonColor: '#3085d6',
                });
            }
        } catch (error) {
            console.error("Gagal update profil", error);
            const errorMessage = error.response?.data?.message || "Terjadi kesalahan saat mengupdate profil.";
            window.Swal.fire({
                icon: "error",
                title: "Gagal",
                text: errorMessage,
                confirmButtonText: "OK",
                confirmButtonColor: '#3085d6',
            });
        }
    };

    // useEffect untuk inisialisasi
    useEffect(() => {
        const init = async () => {
            try {
                const currentToken = await refreshToken();
                if (currentToken) {
                    await getProfile(currentToken);
                } else {
                    navigate('/');
                }
            } catch (error) {
                console.error("Initialization failed:", error)
            }
        };
        init();
    }, []);


    useEffect(() => {
        if (activeTab === 'edit') {
            setEditMode(false);
        } else if (activeTab === 'profile') {
            setEditMode(false);
        }
    }, [activeTab]);


    return (
        <div className="container mt-5">
            <div className="row">
                <ProfileSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

                <div className="col-lg-8 col-md-7 col-sm-6">
                    <AnimatePresence mode="wait">
                        {activeTab === 'profile' && (
                            <ProfileInfoCard
                                key="profileCard" // Key penting untuk AnimatePresence
                                name={name}
                                email={email}
                                gender={gender}
                                age={age}
                                weight={weight}
                                height={height}
                                tddeInfo={calorieAnalysisData}
                            />
                        )}

                        {activeTab === 'edit' && (
                            <ProfileEditForm
                                key="editForm" // Key penting untuk AnimatePresence
                                name={name} setName={setName}
                                email={email} setEmail={setEmail}
                                age={age} setAge={setAge}
                                weight={weight} setWeight={setWeight}
                                height={height} setHeight={setHeight}
                                gender={gender} setGender={setGender}
                                activityLevel={activityLevel} setActivityLevel={setActivityLevel}
                                editMode={editMode}
                                setEditMode={setEditMode}
                                handleSubmit={handleSubmit}
                                getProfile={getProfile} // Untuk tombol batal agar bisa reset form
                            />
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default Profile;