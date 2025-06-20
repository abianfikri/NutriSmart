// src/Components/RequestCard.js
import React from 'react';

const RequestCard = ({ formData }) => {
    if (!formData) {
        return null;
    }

    const { minCalories, maxCalories, timeFrame, diets, selectedMeals, selectedDishes } = formData;

    return (
        <div className="card mb-3">
            <div className="card-header">
                <h5 className="mb-0">Detail Meal Plan Anda</h5>
            </div>
            <div className="card-body">
                <p className="card-text">
                    <strong>Rentang Kalori:</strong> {minCalories} - {maxCalories} kalori
                </p>
                <p className="card-text">
                    <strong>Kerangka Waktu:</strong> {timeFrame} hari
                </p>
                {diets && Array.isArray(diets) && diets.length > 0 && (
                    <p className="card-text">
                        <strong>Diet:</strong> {diets.join(', ')}
                    </p>
                )}
                {selectedMeals && Array.isArray(selectedMeals) && selectedMeals.length > 0 && (
                    <div>
                        <strong>Makanan yang Dipilih:</strong>
                        <ul>
                            {selectedMeals.map((meal, index) => (
                                <li key={index}>{meal.toUpperCase()}</li>
                            ))}
                        </ul>
                    </div>
                )}
                {/* Pastikan selectedDishes adalah objek sebelum Object.keys */}
                {selectedDishes && typeof selectedDishes === 'object' && Object.keys(selectedDishes).length > 0 && (
                    <div>
                        <strong>Hidangan Spesifik:</strong>
                        <ul>
                            {Object.entries(selectedDishes).map(([mealType, dish]) => (
                                <li key={mealType}>
                                    {mealType}: {dish}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RequestCard;