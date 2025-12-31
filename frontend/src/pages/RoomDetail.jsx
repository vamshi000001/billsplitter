import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import RoomAdminDashboard from './RoomAdminDashboard';
import RoomMemberDashboard from './RoomMemberDashboard';

const RoomDetail = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const checkRole = async () => {
            try {
                const res = await api.get(`/rooms/${id}`);

                // Check if current user is the admin AND they logged in as an admin
                const loginType = localStorage.getItem('loginType');
                if (parseInt(res.data.adminId) === parseInt(user.id) && loginType !== 'ROOMMATE') {
                    setIsAdmin(true);
                } else {
                    setIsAdmin(false);
                }
            } catch (err) {
                console.error("Failed to fetch room role:", err);
                if (err.response?.status === 403 || err.response?.status === 404) {
                    alert("Access Denied or Room Not Found");
                    navigate('/dashboard');
                }
            } finally {
                setLoading(false);
            }
        };

        if (id && user) {
            checkRole();
        }
    }, [id, user, navigate]);

    if (loading) {
        return <div className="h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>;
    }

    return isAdmin ? <RoomAdminDashboard roomId={id} /> : <RoomMemberDashboard roomId={id} />;
};

export default RoomDetail;
