import React from 'react';
import { motion } from 'framer-motion';

const buttonVariants = {
    hover: {
        scale: 1.05,
        transition: { duration: 0.2 },
    },
    tap: {
        scale: 0.95,
    }
};

const ProfileSidebar = ({ activeTab, setActiveTab }) => {
    return (
        <div className="col-lg-4 col-md-5 col-sm-6">
            <div className="card">
                <div className="list-group">
                    <motion.button
                        type="button"
                        className={`list-group-item list-group-item-action ${activeTab === 'profile' ? 'active' : ''}`}
                        onClick={() => setActiveTab("profile")}
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                    >
                        Profile
                    </motion.button>
                    <motion.button
                        type="button"
                        className={`list-group-item list-group-item-action ${activeTab === 'edit' ? 'active' : ''}`}
                        onClick={() => setActiveTab("edit")}
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                    >
                        Edit Profile
                    </motion.button>
                </div>
            </div>
        </div>
    );
};

export default ProfileSidebar;