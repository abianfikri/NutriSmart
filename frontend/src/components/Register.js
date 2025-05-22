import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'

const Register = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const navigate = useNavigate()

    const handleRegister = async (e) => {
        e.preventDefault()

        try {
            await axios.post('http://localhost:5000/api/auth/register', {
                name: name,
                email: email,
                password: password,
                confirmPassword: confirmPassword
            });

            window.Swal.fire({
                icon: 'success',
                title: 'Berhasil',
                text: 'Akun berhasil dibuat, silahkan login',
                confirmButtonText: 'OK',
                confirmButtonColor: '#3085d6',
            }).then(() => {
                navigate('/')
            });

        } catch (error) {
            window.Swal.fire({
                icon: 'error',
                title: 'Gagal registrasi',
                text: error.response?.data?.message || 'Terjadi kesalahan saat registrasi.'
            })
        }
    }

    return (
        <section className="hero has-background-grey-light is-fullheight is-fullwidth">
            <div className="hero-body">
                <div className="container">
                    <div className="columns is-centered">
                        <div className="column is-4-desktop">
                            <form onSubmit={handleRegister} className='box'>
                                {/* Name*/}
                                <div className="field mt-5">
                                    <label className="label">Name</label>
                                    <div className="controls">
                                        <input type="text" className='input' placeholder='Name' value={name} onChange={(e) => setName(e.target.value)} />
                                    </div>
                                </div>

                                {/* Email*/}
                                <div className="field mt-5">
                                    <label className="label">Email</label>
                                    <div className="controls">
                                        <input type="text" className='input' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
                                    </div>
                                </div>

                                {/* Password */}
                                <div className="field mt-5">
                                    <label className="label">Password</label>
                                    <div className="controls">
                                        <input type="password" className='input' placeholder='*******' value={password} onChange={(e) => setPassword(e.target.value)} />
                                    </div>
                                </div>

                                {/* Confirm Password */}
                                <div className="field mt-5">
                                    <label className="label">Confirm Password</label>
                                    <div className="controls">
                                        <input type="password" className='input' placeholder='*******' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                                    </div>
                                </div>

                                {/* Button */}
                                <div className="field mt-5">
                                    <div className="control">
                                        <button className='button is-success is-fullwidth'>Register</button>
                                    </div>
                                </div>

                                {/* Link ke Login */}
                                <div className="has-text-centered mt-4">
                                    <p>Sudah punya akun? <Link to="/" className="has-text-link">Login di sini</Link></p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Register
