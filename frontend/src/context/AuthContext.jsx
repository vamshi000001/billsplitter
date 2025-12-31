/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [loading] = useState(false); // No need to wait for effect if we lazy load

    const login = async (email, password) => {
        const res = await api.post('/auth/login', { email, password });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        localStorage.setItem('loginType', 'ADMIN'); // Set login type
        setUser(res.data.user);
        return res.data.user;
    };

    const loginRoommate = async (email, password) => {
        const { data } = await api.post('/auth/login/room', { email, password });
        // loginType is NOT set here because role will handle it?
        // Actually earlier we set loginType to correctly route in RoomDetail.
        // Let's keep setting it, but consistent.
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('loginType', 'ROOMMATE'); // Store login type
        setUser(data.user);
        return data.user;
    };

    const register = async (name, email, password, roomName) => {
        await api.post('/auth/register', { name, email, password, roomName });
        await login(email, password); // Automatically log in after registration
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, loginRoommate, register, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
