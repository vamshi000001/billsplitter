import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { toast } from 'react-hot-toast';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, Legend } from 'recharts';

const RoomMemberDashboard = ({ roomId }) => {
    const navigate = useNavigate();

    // State
    const [expenses, setExpenses] = useState([]);
    const [members, setMembers] = useState([]);
    const [roomTitle, setRoomTitle] = useState('');
    const [cycleSummary, setCycleSummary] = useState(null);
    const [categoryAnalytics, setCategoryAnalytics] = useState({});
    const [monthlyAnalytics, setMonthlyAnalytics] = useState([]);
    const [loading, setLoading] = useState(true);

    const [adminId, setAdminId] = useState(null);

    // UI State
    const [messageContent, setMessageContent] = useState('');
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [rightPanel, setRightPanel] = useState('members'); // 'members' or 'notifications'
    const [notifications, setNotifications] = useState([]);

    const fetchData = useCallback(async () => {
        try {
            const [roomRes, expRes, sumRes, analyticsRes, monthlyRes] = await Promise.all([
                api.get(`/rooms/${roomId}`),
                api.get(`/rooms/${roomId}/expenses`, { params: { currentCycle: 'true' } }),
                api.get(`/rooms/${roomId}/analytics/summary`),
                api.get(`/rooms/${roomId}/analytics/category`),
                api.get(`/rooms/${roomId}/analytics/monthly`)
            ]);

            setMembers(roomRes.data.members || []);
            setRoomTitle(roomRes.data.title);
            setAdminId(roomRes.data.adminId);
            setExpenses(expRes.data);
            setCycleSummary(sumRes.data);
            setCategoryAnalytics(analyticsRes.data);
            setCategoryAnalytics(analyticsRes.data);
            setMonthlyAnalytics(monthlyRes.data);

            // Fetch Notifications
            try {
                const notifRes = await api.get('/notifications');
                setNotifications(notifRes.data);
            } catch {
                console.error("Failed to fetch notifications");
            }

        } catch (err) {
            console.error(err);
            toast.error("Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    }, [roomId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleSendMessage = async () => {
        try {
            await api.post(`/rooms/${roomId}/messages`, { content: messageContent });
            setMessageContent('');
            toast.success('Message sent to admin! 📨');
            setShowMessageModal(false);
        } catch {
            toast.error('Failed to send message');
        }
    };

    if (loading) return <div className="p-8 flex justify-center"><div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans transition-colors duration-300">
            {/* Professional Navbar */}
            <div className="bg-white dark:bg-gray-800 backdrop-blur-xl shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30 transition-all">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="group flex items-center gap-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                        >
                            <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
                            <span className="font-bold text-sm hidden sm:block">Dashboard</span>
                        </button>

                        <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 hidden sm:block"></div>

                        <div className="flex items-center gap-3">
                            <h1 className="text-lg sm:text-lg font-extrabold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent truncate max-w-[150px] sm:max-w-xs">
                                {roomTitle || `Room ${roomId}`}
                            </h1>
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-black text-black  bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800 shadow-sm">
                                Member
                            </span>
                        </div>
                    </div>


                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setRightPanel(rightPanel === 'notifications' ? 'members' : 'notifications')}
                            className={`relative p-2 rounded-xl transition-all ${rightPanel === 'notifications' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'text-gray-400 hover:text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                            title="Toggle Notifications"
                        >
                            <span className="text-2xl block">🔔</span>
                            {notifications.filter(n => !n.isRead).length > 0 && (
                                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white font-bold ring-2 ring-white dark:ring-gray-800 animate-pulse">
                                    {notifications.filter(n => !n.isRead).length}
                                </span>
                            )}
                        </button>

                        <button
                            onClick={() => navigate('/settings')}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all"
                            title="Settings"
                        >
                            <span className="text-2xl">⚙️</span>
                        </button>

                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 p-[2px] shadow-lg shadow-blue-500/20">
                            <div className="w-full h-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center">
                                <span className="font-black text-xs text-blue-600 dark:text-blue-400">ME</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <div className="max-w-7xl mx-auto p-4 sm:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 lg:gap-8">

                    {/* LEFT COLUMN: Actions & Summary */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Quick Actions Card */}
                        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl shadow-gray-100/50 dark:shadow-none border border-gray-100 dark:border-gray-700 p-6">
                            <h3 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-5">Quick Actions</h3>
                            <button
                                onClick={() => setShowMessageModal(true)}
                                className="w-full group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-[1px] shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all duration-300"
                            >
                                <div className="relative bg-white dark:bg-gray-800 rounded-2xl px-4 py-4 group-hover:bg-opacity-95 transition-all flex items-center justify-center gap-3">
                                    <span className="text-2xl group-hover:scale-110 transition-transform duration-300">✉️</span>
                                    <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">Message Admin</span>
                                </div>
                            </button>
                        </div>

                        {/* Status Card (Re-designed) */}
                        {cycleSummary && (
                            <div className="relative overflow-hidden rounded-3xl p-6 shadow-2xl shadow-emerald-500/20 group">
                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500"></div>
                                <div className="absolute top-0 right-0 w-40 h-40 bg-white/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none group-hover:scale-110 transition-transform duration-700"></div>

                                <div className="relative z-10 text-white">
                                    <div className="flex justify-between items-start mb-8">
                                        <div>
                                            <p className="text-emerald-100 text-xs font-black tracking-widest uppercase mb-1">Cycle Total</p>
                                            <p className="text-4xl font-black tracking-tighter shadow-sm">₹{cycleSummary.total.toLocaleString()}</p>
                                        </div>
                                        <div className="bg-white/20 backdrop-blur-md p-2 rounded-xl">
                                            <span className="text-2xl">📉</span>
                                        </div>
                                    </div>

                                    <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                                        <div className="flex justify-between items-center">
                                            <span className="font-bold text-sm tracking-wide opacity-90">My Status</span>
                                            <span className={`px-3 py-1.5 rounded-lg text-xs font-black shadow-lg ${cycleSummary.unpaid > 0 ? 'bg-rose-500 text-white ring-2 ring-rose-400/50' : 'bg-emerald-400 text-emerald-950 ring-2 ring-emerald-300/50'}`}>
                                                {cycleSummary.unpaid > 0 ? 'PAYMENT DUE' : 'ALL GOOD'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* CENTER COLUMN: Feed */}
                    <div className="lg:col-span-6 space-y-6">

                        {/* Advanced Analytics Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* PIE CHART */}
                            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 min-h-[300px]">
                                <h3 className="text-sm font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
                                    <span className="text-xl">🍩</span> Spending by Category
                                </h3>
                                <div className="h-64 w-full">
                                    {Object.keys(categoryAnalytics).length > 0 ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={Object.entries(categoryAnalytics).map(([name, value]) => ({ name, value }))}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={60}
                                                    outerRadius={80}
                                                    paddingAngle={5}
                                                    dataKey="value"
                                                >
                                                    {Object.keys(categoryAnalytics).map((entry, index) => {
                                                        const colors = ['#F59E0B', '#8B5CF6', '#3B82F6', '#EC4899', '#6B7280'];
                                                        return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} stroke="none" />;
                                                    })}
                                                </Pie>
                                                <Tooltip
                                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                                    itemStyle={{ fontWeight: 'bold', color: '#333' }}
                                                />
                                                <Legend
                                                    verticalAlign="bottom"
                                                    height={36}
                                                    iconType="circle"
                                                    formatter={(value) => <span className="text-xs font-bold text-gray-500 ml-1">{value}</span>}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                            <span className="text-3xl opacity-20">📉</span>
                                            <span className="text-xs mt-2">No data available</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* BAR CHART */}
                            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 min-h-[300px]">
                                <h3 className="text-sm font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
                                    <span className="text-xl">📊</span> 3-Month Trend
                                </h3>
                                <div className="h-64 w-full">
                                    {monthlyAnalytics.length > 0 ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={monthlyAnalytics}>
                                                <XAxis
                                                    dataKey="month"
                                                    axisLine={false}
                                                    tickLine={false}
                                                    tick={{ fontSize: 10, fill: '#9CA3AF', fontWeight: 'bold' }}
                                                    dy={10}
                                                />
                                                <Tooltip
                                                    cursor={{ fill: 'transparent' }}
                                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                                />
                                                <Bar dataKey="total" fill="#3B82F6" radius={[6, 6, 0, 0]} barSize={30} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                            <span className="text-3xl opacity-20">📅</span>
                                            <span className="text-xs mt-2">No trend data yet</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-end bg-gradient-to-b from-gray-50/50 to-transparent dark:from-gray-700/10">
                                <div>
                                    <h3 className="font-black text-xl text-gray-900 dark:text-white flex items-center gap-3">
                                        <span className="text-2xl">🧾</span> Expense Feed
                                    </h3>
                                    <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-wide">Recent transactions in this room</p>
                                </div>
                            </div>

                            <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
                                {expenses.length === 0 ? (
                                    <div className="p-20 text-center flex flex-col items-center justify-center opacity-50">
                                        <span className="text-6xl mb-4 grayscale">💸</span>
                                        <p className="font-bold text-gray-400">No expenses yet. Quiet day!</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
                                        {expenses.map((exp) => (
                                            <div key={exp.id} className="p-6 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-all duration-200 group">
                                                <div className="flex justify-between items-center">
                                                    <div className="flex items-center gap-5">
                                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-lg ring-4 ring-opacity-20 ${exp.category === 'Food' ? 'bg-orange-100 text-orange-500 ring-orange-500' :
                                                            exp.category === 'Rent' ? 'bg-purple-100 text-purple-600 ring-purple-600' :
                                                                'bg-blue-100 text-blue-600 ring-blue-600'
                                                            }`}>
                                                            {exp.category === 'Food' ? '🍔' : exp.category === 'Rent' ? '🏠' : '💰'}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-gray-900 dark:text-white text-lg leading-tight group-hover:text-blue-600 transition-colors">{exp.itemName}</h4>
                                                            <div className="flex items-center gap-3 mt-1.5">
                                                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{exp.category}</span>
                                                                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                                                <span className="text-xs font-medium text-gray-400">{new Date(exp.createdAt).toLocaleDateString()}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="block font-black text-xl text-gray-900 dark:text-white tracking-tight">₹{exp.amount.toLocaleString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Members & Notifications */}
                    <div className="lg:col-span-3 space-y-6">
                        {rightPanel === 'members' && (
                            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg shadow-gray-100 dark:shadow-none border border-gray-100 dark:border-gray-700 p-6">
                                <h3 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-6">Roommates</h3>
                                <div className="space-y-5">
                                    {members.map((member, i) => (
                                        <div key={member.id} className="flex items-center gap-4 group">
                                            <div className="relative">
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg shadow-inner ${i % 2 === 0 ? 'bg-indigo-50 text-indigo-600' : 'bg-rose-50 text-rose-600'
                                                    }`}>
                                                    {member.user.name.charAt(0).toUpperCase()}
                                                </div>
                                                {member.paymentStatus === 'UNPAID' && (
                                                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-white rounded-full"></span>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-center mb-0.5">
                                                    <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{member.user.name}</p>
                                                    {member.userId === adminId && (
                                                        <span className="text-[9px] font-black bg-gray-900 text-white px-1.5 py-0.5 rounded-md uppercase tracking-wide">Admin</span>
                                                    )}
                                                </div>
                                                <p className={`text-xs font-bold uppercase tracking-wide ${member.paymentStatus === 'PAID' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                                    {member.paymentStatus}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {rightPanel === 'notifications' && (
                            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg shadow-gray-100 dark:shadow-none border border-gray-100 dark:border-gray-700 p-6 overflow-hidden max-h-[500px] overflow-y-auto">
                                <h3 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-6">Notifications</h3>
                                {notifications.length === 0 ? (
                                    <div className="text-center text-gray-400 text-sm py-8">No notifications.</div>
                                ) : (
                                    <div className="space-y-3">
                                        {notifications.map(notif => (
                                            <div key={notif.id} className={`p-3 rounded-xl border ${notif.type === 'WARNING' ? 'bg-red-50 border-red-100 dark:bg-red-900/20 dark:border-red-800' : 'bg-blue-50 border-blue-100 dark:bg-blue-900/20 dark:border-blue-800'} shadow-sm`}>
                                                <div className="flex gap-3">
                                                    <span className="text-xl">{notif.type === 'WARNING' ? '🚨' : 'ℹ️'}</span>
                                                    <div>
                                                        <p className="text-sm font-bold text-black dark:text-white">{notif.content}</p>
                                                        <span className="text-[10px] text-gray-500 mt-1 block">{new Date(notif.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Contact Widget */}
                        <div className="bg-indigo-50/50 dark:bg-indigo-900/10 rounded-2xl p-6 border border-indigo-100 dark:border-indigo-900/30 text-center">
                            <p className="text-2xl mb-2">🤝</p>
                            <p className="text-xs font-bold text-indigo-900 dark:text-indigo-300">Need help?</p>
                            <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium mt-1">Contact your admin to resolve payment issues.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Message Modal */}
            {
                showMessageModal && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4">
                        <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl w-full max-w-lg shadow-2xl border border-gray-100 dark:border-gray-700 transform transition-all scale-100">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                                    <span className="text-3xl">💬</span> Send Message
                                </h3>
                                <button onClick={() => setShowMessageModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors bg-gray-100 dark:bg-gray-700 rounded-full p-2 w-8 h-8 flex items-center justify-center">✕</button>
                            </div>

                            <div className="space-y-4">
                                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
                                    <p className="text-xs text-blue-700 dark:text-blue-300 font-bold leading-relaxed">
                                        This message will be sent directly to the room admin. Use this for payment clarifications or generic queries.
                                    </p>
                                </div>

                                <textarea
                                    value={messageContent}
                                    onChange={e => setMessageContent(e.target.value)}
                                    className="w-full p-4 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white font-medium focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all h-40 resize-none placeholder:text-gray-400"
                                    placeholder="Hey admin, about the electricity bill..."
                                ></textarea>

                                <div className="flex gap-3 pt-2">
                                    <button onClick={() => setShowMessageModal(false)} className="flex-1 py-3.5 rounded-xl font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">Cancel</button>
                                    <button onClick={handleSendMessage} className="flex-[2] py-3.5 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40 hover:-translate-y-0.5 transition-all">Send Message</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default RoomMemberDashboard;
