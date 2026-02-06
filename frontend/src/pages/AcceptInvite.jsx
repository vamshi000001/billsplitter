import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import { Eye, EyeOff } from 'lucide-react';
// import { useAuth } from '../context/AuthContext';

const AcceptInvite = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();
    // const { } = useAuth(); // Unused

    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [name, setName] = useState(''); // Allow editing name
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!token) {
            setError('Invalid invite link. Missing token.');
        }
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        setLoading(true);
        try {
            const res = await api.post('/auth/accept-invite', {
                token,
                password,
                name: name || undefined // Only send if set
            });

            // Auto login or redirect
            // If backend returns token, we can auto-login
            if (res.data.token) {
                // Manually set token/user in localStorage and AuthContext if possible, 
                // or just alert and redirect to login
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user', JSON.stringify(res.data.user));
                localStorage.setItem('loginType', 'ROOMMATE');
                // Reload to pick up auth state or just go to dashboard
                window.location.href = '/dashboard';
            } else {
                alert('Account activated! You can now login.');
                navigate('/login');
            }

        } catch (err) {
            setError(err.response?.data?.message || 'Failed to activate account');
        } finally {
            setLoading(false);
        }
    };

    if (!token) return <div className="text-center p-10 text-red-500 font-bold">Invalid Token</div>;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4 transition-all duration-300">
            <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-2xl border border-white/20 backdrop-blur-sm transform transition-all hover:scale-[1.01]">
                <div className="text-center mb-8">
                    <span className="text-5xl block mb-2">🎉</span>
                    <h2 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">Welcome Aboard!</h2>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">Set your password to join the room and start splitting.</p>
                </div>

                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm font-bold mb-6 flex items-center gap-2 animate-pulse">
                        ⚠️ {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1 mb-1">Display Name (Optional)</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none dark:text-white font-bold transition-all placeholder:font-normal placeholder:text-gray-400"
                            placeholder="e.g. John Doe"
                        />
                    </div>
                    <div className="relative">
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1 mb-1">New Password</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none dark:text-white font-bold transition-all placeholder:font-normal placeholder:text-gray-400 pr-12"
                            placeholder="••••••••"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-[34px] text-gray-400 hover:text-brand-blue transition-colors"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                    <div className="relative">
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1 mb-1">Confirm Password</label>
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none dark:text-white font-bold transition-all placeholder:font-normal placeholder:text-gray-400 pr-12"
                            placeholder="••••••••"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-4 top-[34px] text-gray-400 hover:text-brand-blue transition-colors"
                        >
                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-lg rounded-xl shadow-lg shadow-blue-500/30 transform hover:-translate-y-0.5 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <span>🚀</span> Join Room
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AcceptInvite;
