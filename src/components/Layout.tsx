import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
    children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    const location = useLocation();

    const navItems = [
        { name: '상품관리', path: '/products', icon: '🏷️' },
        { name: '재고', path: '/inventory', icon: '📦' },
        { name: '배송', path: '/shipping', icon: '🚚' },
        { name: '메시지', path: '/inbox', icon: '💬' },
        { name: '설정', path: '/settings', icon: '⚙️' },
    ];

    return (
        <div className="flex flex-col h-svh bg-sand-100 max-w-md mx-auto shadow-2xl border-x border-sand-200">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-sand-200 px-4 py-3">
                <h1 className="text-xl font-medium text-sage-900 text-center font-sans tracking-tight">
                    들꽃이야기
                </h1>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-4 scroll-smooth">
                {children}
            </main>

            {/* Bottom Navigation */}
            <nav className="bg-white border-t border-sand-200 px-6 py-2 pb-safe">
                <ul className="flex justify-between items-center">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <li key={item.name}>
                                <Link
                                    to={item.path}
                                    className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200 ${isActive
                                        ? 'text-sage-600'
                                        : 'text-sage-300 hover:text-sage-500'
                                        }`}
                                >
                                    <span className="text-2xl">{item.icon}</span>
                                    <span className="text-[10px] font-medium tracking-wide">
                                        {item.name}
                                    </span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </div>
    );
}
