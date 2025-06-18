import React, { useEffect, useState } from 'react';
import ConfirmationModal from './ConfirmationModal';

const MealPlanForm = ({ onGenerate, loading, initialCalories, initialFormData }) => {
    const [step, setStep] = useState(0);
    const [form, setForm] = useState({
        minCalories: '',
        maxCalories: '',
        timeFrame: '1',
        diets: [],
        selectedMeals: [],
        selectedDishes: {},
    });

    const [showConfirm, setShowConfirm] = useState(false);

    const steps = ['Kalori & Waktu', 'Diet', 'Meal & Dish', 'Konfirmasi'];

    useEffect(() => {
        if (initialCalories) {
            const ambValue = initialCalories.amb !== undefined ? Math.round(initialCalories.amb) : '';
            const tddValue = initialCalories.tdd !== undefined ? Math.round(initialCalories.tdd) : '';

            setForm((prev) => ({
                ...prev,
                minCalories: ambValue,
                maxCalories: tddValue,
            }));
        }
    }, [initialCalories]);

    // Tambahkan useEffect untuk mengisi form dengan initialFormData
    useEffect(() => {
        if (initialFormData) {
            const newFormState = {
                minCalories: initialFormData.minCalories || '',
                maxCalories: initialFormData.maxCalories || '',
                timeFrame: initialFormData.timeFrame || '',
                diets: Array.isArray(initialFormData.diets) ? initialFormData.diets : [],
                selectedMeals: Array.isArray(initialFormData.selectedMeals) ? initialFormData.selectedMeals : [],
                selectedDishes: typeof initialFormData.selectedDishes === 'object' && !Array.isArray(initialFormData.selectedDishes)
                    ? initialFormData.selectedDishes
                    : {},
            };

            setForm(newFormState);
        }
    }, [initialFormData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e, key) => {
        const { value, checked } = e.target;
        setForm((prev) => {
            const current = new Set(prev[key]);
            checked ? current.add(value) : current.delete(value);
            return { ...prev, [key]: Array.from(current) };
        });
    };

    const handleDishChange = (meal, value) => {
        setForm((prev) => ({
            ...prev,
            selectedDishes: {
                ...prev.selectedDishes,
                [meal]: value,
            },
        }));
    };

    const handleConfirm = async () => {
        setShowConfirm(false);

        window.Swal.fire({
            title: 'Sedang memproses...',
            allowOutsideClick: false,
            didOpen: () => {
                window.Swal.showLoading();
            },
        });

        try {
            const response = await onGenerate(form);
            window.Swal.close();

            if (response.success) {
                window.Swal.fire(
                    'Berhasil',
                    response.message,
                    'success'
                );
            } else {
                const swalType = response.statusCode === 400 ? 'warning' : 'error';
                window.Swal.fire(
                    'Gagal',
                    response.message,
                    swalType
                );
            }
        } catch (error) {
            window.Swal.close();
            window.Swal.fire(
                'Gagal',
                'Terjadi kesalahan saat memproses data. Silakan coba lagi.',
                'error'
            );
        }
    };


    const renderStep = () => {
        switch (step) {
            case 0:
                return (
                    <>
                        <div className="mb-3">
                            <label className="form-label">Min Calories</label>
                            <input
                                type="number"
                                name="minCalories"
                                className="form-control"
                                value={form.minCalories}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Max Calories</label>
                            <input
                                type="number"
                                name="maxCalories"
                                className="form-control"
                                value={form.maxCalories}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Time Frame (days)</label>
                            <input
                                type="number"
                                name="timeFrame"
                                className="form-control"
                                value={form.timeFrame}
                                onChange={handleChange}
                            />
                        </div>
                    </>
                );
            case 1:
                return (
                    <>
                        <label className="form-label">Diet Preferences</label>
                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                value="vegetarian"
                                checked={form.diets.includes('vegetarian')}
                                onChange={(e) => handleCheckboxChange(e, 'diets')}
                            />
                            <label className="form-check-label">Vegetarian</label>
                        </div>
                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                value="vegan"
                                checked={form.diets.includes('vegan')}
                                onChange={(e) => handleCheckboxChange(e, 'diets')}
                            />
                            <label className="form-check-label">Vegan</label>
                        </div>
                        {/* Add more diets if needed */}
                    </>
                );
            case 2:
                console.log("MealPlanForm: Rendering Step 2. Current form.selectedMeals:", form.selectedMeals);
                console.log("MealPlanForm: Current form.selectedDishes:", form.selectedDishes);
                const mealOptions = ['breakfast', 'lunch', 'dinner'];
                const dishOptions = {
                    breakfast: ['main course', 'Oatmeal', 'Omelette'],
                    lunch: ['main course', 'Grilled Chicken', 'Salad'],
                    dinner: ['main course', 'Soup', 'Steamed Vegetables'],
                };

                return (
                    <>
                        <label className="form-label">Select Meals</label>
                        {mealOptions.map((meal) => (
                            <div className="form-check" key={meal}>
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    value={meal}
                                    checked={form.selectedMeals.includes(meal)}
                                    onChange={(e) => handleCheckboxChange(e, 'selectedMeals')}
                                />
                                <label className="form-check-label">{meal}</label>
                            </div>
                        ))}

                        {form.selectedMeals.map((meal) => (
                            <div className="mt-3" key={meal}>
                                <label className="form-label">Dish for {meal}</label>
                                <select
                                    className="form-select"
                                    value={form.selectedDishes[meal] || ''}
                                    onChange={(e) => handleDishChange(meal, e.target.value)}
                                >
                                    <option value="">Pilih Dish</option>
                                    {dishOptions[meal].map((dish) => (
                                        <option key={dish} value={dish}>
                                            {dish}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        ))}
                    </>
                );
            case 3:
                return <p>Klik tombol "Lihat Ringkasan" untuk melihat konfirmasi sebelum submit.</p>;
            default:
                return null;
        }
    };

    return (
        <div className="container p-4 shadow rounded bg-white" style={{ maxWidth: '600px' }}>
            <h4 className="mb-4">Form Meal Plan - Step {step + 1} / {steps.length}</h4>
            {renderStep()}

            <div className="d-flex justify-content-between mt-4">
                <button className="btn btn-secondary" onClick={() => setStep((s) => Math.max(s - 1, 0))} disabled={step === 0}>
                    Kembali
                </button>

                {step < steps.length - 1 ? (
                    <button className="btn btn-success" onClick={() => setStep((s) => Math.min(s + 1, steps.length - 1))}>
                        Lanjut
                    </button>
                ) : (
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => setShowConfirm(true)}
                    >
                        Lihat Ringkasan
                    </button>
                )}
            </div>

            <ConfirmationModal
                show={showConfirm}
                onHide={() => setShowConfirm(false)}
                form={form}
                onConfirm={handleConfirm}
            />
        </div>
    );

};

export default MealPlanForm;