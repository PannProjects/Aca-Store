import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Sidebar from '../Components/Sidebar';
import NotificationDropdown from '../Components/NotificationDropdown';
import { useTheme } from '../Hooks/useTheme';
import GlobalToast from '../Components/GlobalToast';

export default function AuthenticatedLayout({ children, title }) {
    const { auth } = usePage().props;
    const { theme, toggleTheme } = useTheme();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Prevent body scroll when mobile sidebar is open
    useEffect(() => {
        document.body.style.overflow = sidebarOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [sidebarOpen]);

    return (
        <div className="min-h-screen bg-[#F3F6F8] dark:bg-[#0f172a] flex transition-colors duration-300">
            {/* Desktop Sidebar */}
            <div className="hidden lg:block w-80 shrink-0">
                <Sidebar user={auth.user} />
            </div>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity"
                        onClick={() => setSidebarOpen(false)}
                    />
                    {/* Sidebar Panel */}
                    <div className="fixed inset-y-0 left-0 w-[280px] max-w-[85vw] z-50 animate-slide-in">
                        <Sidebar user={auth.user} mobile onClose={() => setSidebarOpen(false)} />
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-h-screen transition-all duration-300 w-full overflow-hidden">

                {/* Header */}
                <header className="px-3 py-2 sm:px-4 sm:py-3 lg:px-6 lg:py-4 mt-2 lg:mt-4 lg:pr-8 relative z-40">
                    <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl border border-white/40 dark:border-slate-700/40 shadow-sm px-3 py-2.5 sm:px-4 sm:py-3 lg:px-6 lg:py-4 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 min-w-0">
                            {/* Mobile Menu Button */}
                            <div className="lg:hidden">
                                <button
                                    onClick={() => setSidebarOpen(true)}
                                    className="p-2 -ml-1 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                </button>
                            </div>
                            <h1 className="lg:hidden font-bold text-lg sm:text-xl text-slate-800 dark:text-white truncate">AcaStore.</h1>
                            <h1 className="hidden lg:block text-xl font-bold text-slate-800 dark:text-white tracking-tight">{title}</h1>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 shrink-0">
                            <button
                                onClick={toggleTheme}
                                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center text-slate-400 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 hover:border-primary-200 transition-colors shadow-sm text-sm"
                            >
                                {theme === 'dark' ? '☀️' : '🌙'}
                            </button>
                            <NotificationDropdown />
                            <Link href="/profile" className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-4 border-l border-slate-200/60 dark:border-slate-700/60">
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-bold text-slate-800 dark:text-white leading-none">{auth.user?.name}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Lihat Profil</p>
                                </div>
                                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary-100 dark:bg-primary-900/40 border-2 border-white dark:border-slate-600 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold text-sm shadow-sm ring-2 ring-slate-100 dark:ring-slate-700">
                                    {auth.user?.name?.charAt(0).toUpperCase()}
                                </div>
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8 lg:pt-4 overflow-y-auto relative z-10">
                    <div className="max-w-7xl mx-auto">
                        <GlobalToast />
                        {children}
                    </div>
                </main>
            </div>

            {/* CSS animation for mobile sidebar */}
            <style>{`
                @keyframes slideIn {
                    from { transform: translateX(-100%); }
                    to { transform: translateX(0); }
                }
                .animate-slide-in {
                    animation: slideIn 0.25s ease-out;
                }
            `}</style>
        </div>
    );
}
