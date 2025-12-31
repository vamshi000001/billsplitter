import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const RoommateLogin = () => {
    // roomName state removed
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
            // Updated call: removed roomName
            await loginRoommate(email.trim(), password.trim());
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 p-4 transition-colors duration-300">
            <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

                {/* Left Side Content - The Space Left of the Form */}
                <div className="hidden md:block space-y-8 p-8">
                    <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white leading-tight">
                        Welcome back,<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Roommate!</span>
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                        Track expenses, settle debts, and keep your shared living space harmonious.
                        Login now to see what's new in your room.
                    </p>
                    <div className="flex items-center gap-4">
                        <div className="flex -space-x-4">
                            <div className="w-12 h-12 rounded-full bg-blue-500 border-2 border-white dark:border-gray-900"></div>
                            <div className="w-12 h-12 rounded-full bg-green-500 border-2 border-white dark:border-gray-900"></div>
                            <div className="w-12 h-12 rounded-full bg-yellow-500 border-2 border-white dark:border-gray-900"></div>
                        </div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Join thousands of happy roommates</p>
                    </div>
                </div>

                {/* Right Side Form */}
                <div className="w-full max-w-md mx-auto p-8 sm:p-10 space-y-8 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-white/20 backdrop-blur-sm">
                    <div className="text-center space-y-2">
                        <span className="text-4xl">👋</span>
                        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                            Roommate Login
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Join your roommates and split bills.
                        </p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
                        {error && (
                            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm font-medium animate-pulse" role="alert">
                                ⚠️ {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ml-1">Email Address</label>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    className="w-full px-5 py-3 border border-gray-200 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ml-1">Password</label>
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    className="w-full px-5 py-3 border border-gray-200 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Signing In...' : 'Enter Room'}
                        </button>

                        <div className="flex flex-col items-center gap-3 mt-4">
                            <Link to="/login" className="w-full py-3 text-center border-2 border-gray-200 dark:border-gray-600 rounded-xl font-bold text-gray-600 dark:text-gray-300 hover:border-purple-500 hover:text-purple-600 dark:hover:text-purple-400 transition-all">
                                Admin Login
                            </Link>

                            <Link to="/" className="font-medium text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                                Back to Home
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};


export default RoommateLogin;
