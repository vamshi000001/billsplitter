import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Loader2 } from 'lucide-react';

const Register = () => {
    const [roomName, setRoomName] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await register(name, email, password, roomName);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-brand-light flex flex-col items-center justify-center p-6 font-sans text-center">

            {/* Logo */}
            <div className="mb-6 animate-fade-in-down">
                <div className="inline-block p-4 bg-white rounded-3xl shadow-lg shadow-brand-blue/10">
                    <img src="/assets/logo.png" alt="Logo" className="w-16 h-16 object-contain" />
                </div>
            </div>

            {/* Header */}
            <div className="mb-8 space-y-2">
                <h2 className="text-2xl font-black text-brand-blue">Create Room</h2>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-wide">Please fill the details and create room</p>
            </div>

            {error && (
                <div className="mb-4 text-red-500 text-xs font-bold bg-red-50 p-3 rounded-xl w-full max-w-xs border border-red-100 animate-shake">
                    {error}
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="w-full max-w-xs space-y-4">

                <input
                    type="text"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    className="w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-gray-800 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 outline-none transition-all placeholder:text-gray-400 placeholder:font-medium"
                    placeholder="Room Name"
                    required
                />

                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-gray-800 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 outline-none transition-all placeholder:text-gray-400 placeholder:font-medium"
                    placeholder="Full Name"
                    required
                />

                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-gray-800 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 outline-none transition-all placeholder:text-gray-400 placeholder:font-medium"
                    placeholder="Email"
                    required
                />

                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-gray-800 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 outline-none transition-all placeholder:text-gray-400 placeholder:font-medium"
                    placeholder="Password"
                    required
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 mt-2 bg-brand-blue text-white font-bold rounded-xl shadow-lg shadow-brand-blue/30 hover:bg-blue-800 hover:shadow-brand-blue/40 transform hover:-translate-y-0.5 active:scale-95 transition-all text-sm flex items-center justify-center gap-2"
                >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {loading ? 'Creating...' : 'Create Room'}
                </button>
            </form>

            {/* Footer / Socials */}
            <div className="mt-8 space-y-6 w-full max-w-xs">
                <div className="text-xs text-center text-gray-400 flex items-center gap-2 justify-center font-medium">
                    <span className="text-gray-400">Already have an account?</span>
                    <Link to="/login" className="text-brand-orange font-bold hover:underline">Log In</Link>
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
            </div>
        </div>
    );
};

export default Register;
