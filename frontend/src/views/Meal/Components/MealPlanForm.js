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

    // Efek untuk mengisi form dengan initialFormData (dari saved meal plan)
    // atau initialCalories (dari analisis) saat komponen dimuat atau props berubah
    useEffect(() => {
        let newMinCalories = '';
        let newMaxCalories = '';
        let newTimeFrame = 1;
        let newDiets = [];
        let newSelectedMeals = [];
        let newSelectedDishes = {};

        if (initialFormData) {
            // Jika ada data form yang tersimpan (sedang edit meal plan), gunakan itu
            newMinCalories = initialFormData.minCalories !== undefined ? initialFormData.minCalories : '';
            newMaxCalories = initialFormData.maxCalories !== undefined ? initialFormData.maxCalories : '';
            newTimeFrame = initialFormData.timeFrame !== undefined ? initialFormData.timeFrame : 1;
            newDiets = Array.isArray(initialFormData.diets) ? initialFormData.diets : [];
            newSelectedMeals = Array.isArray(initialFormData.selectedMeals) ? initialFormData.selectedMeals : [];
            newSelectedDishes = typeof initialFormData.selectedDishes === 'object' && !Array.isArray(initialFormData.selectedDishes)
                ? initialFormData.selectedDishes
                : {};
        } else if (initialCalories) {
            // Jika tidak ada initialFormData, tapi ada initialCalories (buat baru / pertama kali), gunakan itu
            newMinCalories = initialCalories.amb !== undefined ? Math.round(initialCalories.amb) : '';
            newMaxCalories = initialCalories.tdd !== undefined ? Math.round(initialCalories.tdd) : '';
        }

        setForm({
            minCalories: newMinCalories,
            maxCalories: newMaxCalories,
            timeFrame: newTimeFrame,
            diets: newDiets,
            selectedMeals: newSelectedMeals,
            selectedDishes: newSelectedDishes,
        });
        setStep(0); // Selalu kembali ke step 0 saat data awal dimuat/diperbarui
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

    // Fungsi baru untuk memperbarui nilai kalori di form dengan analisis terbaru
    const updateCaloriesFromAnalysis = () => {
        if (initialCalories) {
            setForm(prev => ({
                ...prev,
                minCalories: Math.round(initialCalories.amb),
                maxCalories: Math.round(initialCalories.tdd),
            }));
            window.Swal.fire(
                'Berhasil',
                'Nilai kalori di form telah diperbarui sesuai analisis terbaru.',
                'success'
            );
        }
    };

    // Fungsi untuk mengecek apakah kalori di form berbeda dengan analisis terbaru
    const areFormCaloriesOutdated = () => {
        if (!initialCalories || form.minCalories === '' || form.maxCalories === '') return false;

        const ambFromAnalysis = Math.round(initialCalories.amb);
        const tddFromAnalysis = Math.round(initialCalories.tdd);

        return Number(form.minCalories) !== ambFromAnalysis || Number(form.maxCalories) !== tddFromAnalysis;
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

                        {/* Tombol untuk memperbarui kalori, hanya tampil jika ada perbedaan */}
                        {initialCalories && areFormCaloriesOutdated() && (
                            <div className="mb-3">
                                <button
                                    type="button"
                                    className="btn btn-sm btn-warning text-dark w-100"
                                    onClick={updateCaloriesFromAnalysis}
                                >
                                    <i className="bi bi-arrow-clockwise me-2"></i>
                                    Perbarui Kalori dari Analisis Terbaru
                                </button>
                                <small className="form-text text-muted">
                                    AMB/TDD saat ini: {Math.round(initialCalories.amb)}-{Math.round(initialCalories.tdd)}
                                </small>
                            </div>
                        )}

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
                <button className="btn btn-outline-secondary" onClick={() => setStep((s) => Math.max(s - 1, 0))} disabled={step === 0}>
                    Kembali
                </button>

                {step < steps.length - 1 ? (
                    <button
                        className="btn text-white"
                        style={{ backgroundColor: '#2ecc71', border: 'none' }}
                        onClick={() => setStep((s) => Math.min(s + 1, steps.length - 1))}
                    >
                        Lanjut
                    </button>
                ) : (
                    <button
                        type="button"
                        className="btn text-white"
                        style={{ backgroundColor: '#ffa726', border: 'none' }}
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