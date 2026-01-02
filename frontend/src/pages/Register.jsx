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
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 transition-colors duration-300 relative overflow-hidden bg-gray-50 dark:bg-gray-900">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-1/4 -right-1/4 w-[1200px] h-[1200px] rounded-full bg-gradient-to-bl from-blue-400/20 to-teal-400/20 blur-3xl animate-blob"></div>
                <div className="absolute -bottom-1/4 -left-1/4 w-[1000px] h-[1000px] rounded-full bg-gradient-to-tr from-purple-400/20 to-indigo-500/20 blur-3xl animate-blob animation-delay-2000"></div>
            </div>

            <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center relative z-10">

                {/* Left Side Branding */}
                <div className="space-y-6 md:space-y-8 p-4 md:p-8 text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight">
                        <span className="block text-xl md:text-2xl font-medium text-blue-600 dark:text-blue-400 mb-2">Start your journey</span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500">To Better Living</span>
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-lg mx-auto md:mx-0">
                        Create your room in seconds. Invite roommates, add bills, and let us handle the math.
                    </p>

                    {/* Feature Cards - visible on small screens now */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto md:mx-0">
                        <div className="flex items-center gap-3 p-4 bg-white/60 dark:bg-gray-800/60 rounded-2xl backdrop-blur-md border border-white/20 shadow-sm text-left">
                            <span className="text-2xl">⚡</span>
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white text-sm">Quick Setup</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Ready in 2 mins</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-white/60 dark:bg-gray-800/60 rounded-2xl backdrop-blur-md border border-white/20 shadow-sm text-left">
                            <span className="text-2xl">🔒</span>
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white text-sm">Secure</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Private & Safe</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side Form */}
                <div className="w-full max-w-md mx-auto relative">
                    {/* Form Card */}
                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 dark:border-gray-700/50 p-6 sm:p-10 relative overflow-hidden">

                        {/* Decorative shimmer */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-teal-500"></div>

                        <div className="text-center space-y-2 mb-8">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Create Account</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Become an efficient Room Admin today.</p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50/80 dark:bg-red-900/30 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl text-sm font-bold flex items-center gap-2 animate-shake">
                                <span>⚠️</span> {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">Room Name</label>
                                <input
                                    type="text"
                                    value={roomName}
                                    onChange={(e) => setRoomName(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:text-white font-medium placeholder:text-gray-400"
                                    placeholder="e.g. The Penthouse"
                                    required
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">Full Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:text-white font-medium placeholder:text-gray-400"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:text-white font-medium placeholder:text-gray-400"
                                    placeholder="john@example.com"
                                    required
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:text-white font-medium placeholder:text-gray-400"
                                    placeholder="Create a strong password"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-4 mt-4 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white font-bold text-lg rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 transform hover:-translate-y-0.5 active:scale-95 transition-all"
                            >
                                Create Account
                            </button>
                        </form>

                        <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700/50 flex flex-col gap-2 text-center">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Already have an account? <Link to="/login" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">Sign In</Link>
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

export default Register;
