import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis } from 'recharts';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import StatusModal from '../components/StatusModal';
import ConfirmModal from '../components/ConfirmModal';
import DeleteRoomModal from '../components/DeleteRoomModal';
import { Bell, Settings, Home, Plus, Users, Wallet, MessageSquare, X, Check, Mail, Send, Trash2, Receipt, Calendar } from 'lucide-react';

const RoomAdminDashboard = ({ roomId }) => {
    const { user } = useAuth();
    const navigate = useNavigate();

    // State
    const [expenses, setExpenses] = useState([]);
    const [members, setMembers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [notifications, setNotifications] = useState([]);

    const [cycleSummary, setCycleSummary] = useState(null);
    const [categoryAnalytics, setCategoryAnalytics] = useState({});
    const [monthlyAnalytics, setMonthlyAnalytics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [roomTitle, setRoomTitle] = useState('');


    // Mobile Navigation State
    const [activeTab, setActiveTab] = useState('home'); // home, expense, members

    // Modal States
    const [showNotifications, setShowNotifications] = useState(false);
    const [showMessages, setShowMessages] = useState(false);
    const [expenseForm, setExpenseForm] = useState({ itemName: '', amount: '', category: 'General' });
    const [showAddExpenseModal, setShowAddExpenseModal] = useState(false); // For mobile FAB
    const [showDeleteRoomModal, setShowDeleteRoomModal] = useState(false);
    const [adding, setAdding] = useState(false); // Loading state

    const [notifyForm, setNotifyForm] = useState({ subject: '', content: '' });
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    const [sendingEmail, setSendingEmail] = useState(false);

    const [statusModal, setStatusModal] = useState({
        isOpen: false,
        status: 'success',
        title: '',
        message: ''
    });

    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => { }
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

            setRoomTitle(roomRes.data.title);
            setMembers(roomRes.data.members || []);
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
        if (adding) return;
        setAdding(true);
        try {
            await api.post(`/rooms/${roomId}/expenses`, {
                ...expenseForm,
                amount: parseFloat(expenseForm.amount)
            });
            setExpenseForm({ itemName: '', amount: '', category: 'General' });
            fetchData();
            setShowAddExpenseModal(false);
            setActiveTab('home'); // Reset to home tab after adding expense
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
        } finally {
            setAdding(false);
        }
    };

    const handleCloseCycle = async () => {
        setConfirmModal({
            isOpen: true,
            title: 'How would you like to close?',
            message: 'Choose "Expense Cycle" to start fresh but keep current payment statuses. Choose "Month Cycle" to start fresh AND reset all roommates to UNPAID.',
            icon: Settings,
            iconBg: "bg-blue-50 dark:bg-blue-900/20",
            iconColor: "text-blue-600 dark:text-blue-400",
            buttons: [
                {
                    text: 'Close Expense Cycle',
                    icon: Receipt,
                    className: 'bg-blue-500 text-white shadow-lg shadow-blue-500/30 hover:bg-blue-600',
                    onClick: async () => {
                        try {
                            await api.post(`/rooms/${roomId}/cycles/close`, { type: 'EXPENSE' });
                            toast.success("Expense cycle closed. Payments kept. 🏷️");
                            fetchData();
                        } catch { toast.error("Failed to close expense cycle"); }
                    }
                },
                {
                    text: 'Close Month Cycle',
                    icon: Calendar,
                    className: 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 hover:bg-emerald-600',
                    onClick: async () => {
                        try {
                            await api.post(`/rooms/${roomId}/cycles/close`, { type: 'MONTHLY' });
                            toast.success("New month started. All reset! 📅");
                            fetchData();
                        } catch { toast.error("Failed to close month"); }
                    }
                },
                {
                    text: 'Cancel',
                    className: 'bg-gray-100 dark:bg-gray-700 text-gray-500 font-bold',
                    onClick: () => { }
                }
            ]
        });
    };

    const handleDeleteRoom = async (password) => {
        try {
            await api.post(`/rooms/${roomId}/delete-secure`, { password });
            toast.success("Room deleted successfully. Redirecting...");
            setTimeout(() => navigate('/dashboard'), 1500);
            setShowDeleteRoomModal(false);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to delete room. Please check your password.");
            throw err; // So the modal can stop loading
        }
    };

    const handleOpenEmailModal = (member) => {
        setSelectedMember(member);
        setNotifyForm({ subject: '', content: '' });
        setShowEmailModal(true);
    };

    const handleSendEmail = async (e) => {
        e.preventDefault();
        if (sendingEmail) return;
        setSendingEmail(true);

        try {
            await api.post(`/rooms/${roomId}/notify`, {
                recipientIds: [selectedMember.userId],
                subject: notifyForm.subject,
                content: notifyForm.content
            });
            toast.success(`Email sent to ${selectedMember.user.name}`);
            setShowEmailModal(false);
        } catch (error) {
            console.error(error);
            toast.error("Failed to send email");
        } finally {
            setSendingEmail(false);
        }
    };

    const handleMarkAsPaid = async (memberId, memberName) => {
        setConfirmModal({
            isOpen: true,
            title: 'Confirm Payment?',
            message: `Are you sure you want to mark ${memberName} as paid for this cycle?`,
            icon: Check,
            iconColor: "text-emerald-600 dark:text-emerald-400",
            iconBg: "bg-emerald-50 dark:bg-emerald-900/20",
            buttons: [
                {
                    text: 'Paid',
                    className: 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 hover:bg-emerald-600',
                    onClick: async () => {
                        try {
                            await api.patch(`/rooms/${roomId}/members/${memberId}/payment`, { status: "PAID" });
                            toast.success(`${memberName} marked as paid`);
                            fetchData();
                        } catch (error) {
                            console.error(error);
                            toast.error("Failed to update payment status");
                        }
                    }
                },
                {
                    text: 'Cancel',
                    className: 'bg-gray-100 dark:bg-gray-700 text-gray-500 font-bold',
                    onClick: () => { }
                }
            ]
        });
    };

    const handleRemoveMember = async (memberId, memberName) => {
        setConfirmModal({
            isOpen: true,
            title: 'Remove Roommate?',
            message: `Are you sure you want to remove ${memberName}? This will delete all their data from this room.`,
            onConfirm: async () => {
                try {
                    await api.delete(`/rooms/${roomId}/members/${memberId}`);
                    toast.success(`${memberName} removed from room`);
                    fetchData();
                } catch (error) {
                    console.error(error);
                    toast.error("Failed to remove member");
                }
            }
        });
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="w-10 h-10 border-4 border-brand-blue border-t-transparent rounded-full animate-spin"></div></div>;

    const unreadMessagesCount = messages.filter(m => m.status === 'OPEN').length;

    return (
        <div className="min-h-screen bg-brand-light dark:bg-gray-900 pb-24 font-sans text-gray-800 dark:text-gray-100">

            {activeTab === 'home' && (
                <div className="animate-fade-in-down">
                    {/* Top Header Section (Mobile App Style) */}
                    <div className="bg-white dark:bg-gray-800 px-6 pt-12 pb-6 shadow-sm rounded-b-3xl mb-6">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-brand-blue font-bold text-lg border-2 border-blue-100 uppercase">
                                    {user?.name?.charAt(0) || 'A'}
                                </div>
                                <div>
                                    <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">Welcome back,</p>
                                    <h1 className="text-xl font-bold text-gray-900 dark:text-white capitalize">{user?.name}</h1>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <button className="relative" onClick={() => setShowMessages(true)}>
                                    <MessageSquare className="w-6 h-6 text-gray-400" />
                                    {unreadMessagesCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-orange text-[10px] text-white flex items-center justify-center rounded-full border-2 border-white">{unreadMessagesCount}</span>}
                                </button>
                                <button className="relative" onClick={() => setShowNotifications(true)}>
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

                    {/* Quick Actions */}
                    <div className="px-6 mb-6 grid grid-cols-2 gap-3">
                        <button
                            onClick={handleCloseCycle}
                            className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center gap-2 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors group"
                        >
                            <div className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-full group-hover:scale-110 transition-transform">
                                <Wallet className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Close Cycle</span>
                        </button>
                        <button
                            onClick={() => { setActiveTab('members'); }}
                            className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center gap-2 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors group"
                        >
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-brand-blue rounded-full group-hover:scale-110 transition-transform">
                                <Mail className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Email All</span>
                        </button>
                    </div>

                    <div className="px-6 space-y-6 pb-24">
                        {/* Analytics Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {/* Category Pie Chart */}
                            <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <h3 className="font-bold text-gray-900 dark:text-white mb-4">Spending by Category</h3>
                                <div className="h-48 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={Object.entries(categoryAnalytics).map(([name, value]) => ({ name, value }))}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={40}
                                                outerRadius={60}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {Object.entries(categoryAnalytics).map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6'][index % 5]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Monthly Bar Chart */}
                            <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <h3 className="font-bold text-gray-900 dark:text-white mb-4">Monthly Trends</h3>
                                <div className="h-48 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={monthlyAnalytics}>
                                            <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                                            <Tooltip cursor={{ fill: 'transparent' }} />
                                            <Bar dataKey="total" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                        {/* Recent Expenses List */}
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-gray-900 dark:text-white text-lg">Recent Expenses</h3>
                                <button className="text-brand-blue text-xs font-bold hover:underline">View All</button>
                            </div>
                            <div className="space-y-3">
                                {expenses.length === 0 ? (
                                    <p className="text-gray-400 text-sm text-center py-4">No expenses recorded yet.</p>
                                ) : (
                                    expenses.slice(0, 5).map(exp => (
                                        <div key={exp.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-50 dark:border-gray-700 flex justify-between items-center">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-xl">
                                                    {exp.category === 'Food' ? '🍕' :
                                                        exp.category === 'Transport' ? '🚕' :
                                                            exp.category === 'Rent' ? '🏠' :
                                                                exp.category === 'Utils' ? '💡' : '🛍️'}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 dark:text-white text-sm">{exp.itemName}</p>
                                                    <p className="text-xs text-gray-400">{exp.addedBy?.name} • {new Date(exp.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <span className="font-bold text-gray-900 dark:text-white">₹{exp.amount}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                        {/* Danger Zone */}
                        <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-700">
                            <h3 className="text-sm font-black text-red-500 uppercase tracking-widest mb-4 px-2">Danger Zone</h3>
                            <div className="bg-red-50/50 dark:bg-red-900/10 p-6 rounded-[2rem] border border-red-100 dark:border-red-900/20">
                                <p className="text-xs text-red-600 dark:text-red-400 font-bold mb-4">
                                    Permanently delete this room and all its data. This action is irreversible.
                                </p>
                                <button
                                    onClick={() => setShowDeleteRoomModal(true)}
                                    className="w-full flex items-center justify-center gap-2 py-4 bg-white dark:bg-gray-800 text-red-500 border-2 border-red-100 dark:border-red-800 rounded-2xl font-black shadow-sm hover:bg-red-50 dark:hover:bg-red-900/40 transition-all active:scale-95"
                                >
                                    <Trash2 className="w-5 h-5" />
                                    Delete This Room
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Members Tab Content */}
            {
                activeTab === 'members' && (
                    <div className="px-5 pb-24 animate-slide-up-mobile">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-xl">Roommates</h3>
                        <div className="space-y-4">
                            {members.map(member => (
                                <div key={member.id} className="bg-white dark:bg-gray-800 p-5 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:shadow-md transition-all duration-300">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400 font-black text-xl border-4 border-white dark:border-gray-700 shadow-sm">
                                            {member.user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                                <span className="truncate">{member.user.name}</span>
                                                {member.user.id === user.id && (
                                                    <span className="text-[10px] bg-blue-50 dark:bg-blue-900/30 text-brand-blue dark:text-blue-400 px-2 py-0.5 rounded-full uppercase tracking-tighter">You</span>
                                                )}
                                            </h4>
                                            <p className="text-xs text-gray-400 dark:text-gray-500 font-medium truncate">{member.user.email}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between sm:justify-end gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-50 dark:border-gray-700/50">
                                        <div className="flex flex-col items-start sm:items-end">
                                            <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-sm ${member.paymentStatus === 'PAID' ? 'bg-emerald-500 text-white' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'}`}>
                                                {member.paymentStatus}
                                            </span>
                                        </div>

                                        <div className="flex gap-2">
                                            {member.paymentStatus === 'UNPAID' && (
                                                <button
                                                    onClick={() => handleMarkAsPaid(member.userId, member.user.name)}
                                                    className="p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-2xl hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-all active:scale-95"
                                                    title="Mark as Paid"
                                                >
                                                    <Check className="w-5 h-5" />
                                                </button>
                                            )}
                                            {member.userId !== user.id && (
                                                <>
                                                    <button
                                                        onClick={() => handleOpenEmailModal(member)}
                                                        className="p-3 bg-blue-50 dark:bg-blue-900/20 text-brand-blue dark:text-blue-400 rounded-2xl hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all active:scale-95"
                                                        title="Email Member"
                                                    >
                                                        <Mail className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleRemoveMember(member.userId, member.user.name)}
                                                        className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl hover:bg-red-100 dark:hover:bg-red-900/40 transition-all active:scale-95"
                                                        title="Remove Member"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => navigate(`/rooms/${roomId}/add-member`)}
                            className="w-full mt-6 py-4 bg-gray-100 dark:bg-gray-800 text-gray-500 font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                            <span>Invite New Member</span>
                        </button>
                    </div>
                )
            }


            {/* Email Modal */}
            {
                showEmailModal && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-3xl p-6 animate-scale-up">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Email {selectedMember?.user.name}</h3>
                                <button onClick={() => setShowEmailModal(false)}><X className="text-gray-400" /></button>
                            </div>

                            <form onSubmit={handleSendEmail} className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Subject</label>
                                    <input
                                        type="text"
                                        value={notifyForm.subject}
                                        onChange={e => setNotifyForm({ ...notifyForm, subject: e.target.value })}
                                        className="w-full bg-gray-50 dark:bg-gray-700 p-3 rounded-xl outline-none font-medium text-gray-900 dark:text-white border border-gray-100 dark:border-gray-600 focus:border-brand-blue"
                                        placeholder="Important Update..."
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Message</label>
                                    <textarea
                                        value={notifyForm.content}
                                        onChange={e => setNotifyForm({ ...notifyForm, content: e.target.value })}
                                        className="w-full bg-gray-50 dark:bg-gray-700 p-3 rounded-xl outline-none font-medium text-gray-900 dark:text-white border border-gray-100 dark:border-gray-600 focus:border-brand-blue min-h-[120px]"
                                        placeholder="Type your message here..."
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={sendingEmail}
                                    className={`w-full py-4 rounded-xl font-bold text-white shadow-lg shadow-brand-blue/30 flex justify-center items-center gap-2 ${sendingEmail ? 'bg-brand-blue/70 cursor-not-allowed' : 'bg-brand-blue hover:bg-blue-600'}`}
                                >
                                    {sendingEmail ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            <span>Sending...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5" />
                                            <span>Send Email</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                )
            }

            {/* Mobile Bottom Navigation (Fixed) */}
            <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 pb-safe pt-2 px-6 safe-area-bottom z-50">
                <div className="flex justify-between items-center py-3">
                    <button onClick={() => { setActiveTab('home'); setShowAddExpenseModal(false); }} className={`flex flex-col items-center gap-1 ${activeTab === 'home' ? 'text-brand-blue' : 'text-gray-400'}`}>
                        <Home className="w-6 h-6" fill={activeTab === 'home' ? "currentColor" : "none"} />
                    </button>

                    <button onClick={() => { setActiveTab('members'); setShowAddExpenseModal(false); }} className={`flex flex-col items-center gap-1 ${activeTab === 'members' ? 'text-brand-blue' : 'text-gray-400'}`}>
                        <Users className="w-6 h-6" fill={activeTab === 'members' ? "currentColor" : "none"} />
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
            {
                showAddExpenseModal && (
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
                                    <button
                                        type="submit"
                                        disabled={adding}
                                        className={`py-4 rounded-xl font-bold text-white shadow-lg shadow-brand-blue/30 flex justify-center items-center gap-2 ${adding ? 'bg-brand-blue/70 cursor-not-allowed' : 'bg-brand-blue'}`}
                                    >
                                        {adding ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                <span>Adding...</span>
                                            </>
                                        ) : (
                                            'Save'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }

            <StatusModal
                isOpen={statusModal.isOpen}
                onClose={() => setStatusModal(prev => ({ ...prev, isOpen: false }))}
                status={statusModal.status}
                title={statusModal.title}
                message={statusModal.message}
            />

            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                onConfirm={confirmModal.onConfirm}
                title={confirmModal.title}
                message={confirmModal.message}
                buttons={confirmModal.buttons}
                icon={confirmModal.icon}
                iconColor={confirmModal.iconColor}
                iconBg={confirmModal.iconBg}
            />

            {/* Messages Drawer */}
            {
                showMessages && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-end">
                        <div className="w-full sm:w-96 bg-white dark:bg-gray-800 h-full p-6 shadow-2xl animate-slide-in-right overflow-y-auto">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Messages</h3>
                                <button onClick={() => setShowMessages(false)}><X className="text-gray-400" /></button>
                            </div>
                            <div className="space-y-4">
                                {messages.length === 0 ? <p className="text-gray-400 text-center mt-10">No messages yet.</p> : messages.map(msg => (
                                    <div key={msg.id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl border border-gray-100 dark:border-gray-600">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="font-bold text-sm text-brand-blue dark:text-blue-300">{msg.sender?.name || 'Member'}</span>
                                            <span className="text-[10px] text-gray-400">{new Date(msg.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">{msg.content}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Notifications Drawer */}
            {
                showNotifications && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-end">
                        <div className="w-full sm:w-96 bg-white dark:bg-gray-800 h-full p-6 shadow-2xl animate-slide-in-right overflow-y-auto">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Notifications</h3>
                                <button onClick={() => setShowNotifications(false)}><X className="text-gray-400" /></button>
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

            <DeleteRoomModal
                isOpen={showDeleteRoomModal}
                onClose={() => setShowDeleteRoomModal(false)}
                onConfirm={handleDeleteRoom}
                roomTitle={roomTitle}
            />
        </div >
    );
};

export default RoomAdminDashboard;
