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
        <section className="hero has-background-grey-light is-fullheight is-fullwidth">
            <div className="hero-body">
                <div className="container">
                    <div className="columns is-centered">
                        <div className="column is-4-desktop">
                            <form onSubmit={handleLogin} className='box'>
                                {/* Username or Email */}
                                <div className="field mt-5">
                                    <label className="label">Email or Username</label>
                                    <div className="controls">
                                        <input type="text" className='input' placeholder='Email or Username' onChange={(e) => setEmail(e.target.value)} />
                                    </div>
                                </div>

                                {/* Password */}
                                <div className="field mt-5">
                                    <label className="label">Password</label>
                                    <div className="controls">
                                        <input type="password" className='input' placeholder='*******' onChange={(e) => setPassword(e.target.value)} />
                                    </div>
                                </div>

                                {/* Button */}
                                <div className="field mt-5">
                                    <div className="control">
                                        <button className='button is-success is-fullwidth'>Login</button>
                                    </div>
                                </div>

                                {/* Link ke Register */}
                                <div className="has-text-centered mt-4">
                                    <p>Belum punya akun? <Link to="/register" className="has-text-link">Daftar di sini</Link></p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Login
