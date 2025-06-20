import React, { useEffect, useState } from 'react';
import ConfirmationModal from './ConfirmationModal';

const MealPlanForm = ({ onGenerate, loading, initialCalories, initialFormData }) => {
    const [step, setStep] = useState(0);
    const [form, setForm] = useState({
        minCalories: '',
        maxCalories: '',
        timeFrame: 1,
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
                minCalories: initialFormData.minCalories !== undefined ? initialFormData.minCalories : '',
                maxCalories: initialFormData.maxCalories !== undefined ? initialFormData.maxCalories : '',
                timeFrame: initialFormData.timeFrame !== undefined ? initialFormData.timeFrame : 1,
                diets: Array.isArray(initialFormData.diets) ? initialFormData.diets : [],
                selectedMeals: Array.isArray(initialFormData.selectedMeals) ? initialFormData.selectedMeals : [],
                selectedDishes: typeof initialFormData.selectedDishes === 'object' && !Array.isArray(initialFormData.selectedDishes)
                    ? initialFormData.selectedDishes
                    : {},
            };

            setForm(newFormState);
            setStep(0);
        } else {
            // Jika initialFormData null (misal: saat membuat meal plan baru dan tidak ada data tersimpan)
            // Reset form ke nilai default (atau nilai dari initialCalories jika ada)
            setForm({
                minCalories: initialCalories?.amb !== undefined ? Math.round(initialCalories.amb) : '',
                maxCalories: initialCalories?.tdd !== undefined ? Math.round(initialCalories.tdd) : '',
                timeFrame: 1, // Kembali ke default number
                diets: [],
                selectedMeals: [],
                selectedDishes: {},
            });
            setStep(0);
        }
    }, [initialFormData, initialCalories]);

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setForm((prev) => (
            {
                ...prev,
                [name]: type === 'number' ? Number(value) : value
            }
        ));
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
                const dietOptions = [
                    { value: 'keto', label: 'Keto' },
                    { value: 'LOW_CARB', label: 'Low-Carb' },
                    { value: 'LOW_FAT', label: 'Low-fat' },
                    { value: 'HIGH_PROTEIN', label: 'High-Protein' },
                    { value: 'HIGH_FIBER', label: 'High-Fiber' },
                ];
                return (
                    <>
                        <label className="form-label">Diet Preferences</label>
                        {dietOptions.map((diet) => (
                            <div key={diet.value} className="form-check">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    value={diet.value}
                                    checked={form.diets.includes(diet.value)}
                                    onChange={(e) => handleCheckboxChange(e, 'diets')}
                                />
                                <label className="form-check-label">{diet.label}</label>
                            </div>
                        ))}
                    </>
                );
            case 2:
                console.log("MealPlanForm: Rendering Step 2. Current form.selectedMeals:", form.selectedMeals);
                console.log("MealPlanForm: Current form.selectedDishes:", form.selectedDishes);
                const mealOptions = [
                    { value: 'breakfast', label: 'Breakfast' },
                    { value: 'lunch', label: 'Lunch' },
                    { value: 'dinner', label: 'Dinner' },
                ];
                const dishOptions = {
                    breakfast: [
                        { value: 'main course', label: 'Main Course' },
                        { value: 'outmeal', label: 'Outmeal' },
                        { value: 'egg', label: 'Egg' },
                    ],
                    lunch: [
                        { value: 'main course', label: 'Main Course' },
                        { value: 'seafood', label: 'Seafood' },
                        { value: 'soup', label: 'Soup' },
                    ],
                    dinner: [
                        { value: 'main course', label: 'Main Course' },
                        { value: 'desserts', label: 'Desserts' },
                        { value: 'salad', label: 'Salad' },
                    ],
                };

                return (
                    <>
                        <label className="form-label">Pilih Jenis Makanan (Minimal 2, Maksimal 3)</label>
                        {mealOptions.map((meal) => (
                            <div key={meal.value} className="form-check">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    value={meal.value}
                                    checked={form.selectedMeals.includes(meal.value)}
                                    onChange={(e) => handleCheckboxChange(e, 'selectedMeals')}
                                />
                                <label className="form-check-label">{meal.label}</label>
                            </div>
                        ))}

                        {form.selectedMeals.map((meal) => (
                            <div className="mt-3" key={meal}>
                                <label className="form-label">Pilih Dish untk {meal.charAt(0).toUpperCase() + meal.slice(1)}</label>
                                <select
                                    className="form-select"
                                    value={form.selectedDishes[meal] || ''}
                                    onChange={(e) => handleDishChange(meal, e.target.value)}
                                >
                                    <option value="">Pilih Dish</option>
                                    {dishOptions[meal].map((dish) => (
                                        <option key={dish.value} value={dish.value}>
                                            {dish.label}
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