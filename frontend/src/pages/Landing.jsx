import { Link } from "react-router-dom";
import { Settings } from 'lucide-react'; // Using Settings as a gear/wheel placeholder

const Landing = () => {
    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 font-sans text-center">

            {/* Logo Section */}
            <div className="mb-8">
                <div className="w-24 h-24 bg-blue-900 rounded-3xl flex items-center justify-center mx-auto shadow-sm">
                    {/* Gear/Wheel Icon matching the mockup */}
                    <Settings className="w-14 h-14 text-white animate-spin-slow" strokeWidth={2.5} />
                </div>
            </div>

            {/* Typography */}
            <div className="space-y-4 mb-16">
                <h1 className="text-3xl font-extrabold text-blue-900 tracking-tight">
                    Welcome To
                </h1>
                <p className="text-gray-500 text-sm max-w-xs mx-auto leading-relaxed">
                    Create an account and access thousand of cool stuffs
                </p>
            </div>

            {/* Actions */}
            <div className="w-full max-w-xs space-y-4">
                <Link
                    to="/register"
                    className="block w-full py-4 bg-blue-900 text-white font-bold rounded-xl shadow-lg hover:bg-blue-800 transition-all text-sm uppercase tracking-wider"
                >
                    Get Started
                </Link>

                <p className="text-sm text-gray-500">
                    Do you have an account? <Link to="/login" className="text-blue-900 font-bold hover:underline">Log In</Link>
                </p>
            </div>

            {/* Additional Roommate Link (Custom addition to preserve functionality) */}
            <div className="mt-8 pt-8 border-t border-gray-100 w-full max-w-xs">
                <Link to="/roommate-login" className="text-xs text-gray-400 font-medium hover:text-blue-900 transition-colors">
                    Join as Roommate instead?
                </Link>
            </div>
        </div>
    );
};

export default Landing;
