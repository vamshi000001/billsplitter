import React, { useState } from 'react';
import { AlertTriangle, X, Lock, Loader2 } from 'lucide-react';

const DeleteRoomModal = ({ isOpen, onClose, onConfirm, roomTitle }) => {
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onConfirm(password);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity animate-fade-in"
                onClick={!loading ? onClose : undefined}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-2xl p-8 max-w-md w-full transform transition-all animate-scale-up border border-gray-100 dark:border-gray-700">

                {/* Close Button */}
                {!loading && (
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}

                <div className="flex flex-col items-center text-center">
                    {/* Warning Icon Section */}
                    <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-6">
                        <div className="w-14 h-14 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-red-600 dark:text-red-400">
                            <AlertTriangle className="w-8 h-8" />
                        </div>
                    </div>

                    {/* Text Section */}
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2 leading-tight">
                        Delete "{roomTitle}"?
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 font-medium mb-6">
                        This will permanently delete all expenses, members, and chat history. This action <span className="text-red-500 font-black uppercase">cannot be undone</span>.
                    </p>

                    <form onSubmit={handleSubmit} className="w-full space-y-6">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-brand-blue transition-colors">
                                <Lock className="w-5 h-5" />
                            </div>
                            <input
                                type="password"
                                required
                                placeholder="Enter your Admin password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-700/50 border-2 border-transparent focus:border-brand-blue rounded-2xl outline-none transition-all font-medium text-gray-900 dark:text-white"
                                disabled={loading}
                                autoFocus
                            />
                        </div>

                        <div className="flex flex-col gap-3">
                            <button
                                type="submit"
                                disabled={loading || !password}
                                className="w-full py-4 rounded-2xl font-black text-white bg-red-500 hover:bg-red-600 shadow-xl shadow-red-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Deleting Room...
                                    </>
                                ) : (
                                    'Permanently Delete Room'
                                )}
                            </button>
                            {!loading && (
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="w-full py-4 rounded-2xl font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default DeleteRoomModal;
