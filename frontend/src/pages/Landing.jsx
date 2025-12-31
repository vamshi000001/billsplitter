import { Link } from 'react-router-dom';

const Landing = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900 px-4 font-sans transition-colors duration-300">
            <div className="max-w-4xl w-full text-center space-y-12">
                <div className="space-y-4">
                    <h1 className="text-6xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent animate-fade-in-down">
                        RoomSplit
                    </h1>
                    <p className="text-2xl text-gray-600 dark:text-gray-300 font-light max-w-2xl mx-auto leading-relaxed">
                        The premium way to manage expenses and split bills with your roommates.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto mt-12">
                    <Link
                        to="/create-room"
                        className="group relative p-8 bg-white dark:bg-gray-800 rounded-3xl shadow-xl hover:shadow-2xl border border-gray-100 dark:border-gray-700 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-blue-600 opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
                        <div className="relative z-10 flex flex-col items-center">
                            <span className="text-5xl mb-6">👑</span>
                            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Create a Room</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-center">For Room Admins to manage expenses and members.</p>
                            <span className="mt-8 px-6 py-2 bg-blue-600 text-white rounded-full font-semibold group-hover:bg-blue-700 transition-colors">
                                Get Started &rarr;
                            </span>
                        </div>
                    </Link>

                    <Link
                        to="/roommate-login"
                        className="group relative p-8 bg-white dark:bg-gray-800 rounded-3xl shadow-xl hover:shadow-2xl border border-gray-100 dark:border-gray-700 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-purple-600 opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
                        <div className="relative z-10 flex flex-col items-center">
                            <span className="text-5xl mb-6">👋</span>
                            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Roommate Login</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-center">Join an existing room and track your dues.</p>
                            <span className="mt-8 px-6 py-2 bg-purple-600 text-white rounded-full font-semibold group-hover:bg-purple-700 transition-colors">
                                Sign In &rarr;
                            </span>
                        </div>
                    </Link>
                </div>

                <p className="text-sm text-gray-400 dark:text-gray-600">© 2024 RoomSplit Inc.</p>
            </div>
        </div>
    );
};

export default Landing;
