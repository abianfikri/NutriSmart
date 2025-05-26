import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const Profile = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [age, setAge] = useState('');
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [gender, setGender] = useState('');
    const [editMode, setEditMode] = useState(false);

    const [token, setToken] = useState('');
    const [expired, setExpired] = useState('');

    const navigate = useNavigate();

    const refreshToken = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/auth/token');
            setToken(response.data.accessToken);

            const decoded = jwtDecode(response.data.accessToken);
            setName(decoded.name);
            setExpired(decoded.exp);
        } catch (error) {
            if (error.response) {
                navigate('/');
            }
        }
    }

    const axiosJwt = axios.create();

    axiosJwt.interceptors.request.use(async (config) => {
        const currentDate = new Date();
        if (expired * 1000 < currentDate.getTime()) {
            const response = await axios.get('http://localhost:5000/api/auth/token');
            config.headers['Authorization'] = `Bearer ${response.data.accessToken}`;
            setToken(response.data.accessToken);

            const decoded = jwtDecode(response.data.accessToken);
            setName(decoded.name);
            setExpired(decoded.exp);
        }
        return config;
    }, (error) => {
        return Promise.reject(error);
    });

    const getProfile = async () => {
        try {
            const response = await axiosJwt.get("http://localhost:5000/api/users/me", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const user = response.data.data;
            setName(user.name);
            setEmail(user.email);
            setAge(user.age);
            setWeight(user.weight);
            setHeight(user.height);
            setGender(user.gender); // <-- perbaikan di sini
        } catch (error) {
            console.error("Failed to fetch profile", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosJwt.patch('http://localhost:5000/api/users/me', {
                name,
                email,
                gender
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data.status === "success") {
                await refreshToken()

                window.Swal.fire({
                    icon: "success",
                    title: "Berhasil",
                    text: response.data.message,
                    confirmButtonText: "OK",
                    confirmButtonColor: '#3085d6',
                }).then((result) => {
                    if (result.isConfirmed) {
                        setEditMode(false);
                        setActiveTab("profile");
                    }
                });
            } else {
                window.Swal.fire({
                    icon: "error",
                    title: "Gagal",
                    text: response.data.message,
                    confirmButtonText: "OK",
                    confirmButtonColor: '#3085d6',
                });
            }

        } catch (error) {
            console.error("Gagal update profil", error);
            window.Swal.fire({
                icon: "error",
                title: "Gagal",
                text: "Terjadi kesalahan saat mengupdate profil.",
                confirmButtonText: "OK",
                confirmButtonColor: '#3085d6',
            });
        }
    };

    const getGenderLabel = (code) => {
        if (code === "L") return "Laki-laki";
        if (code === "P") return "Perempuan";
        return "-";
    };

    useEffect(() => {
        const init = async () => {
            await refreshToken();
            await getProfile();
        };
        init();
    }, []);

    return (
        <div className="container mt-5">
            <div className="row">
                {/* Sidebar */}
                <div className="col-lg-4 col-md-5 col-sm-6">
                    <div className="card">
                        <div className="list-group">
                            <button type="button" className={`list-group-item list-group-item-action ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab("profile")}>
                                Profile
                            </button>
                            <button type="button" className={`list-group-item list-group-item-action ${activeTab === 'edit' ? 'active' : ''}`} onClick={() => setActiveTab("edit")}>
                                Edit Profile
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="col-lg-8 col-md-7 col-sm-6">
                    {activeTab === 'profile' && (
                        <>
                            <div className="card mb-3">
                                <div className="card-header">
                                    Informasi Dasar
                                </div>
                                <div className="card-body">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th style={{ width: '55%' }}>Nama</th>
                                                <td>: {name}</td>
                                            </tr>
                                            <tr>
                                                <th style={{ width: '55%' }}>Email</th>
                                                <td>: {email}</td>
                                            </tr>
                                            <tr>
                                                <th style={{ width: '55%' }}>Jenis Kelamin</th>
                                                <td>: {getGenderLabel(gender)}</td>
                                            </tr>
                                        </thead>
                                    </table>
                                </div>
                            </div>

                            <div className="card mb-3">
                                <div className="card-header">
                                    Data Fisik
                                </div>
                                <div className="card-body d-flex justify-content-between flex-wrap">
                                    <div className="p-2 border rounded shadow-sm m-2 flex-fill text-center">
                                        <h6>Umur</h6>
                                        <p className="fs-4">{age} Tahun</p>
                                    </div>
                                    <div className="p-2 border rounded shadow-sm m-2 flex-fill text-center">
                                        <h6>Berat Badan</h6>
                                        <p className="fs-4">{weight} Kg</p>
                                    </div>
                                    <div className="p-2 border rounded shadow-sm m-2 flex-fill text-center">
                                        <h6>Tinggi Badan</h6>
                                        <p className="fs-4">{height} cm</p>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === 'edit' && (
                        <div className="card shadow-sm"> {/* Menambahkan shadow untuk efek modern */}
                            <div className="card-body p-4"> {/* Menambahkan padding lebih */}
                                <form onSubmit={handleSubmit}>
                                    <h4 className="mb-3 text-muted">Informasi Dasar</h4>
                                    <div className="form-floating mb-3">
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="floatingName"
                                            placeholder="Masukkan nama Anda"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            disabled={!editMode}
                                        />
                                        <label htmlFor="floatingName">Nama</label>
                                    </div>

                                    <div className="form-floating mb-3">
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="floatingEmail"
                                            placeholder="Masukkan email Anda"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            disabled={!editMode}
                                        />
                                        <label htmlFor="floatingEmail">Email</label>
                                    </div>

                                    <div className="mb-3"> {/* Untuk select, form-floating kurang ideal, jadi tetap standar */}
                                        <label htmlFor="gender" className="form-label">Jenis Kelamin</label>
                                        <select
                                            id="gender"
                                            className='form-select'
                                            value={gender}
                                            onChange={(e) => setGender(e.target.value)}
                                            disabled={!editMode}
                                        >
                                            <option value="" disabled>-- Pilih Jenis Kelamin --</option>
                                            <option value="L">Laki-Laki</option>
                                            <option value="P">Perempuan</option>
                                        </select>
                                    </div>

                                    <hr className="my-4" /> {/* Pemisah visual */}

                                    <h4 className="mb-3 text-muted">Data Fisik</h4>
                                    <div className="row">
                                        <div className="col-md-4">
                                            <div className="form-floating mb-3">
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    id="floatingAge"
                                                    placeholder="Masukkan umur Anda"
                                                    value={age}
                                                    onChange={(e) => setAge(e.target.value)}
                                                    disabled={!editMode}
                                                />
                                                <label htmlFor="floatingAge">Umur (Tahun)</label>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="form-floating mb-3">
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    id="floatingWeight"
                                                    placeholder="Masukkan berat badan Anda"
                                                    value={weight}
                                                    onChange={(e) => setWeight(e.target.value)}
                                                    disabled={!editMode}
                                                />
                                                <label htmlFor="floatingWeight">Berat Badan (Kg)</label>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="form-floating mb-3">
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    id="floatingHeight"
                                                    placeholder="Masukkan tinggi badan Anda"
                                                    value={height}
                                                    onChange={(e) => setHeight(e.target.value)}
                                                    disabled={!editMode}
                                                />
                                                <label htmlFor="floatingHeight">Tinggi Badan (cm)</label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4"> {/* Margin atas untuk tombol */}
                                        {!editMode ? (
                                            <button type="button" className="btn btn-primary w-100" onClick={() => setEditMode(true)}>
                                                <i className="bi bi-pencil-square me-2"></i>Edit Data {/* Contoh ikon jika menggunakan Bootstrap Icons */}
                                            </button>
                                        ) : (
                                            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                                                <button type="submit" className="btn btn-success me-md-2">
                                                    <i className="bi bi-check-circle me-2"></i>Simpan Perubahan
                                                </button>
                                                <button type="button" className="btn btn-secondary" onClick={() => {
                                                    setEditMode(false);
                                                    // Optional: Reset form to original values if needed
                                                    getProfile(); // Re-fetch profile to discard unsaved changes
                                                }}>
                                                    <i className="bi bi-x-circle me-2"></i>Batal
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default Profile;
