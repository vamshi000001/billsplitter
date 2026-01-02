import { Link } from "react-router-dom";

const Landing = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 relative overflow-hidden font-sans selection:bg-blue-500 selection:text-white">

            {/* Ambient Background Glows */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[100px] animate-pulse animation-delay-2000"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 relative z-10 flex flex-col items-center justify-center min-h-screen text-center">

                {/* Hero Section */}
                <div className="space-y-8 max-w-4xl mx-auto">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 dark:bg-gray-800/50 backdrop-blur-md border border-gray-200 dark:border-gray-700 shadow-sm mb-4 animate-fade-in-up">
                        <span className="flex h-2 w-2 rounded-full bg-green-500 animate-ping"></span>
                        <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">v2.0 Now Live</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white animate-fade-in-up animation-delay-100">
                        Split Bills, <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">Not Friendships.</span>
                    </h1>

                    <p className="text-lg md:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed animate-fade-in-up animation-delay-200">
                        The premium way to manage shared expenses. Track balances, settle debts, and keep your home in harmony.
                    </p>

                    {/* Action Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mt-12 w-full max-w-3xl mx-auto animate-fade-in-up animation-delay-500">

                        {/* Admin Card */}
                        <Link
                            to="/register"
                            className="group relative p-8 bg-white dark:bg-gray-800 rounded-3xl shadow-xl hover:shadow-2xl border border-gray-100 dark:border-gray-700 transition-all duration-300 transform hover:-translate-y-2 overflow-hidden text-left"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <span className="text-8xl">👑</span>
                            </div>
                            <div className="relative z-10 space-y-4">
                                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                                    👑
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Create a Room</h3>
                                    <p className="text-gray-600 dark:text-gray-400">For Admins. Set up your space, invite members, and manage the finances.</p>
                                </div>
                                <div className="pt-4">
                                    <span className="inline-flex items-center text-blue-600 dark:text-blue-400 font-bold group-hover:translate-x-1 transition-transform">
                                        Get Started &rarr;
                                    </span>
                                </div>
                            </div>
                        </Link>

                        {/* Member Card */}
                        <Link
                            to="/roommate-login"
                            className="group relative p-8 bg-white dark:bg-gray-800 rounded-3xl shadow-xl hover:shadow-2xl border border-gray-100 dark:border-gray-700 transition-all duration-300 transform hover:-translate-y-2 overflow-hidden text-left"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <span className="text-8xl">👋</span>
                            </div>
                            <div className="relative z-10 space-y-4">
                                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                                    👋
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Roommate Login</h3>
                                    <p className="text-gray-600 dark:text-gray-400">Join an existing room, check your dues, and settle payments.</p>
                                </div>
                                <div className="pt-4">
                                    <span className="inline-flex items-center text-purple-600 dark:text-purple-400 font-bold group-hover:translate-x-1 transition-transform">
                                        Sign In &rarr;
                                    </span>
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Footer / Copyright */}
                    <div className="pt-16 text-sm text-gray-400 animate-fade-in-up animation-delay-700">
                        &copy; 2026 RoomSplit Inc. • Made with ❤️ for roommates everywhere.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Landing;
