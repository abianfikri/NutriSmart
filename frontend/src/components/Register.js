import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        gender: '',
        age: '',
        weight: '',
        height: '',
    })

    const navigate = useNavigate()

    const handleChange = (e) => {
        const { id, value } = e.target
        setFormData(prev => ({ ...prev, [id]: value }))
    }

    const handleRegister = async (e) => {
        e.preventDefault()
        try {
            await axios.post('http://localhost:5000/api/auth/register', {
                ...formData,
                age: parseInt(formData.age),
                weight: parseInt(formData.weight),
                height: parseInt(formData.height),
            })

            window.Swal.fire({
                icon: 'success',
                title: 'Berhasil',
                text: 'Akun berhasil dibuat, silakan login',
                confirmButtonText: 'OK',
                confirmButtonColor: '#27ae60',
            }).then(() => navigate('/'))
        } catch (error) {
            window.Swal.fire({
                icon: 'error',
                title: 'Gagal registrasi',
                text: error.response?.data?.message || 'Terjadi kesalahan saat registrasi.',
            })
        }
    }

    return (
        <div className="min-vh-100 d-flex align-items-center bg-light">
            <div className="container">
                <div className="row justify-content-center">
                    {/* Kolom kiri - teks */}
                    <div className="col-lg-5 d-flex flex-column justify-content-center pe-5">
                        <h1 className="display-4 fw-bold" style={{ color: '#2c3e50' }}>
                            Langkah Awal Menuju Hidup Sehat
                        </h1>
                        <p className="lead mt-3" style={{ color: '#34495e' }}>
                            Bergabung dengan <strong>NutriSmart</strong>, wujudkan hidup sehat yang kamu impikan.
                        </p>
                    </div>

                    {/* Form Section */}
                    <div className="col-lg-7">
                        <div className="card p-4 shadow-sm rounded-4 bg-white">
                            <form onSubmit={handleRegister} noValidate>
                                <h5 className="fw-bold text-success mb-3">Informasi Diri</h5>
                                <div className="row g-3 mb-4">
                                    <div className="col-md-6">
                                        <label htmlFor="name" className="form-label fw-semibold">Nama Lengkap *</label>
                                        <input
                                            type="text"
                                            id="name"
                                            className="form-control"
                                            placeholder="Masukkan nama lengkap"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            autoFocus
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="email" className="form-label fw-semibold">Email *</label>
                                        <input
                                            type="email"
                                            id="email"
                                            className="form-control"
                                            placeholder="contoh: john@example.com"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="gender" className="form-label fw-semibold">Gender *</label>
                                        <select
                                            id="gender"
                                            className="form-select"
                                            value={formData.gender}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">-- Pilih Gender --</option>
                                            <option value="L">Laki-laki</option>
                                            <option value="P">Perempuan</option>
                                        </select>
                                    </div>
                                </div>

                                <h5 className="fw-bold text-success mb-3">Data Fisik</h5>
                                <div className="row g-3 mb-4">
                                    <div className="col-md-4">
                                        <label htmlFor="age" className="form-label">Usia</label>
                                        <input
                                            type="number"
                                            id="age"
                                            className="form-control"
                                            placeholder="Misal: 25"
                                            min={0}
                                            value={formData.age}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label htmlFor="weight" className="form-label">Berat Badan (kg)</label>
                                        <input
                                            type="number"
                                            id="weight"
                                            className="form-control"
                                            placeholder="Misal: 70"
                                            min={0}
                                            value={formData.weight}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label htmlFor="height" className="form-label">Tinggi Badan (cm)</label>
                                        <input
                                            type="number"
                                            id="height"
                                            className="form-control"
                                            placeholder="Misal: 170"
                                            min={0}
                                            value={formData.height}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <h5 className="fw-bold text-success mb-3">Keamanan Akun</h5>
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label fw-semibold">Password *</label>
                                    <input
                                        type="password"
                                        id="password"
                                        className="form-control"
                                        placeholder="Minimal 6 karakter"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        minLength={6}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="confirmPassword" className="form-label fw-semibold">Konfirmasi Password *</label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        className="form-control"
                                        placeholder="Ulangi password"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                        minLength={6}
                                    />
                                </div>

                                <div className="d-grid mb-3">
                                    <button type="submit" className="btn btn-success btn-lg fw-bold">
                                        Daftar Sekarang
                                    </button>
                                </div>

                                <p className="text-center text-muted mb-0">
                                    Sudah punya akun?{' '}
                                    <Link to="/" className="text-decoration-none fw-semibold text-success">
                                        Login di sini
                                    </Link>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </div >
        </div >
    )
}

export default Register
