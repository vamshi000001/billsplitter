import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [roomName, setRoomName] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(name, email, password, roomName);
            // After register, redirect to login? Or auto login?
            // Usually redirect to login
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 p-4 transition-colors duration-300">
            <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

                {/* Left Side Branding */}
                <div className="hidden md:block space-y-8 p-8">
                    <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white leading-tight">
                        Start your journey<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">to better living.</span>
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                        Create an account to set up your room, invite members, and start tracking shared expenses effortlessly.
                    </p>
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-4 p-4 bg-white/50 dark:bg-gray-800/50 rounded-2xl backdrop-blur-sm border border-white/20">
                            <span className="text-2xl">⚡</span>
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white">Quick Setup</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Get your room ready in under 2 minutes</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 bg-white/50 dark:bg-gray-800/50 rounded-2xl backdrop-blur-sm border border-white/20">
                            <span className="text-2xl">🔒</span>
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white">Secure & Private</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Your data is safe with us</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side Form */}
                <div className="w-full max-w-md mx-auto p-8 sm:p-10 space-y-8 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-white/20 backdrop-blur-sm">
                    <div className="text-center space-y-2">
                        <span className="text-4xl">🚀</span>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Create Account</h2>
                        <p className="text-gray-500 dark:text-gray-400">Start managing your shared expenses.</p>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium animate-pulse">
                            ⚠️ {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5" style={{ textAlign: 'left' }}>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ml-1">Room Name</label>
                            <input
                                type="text"
                                value={roomName}
                                onChange={(e) => setRoomName(e.target.value)}
                                className="w-full px-5 py-3 border border-gray-200 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                placeholder="My Awesome Apartment"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ml-1">Full Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-5 py-3 border border-gray-200 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                placeholder="John Doe"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ml-1">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-5 py-3 border border-gray-200 dark:border-gray-600 rounded-xl dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                placeholder="john@example.com"
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
                                placeholder="Create a strong password"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
                        >
                            Register
                        </button>
                    </form>

                    <div className="text-center space-y-4 text-sm">
                        <p className="text-gray-600 dark:text-gray-400">
                            Already have an account? <Link to="/login" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">Sign In</Link>
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

export default Register;
