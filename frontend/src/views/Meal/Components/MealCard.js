import React from 'react';
import { motion } from 'framer-motion';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
        },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
};

const MealCard = ({ data }) => {
    if (!data || !Array.isArray(data)) {
        console.warn("MealCard received invalid or empty data:", data);
        return (
            <div className="container mt-4">
                <div className="alert alert-warning" role="alert">
                    Tidak ada data meal plan yang tersedia untuk ditampilkan.
                </div>
            </div>
        );
    }

    return (
        <motion.div className="container mt-4" variants={containerVariants} initial="hidden" animate="visible">
            {data.map((item, index) => (
                <motion.div className="card mb-4 shadow-sm" key={index} variants={cardVariants} whileHover={{ scale: 1.02 }}>
                    <div className="card-header bg-primary text-white">
                        <h5 className="mb-0">Hari {item.day}</h5>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            {item.meals && typeof item.meals === 'object' ? (
                                // Perubahan di sini: tambahkan .filter() sebelum .map()
                                Object.entries(item.meals)
                                    .filter(([, meal]) => meal) // Filter entri yang nilai 'meal' nya tidak null/undefined
                                    .map(([mealTime, meal], i) => (
                                        <motion.div className="col-md-4 mb-4" key={i} variants={cardVariants}>
                                            <div className="card h-100 border-0 shadow-sm">
                                                {meal?.image ? (
                                                    <img
                                                        src={meal.image}
                                                        alt={meal.label || 'Gambar Makanan'}
                                                        className="card-img-top img-fluid rounded-top"
                                                    />
                                                ) : (
                                                    <div className="text-center p-3">
                                                        <i className="bi bi-image-fill" style={{ fontSize: '3rem', color: '#ccc' }}></i>
                                                        <p className="text-muted">Gambar tidak tersedia</p>
                                                    </div>
                                                )}
                                                <div className="card-body">
                                                    <h6 className="card-subtitle text-muted text-capitalize">{mealTime}</h6>
                                                    <h5 className="card-title mt-2">
                                                        {meal?.label || 'Nama Makanan Tidak Tersedia'}
                                                    </h5>
                                                    <ul className="list-unstyled small mt-2">
                                                        <li>Kalori: {meal?.calories !== undefined ? `${meal.calories} kcal` : 'N/A'}</li>
                                                        <li>Protein: {meal?.protein !== undefined ? `${meal.protein} g` : 'N/A'}</li>
                                                        <li>Lemak: {meal?.fat !== undefined ? `${meal.fat} g` : 'N/A'}</li>
                                                        <li>Karbohidrat: {meal?.carbs !== undefined ? `${meal.carbs} g` : 'N/A'}</li>
                                                        <li>Porsi: {meal?.servings !== undefined ? meal.servings : 'N/A'}</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))
                            ) : (
                                <div className="col-12">
                                    <div className="alert alert-info" role="alert">
                                        Tidak ada detail makanan untuk hari ini.
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            ))}
        </motion.div>
    );
};

export default MealCard;