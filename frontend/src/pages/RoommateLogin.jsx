import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const RoommateLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { loginRoommate } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await loginRoommate(email.trim(), password.trim());
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 transition-colors duration-300 relative overflow-hidden bg-gray-50 dark:bg-gray-900">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-1/2 -right-1/4 w-[1000px] h-[1000px] rounded-full bg-gradient-to-bl from-purple-400/20 to-pink-500/20 blur-3xl animate-blob"></div>
                <div className="absolute -bottom-1/2 -left-1/4 w-[800px] h-[800px] rounded-full bg-gradient-to-tr from-yellow-400/20 to-orange-500/20 blur-3xl animate-blob animation-delay-2000"></div>
            </div>

            <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center relative z-10">

                {/* Left Side Content - Improved Layout */}
                <div className="space-y-6 md:space-y-8 p-4 md:p-8 text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight">
                        <span className="block text-xl md:text-2xl font-medium text-purple-600 dark:text-purple-400 mb-2">Roommate Portal</span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600">Track Expenses & Split Bills</span>
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-lg mx-auto md:mx-0">
                        Join your room to check your dues, see new expenses, and settle up instantly.
                    </p>

                    {/* Avatars - Visible on all screens now but optimized */}
                    <div className="flex items-center justify-center md:justify-start gap-4 p-4 bg-white/40 dark:bg-gray-800/40 rounded-2xl backdrop-blur-sm border border-white/20 inline-flex">
                        <div className="flex -space-x-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white dark:border-gray-900 shadow-sm"></div>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border-2 border-white dark:border-gray-900 shadow-sm"></div>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 border-2 border-white dark:border-gray-900 shadow-sm"></div>
                        </div>
                        <p className="text-sm font-bold text-gray-600 dark:text-gray-400">Join the squad</p>
                    </div>
                </div>

                {/* Right Side Form */}
                <div className="w-full max-w-md mx-auto relative">
                    {/* Form Card */}
                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 dark:border-gray-700/50 p-6 sm:p-10 relative overflow-hidden">

                        {/* Decorative shimmer */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500"></div>

                        <div className="text-center space-y-2 mb-8">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Member Login</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Not an admin? You're in the right place.</p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50/80 dark:bg-red-900/30 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl text-sm font-bold flex items-center gap-2 animate-shake">
                                <span>⚠️</span> {error}
                            </div>
                        )}

                        <form className="space-y-5" onSubmit={handleSubmit}>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">Email</label>
                                <div className="relative group">
                                    <span className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-purple-500 transition-colors">✉️</span>
                                    <input
                                        name="email"
                                        type="email"
                                        required
                                        className="w-full pl-11 pr-4 py-3 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all dark:text-white font-medium"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">Password</label>
                                <div className="relative group">
                                    <span className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-purple-500 transition-colors">🔒</span>
                                    <input
                                        name="password"
                                        type="password"
                                        required
                                        className="w-full pl-11 pr-4 py-3 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all dark:text-white font-medium"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 mt-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-lg rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-purple-500/40 transform hover:-translate-y-0.5 active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Signing In...' : 'Enter Room'}
                            </button>

                            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700/50 flex flex-col gap-3 text-center">
                                <Link to="/login" className="w-full py-3 border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-xl font-bold text-gray-500 hover:text-purple-600 hover:border-purple-300 dark:hover:text-purple-400 transition-all text-sm">
                                    Switch to Admin Login
                                </Link>

                                <Link to="/" className="text-xs font-bold text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors mt-2">
                                    ← Back to Home
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default RoommateLogin;
