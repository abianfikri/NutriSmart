// src/pages/Meal.js (atau lokasi file Meal.js Anda)
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import MealPlanForm from './Components/MealPlanForm'; // Perbaiki path jika perlu
import MealCard from './Components/MealCard'; // Perbaiki path jika perlu
import RequestCard from './Components/RequestCard'; // Perbaiki path jika perlu
import { API_URL } from '../../api'; // Perbaiki path jika perlu

const Meal = () => {
    const [token, setToken] = useState('');
    const [expired, setExpired] = useState(0);
    const [mealPlan, setMealPlan] = useState(null);
    const [saveMealPlan, setSaveMealPlan] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedTab, setSelectedTab] = useState('view');
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

    const parseJsonString = (jsonString, defaultValue) => {
        if (typeof jsonString === 'string') {
            try {
                let parsed = JSON.parse(jsonString);

                if (typeof parsed === 'string') {
                    try {
                        parsed = JSON.parse(parsed);
                    } catch (e) {
                        console.warn('Failed to parse JSON string (second attempt):', parsed, e);
                        return defaultValue;
                    }
                }

                if (defaultValue === null || defaultValue === undefined) {
                    return parsed;
                } else if (Array.isArray(defaultValue) && !Array.isArray(parsed)) {
                    console.warn('Parsed value is not an array as expected:', parsed);
                    return defaultValue;
                } else if (typeof defaultValue === 'object' && defaultValue !== null && (typeof parsed !== 'object' || parsed === null)) {
                    console.warn('Parsed value is not an object as expected:', parsed);
                    return defaultValue;
                }
                return parsed;

            } catch (e) {
                console.warn('Failed to parse JSON string (first attempt):', jsonString, e);
                return defaultValue;
            }
        }
        return jsonString;
    };
    // Ini adalah akhir dari fungsi helper parseJsonString

    const fetchSavedMealPlan = async (currentToken) => {
        setLoading(true);
        try {
            const response = await axiosJwt.get(`${API_URL.GET_MEAL_PLAN}`, {
                headers: {
                    Authorization: `Bearer ${currentToken || token}`
                }
            });
            if (response.data && response.data.data && response.data.status === 'success') {
                const apiData = response.data.data;

                // Parse semua properti yang mungkin berupa string JSON
                const parsedDiets = parseJsonString(apiData.diets, []);
                const parsedSelectedMeals = parseJsonString(apiData.selectedMeals, []);
                const parsedSelectedDishes = parseJsonString(apiData.selectedDishes, {});

                setSaveMealPlan({
                    ...apiData,
                    diets: parsedDiets,
                    selectedMeals: parsedSelectedMeals,
                    selectedDishes: parsedSelectedDishes,
                });
                setMealPlan(apiData.mealPlan); // mealPlan sendiri biasanya sudah objek/array
                setLatestFormData({
                    minCalories: apiData.minCalories,
                    maxCalories: apiData.maxCalories,
                    timeFrame: apiData.timeFrame,
                    diets: parsedDiets,
                    selectedMeals: parsedSelectedMeals,
                    selectedDishes: parsedSelectedDishes,
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
                await getCalorieAnalysis(currentToken);
                await fetchSavedMealPlan(currentToken);
            }
        }
        init();
    }, []);

    const handleGenerate = async (formData) => {
        setLoading(true);
        setMealPlan(null);

        // Pastikan diets, selectedMeals, selectedDishes dari formData juga di-parse jika perlu (misal dari MealPlanForm)
        const parsedFormData = {
            ...formData,
            diets: parseJsonString(formData.diets, []),
            selectedMeals: parseJsonString(formData.selectedMeals, []),
            selectedDishes: parseJsonString(formData.selectedDishes, {}),
        };

        const cleanedSelectedDishes = {};
        parsedFormData.selectedMeals.forEach(meal => {
            if (parsedFormData.selectedDishes && parsedFormData.selectedDishes[meal]) {
                cleanedSelectedDishes[meal] = parsedFormData.selectedDishes[meal];
            }
        });

        const payload = {
            ...parsedFormData,
            minCalories: Number(parsedFormData.minCalories),
            maxCalories: Number(parsedFormData.maxCalories),
            timeFrame: Number(parsedFormData.timeFrame),
            selectedDishes: cleanedSelectedDishes, // Gunakan yang sudah dibersihkan dan dipastikan objek
        };

        setLatestFormData(payload); // Simpan payload yang sudah di-parse dan dibersihkan

        try {
            const response = await axiosJwt.post(`${API_URL.GET_RECOMMENDATION}`, payload);

            if (response.data && response.data.status === 'success') {
                setMealPlan(response.data.data); // Asumsi mealPlan dari API sudah dalam format yang benar
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
        if (!mealPlan || !latestFormData) {
            window.Swal.fire('Peringatan', 'Tidak ada meal plan untuk disimpan atau data form tidak ditemukan.', 'warning');
            return;
        }

        const cleanedSelectedDishes = {};
        latestFormData.selectedMeals.forEach(meal => {
            if (latestFormData.selectedDishes && latestFormData.selectedDishes[meal]) {
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
            // Saat mengirim ke backend, stringify sekali saja
            const dataToSave = {
                mealPlan: mealPlan,
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

            const apiData = response.data.data;
            // Parse kembali respons dari API setelah menyimpan, gunakan fungsi yang lebih tangguh
            const parsedDiets = parseJsonString(apiData.diets, []);
            const parsedSelectedMeals = parseJsonString(apiData.selectedMeals, []);
            const parsedSelectedDishes = parseJsonString(apiData.selectedDishes, {});

            setSaveMealPlan({
                ...apiData,
                diets: parsedDiets,
                selectedMeals: parsedSelectedMeals,
                selectedDishes: parsedSelectedDishes,
            });
            setMealPlan(apiData.mealPlan);

            setLatestFormData({
                minCalories: apiData.minCalories,
                maxCalories: apiData.maxCalories,
                timeFrame: apiData.timeFrame,
                diets: parsedDiets,
                selectedMeals: parsedSelectedMeals,
                selectedDishes: parsedSelectedDishes,
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

        // saveMealPlan sudah di-parse di fetchSavedMealPlan, jadi perbandingan harusnya langsung benar
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
                <div className="col-md-3 mb-3">
                    <div className="list-group">
                        <button
                            className={`list-group-item list-group-item-action ${selectedTab === 'view' ? 'active' : ''}`}
                            onClick={() => {
                                setSelectedTab('view');
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
                                setMealPlan(null);
                            }}
                        >
                            {saveMealPlan ? 'Edit Meal Plan Anda' : 'Buat Meal Plan Baru'}
                        </button>
                    </div>

                    {saveMealPlan && (
                        <div className="mt-3">
                            <RequestCard
                                formData={saveMealPlan}
                            />
                        </div>
                    )}
                </div>

                <div className="col-md-9">
                    {selectedTab === 'view' && (
                        <div className="position-relative">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h3 className="mb-0">Meal Plan Anda</h3>
                                {loading ? null : (
                                    mealPlan ? (
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
                            {loading && !mealPlan ? (
                                <div className="text-center mt-5">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                    <p>Memuat meal plan...</p>
                                </div>
                            ) : (
                                mealPlan ? (
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
                            <MealPlanForm
                                onGenerate={handleGenerate}
                                loading={loading}
                                initialCalories={calorieAnalysis}
                                initialFormData={latestFormData || saveMealPlan}
                            />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Meal;