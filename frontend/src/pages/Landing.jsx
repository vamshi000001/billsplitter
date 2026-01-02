import { useNavigate } from 'react-router-dom';
import { ArrowRight, Users, Wallet, ShieldCheck, Zap } from 'lucide-react';

const Landing = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-brand-light font-sans selection:bg-brand-orange selection:text-white overflow-hidden">

            {/* Background Pattern */}
            <div className="fixed inset-0 z-0 opacity-10 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-blue rounded-full blur-[100px] -mr-40 -mt-40"></div>
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-orange rounded-full blur-[100px] -ml-20 -mb-20"></div>
            </div>

            {/* Navbar */}
            <nav className="relative z-50 px-6 py-6 flex justify-between items-center max-w-7xl mx-auto">
                <div className="flex items-center gap-3">
                    <img src="/assets/logo.png" alt="Bill Splitter Logo" className="w-12 h-12 object-contain drop-shadow-sm hover:scale-105 transition-transform" />
                    <span className="font-extrabold text-xl tracking-tight text-brand-blue">Bill Splitter</span>
                </div>
                <div className="hidden md:flex gap-4">
                    <button onClick={() => navigate('/login')} className="px-6 py-2.5 rounded-full font-bold text-brand-blue hover:bg-white/50 transition-all">Log In</button>
                    <button onClick={() => navigate('/register')} className="px-6 py-2.5 rounded-full bg-brand-blue text-white font-bold shadow-lg hover:shadow-brand-blue/30 hover:-translate-y-0.5 transition-all">Get Started</button>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="relative z-10 max-w-7xl mx-auto px-6 pt-10 pb-20 md:pt-20 lg:pt-32 text-center">

                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-gray-100 mb-8 animate-fade-in-down">
                    <span className="flex h-2 w-2 rounded-full bg-brand-orange animate-pulse"></span>
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">The Smartest Way to Split</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-black text-brand-blue mb-8 leading-tight tracking-tight">
                    Welcome To <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-brand-yellow">Bill Splitter</span>
                </h1>

                <p className="text-lg md:text-xl text-gray-500 font-medium max-w-2xl mx-auto mb-12 leading-relaxed">
                    Split rent, utilities, and groceries with your roommates instantly. No more awkward math, just accurate splitting.
                </p>

                {/* Call to Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 max-w-md mx-auto sm:max-w-none">

                    {/* Create Room Card */}
                    <button
                        onClick={() => navigate('/register')}
                        className="group relative w-full sm:w-80 bg-white p-2 rounded-[2rem] shadow-xl shadow-brand-blue/10 hover:shadow-brand-blue/20 transition-all duration-300 hover:-translate-y-1"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-brand-blue to-blue-600 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative bg-white rounded-[1.7rem] p-6 flex items-center justify-between group-hover:bg-opacity-0 transition-all duration-300">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-brand-light flex items-center justify-center text-brand-blue group-hover:bg-white/20 group-hover:text-white transition-colors">
                                    <ArrowRight className="w-6 h-6" />
                                </div>
                                <div className="text-left">
                                    <p className="font-bold text-lg text-brand-blue group-hover:text-white transition-colors">Get Started</p>
                                    <p className="text-xs text-gray-400 font-medium group-hover:text-white/80 transition-colors">Create a new room</p>
                                </div>
                            </div>
                        </div>
                    </button>

                    {/* Roommate Login Card */}
                    <button
                        onClick={() => navigate('/roommate-login')}
                        className="group relative w-full sm:w-80 bg-white p-2 rounded-[2rem] shadow-xl shadow-brand-orange/10 hover:shadow-brand-orange/20 transition-all duration-300 hover:-translate-y-1"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-brand-orange to-brand-yellow rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative bg-white rounded-[1.7rem] p-6 flex items-center justify-between group-hover:bg-opacity-0 transition-all duration-300">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-brand-light flex items-center justify-center text-brand-orange group-hover:bg-white/20 group-hover:text-white transition-colors">
                                    <Users className="w-6 h-6" />
                                </div>
                                <div className="text-left">
                                    <p className="font-bold text-lg text-brand-blue group-hover:text-white transition-colors">Join Room</p>
                                    <p className="text-xs text-gray-400 font-medium group-hover:text-white/80 transition-colors">Login as roommate</p>
                                </div>
                            </div>
                        </div>
                    </button>

                </div>

                {/* Features Grid */}
                <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto text-left relative z-10">
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100/50 hover:border-brand-blue/20 transition-all">
                        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 text-brand-blue">
                            <Zap className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-xl text-brand-blue mb-3">Instant Splitting</h3>
                        <p className="text-gray-500 leading-relaxed font-medium">Add an expense and we split it automatically. No calculators needed.</p>
                    </div>
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100/50 hover:border-brand-orange/20 transition-all">
                        <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center mb-6 text-brand-orange">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-xl text-brand-blue mb-3">Secure & Private</h3>
                        <p className="text-gray-500 leading-relaxed font-medium">Your data is safe with us. Only your roommates see your expenses.</p>
                    </div>
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100/50 hover:border-brand-yellow/20 transition-all">
                        <div className="w-12 h-12 bg-yellow-50 rounded-2xl flex items-center justify-center mb-6 text-brand-yellow transform rotate-12">
                            <Wallet className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-xl text-brand-blue mb-3">Track Balances</h3>
                        <p className="text-gray-500 leading-relaxed font-medium">Know exactly who owes what at any time. Settle up with one click.</p>
                    </div>
                </div>

                {/* Footer */}
                <footer className="mt-24 pb-8 border-t border-gray-100 pt-12">
                    <p className="text-gray-400 font-medium">© 2024 Bill Splitter. All rights reserved.</p>
                </footer>

            </main>
        </div>
    );
};

export default Landing;
