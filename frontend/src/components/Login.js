import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import logoNutriSmart from '../assets/logo.jpg'; // Sesuaikan path ini jika logo Anda ada di tempat lain

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                email: email,
                password: password
            });

            window.Swal.fire({
                icon: 'success',
                title: 'Berhasil',
                text: 'Login berhasil. Selamat datang kembali!',
                confirmButtonText: 'OK',
                confirmButtonColor: '#27ae60',
            }).then(() => {
                localStorage.setItem('accessToken', response.data.data.accessToken);
                navigate('/dashboard');
            });

        } catch (error) {
            window.Swal.fire({
                icon: 'error',
                title: 'Gagal login',
                text: error.response?.data?.message || 'Terjadi kesalahan saat login. Periksa kembali email dan password Anda.'
            });
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    const marketingVariants = {
        hidden: { opacity: 0, x: -50 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.5, delay: 0.2 } }
    };

    return (
        <div className="min-vh-100 d-flex align-items-center bg-light">
            <div className="container">
                <div className="row justify-content-center align-items-center">
                    {/* Sisi Kiri: Marketing dan Logo */}
                    <motion.div
                        className="col-lg-5 d-none d-lg-flex flex-column justify-content-center pe-5"
                        initial="hidden"
                        animate="visible"
                        variants={marketingVariants}
                    >
                        <img src={logoNutriSmart} alt="NutriSmart Logo" className="img-fluid mb-4" style={{ maxWidth: '200px', margin: '0 auto' }} />
                        <h1 className="display-5 fw-bold text-center" style={{ color: '#2c3e50' }}>
                            Selamat Datang Kembali!
                        </h1>
                        <p className="lead mt-3 text-center" style={{ color: '#34495e' }}>
                            Lanjutkan perjalanan sehatmu bersama <strong>NutriSmart</strong>. Kami siap membantumu mencapai target nutrisimu.
                        </p>
                    </motion.div>

                    {/* Sisi Kanan: Form Login */}
                    <div className="col-lg-5 col-md-8 col-sm-10">
                        <motion.div
                            className="card p-4 shadow-sm rounded-4 bg-white"
                            initial="hidden"
                            animate="visible"
                            variants={cardVariants}
                        >
                            <div className="card-body">
                                <div className="text-center d-lg-none mb-4">
                                    <img src={logoNutriSmart} alt="NutriSmart Logo" className="img-fluid" style={{ maxWidth: '120px' }} />
                                    <h3 className="mt-2" style={{ color: '#2c3e50' }}>NutriSmart</h3>
                                </div>

                                <h3 className="card-title text-center mb-4 fw-bold" style={{ color: '#27ae60' }}>Login Akun Anda</h3>
                                <form onSubmit={handleLogin}>
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">Email</label>
                                        <input
                                            type="email"
                                            className="form-control" // DIUBAH: Dihapus form-control-lg
                                            id="email"
                                            placeholder="Masukkan alamat email Anda"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="password" className="form-label">Password</label>
                                        <input
                                            type="password"
                                            className="form-control" // DIUBAH: Dihapus form-control-lg
                                            id="password"
                                            placeholder="Masukkan password Anda"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>

                                    <div className="d-grid mb-3 mt-4">
                                        {/* Tombol login bisa tetap btn-lg jika diinginkan, atau disesuaikan juga */}
                                        <button type="submit" className="btn btn-success btn-lg fw-bold">Login</button>
                                    </div>

                                    <div className="text-center mt-3">
                                        <p className="mb-0 text-muted">
                                            Belum punya akun? <Link to="/register" className="text-decoration-none fw-semibold text-success">Daftar di sini</Link>
                                        </p>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;