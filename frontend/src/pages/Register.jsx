import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Settings, Facebook, Twitter, Linkedin } from 'lucide-react';

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
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 font-sans text-center">

            {/* Logo */}
            <div className="mb-6">
                <div className="inline-block p-4">
                    <Settings className="w-12 h-12 text-blue-900" />
                </div>
            </div>

            {/* Header */}
            <div className="mb-8 space-y-2">
                <h2 className="text-2xl font-bold text-blue-900">Sign Up Now</h2>
                <p className="text-gray-400 text-xs">Please fill the details and create account</p>
            </div>

            {error && (
                <div className="mb-4 text-red-500 text-xs font-semibold bg-red-50 p-2 rounded w-full max-w-xs">
                    {error}
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="w-full max-w-xs space-y-4">

                <input
                    type="text"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    className="w-full px-5 py-4 bg-transparent border border-gray-300 rounded-2xl text-sm focus:border-blue-900 focus:ring-0 outline-none transition-all placeholder:text-gray-400 text-gray-800"
                    placeholder="Room Name"
                    required
                />

                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-5 py-4 bg-transparent border border-gray-300 rounded-2xl text-sm focus:border-blue-900 focus:ring-0 outline-none transition-all placeholder:text-gray-400 text-gray-800"
                    placeholder="Full Name"
                    required
                />

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

                <button
                    type="submit"
                    className="w-full py-4 mt-2 bg-blue-900 text-white font-bold rounded-xl shadow-lg hover:bg-blue-800 transition-all text-sm"
                >
                    Sign Up
                </button>
            </form>

            {/* Footer / Socials */}
            <div className="mt-8 space-y-6 w-full max-w-xs">
                <div className="text-xs text-center text-gray-400 flex items-center gap-2 justify-center">
                    <span className="text-gray-400">Already have an account?</span>
                    <Link to="/login" className="text-blue-900 font-bold hover:underline">Log In</Link>
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
                    <button className="p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
                        <Facebook className="w-5 h-5" />
                    </button>
                    <button className="p-2 rounded-full bg-sky-50 text-sky-500 hover:bg-sky-100 transition-colors">
                        <Twitter className="w-5 h-5" />
                    </button>
                    <button className="p-2 rounded-full bg-blue-50 text-blue-800 hover:bg-blue-100 transition-colors">
                        <Linkedin className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Register;
