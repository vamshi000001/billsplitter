import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { Lock, ArrowLeft, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const navigate = useNavigate();

    const token = new URLSearchParams(window.location.search).get('token');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!token) return toast.error("Invalid or missing reset token");
        if (password.length < 8) return toast.error("Password must be at least 8 characters");
        if (password !== confirmPassword) return toast.error("Passwords do not match");

        setLoading(true);
        try {
            const response = await axios.post('/auth/reset-password', { token, newPassword: password });
            toast.success(response.data.message || "Password reset successfully!");
            setIsSubmitted(true);
        } catch (error) {
            const message = error.response?.data?.message || "Something went wrong";
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-brand-light flex items-center justify-center p-6 font-sans">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 relative overflow-hidden">
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-blue/5 rounded-full blur-3xl"></div>

                <Link to="/login" className="inline-flex items-center text-sm font-bold text-gray-400 hover:text-brand-blue transition-colors mb-8 group">
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Login
                </Link>

                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-100">
                        <Lock className="w-8 h-8 text-brand-blue" />
                    </div>
                    <h1 className="text-2xl font-black text-gray-900 mb-2">Reset Password</h1>
                    <p className="text-sm text-gray-500 font-medium">
                        Set a new password for your account.
                    </p>
                </div>

                {!isSubmitted ? (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">New Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-brand-blue transition-colors" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter new password"
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-brand-blue focus:bg-white rounded-2xl outline-none font-bold transition-all text-gray-900"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Confirm Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-brand-blue transition-colors" />
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm new password"
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-brand-blue focus:bg-white rounded-2xl outline-none font-bold transition-all text-gray-900"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-4 rounded-2xl font-black text-white shadow-lg shadow-brand-blue/30 flex items-center justify-center gap-2 transition-all active:scale-95 ${loading ? 'bg-brand-blue/70 cursor-not-allowed' : 'bg-brand-blue hover:bg-blue-600'
                                }`}
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                'Reset Password'
                            )}
                        </button>
                    </form>
                ) : (
                    <div className="text-center animate-in fade-in zoom-in duration-500">
                        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100">
                            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Password Updated!</h2>
                        <p className="text-sm text-gray-500 font-medium mb-8">
                            Your password has been reset. You can now sign in.
                        </p>
                        <button
                            onClick={() => navigate('/login')}
                            className="w-full py-4 rounded-2xl bg-brand-orange text-white font-black shadow-lg shadow-brand-orange/30 active:scale-95 transition-all"
                        >
                            Back to Login
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResetPassword;
