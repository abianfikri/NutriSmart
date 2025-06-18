import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import MealPlanForm from './Components/MealPlanForm';
import MealCard from './Components/MealCard';
import { API_URL } from '../../api';

const Meal = () => {
    const [token, setToken] = useState('');
    const [expired, setExpired] = useState(0);
    const [mealPlan, setMealPlan] = useState(null);
    const [saveMealPlan, setSaveMealPlan] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedTab, setSelectedTab] = useState('view'); // 'view' or 'form'
    const [calorieAnalysis, setCalorieAnalysis] = useState(null);
    const [latestFormData, setLatestFormData] = useState(null);

    const refreshToken = async () => {
        try {
            const res = await axios.get(`${API_URL.REFRESH_TOKEN}`);
            setToken(res.data.accessToken);
            const decoded = jwtDecode(res.data.accessToken);
            setExpired(decoded.exp);
            return res.data.accessToken;
        } catch (error) {
            console.error('Unauthorized', error);
        }
    };

    const axiosJwt = axios.create();
    axiosJwt.interceptors.request.use(async (config) => {
        const currentDate = new Date();
        if (expired * 1000 < currentDate.getTime()) {
            const res = await axios.get(`${API_URL.REFRESH_TOKEN}`);
            config.headers.Authorization = `Bearer ${res.data.accessToken}`;
            setToken(res.data.accessToken);
            const decoded = jwtDecode(res.data.accessToken);
            setExpired(decoded.exp);
        } else {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    }, (error) => {
        return Promise.reject(error);
    });

    const getCalorieAnalysis = async (currentToken) => {
        try {
            const response = await axios.get(`${API_URL.GET_ANALYSIS}`, {
                headers: {
                    Authorization: `Bearer ${currentToken || token}`
                }
            });

            setCalorieAnalysis(response.data.data);
        } catch (error) {
            console.error('Error fetching calorie analysis:', error);
        }
    }

    const fetchSavedMealPlan = async (currentToken) => {
        setLoading(true);
        try {
            const response = await axiosJwt.get(`${API_URL.GET_MEAL_PLAN}`, {
                headers: {
                    Authorization: `Bearer ${currentToken || token}`
                }
            });
            if (response.data && response.data.data && response.data.data.mealPlan) {
                setSaveMealPlan(response.data.data); // Simpan seluruh objek data dari API
                setMealPlan(response.data.data.mealPlan); // Tampilkan meal plan yang tersimpan di view
                setLatestFormData({ // Set latestFormData dari meal plan yang tersimpan
                    minCalories: response.data.data.minCalories,
                    maxCalories: response.data.data.maxCalories,
                    timeFrame: response.data.data.timeFrame,
                    diets: response.data.data.diets,
                    selectedMeals: response.data.data.selectedMeals,
                    selectedDishes: response.data.data.selectedDishes,
                });
            } else {
                setSaveMealPlan(null);
                setMealPlan(null);
                setLatestFormData(null);
            }
        } catch (error) {
            console.error('Error fetching saved meal plan:', error);
            setSaveMealPlan(null);
            setMealPlan(null);
            setLatestFormData(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const init = async () => {
            const currentToken = await refreshToken();
            if (currentToken) {
                getCalorieAnalysis(currentToken);
                fetchSavedMealPlan(currentToken);
            }
        }

        init();
    }, []);

    const handleGenerate = async (formData) => {
        setLoading(true);
        setMealPlan(null);
        // Penting: Bersihkan selectedDishes agar hanya berisi yang benar-benar dipilih di selectedMeals
        const cleanedSelectedDishes = {};
        formData.selectedMeals.forEach(meal => {
            if (formData.selectedDishes[meal]) {
                cleanedSelectedDishes[meal] = formData.selectedDishes[meal];
            }
        });

        const payload = {
            ...formData,
            minCalories: Number(formData.minCalories),
            maxCalories: Number(formData.maxCalories),
            timeFrame: Number(formData.timeFrame),
            selectedDishes: cleanedSelectedDishes,
        };

        setLatestFormData(payload);

        try {
            const response = await axiosJwt.post(`${API_URL.GET_RECOMMENDATION}`, payload);

            if (response.data && response.data.status === 'success') {
                setMealPlan(response.data.data);
                setSelectedTab('view');
                return {
                    success: true,
                    message: response.data.message,
                    data: response.data.data,
                };
            } else {
                return {
                    success: false,
                    message: response.data.message,
                    statusCode: response.status || 400,
                };
            }
        } catch (error) {
            let message = 'Terjadi kesalahan saat mengambil data. Silakan coba lagi.';
            let statusCode = 500;

            if (error.response) {
                const { status, data } = error.response;
                statusCode = status;
                if (status === 400) {
                    message = data.message || 'Input tidak valid';
                } else if (status === 500) {
                    message = data.message || 'Terjadi kesalahan server.';
                }
            }

            return {
                success: false,
                message: message,
                statusCode: statusCode
            };
        } finally {
            setLoading(false);
        }
    };


    const handleSaveMealPlan = async () => {
        // If there's no mealPlan generated or no form data to save, return
        if (!mealPlan || !latestFormData) {
            window.Swal.fire('Peringatan', 'Tidak ada meal plan untuk disimpan atau data form tidak ditemukan.', 'warning');
            return;
        }

        // Penting: Bersihkan selectedDishes agar hanya berisi yang benar-benar dipilih di selectedMeals
        const cleanedSelectedDishes = {};
        latestFormData.selectedMeals.forEach(meal => {
            if (latestFormData.selectedDishes[meal]) {
                cleanedSelectedDishes[meal] = latestFormData.selectedDishes[meal];
            }
        });

        window.Swal.fire({
            title: 'Sedang menyimpan...',
            allowOutsideClick: false,
            didOpen: () => {
                window.Swal.showLoading();
            },
        });

        try {
            const dataToSave = {
                mealPlan: mealPlan, // mealPlan yang sedang ditampilkan
                minCalories: latestFormData.minCalories,
                maxCalories: latestFormData.maxCalories,
                timeFrame: latestFormData.timeFrame,
                diets: latestFormData.diets,
                selectedMeals: latestFormData.selectedMeals,
                selectedDishes: cleanedSelectedDishes,
            };

            const response = await axiosJwt.post(`${API_URL.SAVE_MEAL_PLAN}`, dataToSave);
            window.Swal.close();
            window.Swal.fire(
                'Berhasil',
                response.data.message,
                'success'
            );
            // Setelah berhasil menyimpan/mengupdate, update savedMealPlan dengan data terbaru dari respons
            setSaveMealPlan(response.data.data);
            setMealPlan(response.data.data.mealPlan); // Pastikan mealPlan yang ditampilkan adalah yang tersimpan
            // Set latestFormData agar sesuai dengan data yang baru tersimpan (untuk edit selanjutnya)
            setLatestFormData({
                minCalories: response.data.data.minCalories,
                maxCalories: response.data.data.maxCalories,
                timeFrame: response.data.data.timeFrame,
                diets: response.data.data.diets,
                selectedMeals: response.data.data.selectedMeals,
                selectedDishes: response.data.data.selectedDishes,
            });
        } catch (error) {
            window.Swal.close();
            window.Swal.fire(
                'Gagal',
                'Terjadi kesalahan saat menyimpan meal plan.',
                'error'
            );
            console.error(error);
        }
    }

    const isCurrentMealPlanSaved = () => {
        if (!mealPlan || !saveMealPlan?.mealPlan) return false;

        const areFormsEqual =
            latestFormData?.minCalories === saveMealPlan.minCalories &&
            latestFormData?.maxCalories === saveMealPlan.maxCalories &&
            latestFormData?.timeFrame === saveMealPlan.timeFrame &&
            JSON.stringify(latestFormData?.diets) === JSON.stringify(saveMealPlan.diets) &&
            JSON.stringify(latestFormData?.selectedMeals) === JSON.stringify(saveMealPlan.selectedMeals) &&
            JSON.stringify(latestFormData?.selectedDishes) === JSON.stringify(saveMealPlan.selectedDishes);

        const areMealPlansContentEqual = JSON.stringify(mealPlan) === JSON.stringify(saveMealPlan.mealPlan);

        return areFormsEqual && areMealPlansContentEqual;
    };

    return (
        <div className="container mt-5">
            <div className="row">
                {/* Sidebar */}
                <div className="col-md-3 mb-3">
                    <div className="list-group">
                        <button
                            className={`list-group-item list-group-item-action ${selectedTab === 'view' ? 'active' : ''}`}
                            onClick={() => {
                                setSelectedTab('view');
                                // Jika ada meal plan yang tersimpan, tampilkan itu di tab 'view'
                                if (saveMealPlan) {
                                    setMealPlan(saveMealPlan.mealPlan);
                                } else {
                                    setMealPlan(null);
                                }
                            }}
                        >
                            Meal Plan Anda
                        </button>
                        <button
                            className={`list-group-item list-group-item-action ${selectedTab === 'form' ? 'active' : ''}`}
                            onClick={() => {
                                setSelectedTab('form');
                                // Saat beralih ke form, pastikan `mealPlan` di-reset ke `null`
                                // agar `initialFormData` di `MealPlanForm` yang berlaku
                                setMealPlan(null);
                            }}
                        >
                            {saveMealPlan ? 'Edit Meal Plan Anda' : 'Buat Meal Plan Baru'}
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="col-md-9">
                    {selectedTab === 'view' && (
                        <div className="position-relative"> {/* Tambahkan div untuk relative positioning */}
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h3 className="mb-0">Meal Plan Anda</h3>
                                {/* Tombol Edit / Simpan */}
                                {loading ? null : ( // Sembunyikan tombol jika loading
                                    mealPlan ? ( // Tampilkan tombol jika ada mealPlan yang ditampilkan
                                        saveMealPlan && isCurrentMealPlanSaved() ? (
                                            <button
                                                className="btn btn-warning btn-sm"
                                                onClick={() => {
                                                    setSelectedTab('form');
                                                    setMealPlan(null);
                                                }}
                                            >
                                                Edit Meal Plan
                                            </button>
                                        ) : (
                                            <button
                                                className="btn btn-primary btn-sm"
                                                onClick={handleSaveMealPlan}
                                                disabled={loading}
                                            >
                                                {loading ? 'Menyimpan...' : 'Simpan Meal Plan'}
                                            </button>
                                        )
                                    ) : null
                                )}
                            </div>
                            {loading && !mealPlan ? ( // Tampilkan loading saat fetch saved meal plan atau generate baru
                                <div className="text-center mt-5">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                    <p>Memuat meal plan...</p>
                                </div>
                            ) : (
                                mealPlan ? ( // Gunakan mealPlan (hasil generate atau saved)
                                    // Konten meal card, wrap dalam div dengan max-height dan overflow-y
                                    <div style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                                        <MealCard data={mealPlan} />
                                    </div>
                                ) : (
                                    <div className="alert alert-info" role="alert">
                                        Data meal plan belum dibuat. Silakan buat meal plan baru di tab "{saveMealPlan ? 'Edit Meal Plan Anda' : 'Buat Meal Plan Baru'}".
                                    </div>
                                )
                            )}
                        </div>
                    )}

                    {selectedTab === 'form' && (
                        <>
                            {/* Pass savedMealPlan.data ke initialFormData jika ada */}
                            <MealPlanForm
                                onGenerate={handleGenerate}
                                loading={loading}
                                initialCalories={calorieAnalysis}
                                initialFormData={saveMealPlan} // Mengirimkan savedMealPlan sebagai initialFormData
                            />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Meal;
