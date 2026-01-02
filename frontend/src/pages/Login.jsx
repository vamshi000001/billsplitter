import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 transition-colors duration-300 relative overflow-hidden bg-gray-50 dark:bg-gray-900">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-1/2 -left-1/4 w-[1000px] h-[1000px] rounded-full bg-gradient-to-br from-blue-400/20 to-purple-500/20 blur-3xl animate-blob"></div>
                <div className="absolute -bottom-1/2 -right-1/4 w-[800px] h-[800px] rounded-full bg-gradient-to-tr from-indigo-400/20 to-pink-500/20 blur-3xl animate-blob animation-delay-2000"></div>
            </div>

            <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center relative z-10">

                {/* Branding Section - Updated for better mobile visibility */}
                <div className="space-y-6 md:space-y-8 p-4 md:p-8 text-center md:text-left">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight">
                        <span className="block text-2xl md:text-3xl font-medium text-gray-500 dark:text-gray-400 mb-2">Welcome Back to</span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">RoomSplit</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-lg mx-auto md:mx-0">
                        The premium dashboard for room admins. Manage expenses and members with zero stress.
                    </p>

                    {/* Stats - Hidden on very small screens to save space, visible on sm+ */}
                    <div className="hidden sm:grid grid-cols-2 gap-4 md:gap-6 max-w-sm mx-auto md:mx-0">
                        <div className="p-4 bg-white/60 dark:bg-gray-800/60 rounded-2xl backdrop-blur-md border border-white/20 shadow-sm">
                            <h3 className="text-xl md:text-2xl font-bold text-blue-600 dark:text-blue-400">100%</h3>
                            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 font-medium">Transparency</p>
                        </div>
                        <div className="p-4 bg-white/60 dark:bg-gray-800/60 rounded-2xl backdrop-blur-md border border-white/20 shadow-sm">
                            <h3 className="text-xl md:text-2xl font-bold text-indigo-600 dark:text-indigo-400">Zero</h3>
                            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 font-medium">Errors</p>
                        </div>
                    </div>
                </div>

                {/* Right Side Form */}
                <div className="w-full max-w-md mx-auto relative">
                    {/* Form Card */}
                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 dark:border-gray-700/50 p-6 sm:p-10 relative overflow-hidden">

                        {/* Decorative shimmer */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

                        <div className="text-center space-y-2 mb-8">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Admin Sign In</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Enter your credentials to access the panel.</p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50/80 dark:bg-red-900/30 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl text-sm font-bold flex items-center gap-2 animate-shake">
                                <span>⚠️</span> {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">Email</label>
                                <div className="relative group">
                                    <span className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-blue-500 transition-colors">✉️</span>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-11 pr-4 py-3 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:text-white font-medium"
                                        placeholder="admin@example.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">Password</label>
                                <div className="relative group">
                                    <span className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-blue-500 transition-colors">🔒</span>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-11 pr-4 py-3 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:text-white font-medium"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-4 mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-lg rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 transform hover:-translate-y-0.5 active:scale-95 transition-all"
                            >
                                Sign In
                            </button>
                        </form>

                        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700/50 flex flex-col gap-4 text-center">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                New here? <Link to="/register" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">Create Account</Link>
                            </p>
                            <Link to="/" className="text-xs font-bold text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                                ← Back to Home
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
