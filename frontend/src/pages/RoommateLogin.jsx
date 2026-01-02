import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, Settings, Facebook, Instagram, Linkedin } from 'lucide-react';

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
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 font-sans text-center">

            {/* Logo */}
            <div className="mb-8">
                <div className="inline-block p-4">
                    <Settings className="w-12 h-12 text-blue-900" />
                </div>
            </div>

            {/* Header */}
            <div className="mb-10 space-y-2">
                <h2 className="text-2xl font-bold text-blue-900">Roommate Login</h2>
                <p className="text-gray-400 text-xs">Enter a room to split bills</p>
            </div>

            {error && (
                <div className="mb-4 text-red-500 text-xs font-semibold bg-red-50 p-2 rounded w-full max-w-xs">
                    {error}
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="w-full max-w-xs space-y-5">

                <div className="space-y-4">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-5 py-4 bg-transparent border border-gray-300 rounded-2xl text-sm focus:border-blue-900 focus:ring-0 outline-none transition-all placeholder:text-gray-400 text-gray-800"
                        placeholder="Email"
                        required
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-5 py-4 bg-transparent border border-gray-300 rounded-2xl text-sm focus:border-blue-900 focus:ring-0 outline-none transition-all placeholder:text-gray-400 text-gray-800"
                        placeholder="Password"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-blue-900 text-white font-bold rounded-xl shadow-lg hover:bg-blue-800 transition-all text-sm flex items-center justify-center gap-2"
                >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {loading ? 'Entering...' : 'Log In'}
                </button>
            </form>

            {/* Footer / Socials */}
            <div className="mt-10 space-y-6 w-full max-w-xs">
                <div className="text-xs text-center text-gray-400 flex items-center gap-2 justify-center">
                    <span className="text-gray-400">Not a roommate?</span>
                    <Link to="/login" className="text-blue-900 font-bold hover:underline">Admin Login</Link>
                </div>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-100"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-gray-400">Or connect with</span>
                    </div>
                </div>

                <div className="flex justify-center gap-4">
                    <a href="#" className="p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
                        <Facebook className="w-5 h-5" />
                    </a>
                    <a href="https://www.instagram.com/_vamshi_yadav__001/" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-pink-50 text-pink-600 hover:bg-pink-100 transition-colors">
                        <Instagram className="w-5 h-5" />
                    </a>
                    <a href="https://www.linkedin.com/in/vamshi-potharaveni-120175271/" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-blue-50 text-blue-800 hover:bg-blue-100 transition-colors">
                        <Linkedin className="w-5 h-5" />
                    </a>
                </div>

                <div className="pt-4">
                    <Link to="/" className="text-xs text-gray-300 hover:text-gray-500">Back to Home</Link>
                </div>
            </div>
        </div>
    );
};

export default RoommateLogin;
