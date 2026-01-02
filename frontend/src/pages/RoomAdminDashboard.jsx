import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis } from 'recharts';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import StatusModal from '../components/StatusModal';

const RoomAdminDashboard = ({ roomId }) => {
    const { user } = useAuth();
    const navigate = useNavigate();

    // State
    const [expenses, setExpenses] = useState([]);
    const [members, setMembers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [notifications, setNotifications] = useState([]); // System Notifications
    const [roomTitle, setRoomTitle] = useState('');
    const [cycleSummary, setCycleSummary] = useState(null);
    const [categoryAnalytics, setCategoryAnalytics] = useState({});
    const [monthlyAnalytics, setMonthlyAnalytics] = useState([]); // New Implementation
    const [loading, setLoading] = useState(true);
    const [rightPanel, setRightPanel] = useState('members');
    const [adminId, setAdminId] = useState(null);

    // Multi-select state
    const [selectedMembers, setSelectedMembers] = useState([]);

    // UI State
    const [notificationTab, setNotificationTab] = useState('messages'); // 'messages' or 'alerts'

    // Form States
    const [expenseForm, setExpenseForm] = useState({ itemName: '', amount: '', category: 'General' });
    const [notifyForm, setNotifyForm] = useState({ subject: '', content: '' });
    const [showReminderModal, setShowReminderModal] = useState(false);
    const [targetUserIds, setTargetUserIds] = useState([]);

    // Status Modal State
    const [statusModal, setStatusModal] = useState({
        isOpen: false,
        status: 'success', // 'success' or 'error'
        title: '',
        message: ''
    });

    const fetchData = useCallback(async () => {
        try {
            const [roomRes, expRes, sumRes, msgRes, analyticsRes, monthlyRes] = await Promise.all([
                api.get(`/rooms/${roomId}`),
                api.get(`/rooms/${roomId}/expenses`, { params: { currentCycle: 'true' } }),
                api.get(`/rooms/${roomId}/analytics/summary`),
                api.get(`/rooms/${roomId}/messages`),
                api.get(`/rooms/${roomId}/analytics/category`),
                api.get(`/rooms/${roomId}/analytics/monthly`) // Fetch 3-Month Trend
            ]);

            setMembers(roomRes.data.members || []);
            setRoomTitle(roomRes.data.title);
            setAdminId(roomRes.data.adminId);
            setExpenses(expRes.data);
            setCycleSummary(sumRes.data);
            setMessages(msgRes.data);
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
        } finally {
            setLoading(false);
        }
    }, [roomId]);

    const toggleMemberSelection = (userId) => {
        setSelectedMembers(prev =>
            prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
        );
    };

    const handleBulkEmail = (userIds) => {
        if (userIds.length === 0) return;
        setTargetUserIds(userIds);
        // Pre-fill subject maybe?
        setNotifyForm(prev => ({ ...prev, subject: 'Important: Notification from Admin' }));
        setShowReminderModal(true);
    };



    useEffect(() => {
        fetchData();
    }, [fetchData]);


    const handleAddExpense = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/rooms/${roomId}/expenses`, {
                ...expenseForm,
                amount: parseFloat(expenseForm.amount)
            });
            setExpenseForm({ itemName: '', amount: '', category: 'General' });
            fetchData();
            setExpenseForm({ itemName: '', amount: '', category: 'General' });
            fetchData();
            // toast.success("Expense added successfully! 💸");
            setStatusModal({
                isOpen: true,
                status: 'success',
                title: 'Expense Added!',
                message: 'Your expense has been logged successfully.'
            });
        } catch {
            // toast.error('Failed to add expense');
            setStatusModal({
                isOpen: true,
                status: 'error',
                title: 'Failed to Add',
                message: 'Could not add expense. Please try again.'
            });
        }
    };

    const handleNotifyMembers = async () => {
        // e.preventDefault(); // Not in form in modal?
        try {
            await api.post(`/rooms/${roomId}/notify`, {
                ...notifyForm,
                recipientIds: targetUserIds // Send selected IDs (empty = all)
            });
            setNotifyForm({ subject: '', content: '' });
            setShowReminderModal(false);
            setTargetUserIds([]); // Reset targets
            setSelectedMembers([]); // Reset checkboxes
            setTargetUserIds([]); // Reset targets
            setSelectedMembers([]); // Reset checkboxes
            // toast.success('Emails sent successfully! 📨');
            setStatusModal({
                isOpen: true,
                status: 'success',
                title: 'Sent!',
                message: 'Emails have been dispatched successfully.'
            });
        } catch {
            // toast.error('Failed to send notification');
            setStatusModal({
                isOpen: true,
                status: 'error',
                title: 'Delivery Failed',
                message: 'Could not send notifications. Please check connection.'
            });
        }
    };

    const handleRemoveMember = async (userId) => {
        if (!window.confirm("Are you sure you want to delete this roommate permanently? This action cannot be undone.")) return;
        try {
            await api.delete(`/rooms/${roomId}/members/${userId}`);
            toast.success('Member removed successfully 🗑️');
            fetchData();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to remove member');
        }
    };

    const handleCloseCycle = async () => {
        if (window.confirm("Close current cycle? This will mark all expenses as settled.")) {
            try {
                await api.post(`/rooms/${roomId}/cycles/close`);
                toast.success("Cycle closed. Waiting for payments. 🔒");
                fetchData();
            } catch { toast.error("Failed to close cycle"); }
        }
    };

    // Quick Fix implementation for bulk actions:
    // Corrected Bulk Action
    const handleBulkMarkPaid = async (userIds) => {
        if (!window.confirm(`Mark ${userIds.length} members as PAID?`)) return;
        try {
            await Promise.all(userIds.map(id => api.patch(`/rooms/${roomId}/members/${id}/payment`, { status: "PAID" })));

            // toast.success("Updated payment status! ✅");
            setStatusModal({
                isOpen: true,
                status: 'success',
                title: 'Payment Updated!',
                message: 'Members have been marked as PAID.'
            });

            fetchData();
            setSelectedMembers([]);
        } catch {
            // toast.error("Failed to update some members.");
            setStatusModal({
                isOpen: true,
                status: 'error',
                title: 'Update Failed',
                message: 'Could not update payment status.'
            });
        }
    };

    if (loading) return <div className="p-8 flex justify-center"><div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>;

    const unreadMessagesCount = messages.filter(m => m.status === 'OPEN').length;
    // Calculate max value for chart scaling
    // const categoryValues = Object.values(categoryAnalytics);
    // const maxCategoryValue = categoryValues.length > 0 ? Math.max(...categoryValues) : 0;

    // Unused colors/icons removed for linting

    const handleOpenNotifications = async () => {
        if (rightPanel === 'notifications') {
            setRightPanel('members'); // Toggle off
        } else {
            setRightPanel('notifications'); // Toggle on
            // Mark as read if there are unread messages
            if (unreadMessagesCount > 0) {
                try {
                    await api.patch(`/rooms/${roomId}/messages/read`);
                    // Update local state to remove unread count immediately
                    setMessages(prev => prev.map(m => ({ ...m, status: 'RESOLVED' })));
                } catch (console) {
                    // Fail silently or log
                    console.error("Failed to mark messages as read");
                }
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-mono text-slate-800 dark:text-gray-200 transition-colors duration-300">
            {/* Professional Navbar */}
            <div className="bg-white dark:bg-gray-800 backdrop-blur-xl shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-20 transition-all">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="group flex items-center gap-2 text-slate-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                        >
                            <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
                            <span className="font-bold text-sm hidden sm:block uppercase tracking-wider">Control Panel</span>
                        </button>

                        <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 hidden sm:block"></div>

                        <div className="flex items-center gap-3">
                            <h1 className="text-lg sm:text-lg font-extrabold bg-gradient-to-r from-purple-600 to-indigo-500 bg-clip-text text-transparent truncate max-w-[150px] sm:max-w-xs">
                                {roomTitle || `Room ${roomId}`}
                            </h1>
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider text-black dark:text-gray-20 shadow-sm">
                                Admin Control
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleOpenNotifications}
                            className={`relative p-2 rounded-xl transition-all ${rightPanel === 'notifications' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                            title="Toggle Notifications"
                        >
                            <span className="text-2xl block">🔔</span>
                            {unreadMessagesCount > 0 && (
                                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white font-bold ring-2 ring-white dark:ring-gray-800 animate-pulse">
                                    {unreadMessagesCount}
                                </span>
                            )}
                        </button>

                        <button
                            onClick={() => navigate('/settings')}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all"
                            title="Settings"
                        >
                            <span className="text-2xl">⚙️</span>
                        </button>

                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 p-[2px] shadow-lg shadow-purple-500/20">
                            <div className="w-full h-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center">
                                <span className="font-black text-xs text-purple-600 dark:text-purple-400">ADM</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">

                    {/* LEFT COLUMN: Admin Actions */}
                    <div className="lg:col-span-3 space-y-6">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl shadow-gray-200/40 dark:shadow-none border border-gray-200 dark:border-gray-700 p-6 transform hover:scale-[1.02] transition-transform duration-300">
                            <h3 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Control Panel</h3>
                            <div className="space-y-3">
                                <button
                                    onClick={() => {
                                        setTargetUserIds([]); // Clear targets to send to ALL
                                        setShowReminderModal(true);
                                    }}
                                    className="w-full text-left px-4 py-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 text-black dark:text-gray-200 transition-all flex items-center gap-3 font-extrabold shadow-sm border border-blue-100 dark:border-blue-800"
                                >
                                    <span className="bg-white text-black dark:bg-blue-800 p-1.5 rounded-lg shadow-sm text-lg">📢</span>
                                    <span className="tracking-wide text-black dark:text-gray-800">SEND REMINDER</span>
                                </button>
                                <button
                                    onClick={handleCloseCycle}
                                    className="w-full text-left px-4 py-4 rounded-xl bg-gradient-to-r from-red-50 to-orange-50 hover:from-red-100 hover:to-orange-100 dark:from-red-900/20 dark:to-orange-900/20 text-black dark:text-gray-200 transition-all flex items-center gap-3 font-extrabold shadow-sm border border-red-100 dark:border-red-800"
                                >
                                    <span className="bg-white dark:bg-red-800 p-1.5 rounded-lg shadow-sm text-lg">🔒</span>
                                    <span className="tracking-wide text-black dark:text-gray-800">CLOSE CYCLE</span>
                                </button>
                            </div>
                        </div>

                        {cycleSummary && (
                            <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-6 text-white shadow-xl shadow-purple-500/20 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-white/20 transition-all duration-700"></div>
                                <p className="text-indigo-100 text-xs font-bold tracking-wider mb-2 uppercase">Total Expenses</p>
                                <p className="text-4xl font-black mb-6 tracking-tight">₹{cycleSummary.total.toLocaleString()}</p>
                                <div className="flex justify-between items-center text-sm border-t border-white/20 pt-4">
                                    <span className="font-medium opacity-90">Status</span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${cycleSummary.unpaid > 0 ? 'bg-amber-400 text-amber-900' : 'bg-emerald-400 text-emerald-900'} backdrop-blur-sm`}>
                                        {cycleSummary.unpaid > 0 ? 'Active' : 'Settled'}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* CENTER COLUMN: Expenses */}
                    <div className="lg:col-span-6 space-y-6">
                        {/* Advanced Analytics Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* PIE CHART: Category Breakdown */}
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 min-h-[300px]">
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
                                                        const colors = ['#F59E0B', '#8B5CF6', '#3B82F6', '#EC4899', '#6B7280']; // Food, Rent, Utils, Ent, Gen
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

                            {/* BAR CHART: 3-Month Trend */}
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 min-h-[300px]">
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
                                                <Bar dataKey="total" fill="#8B5CF6" radius={[6, 6, 0, 0]} barSize={30} />
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

                        {/* Add Expense Form */}
                        <div className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl shadow-xl shadow-purple-500/5 border border-gray-100 dark:border-gray-700 p-8 transform transition-all hover:shadow-2xl hover:shadow-purple-500/10">
                            {/* Decorative background blob */}
                            <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

                            <div className="flex items-center gap-4 mb-8 relative z-10">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-3xl text-white shadow-lg shadow-purple-500/30">
                                    💸
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Add New Expense</h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mt-1">Track your room's spending</p>
                                </div>
                            </div>

                            <form onSubmit={handleAddExpense} className="space-y-5 relative z-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Item Name</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-3.5 text-gray-400 text-lg">🏷️</span>
                                            <input
                                                type="text"
                                                placeholder="What did you buy?"
                                                value={expenseForm.itemName}
                                                onChange={e => setExpenseForm({ ...expenseForm, itemName: e.target.value })}
                                                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none dark:text-white font-bold text-gray-900 transition-all placeholder:font-medium placeholder:text-gray-400"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Amount</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-3.5 text-gray-500 font-black text-lg">₹</span>
                                            <input
                                                type="number"
                                                placeholder="0.00"
                                                value={expenseForm.amount}
                                                onChange={e => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                                                className="w-full pl-10 pr-4 py-3.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none dark:text-white font-bold text-gray-900 transition-all placeholder:font-medium placeholder:text-gray-400"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Category</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-3.5 text-gray-400 text-lg">📂</span>
                                        <select
                                            value={expenseForm.category}
                                            onChange={e => setExpenseForm({ ...expenseForm, category: e.target.value })}
                                            className="w-full pl-12 pr-10 py-3.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none dark:text-white font-bold text-gray-900 transition-all appearance-none cursor-pointer"
                                        >
                                            <option>General</option>
                                            <option>Food</option>
                                            <option>Utilities</option>
                                            <option>Rent</option>
                                            <option>Entertainment</option>
                                        </select>
                                        <span className="absolute right-4 top-4 text-gray-400 pointer-events-none text-xs">▼</span>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-4 mt-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-extrabold text-lg rounded-xl shadow-lg shadow-purple-500/30 transform hover:-translate-y-0.5 active:scale-95 transition-all flex items-center justify-center gap-2 group"
                                >
                                    <span className="group-hover:rotate-90 transition-transform duration-300">＋</span> Add Expense
                                </button>
                            </form>
                        </div>

                        {/* Transactions */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                            <div className="p-6 border-b border-gray-50 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
                                <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                    <span className="text-xl">🧾</span> Recent Transactions
                                </h3>
                            </div>
                            <div className="divide-y divide-gray-50 dark:divide-gray-700 max-h-[500px] overflow-y-auto">
                                {expenses.map(exp => (
                                    <div key={exp.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-750 flex justify-between items-center transition-all group">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-sm group-hover:scale-110 transition-transform ${exp.category === 'Food' ? 'bg-orange-50 text-orange-500' : exp.category === 'Rent' ? 'bg-purple-50 text-purple-500' : 'bg-blue-50 text-blue-500'}`}>
                                                {exp.category === 'Food' ? '🍔' : exp.category === 'Rent' ? '🏠' : '💰'}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-800 dark:text-white text-md">{exp.itemName}</p>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">{exp.category}</span>
                                                    <span className="text-xs text-gray-400">• {new Date(exp.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <span className="font-black text-gray-900 dark:text-white text-lg tracking-tight">₹{exp.amount}</span>
                                    </div>
                                ))}
                                {expenses.length === 0 && (
                                    <div className="p-12 text-center text-gray-400 flex flex-col items-center">
                                        <span className="text-4xl mb-3 opacity-20">💸</span>
                                        <p>No expenses recorded yet.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Management */}
                    <div className="lg:col-span-3 space-y-6">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-1.5 flex gap-1 mb-2">
                            <button
                                onClick={() => setRightPanel('members')}
                                className={`flex-1 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition-all border ${rightPanel === 'members' ? 'bg-gray-100 border-gray-200 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white shadow-sm' : 'border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                            >
                                Members
                            </button>
                            <button
                                onClick={handleOpenNotifications}
                                className={`flex-1 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition-all border ${rightPanel === 'notifications' ? 'bg-blue-50 border-blue-100 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300 shadow-sm' : 'border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                            >
                                Messages
                                {unreadMessagesCount > 0 && <span className="ml-2 bg-red-500 text-white px-1.5 py-0.5 rounded-full text-[9px]">{unreadMessagesCount}</span>}
                            </button>
                        </div>


                        {rightPanel === 'members' && (
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-700 p-6">
                                <button
                                    onClick={() => navigate(`/rooms/${roomId}/add-member`)}
                                    className="w-full mb-6 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 rounded-xl hover:border-purple-500 hover:text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-all flex items-center justify-center gap-2 font-bold text-sm"
                                >
                                    <span>+ Add Roommate</span>
                                </button>

                                {/* Bulk Actions Bar */}
                                {selectedMembers.length > 0 && (
                                    <div className="mb-4 bg-purple-50 dark:bg-purple-900/20 p-3 rounded-xl flex justify-between items-center animate-fade-in">
                                        <span className="text-xs font-bold text-purple-700 dark:text-purple-300 px-2">{selectedMembers.length} selected</span>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleBulkEmail(selectedMembers)}
                                                className="bg-white dark:bg-gray-800 p-2 rounded-lg text-purple-600 dark:text-purple-400 shadow-sm hover:scale-105 transition-transform"
                                                title="Send Mail"
                                            >
                                                ✉️
                                            </button>
                                            <button
                                                onClick={() => handleBulkMarkPaid(selectedMembers)}
                                                className="bg-white dark:bg-gray-800 p-2 rounded-lg text-green-600 dark:text-green-400 shadow-sm hover:scale-105 transition-transform"
                                                title="Mark as Paid"
                                            >
                                                ✅
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-4">
                                    {members.map(member => (
                                        <div key={member.id} className="flex items-center justify-between group">
                                            <div className="flex items-center gap-3 min-w-0">
                                                {/* Checkbox */}
                                                {member.userId !== user.userId && (
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedMembers.includes(member.userId)}
                                                        onChange={() => toggleMemberSelection(member.userId)}
                                                        className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500 transition-colors cursor-pointer"
                                                    />
                                                )}

                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-600 flex items-center justify-center font-bold text-sm shadow-inner relative">
                                                    {member.user.name.charAt(0).toUpperCase()}
                                                    {/* Online Status (Mock) */}
                                                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-gray-800 rounded-full"></span>
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-sm font-bold text-gray-800 dark:text-white truncate">{member.user.name}</p>
                                                        {member.userId === adminId && (
                                                            <span className="text-[10px] font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 text-white px-2 py-0.5 rounded-full shadow-md shadow-purple-500/30">
                                                                ADMIN
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${member.paymentStatus === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                        {member.paymentStatus}
                                                    </span>
                                                </div>
                                            </div>
                                            {member.userId !== user.userId && (
                                                <button
                                                    onClick={() => handleRemoveMember(member.userId)}
                                                    className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                                                    title="Remove Roommate"
                                                >
                                                    🗑️
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {rightPanel === 'notifications' && (
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-700 overflow-hidden max-h-[500px]">
                                <div className="flex border-b border-gray-100 dark:border-gray-700">
                                    <button
                                        onClick={() => setNotificationTab('messages')}
                                        className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider rounded-tl-2xl transition-all ${notificationTab === 'messages' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50 dark:bg-gray-700 dark:text-blue-400' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
                                    >
                                        Messages
                                    </button>
                                    <button
                                        onClick={() => setNotificationTab('alerts')}
                                        className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider rounded-tr-2xl transition-all ${notificationTab === 'alerts' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50 dark:bg-gray-700 dark:text-blue-400' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
                                    >
                                        Alerts {notifications.filter(n => !n.isRead).length > 0 && `(${notifications.filter(n => !n.isRead).length})`}
                                    </button>
                                </div>

                                <div className="p-4 overflow-y-auto max-h-[400px]">
                                    {notificationTab === 'messages' ? (
                                        <>
                                            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Recent Messages</h4>
                                            {messages.length === 0 ? (
                                                <div className="p-8 text-center text-gray-400 text-sm">No new messages.</div>
                                            ) : (
                                                <div className="divide-y divide-gray-100 dark:divide-gray-700 space-y-3">
                                                    {messages.map(msg => (
                                                        <div key={msg.id} className="p-3 bg-white dark:bg-gray-750 dark:bg-gray-700 rounded-xl border border-gray-100 dark:border-gray-600 shadow-sm">
                                                            <div className="flex justify-between items-start mb-1">
                                                                <span className="font-bold text-sm text-gray-900 dark:text-white">{msg.sender?.name || 'User'}</span>
                                                                <span className="text-[10px] text-gray-400">{new Date(msg.createdAt).toLocaleDateString()}</span>
                                                            </div>
                                                            <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">{msg.content}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">System Alerts</h4>
                                            {notifications.length === 0 ? (
                                                <div className="p-8 text-center text-gray-400 text-sm">No notifications.</div>
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
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Reminder Modal */}
            {showReminderModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4">
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl w-full max-w-md shadow-2xl transform scale-100 transition-all">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold dark:text-white flex items-center gap-2">
                                <span className="bg-blue-100 p-2 rounded-lg text-xl">📢</span>
                                {targetUserIds.length > 0 ? `Message ${targetUserIds.length} Members` : 'Message All Members'}
                            </h3>
                            <button onClick={() => setShowReminderModal(false)} className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors">✕</button>
                        </div>

                        <form onSubmit={handleNotifyMembers} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Subject</label>
                                <input type="text" value={notifyForm.subject} onChange={e => setNotifyForm({ ...notifyForm, subject: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600 font-medium" placeholder="e.g., Rent Due" required />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Message</label>
                                <textarea value={notifyForm.content} onChange={e => setNotifyForm({ ...notifyForm, content: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600 font-medium" rows="4" placeholder="Please pay by Friday..." required></textarea>
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={() => setShowReminderModal(false)} className="px-6 py-2.5 rounded-xl text-gray-600 hover:bg-gray-100 dark:text-gray-300 font-bold">Cancel</button>
                                <button type="submit" className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-blue-500/30 transform hover:-translate-y-0.5 transition-all">Send Emails</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <StatusModal
                isOpen={statusModal.isOpen}
                onClose={() => setStatusModal(prev => ({ ...prev, isOpen: false }))}
                status={statusModal.status}
                title={statusModal.title}
                message={statusModal.message}
            />
        </div>
    );
};

export default RoomAdminDashboard;
