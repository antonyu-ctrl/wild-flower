import React, { Fragment } from 'react';

interface ConfirmationModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmationModal({ isOpen, title, message, onConfirm, onCancel }: ConfirmationModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
                onClick={onCancel}
            />

            {/* Modal Content */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 transform transition-all animate-in zoom-in-95 duration-200 border border-sand-100">
                <div className="text-center">
                    <div className="w-12 h-12 bg-sage-50 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl border border-sage-100">
                        ❓
                    </div>
                    <h3 className="text-lg font-bold text-sage-900 mb-2 font-serif">
                        {title}
                    </h3>
                    <p className="text-sm text-sage-600 mb-6">
                        {message}
                    </p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-3 px-4 bg-sand-50 text-sage-700 rounded-xl font-medium border border-sand-200 hover:bg-sand-100 transition-colors active:scale-95"
                    >
                        취소
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 py-3 px-4 bg-sage-700 text-white rounded-xl font-medium shadow-md hover:bg-sage-800 transition-all active:scale-95"
                    >
                        확인
                    </button>
                </div>
            </div>
        </div>
    );
}
