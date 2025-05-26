import React, { useState, useEffect } from 'react'
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
            console.log(decoded);


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
            if (user.gender === "L") {
                setGender("Laki-laki");
            } else {
                setGender("Perempuan");
            }
        } catch (error) {
            console.error("Failed to fetch profile", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axiosJwt.patch('http://localhost:5000/api/users/me', {
                name,
                email
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            await refreshToken();
            alert("Profil berhasil diperbarui");
            setEditMode(false); // Kembali non-edit mode
            setActiveTab("profile"); // Opsional: kembali ke tab profil
        } catch (error) {
            console.error("Gagal update profil", error);
            alert("Gagal update profil");
        }
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
                                                <td>: {gender}</td>
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
                        <div className="card p-3">
                            <h3>Edit Profile</h3>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label>Nama</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        disabled={!editMode}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={!editMode}
                                    />
                                </div>

                                {!editMode ? (
                                    <button type="button" className="btn btn-warning" onClick={() => setEditMode(true)}>
                                        Edit Data
                                    </button>
                                ) : (
                                    <div>
                                        <button type="submit" className="btn btn-primary me-2">Simpan</button>
                                        <button type="button" className="btn btn-secondary" onClick={() => setEditMode(false)}>
                                            Batal
                                        </button>
                                    </div>
                                )}
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Profile
