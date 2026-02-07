import { Link, usePage } from '@inertiajs/react';
import { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Sidebar from '../Components/Sidebar';
import Alert from '../Components/Alert';
import NotificationDropdown from '../Components/NotificationDropdown';
import { useTheme } from '../Hooks/useTheme';

export default function AuthenticatedLayout({ children, title }) {
    const { auth, flash } = usePage().props;
    const { theme, toggleTheme } = useTheme();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#F3F6F8] dark:bg-[#0f172a] flex transition-colors duration-300">
            {/* Floating Sidebar (Hidden on mobile) */}
            <div className="hidden lg:block w-80 shrink-0">
                <Sidebar user={auth.user} />
            </div>

            {/* Mobile Sidebar */}
            <Transition.Root show={sidebarOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
                    <Transition.Child
                        as={Fragment}
                        enter="transition-opacity ease-linear duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition-opacity ease-linear duration-300"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm" />
                    </Transition.Child>

                    <div className="fixed inset-0 flex">
                        <Transition.Child
                            as={Fragment}
                            enter="transition ease-in-out duration-300 transform"
                            enterFrom="-translate-x-full"
                            enterTo="translate-x-0"
                            leave="transition ease-in-out duration-300 transform"
                            leaveFrom="translate-x-0"
                            leaveTo="-translate-x-full"
                        >
                            <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                                <Sidebar user={auth.user} mobile onClose={() => setSidebarOpen(false)} />
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition.Root>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-h-screen transition-all duration-300 w-full overflow-hidden">
                
                {/* Header - Floating & Transparent */}
                <header className="px-6 py-4 mt-2 lg:mt-4 lg:pr-8 relative z-50">
                    <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl border border-white/40 dark:border-slate-700/40 shadow-sm px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            {/* Mobile Menu Button (Visible only on mobile) */}
                             <div className="lg:hidden">
                                <button
                                    onClick={() => setSidebarOpen(true)}
                                    className="p-2 -ml-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                </button>
                             </div>
                             <h1 className="lg:hidden ml-2 font-bold text-xl text-slate-800 dark:text-white">AcaStore.</h1>
                             <h1 className="hidden lg:block text-xl font-bold text-slate-800 dark:text-white tracking-tight">{title}</h1>
                        </div>

                        <div className="flex items-center gap-4">
                            <button 
                                onClick={toggleTheme}
                                className="w-10 h-10 rounded-full bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center text-slate-400 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 hover:border-primary-200 transition-colors shadow-sm"
                            >
                                {theme === 'dark' ? '☀️' : '🌙'}
                            </button>
                            <NotificationDropdown />
                            <Link href="/profile" className="flex items-center gap-3 pl-4 border-l border-slate-200/60 dark:border-slate-700/60">
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-bold text-slate-800 dark:text-white leading-none">{auth.user?.name}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Lihat Profil</p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/40 border-2 border-white dark:border-slate-600 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold text-sm shadow-sm ring-2 ring-slate-100 dark:ring-slate-700">
                                    {auth.user?.name?.charAt(0).toUpperCase()}
                                </div>
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-6 lg:p-8 lg:pt-4 overflow-y-auto">
                    <div className="max-w-7xl mx-auto">
                        {/* Flash Messages */}
                        {flash?.success && (
                            <div className="animate-fade-in-down">
                                <Alert type="success" message={flash.success} className="mb-6 shadow-sm border border-emerald-100 dark:border-emerald-900/30" />
                            </div>
                        )}
                        {flash?.error && (
                             <div className="animate-fade-in-down">
                                <Alert type="error" message={flash.error} className="mb-6 shadow-sm border border-red-100 dark:border-red-900/30" />
                             </div>
                        )}

                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
