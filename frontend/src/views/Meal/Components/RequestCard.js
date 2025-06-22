import React from 'react';

const RequestCard = ({ formData }) => {
    if (!formData) return null;

    const {
        minCalories,
        maxCalories,
        timeFrame,
        diets,
        selectedMeals,
        selectedDishes,
    } = formData;

    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

    return (
        <div className="card shadow-sm border-0">
            <div
                className="card-header text-white"
                style={{ backgroundColor: '#2ecc71' }}
            >
                <h6 className="mb-0">📋 Detail Meal Plan Anda</h6>
            </div>
            <div className="card-body">
                <p className="mb-2">
                    <strong>🍽 Rentang Kalori:</strong>{' '}
                    <span className="badge bg-success">
                        {minCalories} - {maxCalories} kalori
                    </span>
                </p>

                <p className="mb-2">
                    <strong>⏱ Kerangka Waktu:</strong>{' '}
                    <span className="badge bg-info text-dark">{timeFrame} hari</span>
                </p>

                {diets && diets.length > 0 && (
                    <div className="mb-2">
                        <strong>🥗 Diet:</strong>
                        <div className="mt-1">
                            {diets.map((diet, index) => (
                                <span
                                    key={index}
                                    className="badge bg-light text-dark border me-1"
                                >
                                    {diet}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {selectedMeals && selectedMeals.length > 0 && (
                    <div className="mb-2">
                        <strong>🍱 Makanan yang Dipilih:</strong>
                        <div className="mt-1">
                            {selectedMeals.map((meal, index) => (
                                <span
                                    key={index}
                                    className="badge bg-secondary text-uppercase me-1"
                                >
                                    {meal}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {selectedDishes &&
                    typeof selectedDishes === 'object' &&
                    Object.keys(selectedDishes).length > 0 && (
                        <div className="mb-2">
                            <strong>🧾 Hidangan Spesifik:</strong>
                            <ul className="mb-0 mt-1 ps-3">
                                {Object.entries(selectedDishes).map(
                                    ([mealType, dish], index) => (
                                        <li key={index}>
                                            <span className="text-capitalize">{mealType}</span>: {dish || '-'}
                                        </li>
                                    )
                                )}
                            </ul>
                        </div>
                    )}
            </div>
        </div>
    );
};

export default RequestCard;
