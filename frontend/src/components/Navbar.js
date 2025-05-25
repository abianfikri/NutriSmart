import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, NavLink } from 'react-router-dom';

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
                await axios.delete('http://localhost:5000/api/auth/logout');
                window.Swal.fire({
                    title: 'Logout',
                    text: 'Anda telah berhasil logout',
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
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">
                <a className="navbar-brand" href="/">
                    <img src="/logo.svg" alt="Logo" className="d-inline-block align-top" />
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
                                className={({ isActive }) => `nav-link ${isActive ? 'fw-bold text-warning' : ''}`}
                            >
                                Dashboard
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink
                                to="/profile"
                                className={({ isActive }) => `nav-link ${isActive ? 'fw-bold text-warning' : ''}`}
                            >
                                Profile
                            </NavLink>
                        </li>
                        {/* Tambahkan menu lain sesuai kebutuhan */}
                    </ul>

                    <button className="btn btn-outline-warning" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
