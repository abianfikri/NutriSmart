import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const Dashboard = () => {
    const [name, setName] = useState('');
    const [token, setToken] = useState('');
    const [expired, setExpired] = useState('');
    const [users, setUsers] = useState([]);
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
    };

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

    const getUsers = async () => {
        const response = await axiosJwt.get('http://localhost:5000/api/users', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        setUsers(response.data.data);
    };

    useEffect(() => {
        refreshToken();
        getUsers();
    }, []);

    return (
        <div className="container mt-5">
            <h1 className="mb-4">Welcome Back: {name}</h1>
            <button onClick={getUsers} className="btn btn-primary mb-4">Get Users</button>

            <div className="table-responsive">
                <table className="table table-striped table-hover">
                    <thead className="table-light">
                        <tr>
                            <th scope="col">No</th>
                            <th scope="col">Name</th>
                            <th scope="col">Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={user.id}>
                                <th scope="row">{index + 1}</th>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Dashboard;
