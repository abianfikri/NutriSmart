import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ConfirmationModal = ({ show, onHide, form, onConfirm }) => {
    const formatArray = (arr) =>
        Array.isArray(arr) && arr.length ? arr.join(', ') : 'Tidak ada';

    const formatDishPerMeal = (dishes) =>
        dishes && typeof dishes === 'object' && !Array.isArray(dishes)
            ? Object.entries(dishes)
                .map(([meal, dish]) => `${capitalize(meal)}: ${dish || '-'}`)
                .join(', ')
            : 'Tidak ada';

    const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header
                closeButton
                style={{ backgroundColor: '#2ecc71', color: 'white' }}
            >
                <Modal.Title>✅ Konfirmasi Meal Plan</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <div className="mb-3">
                    <strong>🍽 Kalori:</strong>{' '}
                    <span className="badge bg-success">
                        {form.minCalories} - {form.maxCalories} kcal
                    </span>
                </div>
                <div className="mb-3">
                    <strong>⏱ Time Frame:</strong>{' '}
                    <span className="badge bg-info text-dark">{form.timeFrame} hari</span>
                </div>

                {/* Diet Section */}
                <div className="mb-3">
                    <strong>🥗 Diet Preference:</strong>
                    <div className="mt-1">
                        {form.diets && form.diets.length ? (
                            form.diets.map((diet, i) => (
                                <span key={i} className="badge bg-light text-dark border me-1">
                                    {diet}
                                </span>
                            ))
                        ) : (
                            <span className="text-muted">Tidak ada</span>
                        )}
                    </div>
                </div>

                {/* Meals Section */}
                <div className="mb-3">
                    <strong>🍱 Meals:</strong>
                    <div className="mt-1">
                        {form.selectedMeals && form.selectedMeals.length ? (
                            form.selectedMeals.map((meal, i) => (
                                <span key={i} className="badge bg-light text-dark border me-1">
                                    {meal}
                                </span>
                            ))
                        ) : (
                            <span className="text-muted">Tidak ada</span>
                        )}
                    </div>
                </div>

                {/* Dishes Section */}
                <div className="mb-3">
                    <strong>🧾 Dishes per Meal:</strong>
                    <div className="mt-1">
                        {form.selectedDishes && Object.keys(form.selectedDishes).length ? (
                            Object.entries(form.selectedDishes).map(([meal, dish], i) => (
                                <div key={i} className="mb-1">
                                    <span className="text-capitalize">{meal}:</span>{' '}
                                    <span className="badge bg-warning text-dark">{dish || '-'}</span>
                                </div>
                            ))
                        ) : (
                            <span className="text-muted">Tidak ada</span>
                        )}
                    </div>
                </div>
            </Modal.Body>


            <Modal.Footer>
                <Button variant="outline-secondary" onClick={onHide}>
                    Kembali
                </Button>
                <Button
                    style={{
                        backgroundColor: '#ffa726',
                        border: 'none',
                        color: 'white',
                        fontWeight: 'bold'
                    }}
                    onClick={onConfirm}
                >
                    ✅ Generate
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ConfirmationModal;
