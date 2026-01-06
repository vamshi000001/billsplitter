import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, Facebook, Instagram, Linkedin, Eye, EyeOff } from 'lucide-react';

const RoommateLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
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
        <div className="min-h-screen bg-brand-light flex flex-col items-center justify-center p-6 font-sans text-center">

            {/* Logo */}
            <div className="mb-8 animate-fade-in-down">
                <div className="inline-block p-4 bg-white rounded-3xl shadow-lg shadow-brand-blue/10">
                    <img src="/assets/logo.png" alt="Logo" className="w-16 h-16 object-contain" />
                </div>
            </div>

            {/* Header */}
            <div className="mb-10 space-y-2">
                <h2 className="text-2xl font-black text-brand-blue">Roommate Login</h2>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-wide">Enter a room to split bills</p>
            </div>

            {error && (
                <div className="mb-4 text-red-500 text-xs font-bold bg-red-50 p-3 rounded-xl w-full max-w-xs border border-red-100 animate-shake">
                    {error}
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="w-full max-w-xs space-y-5">

                <div className="space-y-4">
                    <div className="relative">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-gray-800 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 outline-none transition-all placeholder:text-gray-400 placeholder:font-medium"
                            placeholder="Email"
                            required
                        />
                    </div>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-gray-800 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 outline-none transition-all placeholder:text-gray-400 placeholder:font-medium pr-12"
                            placeholder="Password"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-brand-blue transition-colors"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-brand-orange text-white font-bold rounded-xl shadow-lg shadow-brand-orange/30 hover:bg-orange-600 hover:shadow-brand-orange/40 transform hover:-translate-y-0.5 active:scale-95 transition-all text-sm flex items-center justify-center gap-2"
                >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {loading ? 'Entering...' : 'Log In'}
                </button>
            </form>

            {/* Footer / Socials */}
            <div className="mt-10 space-y-6 w-full max-w-xs">
                <div className="text-xs text-center text-gray-400 flex items-center gap-2 justify-center font-medium">
                    <span className="text-gray-400">Not a roommate?</span>
                    <Link to="/login" className="text-brand-blue font-bold hover:underline">Admin Login</Link>
                </div>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-widest">
                        <span className="bg-brand-light px-2 text-gray-400">Or connect with</span>
                    </div>
                </div>

                <div className="flex justify-center gap-4">
                    <a href="#" className="p-3 rounded-full bg-white text-blue-600 shadow-sm hover:scale-110 transition-transform">
                        <Facebook className="w-5 h-5" />
                    </a>
                    <a href="https://www.instagram.com/_vamshi_yadav__001/" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-white text-pink-600 shadow-sm hover:scale-110 transition-transform">
                        <Instagram className="w-5 h-5" />
                    </a>
                    <a href="https://www.linkedin.com/in/vamshi-potharaveni-120175271/" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-white text-blue-800 shadow-sm hover:scale-110 transition-transform">
                        <Linkedin className="w-5 h-5" />
                    </a>
                </div>

                <div className="pt-4">
                    <Link to="/" className="text-xs text-gray-400 font-bold hover:text-brand-blue transition-colors">Back to Home</Link>
                </div>
            </div>
        </div>
    );
};

export default RoommateLogin;
