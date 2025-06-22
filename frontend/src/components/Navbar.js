import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, NavLink } from 'react-router-dom';
import { API_URL } from '../api';

const Navbar = () => {
    const navigate = useNavigate();
    const [isActive, setIsActive] = useState(false);

    const handleLogout = async () => {
        const result = await window.Swal.fire({
            title: 'Konfirmasi Logout',
            text: 'Apakah Anda yakin ingin logout?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, logout',
            cancelButtonText: 'Batal'
        });

        if (result.isConfirmed) {
            try {
                const response = await axios.delete(`${API_URL.LOGOUT}`);
                window.Swal.fire({
                    title: 'Logout',
                    text: response.data.message,
                    icon: 'success',
                    confirmButtonText: 'OK'
                }).then(() => navigate('/'));
            } catch (error) {
                console.error(error);
                window.Swal.fire({
                    title: 'Error',
                    text: 'Gagal logout. Silakan coba lagi.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        }
    };

    return (
        <nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#2ecc71' }}>
            <div className="container">
                <a className="navbar-brand d-flex align-items-center gap-2 text-white" href="/">
                    <div
                        className="rounded-circle bg-white d-flex align-items-center justify-content-center"
                        style={{ width: '30px', height: '30px' }}
                    >
                        <span className="text-success fw-bold">N</span>
                    </div>
                    <span className="fw-bold">NutriSmart</span>
                </a>

                <button
                    className="navbar-toggler"
                    type="button"
                    onClick={() => setIsActive(!isActive)}
                    aria-controls="navbarNav"
                    aria-expanded={isActive}
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className={`collapse navbar-collapse ${isActive ? 'show' : ''}`} id="navbarNav">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <NavLink
                                to="/dashboard"
                                className={({ isActive }) =>
                                    `nav-link ${isActive ? 'fw-bold text-white' : 'text-black'}`
                                }
                            >
                                Dashboard
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink
                                to="/profile"
                                className={({ isActive }) =>
                                    `nav-link ${isActive ? 'fw-bold text-white' : 'text-black'}`
                                }
                            >
                                Profile
                            </NavLink>
                        </li>
                    </ul>

                    <button className="btn btn-light text-success fw-semibold border border-success" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
