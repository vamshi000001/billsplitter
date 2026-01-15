import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis } from 'recharts';
import { Bell, Settings, Home, MessageSquare, Plus, X } from 'lucide-react';

const RoomMemberDashboard = ({ roomId }) => {
    const navigate = useNavigate();
    const { user } = useAuth();

    // State
    const [expenses, setExpenses] = useState([]);
    const [members, setMembers] = useState([]);
    const [roomTitle, setRoomTitle] = useState('');
    const [adminId, setAdminId] = useState(null);
    const [cycleSummary, setCycleSummary] = useState(null);
    const [categoryAnalytics, setCategoryAnalytics] = useState({});
    const [monthlyAnalytics, setMonthlyAnalytics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notifications, setNotifications] = useState([]);

    // UI/Nav State
    const [activeTab, setActiveTab] = useState('home');
    const [showNotifications, setShowNotifications] = useState(false);
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [messageContent, setMessageContent] = useState('');
    const [sending, setSending] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            const [roomRes, expRes, sumRes, analyticsRes, monthlyRes] = await Promise.all([
                api.get(`/rooms/${roomId}`),
                api.get(`/rooms/${roomId}/expenses`, { params: { currentCycle: 'true' } }),
                api.get(`/rooms/${roomId}/analytics/summary`),
                api.get(`/rooms/${roomId}/analytics/category`),
                api.get(`/rooms/${roomId}/analytics/monthly`)
            ]);


            setRoomTitle(roomRes.data.title);
            setAdminId(roomRes.data.adminId);
            setMembers(roomRes.data.members || []);
            setExpenses(expRes.data);
            setCycleSummary(sumRes.data);
            setCategoryAnalytics(analyticsRes.data);
            setMonthlyAnalytics(monthlyRes.data);

            try {
                const notifRes = await api.get('/notifications');
                setNotifications(notifRes.data);
            } catch {
                console.warn("Failed to fetch notifications");
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
        if (!messageContent.trim()) return;
        setSending(true);
        try {
            await api.post(`/rooms/${roomId}/messages`, { content: messageContent });
            setMessageContent('');
            toast.success('Message sent to admin! 📨');
            setShowMessageModal(false);
        } catch {
            toast.error('Failed to send message');
        } finally {
            setSending(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="w-10 h-10 border-4 border-brand-blue border-t-transparent rounded-full animate-spin"></div></div>;

    return (
        <div className="min-h-screen bg-brand-light dark:bg-gray-900 pb-24 font-sans text-gray-800 dark:text-gray-100">

            {/* Mobile Header */}
            <div className="bg-white dark:bg-gray-800 px-6 pt-12 pb-6 shadow-sm rounded-b-3xl mb-6">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-brand-blue font-bold text-lg border-2 border-blue-100 uppercase">
                            {user?.name?.charAt(0) || 'M'}
                        </div>
                        <div>
                            <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">Member View</p>
                            <h1 className="text-xl font-bold text-gray-900 dark:text-white truncate max-w-[150px]">{roomTitle}</h1>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <button className="relative" onClick={() => setShowNotifications(true)}>
                            <Bell className="w-6 h-6 text-gray-400" />
                            {notifications.length > 0 && <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>}
                        </button>
                    </div>
                </div>

                {/* Main Stat Card (Brand Orange/Gradient) */}
                {cycleSummary && (
                    <div className="bg-gradient-to-br from-brand-orange via-orange-500 to-orange-600 text-white rounded-[2.5rem] p-8 shadow-2xl shadow-brand-orange/30 relative overflow-hidden group">
                        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                            <div>
                                <p className="opacity-90 text-sm font-bold uppercase tracking-widest mb-2">My Contribution</p>
                                <h2 className="text-5xl font-black mb-1 drop-shadow-sm transition-transform group-hover:scale-105 duration-500 origin-left">
                                    ₹{cycleSummary.userShare?.toLocaleString() || '0'}
                                </h2>
                                <p className="text-xs opacity-70 font-medium tracking-wide">Current Cycle Split</p>
                            </div>

                            <div className="flex flex-col items-start md:items-end justify-between md:justify-center gap-4 border-t md:border-t-0 md:border-l border-white/20 pt-6 md:pt-0 md:pl-10">
                                <div className="text-left md:text-right">
                                    <p className="text-[10px] opacity-70 uppercase font-black tracking-widest mb-1">Room Total</p>
                                    <p className="text-xl font-bold">₹{cycleSummary.total.toLocaleString()}</p>
                                </div>
                                <div className="flex gap-2">
                                    <span className={`px-6 py-2 rounded-2xl text-[10px] font-black shadow-xl uppercase tracking-widest transition-all ${cycleSummary.paymentStatus === 'PAID' ? 'bg-white text-emerald-500 scale-110 shadow-emerald-500/20' : 'bg-red-500 text-white animate-pulse shadow-red-500/40'}`}>
                                        {cycleSummary.paymentStatus || 'UNPAID'}
                                    </span>
                                </div>
                            </div>
                        </div>
                        {/* Decorative Premium Elements */}
                        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-24 -mt-24 blur-3xl group-hover:scale-125 transition-transform duration-700"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-300/20 rounded-full -ml-16 -mb-16 blur-2xl"></div>
                    </div>
                )}
            </div>

            <div className="px-5 grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Spending Chart (Pie) */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-700 min-h-[250px] flex items-center justify-center relative">
                    <h3 className="absolute top-6 left-6 font-bold text-gray-900 dark:text-white">Spending Mix</h3>
                    <div className="w-full h-48 mt-8">
                        {Object.keys(categoryAnalytics).length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={Object.entries(categoryAnalytics).map(([name, value]) => ({ name, value }))}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={50}
                                        outerRadius={70}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {Object.keys(categoryAnalytics).map((entry, index) => {
                                            const colors = ['#F59E0B', '#0F4C81', '#FF6B35', '#F7C948', '#6B7280'];
                                            return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} stroke="none" />;
                                        })}
                                    </Pie>
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} />
                                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                <span className="text-3xl opacity-20">📉</span>
                                <span className="text-xs mt-2">No data yet</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Monthly Bar Chart */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-700 min-h-[250px] relative">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-4">Monthly Trends</h3>
                    <div className="h-48 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={monthlyAnalytics}>
                                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} />
                                <Bar dataKey="total" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="px-5 space-y-6">

                {/* Roommates List */}
                <div className="pb-4">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-4 px-1">Roommates</h3>
                    <div className="space-y-4">
                        {members.map(member => (
                            <div key={member.id} className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex justify-between items-center transition-all hover:shadow-md">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold border-2 border-white dark:border-gray-700 shadow-sm uppercase">
                                        {member.user.name.charAt(0)}
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className="font-bold text-sm text-gray-900 dark:text-white truncate">
                                            {member.user.name}
                                            {member.user.id === user?.id && ' (You)'}
                                        </h4>
                                        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-tight">
                                            {member.userId === adminId ? 'Room Admin' : 'Roommate'}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-sm ${member.paymentStatus === 'PAID' ? 'bg-emerald-500 text-white' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'}`}>
                                        {member.paymentStatus}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Transaction Feed */}
                <div className="pb-4">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-4 px-1">Room Activity</h3>
                    <div className="space-y-4">
                        {expenses.length === 0 ? (
                            <p className="text-center text-gray-400 py-8">No expenses recorded yet.</p>
                        ) : (
                            expenses.map(exp => (
                                <div key={exp.id} className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex justify-between items-center transform transition-transform active:scale-98">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-sm ${exp.category === 'Food' ? 'bg-orange-50 text-brand-orange' : 'bg-blue-50 text-brand-blue'}`}>
                                            {exp.category === 'Food' ? '🍔' : '💸'}
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className="font-bold text-sm text-gray-900 dark:text-white truncate">{exp.itemName}</h4>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className="text-[10px] font-bold uppercase tracking-wide text-brand-blue/60 bg-blue-50 px-2 py-0.5 rounded-full">{exp.category}</span>
                                                <span className="text-[10px] text-gray-400 font-medium">
                                                    {new Date(exp.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="block font-bold text-gray-900 dark:text-white">₹{exp.amount}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Bottom Nav */}
            <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 pb-safe pt-2 px-8 safe-area-bottom z-50">
                <div className="flex justify-between items-center py-3">
                    <button onClick={() => { setActiveTab('home'); }} className={`flex flex-col items-center gap-1 ${activeTab === 'home' ? 'text-brand-blue' : 'text-gray-400'}`}>
                        <Home className="w-6 h-6" fill={activeTab === 'home' ? "currentColor" : "none"} />
                        <span className="text-[10px] font-bold">Home</span>
                    </button>

                    <button
                        onClick={() => { setActiveTab('message'); setShowMessageModal(true); }}
                        className="w-14 h-14 bg-gradient-to-r from-brand-orange to-orange-400 rounded-full flex items-center justify-center text-white shadow-lg shadow-brand-orange/40 -mt-8 border-4 border-gray-50 dark:border-gray-900"
                    >
                        <MessageSquare className="w-6 h-6" />
                    </button>

                    <button onClick={() => { setActiveTab('settings'); navigate('/settings'); }} className={`flex flex-col items-center gap-1 ${activeTab === 'settings' ? 'text-brand-blue' : 'text-gray-400'}`}>
                        <Settings className="w-6 h-6" />
                        <span className="text-[10px] font-bold">Settings</span>
                    </button>
                </div>
            </div>

            {/* Message Modal */}
            {showMessageModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center sm:justify-center p-0 sm:p-4">
                    <div className="bg-white dark:bg-gray-800 w-full sm:max-w-md rounded-t-[2rem] sm:rounded-[2rem] p-8 animate-slide-up-mobile">
                        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-8 sm:hidden"></div>
                        <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Message Admin</h3>

                        <div className="space-y-4">
                            <textarea
                                value={messageContent}
                                onChange={e => setMessageContent(e.target.value)}
                                className="w-full bg-brand-light dark:bg-gray-700 p-4 rounded-xl outline-none font-bold h-32 resize-none text-gray-900 dark:text-white"
                                placeholder="Type your message..."
                            ></textarea>

                            <div className="grid grid-cols-2 gap-4">
                                <button onClick={() => setShowMessageModal(false)} className="py-4 rounded-xl font-bold text-gray-500 bg-gray-100 dark:bg-gray-700">Cancel</button>
                                <button
                                    onClick={handleSendMessage}
                                    disabled={sending}
                                    className={`py-4 rounded-xl font-bold text-white shadow-lg shadow-brand-blue/30 ${sending ? 'bg-brand-blue/70 cursor-not-allowed' : 'bg-brand-blue'}`}
                                >
                                    {sending ? 'Sending...' : 'Send'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Notifications Drawer */}
            {
                showNotifications && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-end">
                        <div className="w-full sm:w-96 bg-white dark:bg-gray-800 h-full p-6 shadow-2xl animate-slide-in-right overflow-y-auto">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Notifications</h3>
                                <button onClick={() => setShowNotifications(false)}><X className="text-gray-400" /> <span className="sr-only">Close</span></button>
                            </div>
                            <div className="space-y-4">
                                {notifications.length === 0 ? <p className="text-gray-400 text-center mt-10">No notifications.</p> : notifications.map(notif => (
                                    <div key={notif.id} className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-100 dark:border-red-800/30 shadow-sm flex gap-3">
                                        <div className="w-2 h-2 rounded-full bg-red-500 mt-2 shrink-0 animate-pulse"></div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{notif.content}</p>
                                            <span className="text-[10px] text-red-400 block mt-1">{new Date(notif.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )
            }

        </div>
    );
};

export default RoomMemberDashboard;
