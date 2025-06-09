import React, { useState } from 'react';
import ConfirmationModal from './ConfirmationModal';

const MealPlanForm = ({ onGenerate, loading }) => {
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

    const handleNext = () => setStep((prev) => Math.min(prev + 1, steps.length - 1));
    const handleBack = () => setStep((prev) => Math.max(prev - 1, 0));

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
            // Panggil fungsi generate (misal API call)
            await onGenerate(form);

            // Jika berhasil, tutup loading dan tampilkan sukses
            window.Swal.close();
            window.Swal.fire('Sukses', 'Meal plan berhasil dibuat!', 'success');
        } catch (error) {
            // Jika error, tutup loading dan tampilkan error
            window.Swal.close();
            window.Swal.fire('Error', 'Terjadi kesalahan saat generate meal plan', 'error');
        }
    }

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
            {/* renderStep() sama seperti sebelumnya */}
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
