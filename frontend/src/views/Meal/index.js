import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import MealPlanForm from './Components/MealPlanForm';
import MealCard from './Components/MealCard';

const Meal = () => {
    const [token, setToken] = useState('');
    const [expired, setExpired] = useState(0);
    const [mealPlan, setMealPlan] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedTab, setSelectedTab] = useState('view'); // 'view' or 'form'

    const refreshToken = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/auth/token');
            setToken(res.data.accessToken);
            const decoded = jwtDecode(res.data.accessToken);
            setExpired(decoded.exp);
        } catch (error) {
            console.error('Unauthorized', error);
        }
    };

    const axiosJwt = axios.create();
    axiosJwt.interceptors.request.use(async (config) => {
        const currentDate = new Date();
        if (expired * 1000 < currentDate.getTime()) {
            const res = await axios.get('http://localhost:5000/api/auth/token');
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

    useEffect(() => {
        refreshToken();
    }, []);

    const handleGenerate = async (formData) => {
        setLoading(true);
        setMealPlan(null);
        try {
            const res = await axiosJwt.post('http://localhost:5000/api/users/meal-plan', formData);
            setMealPlan(res.data.data);
            setSelectedTab('view'); // pindah ke tab hasil
        } catch (err) {
            console.error(err);
            alert('Failed to generate meal plan');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row">
                {/* Sidebar */}
                <div className="col-md-3 mb-3">
                    <div className="list-group">
                        <button
                            className={`list-group-item list-group-item-action ${selectedTab === 'view' ? 'active' : ''}`}
                            onClick={() => setSelectedTab('view')}
                        >
                            Meal Plan Anda
                        </button>
                        <button
                            className={`list-group-item list-group-item-action ${selectedTab === 'form' ? 'active' : ''}`}
                            onClick={() => setSelectedTab('form')}
                        >
                            Buat Meal Plan Baru
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="col-md-9">
                    {selectedTab === 'view' && (
                        <>
                            <h3 className="mb-3">Meal Plan Anda</h3>
                            {mealPlan ? (
                                <MealCard data={mealPlan} />
                            ) : (
                                <div className="alert alert-info">Belum ada meal plan yang dibuat.</div>
                            )}
                        </>
                    )}

                    {selectedTab === 'form' && (
                        <>
                            <MealPlanForm onGenerate={handleGenerate} loading={loading} />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Meal;
