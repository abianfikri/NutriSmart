import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ConfirmationModal = ({ show, onHide, form, onConfirm }) => {
    const formatArray = (arr) => (Array.isArray(arr) && arr.length ? arr.join(', ') : 'Tidak ada');

    const formatDishPerMeal = (dishes) =>
        dishes && typeof dishes === 'object' && !Array.isArray(dishes)
            ? Object.entries(dishes)
                .map(([meal, dish]) => `${meal}: ${dish || '-'}`)
                .join(', ')
            : 'Tidak ada';


    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Konfirmasi Meal Plan</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ul className="list-unstyled">
                    <li><strong>Kalori:</strong> {form.minCalories} - {form.maxCalories}</li>
                    <li><strong>Time Frame:</strong> {form.timeFrame} hari</li>
                    <li><strong>Diet Preference:</strong> {formatArray(form.diets)}</li>
                    <li><strong>Meals:</strong> {formatArray(form.selectedMeals)}</li>
                    <li><strong>Dishes:</strong> {formatDishPerMeal(form.selectedDishes)}</li>
                </ul>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>Kembali</Button>
                <Button variant="primary" onClick={onConfirm}>Generate</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ConfirmationModal;
