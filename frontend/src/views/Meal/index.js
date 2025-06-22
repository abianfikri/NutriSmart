import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import MealPlanForm from './Components/MealPlanForm';
import MealCard from './Components/MealCard';
import RequestCard from './Components/RequestCard';
import { API_URL } from '../../api';

const Meal = () => {
    const [token, setToken] = useState('');
    const [expired, setExpired] = useState(0);
    const [mealPlan, setMealPlan] = useState(null);
    const [saveMealPlan, setSaveMealPlan] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedTab, setSelectedTab] = useState('view');
    const [calorieAnalysis, setCalorieAnalysis] = useState(null);
    const [latestFormData, setLatestFormData] = useState(null); // Data form terakhir yang digunakan untuk generate/simpan

    const refreshToken = async () => {
        try {
            const res = await axios.get(`${API_URL.REFRESH_TOKEN}`);
            setToken(res.data.accessToken);
            const decoded = jwtDecode(res.data.accessToken);
            setExpired(decoded.exp);
            return res.data.accessToken;
        } catch (error) {
            console.error('Unauthorized', error);
            return null;
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
            setCalorieAnalysis(null);
        }
    }

    const parseJsonString = (jsonString, defaultValue) => {
        if (typeof jsonString === 'string') {
            try {
                let parsed = JSON.parse(jsonString);

                if (typeof parsed === 'string') { // Handle double-parsed strings
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

                const parsedDiets = parseJsonString(apiData.diets, []);
                const parsedSelectedMeals = parseJsonString(apiData.selectedMeals, []);
                const parsedSelectedDishes = parseJsonString(apiData.selectedDishes, {});

                const currentSavedData = {
                    ...apiData,
                    diets: parsedDiets,
                    selectedMeals: parsedSelectedMeals,
                    selectedDishes: parsedSelectedDishes,
                };

                setSaveMealPlan(currentSavedData);
                setMealPlan(apiData.mealPlan); // Tampilkan meal plan yang tersimpan saat pertama kali loading

                // Pastikan latestFormData disetel saat meal plan disimpan dimuat
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
        setMealPlan(null); // Kosongkan meal plan saat generate baru

        const payload = {
            ...formData,
            minCalories: Number(formData.minCalories),
            maxCalories: Number(formData.maxCalories),
            timeFrame: Number(formData.timeFrame),
        };

        const cleanedSelectedDishes = {};
        if (Array.isArray(formData.selectedMeals)) {
            formData.selectedMeals.forEach(meal => {
                if (formData.selectedDishes && formData.selectedDishes[meal]) {
                    cleanedSelectedDishes[meal] = formData.selectedDishes[meal];
                }
            });
        }
        payload.selectedDishes = cleanedSelectedDishes;

        // Set latestFormData di sini karena ini adalah data yang baru saja digenerate
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
        if (!mealPlan || !latestFormData) {
            window.Swal.fire('Peringatan', 'Tidak ada meal plan untuk disimpan atau data form tidak ditemukan.', 'warning');
            return;
        }

        const cleanedSelectedDishes = {};
        if (Array.isArray(latestFormData.selectedMeals)) {
            latestFormData.selectedMeals.forEach(meal => {
                if (latestFormData.selectedDishes && latestFormData.selectedDishes[meal]) {
                    cleanedSelectedDishes[meal] = latestFormData.selectedDishes[meal];
                }
            });
        }

        const dataToSave = {
            mealPlan: mealPlan,
            minCalories: latestFormData.minCalories,
            maxCalories: latestFormData.maxCalories,
            timeFrame: latestFormData.timeFrame,
            diets: latestFormData.diets,
            selectedMeals: latestFormData.selectedMeals,
            selectedDishes: cleanedSelectedDishes,
        };


        window.Swal.fire({
            title: 'Sedang menyimpan...',
            allowOutsideClick: false,
            didOpen: () => {
                window.Swal.showLoading();
            },
        });

        try {
            const response = await axiosJwt.post(`${API_URL.SAVE_MEAL_PLAN}`, dataToSave);
            window.Swal.close();
            window.Swal.fire(
                'Berhasil',
                response.data.message,
                'success'
            );

            const apiData = response.data.data;
            const parsedDiets = parseJsonString(apiData.diets, []);
            const parsedSelectedMeals = parseJsonString(apiData.selectedMeals, []);
            const parsedSelectedDishes = parseJsonString(apiData.selectedDishes, {});

            const updatedSavedMealPlan = {
                ...apiData,
                diets: parsedDiets,
                selectedMeals: parsedSelectedMeals,
                selectedDishes: parsedSelectedDishes,
            };

            setSaveMealPlan(updatedSavedMealPlan); // Update saveMealPlan dengan data terbaru dari DB
            setMealPlan(apiData.mealPlan);

            // Update latestFormData juga agar form konsisten dengan data yang baru saja disimpan
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

    // Membandingkan data form terbaru dengan data yang tersimpan untuk menentukan apakah sudah tersimpan
    const isCurrentMealPlanSaved = () => {
        if (!mealPlan || !saveMealPlan?.mealPlan || !latestFormData) return false;

        const areFormsEqual =
            latestFormData.minCalories === saveMealPlan.minCalories &&
            latestFormData.maxCalories === saveMealPlan.maxCalories &&
            latestFormData.timeFrame === saveMealPlan.timeFrame &&
            JSON.stringify(latestFormData.diets) === JSON.stringify(saveMealPlan.diets) &&
            JSON.stringify(latestFormData.selectedMeals) === JSON.stringify(saveMealPlan.selectedMeals) &&
            JSON.stringify(latestFormData.selectedDishes) === JSON.stringify(saveMealPlan.selectedDishes);

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
                            style={selectedTab === 'view' ? { backgroundColor: '#2ecc71', color: 'white', borderColor: '#2ecc71' } : {}}
                            onClick={() => {
                                setSelectedTab('view');
                                if (saveMealPlan) {
                                    setMealPlan(saveMealPlan.mealPlan);
                                    // Pastikan latestFormData juga sesuai dengan saveMealPlan saat kembali ke view
                                    setLatestFormData({
                                        minCalories: saveMealPlan.minCalories,
                                        maxCalories: saveMealPlan.maxCalories,
                                        timeFrame: saveMealPlan.timeFrame,
                                        diets: saveMealPlan.diets,
                                        selectedMeals: saveMealPlan.selectedMeals,
                                        selectedDishes: saveMealPlan.selectedDishes,
                                    });
                                } else {
                                    setMealPlan(null);
                                    setLatestFormData(null); // Reset jika tidak ada saveMealPlan
                                }
                            }}
                        >
                            Meal Plan Anda
                        </button>
                        <button
                            className={`list-group-item list-group-item-action ${selectedTab === 'form' ? 'active' : ''}`}
                            style={selectedTab === 'form' ? { backgroundColor: '#2ecc71', color: 'white', borderColor: '#2ecc71' } : {}}
                            onClick={() => {
                                setSelectedTab('form');
                                setMealPlan(null); // Clear mealPlan in form tab
                                // latestFormData akan dihandle oleh prop initialFormData di MealPlanForm
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
                                                className="btn btn-outline-success btn-sm"
                                                onClick={() => {
                                                    setSelectedTab('form');
                                                    setMealPlan(null); // Clear meal plan for form view
                                                }}
                                            >
                                                Edit Meal Plan
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                className="btn text-white btn-sm"
                                                style={{ backgroundColor: '#2ecc71', border: 'none' }}
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
                                    <div className="spinner-border text-success" role="status">
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