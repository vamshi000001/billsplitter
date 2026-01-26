import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Users, Wallet, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import Waves from '../components/Waves';

const Landing = () => {
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="relative min-h-screen bg-white dark:bg-gray-950 font-sans selection:bg-blue-500 selection:text-white overflow-x-hidden transition-colors duration-500">

            {/* Premium Animated Background */}
            <div className="fixed inset-0 z-0 opacity-20 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-400 rounded-full blur-[120px] animate-blob"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-500 rounded-full blur-[120px] animate-blob animation-delay-2000"></div>
                <div className="absolute top-[30%] left-[20%] w-[400px] h-[400px] bg-cyan-400 rounded-full blur-[100px] animate-blob animation-delay-4000"></div>
            </div>

            {/* Navbar */}
            {/* Navbar */}
            <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 px-4 md:px-6 ${scrolled ? 'py-3 shadow-2xl bg-white/40 dark:bg-gray-950/40 backdrop-blur-2xl border-b border-white/30 dark:border-gray-800/50' : 'py-6 md:py-8 bg-white/5 backdrop-blur-sm border-b border-transparent'}`}>
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-2 md:gap-3 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        <div className="p-1.5 md:p-2 bg-blue-600 rounded-xl md:rounded-2xl shadow-lg shadow-blue-500/30 group-hover:rotate-12 transition-all duration-300">
                            <img src="/assets/logo.png" alt="Logo" className="w-6 h-6 md:w-8 md:h-8 object-contain" />
                        </div>
                        <span className={`font-extrabold text-xl md:text-2xl tracking-tight transition-colors ${scrolled ? 'text-gray-900' : 'text-gray-900 dark:text-white'}`}>Bill Splitter</span>
                    </div>
                    <div className="flex gap-2 md:gap-4 items-center">
                        <button onClick={() => navigate('/login')} className={`px-3 md:px-5 py-2 rounded-xl font-bold text-sm md:text-base transition-all ${scrolled ? 'text-gray-600 hover:text-blue-600' : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'}`}>Log In</button>
                        <button onClick={() => navigate('/register')} className="px-4 md:px-6 py-2 md:py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm md:text-base shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-0.5 active:scale-95 transition-all">Get Started</button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="relative z-10 max-w-7xl mx-auto px-6 pt-32 md:pt-48 pb-32 text-center">

                <div className="inline-flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 rounded-full glass-morphism mb-8 md:mb-10 animate-fade-in-down shadow-xl shadow-blue-500/5">
                    <span className="flex h-2 md:h-2.5 w-2 md:w-2.5 rounded-full bg-blue-600 animate-pulse"></span>
                    <span className="text-[11px] md:text-[13px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">The Future of Bill Splitting</span>
                </div>

                <h1 className="text-5xl md:text-8xl font-black text-gray-900 dark:text-white mb-6 md:mb-8 leading-tight tracking-tight animate-scale-up">
                    Bill Splitting <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400 animate-pulse">Made Amazing</span>
                </h1>

                <p className="text-base md:text-2xl text-gray-500 dark:text-gray-400 font-medium max-w-3xl mx-auto mb-12 md:mb-16 leading-relaxed animate-fade-in animation-delay-2000">
                    Split rent, utilities, and groceries with your roommates instantly. <br className="hidden md:block" />
                    No more awkward math, just accurate splitting with a touch of magic.
                </p>

                {/* Call to Actions - Redesigned for Impact */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 max-w-4xl mx-auto animate-fade-in animation-delay-4000">

                    {/* Create Room Card */}
                    <button
                        onClick={() => navigate('/register')}
                        className="group relative w-full md:w-1/2 p-1 rounded-3xl bg-white dark:bg-gray-900 shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 hover:-translate-y-2 border border-blue-100 dark:border-blue-900/50"
                    >
                        <div className="relative bg-white dark:bg-gray-950 rounded-[1.4rem] p-6 md:p-8 flex flex-col items-center gap-3 md:gap-4 transition-all duration-500">
                            <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                                <Sparkles className="w-6 h-6 md:w-8 md:h-8" />
                            </div>
                            <div className="text-center">
                                <p className="font-extrabold text-xl md:text-2xl text-gray-900 dark:text-white transition-colors">Start a Room</p>
                                <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-medium transition-colors mt-1">Create a new space for your squad</p>
                            </div>
                            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold group-hover:translate-x-2 transition-transform">
                                <span>Get Started</span>
                                <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
                            </div>
                        </div>
                    </button>

                    {/* Roommate Login Card */}
                    <button
                        onClick={() => navigate('/roommate-login')}
                        className="group relative w-full md:w-1/2 p-1 rounded-3xl bg-white dark:bg-gray-900 shadow-2xl hover:shadow-indigo-500/20 transition-all duration-500 hover:-translate-y-2 border border-indigo-100 dark:border-indigo-900/50"
                    >
                        <div className="relative bg-white dark:bg-gray-950 rounded-[1.4rem] p-6 md:p-8 flex flex-col items-center gap-3 md:gap-4 transition-all duration-500">
                            <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                                <Users className="w-6 h-6 md:w-8 md:h-8" />
                            </div>
                            <div className="text-center">
                                <p className="font-extrabold text-xl md:text-2xl text-gray-900 dark:text-white transition-colors">Join Friends</p>
                                <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-medium transition-colors mt-1">Login with an invite code</p>
                            </div>
                            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold group-hover:translate-x-2 transition-transform">
                                <span>Enter Room</span>
                                <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
                            </div>
                        </div>
                    </button>

                </div>

                {/* Features Grid */}
                <div className="mt-40 grid grid-cols-1 md:grid-cols-3 gap-10 text-left relative z-10">
                    <div className="glass-morphism p-10 rounded-[2.5rem] shadow-xl hover:scale-105 transition-all group overflow-hidden border-none animate-fade-in animation-delay-2000">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center mb-8 text-white shadow-lg shadow-blue-500/30 group-hover:rotate-6 transition-transform">
                            <Zap className="w-7 h-7" />
                        </div>
                        <h3 className="font-extrabold text-2xl text-gray-900 dark:text-white mb-4">Instant Splitting</h3>
                        <p className="text-gray-500 dark:text-gray-400 leading-relaxed font-medium">Add an expense and we split it automatically. No calculators, no stress, just speed.</p>
                    </div>
                    <div className="glass-morphism p-10 rounded-[2.5rem] shadow-xl hover:scale-105 transition-all group overflow-hidden border-none animate-fade-in animation-delay-2000">
                        <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-2xl flex items-center justify-center mb-8 text-white shadow-lg shadow-indigo-500/30 group-hover:rotate-6 transition-transform">
                            <ShieldCheck className="w-7 h-7" />
                        </div>
                        <h3 className="font-extrabold text-2xl text-gray-900 dark:text-white mb-4">Secure & Private</h3>
                        <p className="text-gray-500 dark:text-gray-400 leading-relaxed font-medium">Your data is encrypted and safe. Only your roommates see your expenses.</p>
                    </div>
                    <div className="glass-morphism p-10 rounded-[2.5rem] shadow-xl hover:scale-105 transition-all group overflow-hidden border-none text-white bg-gradient-to-br from-indigo-600 to-blue-700 animate-fade-in animation-delay-2000">
                        <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 text-white shadow-lg group-hover:rotate-6 transition-transform">
                            <Wallet className="w-7 h-7" />
                        </div>
                        <h3 className="font-extrabold text-2xl mb-4">Track Balances</h3>
                        <p className="text-blue-100 leading-relaxed font-medium">Know exactly who owes what at any time. Settle up with one click and stay friends.</p>
                    </div>
                </div>

                {/* Footer */}
                <footer className="mt-40 pb-12 opacity-60">
                    <p className="text-gray-500 dark:text-gray-400 font-bold tracking-widest text-xs uppercase">© 2024 Bill Splitter • Built for Roommates</p>
                </footer>

            </main>

            {/* The Waves Interaction */}
            <Waves />
        </div>
    );
};

export default Landing;
