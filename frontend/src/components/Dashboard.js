import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'

const Dashboard = () => {
    const [name, setName] = useState('')
    const [token, setToken] = useState('')
    const [expired, setExpired] = useState('')
    const [users, setUsers] = useState([])
    const navigate = useNavigate()

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
    }; // axiosJwt is a new instance per render, you might need to handle it too

    useEffect(() => {
        refreshToken();
        getUsers();
    }, []);

    return (
        <div className='container mt-5'>
            <h1>Welcome Back: {name}</h1>
            <button onClick={getUsers} className='button is-info'> Get Users</button>

            <table className='table is-striped is-hoverable is-fullwidth mt-5'>
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Name</th>
                        <th>Email</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr key={user.id}>
                            <td>{index + 1}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Dashboard
