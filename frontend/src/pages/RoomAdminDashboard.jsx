import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis } from 'recharts';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import StatusModal from '../components/StatusModal';
import { Bell, Settings, Home, Plus, Users, Wallet } from 'lucide-react';

const RoomAdminDashboard = ({ roomId }) => {
    const { user } = useAuth();
    const navigate = useNavigate();

    // State
    const [expenses, setExpenses] = useState([]);
    const [members, setMembers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [roomTitle, setRoomTitle] = useState('');
    const [cycleSummary, setCycleSummary] = useState(null);
    const [categoryAnalytics, setCategoryAnalytics] = useState({});
    const [monthlyAnalytics, setMonthlyAnalytics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [adminId, setAdminId] = useState(null);

    // Mobile Navigation State
    const [activeTab, setActiveTab] = useState('home'); // home, expense, members

    // Modal States
    const [expenseForm, setExpenseForm] = useState({ itemName: '', amount: '', category: 'General' });
    const [showAddExpenseModal, setShowAddExpenseModal] = useState(false); // For mobile FAB
    const [targetUserIds, setTargetUserIds] = useState([]);
    const [showReminderModal, setShowReminderModal] = useState(false);
    const [notifyForm, setNotifyForm] = useState({ subject: '', content: '' });

    const [statusModal, setStatusModal] = useState({
        isOpen: false,
        status: 'success',
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
                api.get(`/rooms/${roomId}/analytics/monthly`)
            ]);

            setMembers(roomRes.data.members || []);
            setRoomTitle(roomRes.data.title);
            setAdminId(roomRes.data.adminId);
            setExpenses(expRes.data);
            setCycleSummary(sumRes.data);
            setMessages(msgRes.data);
            setCategoryAnalytics(analyticsRes.data);
            setMonthlyAnalytics(monthlyRes.data);

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
            setShowAddExpenseModal(false);
            setStatusModal({
                isOpen: true,
                status: 'success',
                title: 'Expense Added!',
                message: 'Your expense has been logged successfully.'
            });
        } catch {
            setStatusModal({
                isOpen: true,
                status: 'error',
                title: 'Failed to Add',
                message: 'Could not add expense. Please try again.'
            });
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

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="w-10 h-10 border-4 border-brand-blue border-t-transparent rounded-full animate-spin"></div></div>;

    const unreadMessagesCount = messages.filter(m => m.status === 'OPEN').length;

    return (
        <div className="min-h-screen bg-brand-light dark:bg-gray-900 pb-24 font-sans text-gray-800 dark:text-gray-100">

            {/* Top Header Section (Mobile App Style) */}
            <div className="bg-white dark:bg-gray-800 px-6 pt-12 pb-6 shadow-sm rounded-b-3xl mb-6">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-brand-blue font-bold text-lg border-2 border-blue-100">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">Welcome back,</p>
                            <h1 className="text-xl font-bold text-gray-900 dark:text-white capitalize">{user?.name}</h1>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <button className="relative">
                            <Bell className="w-6 h-6 text-gray-400" />
                            {notifications.length > 0 && <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>}
                        </button>
                    </div>
                </div>

                {/* Main Stat Card (Brand Blue) */}
                {cycleSummary && (
                    <div className="bg-brand-blue text-white rounded-[2rem] p-6 shadow-xl shadow-brand-blue/20 relative overflow-hidden">
                        <div className="relative z-10">
                            <p className="opacity-80 text-sm font-medium mb-1">Total Spending (This Cycle)</p>
                            <h2 className="text-4xl font-bold mb-6">₹{cycleSummary.total.toLocaleString()}</h2>

                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-xs opacity-70 mb-1">Your Share</p>
                                    <p className="font-semibold">₹{cycleSummary.userShare?.toLocaleString() || '0'}</p>
                                </div>
                                <div className="flex gap-2">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${cycleSummary.unpaid > 0 ? 'bg-white/20 text-white' : 'bg-green-400 text-green-900'}`}>
                                        {cycleSummary.unpaid > 0 ? 'Active' : 'Settled'}
                                    </span>
                                </div>
                            </div>
                        </div>
                        {/* Decorative Circles */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
                    </div>
                )}
            </div>

            {/* Content Body */}
            <div className="px-5 space-y-6">

                {/* Quick Actions (Horizontal Scroll) */}
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                    <button
                        onClick={() => setShowAddExpenseModal(true)}
                        className="flex flex-col items-center gap-2 min-w-[80px]"
                    >
                        <div className="w-14 h-14 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center text-brand-blue shadow-sm border border-gray-100 hover:bg-blue-50 transition-colors">
                            <Plus className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-medium text-gray-500">Add</span>
                    </button>
                    <button
                        onClick={handleCloseCycle}
                        className="flex flex-col items-center gap-2 min-w-[80px]"
                    >
                        <div className="w-14 h-14 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center text-brand-orange shadow-sm border border-gray-100 hover:bg-orange-50 transition-colors">
                            <Wallet className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-medium text-gray-500">Close</span>
                    </button>
                    <button
                        onClick={() => navigate(`/rooms/${roomId}/add-member`)}
                        className="flex flex-col items-center gap-2 min-w-[80px]"
                    >
                        <div className="w-14 h-14 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center text-brand-yellow shadow-sm border border-gray-100 hover:bg-yellow-50 transition-colors">
                            <Users className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-medium text-gray-500">Invite</span>
                    </button>
                </div>

                {/* Spending Chart */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-gray-900 dark:text-white">Spending Analytics</h3>
                    </div>
                    <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={monthlyAnalytics}>
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9CA3AF' }} dy={10} />
                                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                                <Bar dataKey="total" fill="#0F4C81" radius={[4, 4, 4, 4]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>


                {/* Transactions List */}
                <div className="pb-4">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-4 px-1">Recent Transactions</h3>
                    <div className="space-y-4">
                        {expenses.slice(0, 5).map(exp => (
                            <div key={exp.id} className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${exp.category === 'Food' ? 'bg-orange-50 text-brand-orange' : 'bg-blue-50 text-brand-blue'}`}>
                                        {exp.category === 'Food' ? '🍔' : '💸'}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm text-gray-900 dark:text-white">{exp.itemName}</h4>
                                        <p className="text-xs text-brand-blue/50 font-bold uppercase tracking-wide">{exp.category}</p>
                                    </div>
                                </div>
                                <span className="font-bold text-gray-900 dark:text-white">₹{exp.amount}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Mobile Bottom Navigation (Fixed) */}
            <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 pb-safe pt-2 px-6 safe-area-bottom z-50">
                <div className="flex justify-between items-center py-3">
                    <button onClick={() => { setActiveTab('home'); setShowAddExpenseModal(false); }} className={`flex flex-col items-center gap-1 ${activeTab === 'home' ? 'text-brand-blue' : 'text-gray-400'}`}>
                        <Home className="w-6 h-6" fill={activeTab === 'home' ? "currentColor" : "none"} />
                    </button>

                    {/* Floating Add Button in Center */}
                    <button
                        onClick={() => { setActiveTab('add'); setShowAddExpenseModal(true); }}
                        className="w-14 h-14 bg-brand-blue rounded-full flex items-center justify-center text-white shadow-lg shadow-brand-blue/40 -mt-8 border-4 border-gray-50 dark:border-gray-900"
                    >
                        <Plus className="w-7 h-7" />
                    </button>

                    <button onClick={() => { setActiveTab('settings'); navigate('/settings'); }} className={`flex flex-col items-center gap-1 ${activeTab === 'settings' ? 'text-brand-blue' : 'text-gray-400'}`}>
                        <Settings className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* Slide-up Modal for Add Expense (Mobile Style) */}
            {showAddExpenseModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center sm:justify-center p-0 sm:p-4">
                    <div className="bg-white dark:bg-gray-800 w-full sm:max-w-md rounded-t-[2rem] sm:rounded-[2rem] p-8 animate-slide-up-mobile">
                        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-8 sm:hidden"></div>
                        <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">New Expense</h3>

                        <form onSubmit={handleAddExpense} className="space-y-6">
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase">Amount</label>
                                <div className="flex items-center gap-2 border-b-2 border-gray-100 dark:border-gray-700 py-2">
                                    <span className="text-2xl font-bold text-gray-400">₹</span>
                                    <input
                                        type="number"
                                        value={expenseForm.amount}
                                        onChange={e => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                                        className="w-full text-4xl font-bold bg-transparent outline-none p-0 text-gray-900 dark:text-white"
                                        placeholder="0"
                                        autoFocus
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Details</label>
                                <input
                                    type="text"
                                    placeholder="What is this for?"
                                    value={expenseForm.itemName}
                                    onChange={e => setExpenseForm({ ...expenseForm, itemName: e.target.value })}
                                    className="w-full bg-brand-light dark:bg-gray-700 p-4 rounded-xl outline-none font-bold mb-4"
                                />
                                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                    {['General', 'Food', 'Transport', 'Rent', 'Utils'].map(cat => (
                                        <button
                                            key={cat}
                                            type="button"
                                            onClick={() => setExpenseForm({ ...expenseForm, category: cat })}
                                            className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${expenseForm.category === cat ? 'bg-brand-blue text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'}`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-4">
                                <button type="button" onClick={() => setShowAddExpenseModal(false)} className="py-4 rounded-xl font-bold text-gray-500 bg-gray-100 dark:bg-gray-700">Cancel</button>
                                <button type="submit" className="py-4 rounded-xl font-bold text-white bg-brand-blue shadow-lg shadow-brand-blue/30">Save</button>
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
