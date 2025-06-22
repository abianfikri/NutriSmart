import React from 'react';
import { motion } from 'framer-motion';

const buttonVariants = {
    hover: { scale: 1.03, transition: { duration: 0.2 } },
    tap: { scale: 0.97 }
};

const ProfileSidebar = ({ activeTab, setActiveTab }) => {
    const activeStyle = {
        backgroundColor: '#28a745',
        color: '#fff'
    };

    const inactiveStyle = {
        backgroundColor: '#f8f9fa',
        color: '#333'
    };

    return (
        <div className="col-lg-4 col-md-5 col-sm-12 mb-4">
            <div className="card shadow-sm border-0 rounded-4">

                <div className="list-group list-group-flush">
                    <motion.button
                        type="button"
                        className="list-group-item list-group-item-action py-3 fw-semibold border-0 text-start"
                        onClick={() => setActiveTab('profile')}
                        style={activeTab === 'profile' ? activeStyle : inactiveStyle}
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                    >
                        Profil Saya
                    </motion.button>

                    <motion.button
                        type="button"
                        className="list-group-item list-group-item-action py-3 fw-semibold border-0 text-start"
                        onClick={() => setActiveTab('edit')}
                        style={activeTab === 'edit' ? activeStyle : inactiveStyle}
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                    >
                        Edit Profil
                    </motion.button>
                </div>
            </div>
        </div>
    );
};

export default ProfileSidebar;
