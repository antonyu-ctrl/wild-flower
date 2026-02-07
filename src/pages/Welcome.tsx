import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';

export default function Welcome() {
    const { isPasswordSet, updateAdminPassword } = useData();
    const navigate = useNavigate();
    const [passwordInput, setPasswordInput] = useState('');
    const [confirmPasswordInput, setConfirmPasswordInput] = useState('');

    const handleSetup = () => {
        if (passwordInput.length < 4) {
            alert('비밀번호는 4자리 이상이어야 합니다.');
            return;
        }
        if (passwordInput !== confirmPasswordInput) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }
        updateAdminPassword(passwordInput);
        alert('관리자 설정이 완료되었습니다!');
        navigate('/inbox'); // Go to main app
    };

    const handleEnter = () => {
        navigate('/inbox');
    };

    return (
        <div className="min-h-[100dvh] bg-sand-50 flex flex-col items-center p-6 text-center max-w-md mx-auto shadow-2xl border-x border-sand-200 relative overflow-hidden">
            <div className="flex-1 flex flex-col items-center justify-center w-full animate-in fade-in zoom-in duration-700">
                {/* Logo */}
                <div className="w-32 h-32 md:w-48 md:h-48 bg-cream rounded-full shadow-xl flex items-center justify-center mb-6 border-4 border-white overflow-hidden transition-all">
                    <img src="/logo.png" alt="Wild Flower" className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-700" />
                </div>

                {/* Title */}
                <h1 className="text-3xl md:text-4xl font-serif text-sage-900 mb-2 tracking-wide transition-all">
                    Wild Flower
                </h1>
                <p className="text-sage-600 mb-8 font-light tracking-widest text-xs uppercase transition-all">
                    Inventory & Order Management
                </p>

                {/* Onboarding Logic */}
                <div className="w-full max-w-xs space-y-4">
                    {!isPasswordSet ? (
                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-sand-100 animate-in slide-in-from-bottom-4 duration-700 delay-300">
                            <p className="text-sm text-sage-800 mb-4 font-medium">
                                👋 환영합니다!<br />초기 관리자 비밀번호를 설정해주세요.
                            </p>
                            <input
                                type="password"
                                placeholder="비밀번호 (4자리 이상)"
                                className="w-full p-3 bg-sand-50 border border-sand-200 rounded-xl mb-2 text-center focus:ring-2 focus:ring-terracotta-400 outline-none transition-all placeholder:text-sand-300 text-sage-900"
                                value={passwordInput}
                                onChange={(e) => setPasswordInput(e.target.value)}
                                autoFocus
                            />
                            <input
                                type="password"
                                placeholder="비밀번호 확인"
                                className="w-full p-3 bg-sand-50 border border-sand-200 rounded-xl mb-4 text-center focus:ring-2 focus:ring-terracotta-400 outline-none transition-all placeholder:text-sand-300 text-sage-900"
                                value={confirmPasswordInput}
                                onChange={(e) => setConfirmPasswordInput(e.target.value)}
                            />
                            <button
                                onClick={handleSetup}
                                disabled={!passwordInput || !confirmPasswordInput}
                                className="w-full py-3 bg-sage-700 text-white rounded-xl font-bold shadow-md hover:bg-sage-800 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                설정 완료
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={handleEnter}
                            className="w-full py-4 bg-sage-800 text-white rounded-xl font-bold shadow-lg hover:bg-sage-900 transition-all active:scale-95 animate-in slide-in-from-bottom-4 duration-700 delay-300 flex items-center justify-center gap-2 group"
                        >
                            <span>관리 시작</span>
                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </button>
                    )}
                </div>
            </div>

            <p className="text-xs text-sand-400 font-light mt-4 mb-2">
                © 2026 wild flower. All rights reserved.
            </p>
        </div>
    );
}
