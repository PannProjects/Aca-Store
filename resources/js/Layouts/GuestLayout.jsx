import { Link } from '@inertiajs/react';
import { useTheme } from '../Hooks/useTheme';

export default function GuestLayout({ children }) {
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden transition-colors duration-300">
            {/* Subtle Pattern Background */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                style={{ backgroundImage: 'radial-gradient(#64748b 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
            </div>

            {/* Dark Mode Toggle */}
            <div className="absolute top-6 right-6 z-50">
                <button 
                    onClick={toggleTheme}
                    className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                    {theme === 'dark' ? '☀️' : '🌙'}
                </button>
            </div>

            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-8">
                    <Link href="/">
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                            Aca<span className="text-primary-600 dark:text-primary-400">Store</span>
                        </h1>
                    </Link>
                    <p className="mt-2 text-slate-500 dark:text-slate-400 text-sm">Masuk untuk melanjutkan</p>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors duration-300">
                    {children}
                </div>
                
                <p className="mt-8 text-center text-xs text-slate-400 dark:text-slate-600">
                    &copy; {new Date().getFullYear()} AcaStore. All rights reserved.
                </p>
            </div>
        </div>
    );
}
