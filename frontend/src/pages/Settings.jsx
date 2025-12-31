import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const Settings = () => {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', content: '' });

    // Profile State
    const [profileForm, setProfileForm] = useState({
        name: user?.name || '',
        email: user?.email || ''
    });

    // Password State
    const [passwordForm, setPasswordForm] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', content: '' });
        try {
            const { data } = await api.put('/users/profile', profileForm);
            setUser({ ...user, ...data.user });
            localStorage.setItem('user', JSON.stringify({ ...user, ...data.user }));
            setMessage({ type: 'success', content: 'Profile updated successfully!' });
        } catch (err) {
            setMessage({ type: 'error', content: err.response?.data?.message || 'Failed to update profile' });
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setMessage({ type: 'error', content: 'New passwords do not match' });
            return;
        }
        setLoading(true);
        setMessage({ type: '', content: '' });
        try {
            await api.put('/users/password', {
                oldPassword: passwordForm.oldPassword,
                newPassword: passwordForm.newPassword
            });
            setMessage({ type: 'success', content: 'Password changed successfully!' });
            setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            setMessage({ type: 'error', content: err.response?.data?.message || 'Failed to change password' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans transition-colors duration-300">
            {/* Navbar */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors flex items-center gap-2">
                        <span className="text-xl">&larr;</span>
                        <span className="font-bold text-sm">Back</span>
                    </button>
                    <h1 className="text-xl font-extrabold text-gray-800 dark:text-white">Settings</h1>
                    <div className="w-8"></div> {/* Spacer for centering */}
                </div>
            </div>

            <div className="max-w-4xl mx-auto p-4 sm:p-8">
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col md:flex-row min-h-[500px]">

                    {/* Sidebar */}
                    <div className="md:w-64 bg-gray-50 dark:bg-gray-800/50 border-r border-gray-100 dark:border-gray-700 p-6">
                        <div className="flex flex-col gap-2">
                            <button
                                onClick={() => setActiveTab('profile')}
                                className={`text-left px-4 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-3 ${activeTab === 'profile' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                            >
                                <span>👤</span> Profile
                            </button>
                            <button
                                onClick={() => setActiveTab('password')}
                                className={`text-left px-4 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-3 ${activeTab === 'password' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                            >
                                <span>🔒</span> Security
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-8">
                        {message.content && (
                            <div className={`mb-6 px-4 py-3 rounded-xl border flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                                <span>{message.type === 'success' ? '✅' : '⚠️'}</span>
                                <span className="font-bold text-sm">{message.content}</span>
                            </div>
                        )}

                        {activeTab === 'profile' && (
                            <div className="animate-fade-in">
                                <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6">Edit Profile</h2>
                                <form onSubmit={handleProfileUpdate} className="space-y-6 max-w-md">
                                    <div>
                                        <label className="block text-xs font-black text-gray-500 uppercase tracking-wide mb-2">Display Name</label>
                                        <input
                                            type="text"
                                            value={profileForm.name}
                                            onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none dark:text-white font-bold"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-gray-500 uppercase tracking-wide mb-2">Email Address</label>
                                        <input
                                            type="email"
                                            value={profileForm.email}
                                            onChange={e => setProfileForm({ ...profileForm, email: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none dark:text-white font-bold"
                                        />
                                    </div>
                                    <div className="pt-4">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all disabled:opacity-50"
                                        >
                                            {loading ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {activeTab === 'password' && (
                            <div className="animate-fade-in">
                                <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6">Change Password</h2>
                                <form onSubmit={handlePasswordChange} className="space-y-6 max-w-md">
                                    <div>
                                        <label className="block text-xs font-black text-gray-500 uppercase tracking-wide mb-2">Current Password</label>
                                        <input
                                            type="password"
                                            required
                                            value={passwordForm.oldPassword}
                                            onChange={e => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none dark:text-white font-bold"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-gray-500 uppercase tracking-wide mb-2">New Password</label>
                                        <input
                                            type="password"
                                            required
                                            value={passwordForm.newPassword}
                                            onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none dark:text-white font-bold"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-gray-500 uppercase tracking-wide mb-2">Confirm New Password</label>
                                        <input
                                            type="password"
                                            required
                                            value={passwordForm.confirmPassword}
                                            onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none dark:text-white font-bold"
                                        />
                                    </div>
                                    <div className="pt-4">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all disabled:opacity-50"
                                        >
                                            {loading ? 'Updating...' : 'Update Password'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
