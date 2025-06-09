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
    return (
        <motion.div className="container mt-4" variants={containerVariants} initial="hidden" animate="visible">
            {data.map((item, index) => (
                <motion.div className="card mb-4 shadow-sm" key={index} variants={cardVariants} whileHover={{ scale: 1.02 }}>
                    <div className="card-header bg-primary text-white">
                        <h5 className="mb-0">Hari {item.day}</h5>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            {Object.entries(item.meals).map(([mealTime, meal], i) => (
                                <motion.div className="col-md-4 mb-4" key={i} variants={cardVariants}>
                                    <div className="card h-100 border-0 shadow-sm">
                                        <img
                                            src={meal.image}
                                            alt={meal.label}
                                            className="card-img-top img-fluid rounded-top"
                                        />
                                        <div className="card-body">
                                            <h6 className="card-subtitle text-muted text-capitalize">{mealTime}</h6>
                                            <h5 className="card-title mt-2">{meal.label}</h5>
                                            <ul className="list-unstyled small mt-2">
                                                <li>Kalori: {meal.calories} kcal</li>
                                                <li>Protein: {meal.protein} g</li>
                                                <li>Lemak: {meal.fat} g</li>
                                                <li>Karbohidrat: {meal.carbs} g</li>
                                                <li>Porsi: {meal.servings}</li>
                                            </ul>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            ))}
        </motion.div>
    );
};

export default MealCard;
