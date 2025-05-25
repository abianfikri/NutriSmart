import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault()

        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                email: email,
                password: password
            });

            window.Swal.fire({
                icon: 'success',
                title: 'Berhasil',
                text: 'Login berhasil',
                confirmButtonText: 'OK',
                confirmButtonColor: '#3085d6',
            }).then(() => {
                localStorage.setItem('accessToken', response.data.data.accessToken)
                navigate('/dashboard')
            });

        } catch (error) {
            window.Swal.fire({
                icon: 'error',
                title: 'Gagal login',
                text: error.response?.data?.message || 'Terjadi kesalahan saat login.'
            })
        }
    }

    return (
        <div className="min-vh-100 d-flex align-items-center bg-light">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-6 col-lg-4">
                        <div className="card shadow">
                            <div className="card-body">
                                <h3 className="card-title text-center mb-4">Login</h3>
                                <form onSubmit={handleLogin}>
                                    {/* Email or Username */}
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">Email or Username</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="email"
                                            placeholder="Email or Username"
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>

                                    {/* Password */}
                                    <div className="mb-3">
                                        <label htmlFor="password" className="form-label">Password</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="password"
                                            placeholder="*******"
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>

                                    {/* Button */}
                                    <div className="d-grid mb-3">
                                        <button type="submit" className="btn btn-success">Login</button>
                                    </div>

                                    {/* Link ke Register */}
                                    <div className="text-center">
                                        <p className="mb-0">
                                            Belum punya akun? <Link to="/register" className="text-decoration-none text-primary">Daftar di sini</Link>
                                        </p>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
