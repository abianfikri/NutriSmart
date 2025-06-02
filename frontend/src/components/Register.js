import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const steps = ['Informasi Diri', 'Data Fisik', 'Keamanan Akun'];

// Definisikan opsi untuk tingkat aktivitas di sini
const activityLevelOptions = [
    { value: "Tidak Aktif", label: "Tidak aktif/minim olahraga" },
    { value: "Ringan", label: "Olahraga ringan 1-3 hari/minggu" },
    { value: "Sedang", label: "Olahraga sedang 3-5 hari/minggu" },
    { value: "Berat", label: "Olahraga berat 6-7 hari/minggu" },
    { value: "Sangat Berat", label: "Pekerjaan fisik berat/olahraga intensif setiap hari" }
];

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        gender: '',
        age: '',
        weight: '',
        height: '',
        activityLevel: '', // Tambahkan activityLevel di sini
        password: '',
        confirmPassword: '',
    });

    const [step, setStep] = useState(0);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleNext = (e) => {
        e.preventDefault();
        // Anda bisa menambahkan validasi per langkah di sini jika diperlukan
        if (step < steps.length - 1) {
            setStep(prev => prev + 1);
        }
    };

    const handleBack = (e) => {
        e.preventDefault();
        if (step > 0) setStep(prev => prev - 1);
    };

    const validatePassword = () => {
        return formData.password === formData.confirmPassword;
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!validatePassword()) {
            window.Swal.fire({
                icon: 'error',
                title: 'Password tidak cocok',
                text: 'Pastikan password dan konfirmasi password sama',
            });
            return;
        }

        // Data yang akan dikirim, termasuk activityLevel
        const dataToSubmit = {
            ...formData,
            age: parseInt(formData.age),
            weight: parseInt(formData.weight),
            height: parseInt(formData.height),
            // activityLevel sudah ada di formData sebagai string
        };

        try {
            await axios.post('http://localhost:5000/api/auth/register', dataToSubmit);

            window.Swal.fire({
                icon: 'success',
                title: 'Berhasil',
                text: 'Akun berhasil dibuat, silakan login',
                confirmButtonColor: '#27ae60',
            }).then(() => navigate('/'));
        } catch (error) {
            window.Swal.fire({
                icon: 'error',
                title: 'Gagal registrasi',
                text: error.response?.data?.message || 'Terjadi kesalahan saat registrasi.',
            });
        }
    };

    return (
        <div className="min-vh-100 d-flex align-items-center bg-light">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-5 d-flex flex-column justify-content-center pe-5">
                        <h1 className="display-4 fw-bold" style={{ color: '#2c3e50' }}>
                            Langkah Awal Menuju Hidup Sehat
                        </h1>
                        <p className="lead mt-3" style={{ color: '#34495e' }}>
                            Bergabung dengan <strong>NutriSmart</strong>, wujudkan hidup sehat yang kamu impikan.
                        </p>
                    </div>

                    <div className="col-lg-7">
                        <div className="card p-4 shadow-sm rounded-4 bg-white">
                            <form onSubmit={step === steps.length - 1 ? handleRegister : handleNext} noValidate>
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={step}
                                        initial={{ opacity: 0, x: 100 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -100 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {step === 0 && (
                                            <>
                                                <h5 className="fw-bold text-success mb-3">{steps[0]}</h5>
                                                <div className="row g-3 mb-3">
                                                    <div className="col-md-6">
                                                        <label htmlFor="name" className="form-label">Nama Lengkap *</label>
                                                        <input
                                                            type="text"
                                                            id="name"
                                                            className="form-control"
                                                            value={formData.name}
                                                            onChange={handleChange}
                                                            placeholder='Masukkan nama lengkap'
                                                            required
                                                        />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label htmlFor="email" className="form-label">Email *</label>
                                                        <input
                                                            type="email"
                                                            id="email"
                                                            className="form-control"
                                                            value={formData.email}
                                                            onChange={handleChange}
                                                            placeholder='contoh@gmail.com'
                                                            required
                                                        />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label htmlFor="gender" className="form-label">Gender *</label>
                                                        <select
                                                            id="gender"
                                                            className="form-select"
                                                            value={formData.gender}
                                                            onChange={handleChange}
                                                            required
                                                        >
                                                            <option value="" disabled>-- Pilih Gender --</option>
                                                            <option value="L">Laki-laki</option>
                                                            <option value="P">Perempuan</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                        {step === 1 && (
                                            <>
                                                <h5 className="fw-bold text-success mb-3">{steps[1]}</h5>
                                                <div className="row g-3 mb-3">
                                                    <div className="col-md-4">
                                                        <label htmlFor="age" className="form-label">Usia</label>
                                                        <input
                                                            type="number"
                                                            id="age"
                                                            className="form-control"
                                                            value={formData.age}
                                                            onChange={handleChange}
                                                            min="0"
                                                            placeholder='Tahun'
                                                            required
                                                        />
                                                    </div>
                                                    <div className="col-md-4">
                                                        <label htmlFor="weight" className="form-label">Berat (kg)</label>
                                                        <input
                                                            type="number"
                                                            id="weight"
                                                            className="form-control"
                                                            value={formData.weight}
                                                            onChange={handleChange}
                                                            min="0"
                                                            placeholder='kg'
                                                            required
                                                        />
                                                    </div>
                                                    <div className="col-md-4">
                                                        <label htmlFor="height" className="form-label">Tinggi (cm)</label>
                                                        <input
                                                            type="number"
                                                            id="height"
                                                            className="form-control"
                                                            value={formData.height}
                                                            onChange={handleChange}
                                                            min="0"
                                                            placeholder='cm'
                                                            required
                                                        />
                                                    </div>
                                                    {/* Input Select untuk Tingkat Aktivitas */}
                                                    <div className="col-md-12">
                                                        <label htmlFor="activityLevel" className="form-label">Tingkat Aktivitas Harian *</label>
                                                        <select
                                                            id="activityLevel"
                                                            className="form-select"
                                                            value={formData.activityLevel}
                                                            onChange={handleChange}
                                                            required
                                                        >
                                                            <option value="" disabled>-- Pilih Tingkat Aktivitas --</option>
                                                            {activityLevelOptions.map(level => (
                                                                <option key={level.value} value={level.value}>
                                                                    {level.label}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                        {step === 2 && (
                                            <>
                                                <h5 className="fw-bold text-success mb-3">{steps[2]}</h5>
                                                <div className="mb-3">
                                                    <label htmlFor="password" className="form-label">Password *</label>
                                                    <input
                                                        type="password"
                                                        id="password"
                                                        className="form-control"
                                                        value={formData.password}
                                                        onChange={handleChange}
                                                        minLength="6"
                                                        placeholder='Minimal 6 karakter'
                                                        required
                                                    />
                                                </div>
                                                <div className="mb-3">
                                                    <label htmlFor="confirmPassword" className="form-label">Konfirmasi Password *</label>
                                                    <input
                                                        type="password"
                                                        id="confirmPassword"
                                                        className="form-control"
                                                        value={formData.confirmPassword}
                                                        onChange={handleChange}
                                                        minLength="6"
                                                        placeholder='Ulangi password'
                                                        required
                                                    />
                                                </div>
                                            </>
                                        )}
                                    </motion.div>
                                </AnimatePresence>

                                <div className="d-flex gap-2 mt-4">
                                    {step > 0 && (
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            onClick={handleBack}
                                        >
                                            Kembali
                                        </button>
                                    )}

                                    {step < steps.length - 1 ? (
                                        <button
                                            type="submit"
                                            className="btn btn-success"
                                        >
                                            Lanjut
                                        </button>
                                    ) : (
                                        <button
                                            type="submit"
                                            className="btn btn-success fw-bold"
                                        >
                                            Daftar Sekarang
                                        </button>
                                    )}
                                </div>

                                <p className="text-center text-muted mt-4 mb-0">
                                    Sudah punya akun?{' '}
                                    <Link to="/" className="text-decoration-none fw-semibold text-success">
                                        Login di sini
                                    </Link>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;