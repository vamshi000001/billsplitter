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
            // Backend returns { message: ... }
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 p-4 transition-colors duration-300">
            <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

                {/* Left Side Branding */}
                <div className="hidden md:block space-y-8 p-8">
                    <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white leading-tight">
                        Manage your rooms<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">like a Pro.</span>
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                        The ultimate dashboard for room administrators. Track payments, manage members, and generate reports with ease.
                    </p>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-2xl backdrop-blur-sm border border-white/20">
                            <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400">100%</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Transparency</p>
                        </div>
                        <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-2xl backdrop-blur-sm border border-white/20">
                            <h3 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">Zero</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Calculator Errors</p>
                        </div>
                    </div>
                </div>

                {/* Right Side Form */}
                <div className="w-full max-w-md mx-auto p-8 sm:p-10 space-y-8 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-white/20 backdrop-blur-sm">
                    <div className="text-center space-y-2">
                        <span className="text-4xl">👑</span>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Login</h2>
                        <p className="text-gray-500 dark:text-gray-400">Welcome back! Manage your rooms.</p>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium animate-pulse">
                            ⚠️ {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6" style={{ textAlign: 'left' }}>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ml-1">Email Address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-5 py-3 border border-gray-200 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    placeholder="admin@example.com"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ml-1">Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-5 py-3 border border-gray-200 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
                        >
                            Sign In
                        </button>
                    </form>

                    <div className="text-center space-y-4 text-sm">
                        <p className="text-gray-600 dark:text-gray-400">
                            Don't have a room? <Link to="/register" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">Create Account</Link>
                        </p>
                        <Link to="/" className="inline-block text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors">
                            &larr; Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
