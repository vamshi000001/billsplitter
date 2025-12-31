import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const AddRoommate = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', email: '' }); // Removed password
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await api.post(`/rooms/${id}/members`, form);
            alert('Roommate added! Welcome email sent with their credentials.');
            navigate(`/rooms/${id}`);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add roommate');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4 font-sans">
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-200 dark:bg-purple-900/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-200 dark:bg-blue-900/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
            </div>

            <div className="max-w-md w-full relative">
                <button
                    onClick={() => navigate(`/rooms/${id}`)}
                    className="absolute -top-12 left-0 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white font-bold flex items-center gap-2 transition-colors"
                >
                    <span>&larr;</span> Back to Dashboard
                </button>

                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/50 dark:border-gray-700 transform hover:scale-[1.01] transition-transform duration-300">
                    <div className="flex items-center gap-4 mb-8 border-b border-gray-100 dark:border-gray-700 pb-6">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-2xl text-white shadow-lg shadow-green-500/30">
                            📧
                        </div>
                        <div>
                            <h2 className="text-2xl font-extrabold text-gray-800 dark:text-white tracking-tight">Invite Roommate</h2>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">Expand your squad</p>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl mb-6 flex items-center gap-3">
                            <span className="text-lg">⚠️</span>
                            <span className="font-bold text-sm">{error}</span>
                        </div>
                    )}

                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-4 mb-6">
                        <p className="text-sm text-blue-800 dark:text-blue-300 flex gap-3">
                            <span className="text-xl">ℹ️</span>
                            <span className="leading-snug">
                                We'll create their account with a <strong>Default Password</strong> (Room Name) and email them the details.
                            </span>
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-bold text-gray-900 dark:text-gray-100 mb-2 ml-1">Full Name</label>
                            <input
                                type="text"
                                required
                                value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })}
                                className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all text-gray-900 font-bold placeholder:text-gray-500"
                                placeholder="e.g. Jane Doe"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-900 dark:text-gray-100 mb-2 ml-1">Email Address</label>
                            <input
                                type="email"
                                required
                                value={form.email}
                                onChange={e => setForm({ ...form, email: e.target.value })}
                                className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all text-gray-900 font-bold placeholder:text-gray-500"
                                placeholder="jane@example.com"
                            />
                        </div>

                        <div className="pt-6 flex gap-3">
                            <button
                                type="button"
                                onClick={() => navigate(`/rooms/${id}`)}
                                className="flex-1 py-3.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-bold rounded-xl transition-all hover:bg-gray-200 dark:hover:bg-gray-600"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-[2] py-3.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transform hover:-translate-y-0.5 active:scale-95 transition-all disabled:opacity-50 disabled:transform-none"
                            >
                                {loading ? 'Sending Invite...' : 'Send Invite 🚀'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
export default AddRoommate;
