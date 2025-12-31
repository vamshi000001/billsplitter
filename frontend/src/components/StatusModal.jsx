import React from 'react';

const StatusModal = ({ isOpen, onClose, status, title, message }) => {
    if (!isOpen) return null;

    const isSuccess = status === 'success';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 max-w-sm w-full transform transition-all scale-100 flex flex-col items-center text-center animate-bounce-in">

                {/* Icon Circle */}
                <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-lg ${isSuccess ? 'bg-emerald-100 text-emerald-500 shadow-emerald-200' : 'bg-red-100 text-red-500 shadow-red-200'}`}>
                    {isSuccess ? (
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                        </svg>
                    ) : (
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    )}
                </div>

                {/* Title */}
                <h3 className={`text-2xl font-black mb-2 ${isSuccess ? 'text-gray-900 dark:text-white' : 'text-gray-900 dark:text-white'}`}>
                    {title || (isSuccess ? 'Success!' : 'Error')}
                </h3>

                {/* Message */}
                <p className="text-gray-500 dark:text-gray-400 font-medium mb-8">
                    {message || (isSuccess ? 'Your submission has been sent.' : 'Something went wrong.')}
                </p>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className={`px-8 py-3 rounded-xl font-bold text-white shadow-lg transform transition-transform active:scale-95 ${isSuccess ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/30' : 'bg-gray-800 hover:bg-gray-900 shadow-gray-800/30'}`}
                >
                    {isSuccess ? 'Great!' : 'Close'}
                </button>
            </div>
        </div>
    );
};

export default StatusModal;
