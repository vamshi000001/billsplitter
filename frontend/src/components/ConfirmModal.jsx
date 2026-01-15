import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Delete",
    cancelText = "Cancel",
    buttons = null,
    icon: Icon = AlertTriangle,
    iconColor = "text-red-600 dark:text-red-400",
    iconBg = "bg-red-50 dark:bg-red-900/20"
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity animate-fade-in"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-2xl p-8 max-w-sm w-full transform transition-all animate-scale-up border border-gray-100 dark:border-gray-700">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex flex-col items-center text-center">
                    {/* Icon Section */}
                    <div className={`w-20 h-20 ${iconBg} rounded-full flex items-center justify-center mb-6`}>
                        <div className={`w-14 h-14 ${iconBg.replace('20', '30')} rounded-full flex items-center justify-center ${iconColor}`}>
                            <Icon className="w-8 h-8" />
                        </div>
                    </div>

                    {/* Text Section */}
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">
                        {title || 'Are you sure?'}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 font-medium mb-8">
                        {message || 'This action cannot be undone. Please confirm to proceed.'}
                    </p>

                    {/* Actions */}
                    <div className={`w-full ${buttons ? 'flex flex-col gap-3' : 'grid grid-cols-2 gap-3'}`}>
                        {buttons ? (
                            buttons.map((btn, idx) => {
                                const BtnIcon = btn.icon;
                                return (
                                    <button
                                        key={idx}
                                        onClick={() => {
                                            btn.onClick();
                                            if (btn.closeOnClick !== false) onClose();
                                        }}
                                        className={`py-4 px-6 rounded-2xl font-bold transition-all active:scale-95 flex items-center justify-center gap-3 ${btn.className}`}
                                    >
                                        {BtnIcon && <BtnIcon className="w-5 h-5" />}
                                        {btn.text}
                                    </button>
                                );
                            })
                        ) : (
                            <>
                                <button
                                    onClick={onClose}
                                    className="py-4 px-6 rounded-2xl font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700/50 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors active:scale-95"
                                >
                                    {cancelText}
                                </button>
                                <button
                                    onClick={() => {
                                        onConfirm();
                                        onClose();
                                    }}
                                    className="py-4 px-6 rounded-2xl font-bold text-white bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30 transition-all active:scale-95"
                                >
                                    {confirmText}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
