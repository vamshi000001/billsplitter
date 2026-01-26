import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

const AppAdminDashboard = () => {
    const [stats, setStats] = useState({ roomCount: 0, activeRoommates: 0 });
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // In a real app, attach token header
                const statsRes = await api.get('/admin/stats');
                const roomsRes = await api.get('/admin/rooms');
                setStats(statsRes.data);
                setRooms(roomsRes.data);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch admin data", err);
                // navigate('/appadminlogin');
            }
        };
        fetchData();
    }, [navigate]);

    const handleBan = async (roomId, currentStatus) => {
        try {
            await api.patch(`/admin/rooms/${roomId}/ban`, { isBanned: !currentStatus });
            setRooms(rooms.map(room => room.id === roomId ? { ...room, isBanned: !currentStatus } : room));
        } catch {
            alert("Failed to update status");
        }
    };

    const handleDelete = async (roomId) => {
        if (!window.confirm("Are you sure? This will delete all data for this room.")) return;
        try {
            await api.delete(`/admin/rooms/${roomId}`);
            setRooms(rooms.filter(room => room.id !== roomId));
        } catch {
            alert("Failed to delete room");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/');
    };

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

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-100">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 bg-blue-50 rounded-md p-3">
                                    <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">Total Rooms</dt>
                                        <dd className="text-3xl font-bold text-gray-900 mt-1">{stats.roomCount}</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-100">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 bg-purple-50 rounded-md p-3">
                                    <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">Active Roommates</dt>
                                        <dd className="text-3xl font-bold text-gray-900 mt-1">{stats.activeRoommates}</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Rooms Table */}
                {/* Rooms Content - Responsive */}
                <div className="space-y-4">

                    {/* Desktop Table View */}
                    <div className="hidden md:block bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                            <h2 className="text-lg font-semibold text-gray-900">Manage Rooms</h2>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {rooms.length} Rooms
                            </span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room Name</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin</th>
                                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Members</th>
                                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {rooms.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                                                No rooms found in the system.
                                            </td>
                                        </tr>
                                    ) : (
                                        rooms.map((room) => (
                                            <tr key={room.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-semibold text-gray-900">{room.title}</div>
                                                    <div className="text-xs text-gray-500 hidden sm:block">ID: {room.id.substring(0, 8)}...</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 text-xs font-bold">
                                                            {room.admin?.name ? room.admin.name.charAt(0).toUpperCase() : 'U'}
                                                        </div>
                                                        <div className="ml-3">
                                                            <div className="text-sm font-medium text-gray-900">{room.admin?.name || 'Unknown'}</div>
                                                            <div className="text-sm text-gray-500">{room.admin?.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                        {room._count?.members || 0}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    {room.isBanned ? (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                            Banned
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                            Active
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => handleBan(room.id, room.isBanned)}
                                                            className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${room.isBanned
                                                                ? 'text-white bg-green-600 hover:bg-green-700 focus:ring-green-500'
                                                                : 'text-white bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500'
                                                                }`}
                                                        >
                                                            {room.isBanned ? 'Unban' : 'Ban'}
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(room.id)}
                                                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Mobile Card View (Full Width Stack) */}
                    <div className="block md:hidden space-y-4">
                        <div className="flex justify-between items-center mb-2 px-1">
                            <h2 className="text-xl font-bold text-gray-900">Managed Rooms</h2>
                            <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{rooms.length} TOTAL</span>
                        </div>

                        {rooms.length === 0 ? (
                            <div className="bg-white rounded-3xl p-8 text-center text-gray-500 shadow-sm border border-gray-100">
                                No rooms found.
                            </div>
                        ) : rooms.map((room) => (
                            <div key={room.id} className="bg-white dark:bg-gray-800 rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden">
                                {/* Status Indicator Strip */}
                                <div className={`absolute top-0 left-0 w-1.5 h-full ${room.isBanned ? 'bg-red-500' : 'bg-green-500'}`}></div>

                                <div className="pl-3">
                                    {/* Header */}
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="font-black text-lg text-gray-900 dark:text-white">{room.title}</h3>
                                            <p className="text-xs text-gray-400 font-medium">ID: {room.id.substring(0, 8)}</p>
                                        </div>
                                        {room.isBanned ? (
                                            <span className="px-3 py-1 rounded-full bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-wider border border-red-100">Banned</span>
                                        ) : (
                                            <span className="px-3 py-1 rounded-full bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-wider border border-green-100">Active</span>
                                        )}
                                    </div>

                                    {/* Admin & Member Info */}
                                    <div className="flex items-center gap-4 mb-6 bg-gray-50 dark:bg-gray-700/30 p-3 rounded-2xl">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                                            {room.admin?.name ? room.admin.name.charAt(0).toUpperCase() : 'U'}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-gray-900 dark:text-white">{room.admin?.name || 'Unknown'}</p>
                                            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Room Admin</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-black text-gray-900 dark:text-white">{room._count?.members || 0}</p>
                                            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Members</p>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            onClick={() => handleBan(room.id, room.isBanned)}
                                            className={`py-3 rounded-xl text-sm font-bold shadow-sm transition-all active:scale-95 flex items-center justify-center gap-2 ${room.isBanned
                                                ? 'bg-green-50 text-green-600 border border-green-200 hover:bg-green-100'
                                                : 'bg-yellow-50 text-yellow-600 border border-yellow-200 hover:bg-yellow-100'
                                                }`}
                                        >
                                            {room.isBanned ? 'Unban Room' : 'Ban Room'}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(room.id)}
                                            className="py-3 rounded-xl text-sm font-bold bg-white text-red-600 border border-red-100 shadow-sm hover:bg-red-50 transition-all active:scale-95 flex items-center justify-center gap-2"
                                        >
                                            Delete Room
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AppAdminDashboard;
