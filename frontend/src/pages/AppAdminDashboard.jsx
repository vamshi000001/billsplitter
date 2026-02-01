import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { Check, X, Megaphone, AlertCircle, Filter, Users, Trash2, Eye } from 'lucide-react';

const AppAdminDashboard = () => {
    const [stats, setStats] = useState({ roomCount: 0, activeRoommates: 0 });
    const [rooms, setRooms] = useState([]);
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL'); // ALL, OPEN, RESOLVED, REJECTED

    // Modal State
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeletingMember, setIsDeletingMember] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, roomsRes, feedbackRes] = await Promise.all([
                    api.get('/admin/stats'),
                    api.get('/admin/rooms'),
                    api.get('/feedback/admin')
                ]);
                setStats(statsRes.data);
                setRooms(roomsRes.data);
                setFeedbacks(feedbackRes.data);
            } catch (err) {
                console.error("Failed to fetch admin data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [navigate]);

    const handleBan = async (roomId, currentStatus) => {
        try {
            await api.patch(`/admin/rooms/${roomId}/ban`, { isBanned: !currentStatus });
            setRooms(rooms.map(room => room.id === roomId ? { ...room, isBanned: !currentStatus } : room));
            if (selectedRoom?.id === roomId) {
                setSelectedRoom(prev => ({ ...prev, isBanned: !currentStatus }));
            }
        } catch {
            alert("Failed to update status");
        }
    };

    const handleDelete = async (roomId) => {
        if (!window.confirm("Are you sure? This will delete all data (messages, expenses, members) for this room instantly.")) return;
        try {
            await api.delete(`/admin/rooms/${roomId}`);
            setRooms(rooms.filter(room => room.id !== roomId));
            setIsModalOpen(false);
            setSelectedRoom(null);
            alert("Room Deleted Successfully");
        } catch {
            alert("Failed to delete room");
        }
    };

    const handleRemoveMember = async (roomId, userId) => {
        if (!window.confirm("Are you sure you want to remove this member? They will lose access to the room.")) return;
        setIsDeletingMember(true);
        try {
            await api.delete(`/admin/rooms/${roomId}/members/${userId}`);

            // Update local state
            const updatedRooms = rooms.map(r => {
                if (r.id === roomId) {
                    return {
                        ...r,
                        _count: { ...r._count, members: r._count.members - 1 }
                    };
                }
                return r;
            });
            setRooms(updatedRooms);

            // Update modal state if open
            if (selectedRoom && selectedRoom.customMembers) {
                setSelectedRoom(prev => ({
                    ...prev,
                    customMembers: prev.customMembers.filter(m => m.userId !== userId)
                }));
            } else {
                // If we don't have members loaded in modal yet, just close or re-fetch (simplification: close modal)
                setIsModalOpen(false);
                alert("Member removed. Please reopen room details to refresh.");
            }

        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Failed to remove member");
        } finally {
            setIsDeletingMember(false);
        }
    };

    const openRoomModal = async (room) => {
        // We might need to fetch members if they aren't fully populated in the list
        // Looking at backend, getAllRooms includes `_count`. 
        // We probably need a separate endpoint to get room details WITH members if `admin/rooms` doesn't include them.
        // Wait, `prisma.room.findMany` in controller doesn't include `members` list, only count.
        // We need to fetch members here or update the backend. 
        // For efficiency, let's fetch individual room details? Or just update backend to include members?
        // Updating backend to include members list for all rooms might be heavy.
        // Let's assume for now we don't have the list.
        // Actually, let's quickly add `members` to the backend `getAllRooms` include? 
        // Or better: Let's assume we can fetch room details.
        // Since I can't easily change backend structure mid-click without reloading, I'll update the backend to Include members logic if needed.
        // CHECK: `admin.controller.js` -> `getAllRooms` currently includes: `admin`, `_count`.
        // I should update it to include `members: { include: { user: true } }`.

        // TEMPORARY: I will use what I check in backend first.
        // Assuming I will update backend in next step for `members`.
        // Let's proceed assuming `room.members` will be available after I fix backend.
        setSelectedRoom(room);
        setIsModalOpen(true);
    };

    const handleUpdateStatus = async (id, newStatus) => {
        try {
            await api.patch(`/feedback/admin/${id}`, { status: newStatus });
            setFeedbacks(feedbacks.map(f => f.id === id ? { ...f, status: newStatus } : f));
        } catch (error) {
            console.error(error);
            alert("Failed to update status");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/');
    };

    const filteredFeedbacks = feedbacks.filter(f => {
        if (filter === 'ALL') return true;
        return f.status === filter;
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-500 font-medium">Loading Dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top Navigation */}
            <nav className="bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800 sticky top-0 z-30 transition-all shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">🛡️</span>
                            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Super Admin Dashboard</h1>
                        </div>
                        <div className="flex items-center">
                            <button
                                onClick={handleLogout}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                            >
                                <svg className="-ml-1 mr-2 h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-4 sm:py-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-100 p-5 flex items-center gap-4">
                        <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Rooms</p>
                            <p className="text-3xl font-bold text-gray-900">{stats.roomCount}</p>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-100 p-5 flex items-center gap-4">
                        <div className="p-3 bg-purple-50 rounded-lg text-purple-600">
                            <Users className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Users</p>
                            <p className="text-3xl font-bold text-gray-900">{stats.activeRoommates}</p>
                        </div>
                    </div>
                </div>

                {/* Broadcast Section */}
                <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-100 mb-8 p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">📢 Broadcast to All Room Admins</h2>
                    <form onSubmit={async (e) => {
                        e.preventDefault();
                        const subject = e.target.subject.value;
                        const message = e.target.message.value;
                        if (!subject || !message) return alert("Please fill all fields");
                        try {
                            await api.post('/admin/broadcast', { subject, message });
                            alert("Broadcast Sent Successfully!");
                            e.target.reset();
                        } catch (err) {
                            console.error(err);
                            alert("Failed to send broadcast");
                        }
                    }}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input name="subject" type="text" placeholder="Subject" className="border p-2 rounded w-full" required />
                            <textarea name="message" placeholder="Message content..." className="border p-2 rounded w-full" rows="1" required></textarea>
                            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full md:w-auto">Send Broadcast</button>
                        </div>
                    </form>
                </div>


                {/* Users Feedback Feed */}
                <div className="mb-8 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <Megaphone className="w-5 h-5 text-blue-600" />
                            User Feedback ({feedbacks.length})
                        </h2>
                        <div className="flex gap-2">
                            {['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED'].map(f => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-3 py-1 text-xs font-bold rounded-full transition-colors ${filter === f ? 'bg-blue-600 text-white' : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'}`}
                                >
                                    {f.replace('_', ' ')}
                                </button>
                            ))}
                        </div>
                    </div>
                    {/* Feedback content remains same as grid but scrollable horizontal if needed or just grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredFeedbacks.length === 0 ? (
                            <p className="text-gray-400 italic">No feedbacks found.</p>
                        ) : filteredFeedbacks.map(item => (
                            <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm text-sm">
                                <div className="flex justify-between mb-2">
                                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${item.type === 'PROBLEM' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>{item.type}</span>
                                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${item.status === 'OPEN' ? 'bg-gray-100' : item.status === 'RESOLVED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100'}`}>{item.status}</span>
                                </div>
                                <h4 className="font-bold mb-1">{item.title}</h4>
                                <p className="text-gray-600 mb-2">{item.description}</p>
                                <div className="flex justify-between items-center border-t pt-2 mt-2">
                                    <span className="text-xs text-gray-400">{item.user?.name}</span>
                                    {item.status !== 'RESOLVED' && <button onClick={() => handleUpdateStatus(item.id, 'RESOLVED')} className="text-[10px] bg-green-50 text-green-600 px-2 py-1 rounded hover:bg-green-100">Resolve</button>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Rooms Table */}
                <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                        <h2 className="text-lg font-semibold text-gray-900">Manage Rooms ({rooms.length})</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Members</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {rooms.map((room) => (
                                    <tr key={room.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-semibold text-gray-900">{room.title}</div>
                                            <div className="text-xs text-gray-400">ID: {room.id}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {room.admin?.name}<br />
                                            <span className="text-xs text-gray-400">{room.admin?.email}</span>
                                        </td>
                                        <td className="px-6 py-4 text-center text-sm font-bold">{room._count?.members || 0}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${room.isBanned ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                                {room.isBanned ? 'Banned' : 'Active'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => openRoomModal(room)}
                                                className="text-blue-600 hover:text-blue-900 text-sm font-medium bg-blue-50 px-3 py-1 rounded-lg"
                                            >
                                                Manage
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {/* Room Detail Modal */}
            {isModalOpen && selectedRoom && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">{selectedRoom.title}</h3>
                                <p className="text-sm text-gray-500">Room ID: {selectedRoom.id}</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1">
                            {/* Room Stats */}
                            <div className="grid grid-cols-3 gap-4 mb-6">
                                <div className="bg-blue-50 p-4 rounded-xl text-center">
                                    <p className="text-xs text-blue-500 font-bold uppercase">Members</p>
                                    <p className="text-2xl font-black text-blue-700">{selectedRoom._count?.members || 0}</p>
                                </div>
                                <div className="bg-purple-50 p-4 rounded-xl text-center">
                                    <p className="text-xs text-purple-500 font-bold uppercase">Expenses</p>
                                    <p className="text-2xl font-black text-purple-700">--</p>
                                </div>
                                <div className="bg-gray-100 p-4 rounded-xl text-center">
                                    <p className="text-xs text-gray-500 font-bold uppercase">Status</p>
                                    <p className={`text-2xl font-black ${selectedRoom.isBanned ? 'text-red-600' : 'text-green-600'}`}>
                                        {selectedRoom.isBanned ? 'BANNED' : 'ACTIVE'}
                                    </p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-wrap gap-3 mb-8">
                                <button
                                    onClick={() => handleBan(selectedRoom.id, selectedRoom.isBanned)}
                                    className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 ${selectedRoom.isBanned ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-orange-500 text-white hover:bg-orange-600'}`}
                                >
                                    <AlertCircle className="w-4 h-4" />
                                    {selectedRoom.isBanned ? 'Unban Room' : 'Ban Room'}
                                </button>
                                <button
                                    onClick={() => handleDelete(selectedRoom.id)}
                                    className="flex-1 py-3 px-4 rounded-xl font-bold text-sm bg-red-600 text-white hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Delete Room
                                </button>
                            </div>

                            {/* Members List */}
                            <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                Members
                                <span className="text-xs font-normal text-gray-400 ml-auto">
                                    {selectedRoom.members?.length || 0} Members
                                </span>
                            </h4>
                            <div className="bg-gray-50 rounded-xl p-4 space-y-3 max-h-60 overflow-y-auto">
                                {selectedRoom.members && selectedRoom.members.length > 0 ? (
                                    selectedRoom.members.map((member) => (
                                        <div key={member.id} className="flex justify-between items-center bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600">
                                                    {member.user?.name?.charAt(0).toUpperCase() || 'U'}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-gray-900">{member.user?.name}</p>
                                                    <p className="text-xs text-gray-500">{member.user?.email}</p>
                                                </div>
                                            </div>
                                            {selectedRoom.admin?.email !== member.user?.email && (
                                                <button
                                                    onClick={() => handleRemoveMember(selectedRoom.id, member.user?.id)}
                                                    disabled={isDeletingMember}
                                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                                    title="Remove Member"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            )}
                                            {selectedRoom.admin?.email === member.user?.email && (
                                                <span className="text-[10px] uppercase font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">Admin</span>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center text-gray-500 text-sm py-2">No members in this room.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AppAdminDashboard;
