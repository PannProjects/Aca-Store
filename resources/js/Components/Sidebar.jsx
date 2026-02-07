import { Link, usePage } from '@inertiajs/react';
import { router } from '@inertiajs/react';

export default function Sidebar({ user, mobile = false, onClose }) {
    const { url } = usePage();

    const isActive = (path) => {
        return url.startsWith(path);
    };

    const handleLogout = (e) => {
        e.preventDefault();
        router.post('/logout');
    };

    const adminMenus = [
        { name: 'Dashboard', href: '/admin', icon: HomeIcon, path: '/admin' },
        { name: 'Produk', href: '/admin/produk', icon: CubeIcon, path: '/admin/produk' },
        { name: 'Users', href: '/admin/users', icon: UsersIcon, path: '/admin/users' },
        { name: 'Pembayaran', href: '/admin/pembayaran', icon: CreditCardIcon, path: '/admin/pembayaran' },
        { name: 'Log Aktivitas', href: '/admin/log', icon: ClipboardIcon, path: '/admin/log' },
        { name: 'Laporan', href: '/admin/laporan', icon: ChartIcon, path: '/admin/laporan' },
    ];

    const userMenus = [
        { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, path: '/dashboard' },
        { name: 'Belanja', href: '/', icon: ShoppingIcon, path: '/' },
        { name: 'Pesanan Saya', href: '/pesanan', icon: ClipboardIcon, path: '/pesanan' },
        { name: 'Log Aktivitas', href: '/log-aktivitas', icon: ClockIcon, path: '/log-aktivitas' },
        { name: 'Profil Saya', href: '/profile', icon: UserIcon, path: '/profile' },
    ];

    const menus = user?.role === 'admin' ? adminMenus : userMenus;

    const desktopClasses = "fixed left-4 top-4 bottom-4 w-72 bg-white dark:bg-slate-800 rounded-3xl flex flex-col z-40 shadow-[8px_0_30px_-10px_rgba(0,0,0,0.05)] border border-slate-100 dark:border-slate-700 overflow-hidden hidden lg:flex transition-colors duration-300";
    const mobileClasses = "w-full h-full bg-white dark:bg-slate-800 flex flex-col transition-colors duration-300";

    return (
        <aside className={mobile ? mobileClasses : desktopClasses}>
            {/* Logo */}
            <div className={`p-8 pb-4 flex items-center justify-between`}>
                <Link href="/" className="block">
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        Aca<span className="text-primary-600">Store</span>.
                    </h1>
                </Link>
                {mobile && (
                    <button onClick={onClose} className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-4 overflow-y-auto">
                <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4 px-4">
                    Main Menu
                </p>
                <ul className="space-y-1">
                    {menus.map((item) => (
                        <li key={item.name}>
                            <Link
                                href={item.href}
                                className={`flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-300 group relative overflow-hidden ${
                                    isActive(item.path)
                                        ? 'text-white shadow-lg shadow-primary-500/30'
                                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white'
                                }`}
                            >
                                {isActive(item.path) && (
                                    <div className="absolute inset-0 bg-primary-600"></div>
                                )}
                                <item.icon className={`w-5 h-5 relative z-10 ${isActive(item.path) ? 'text-white' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`} />
                                <span className="relative z-10">{item.name}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* User Profile Mini */}
            <div className="p-4 mt-auto">
                 <div className="bg-slate-50 dark:bg-slate-700/30 rounded-2xl p-4 border border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-3 mb-3">
                         <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-600 border-2 border-slate-200 dark:border-slate-500 flex items-center justify-center text-slate-700 dark:text-white font-bold text-sm shadow-sm">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                             <p className="font-bold text-sm text-slate-900 dark:text-white truncate">{user?.name}</p>
                             <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{user?.role}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all border border-transparent hover:border-red-100 dark:hover:border-red-900/30"
                    >
                        Sign Out
                    </button>
                 </div>
            </div>
        </aside>
    );
}

// Icon Components
function HomeIcon({ className }) { return (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>); }
function CubeIcon({ className }) { return (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>); }
function UsersIcon({ className }) { return (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>); }
function CreditCardIcon({ className }) { return (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>); }
function ClipboardIcon({ className }) { return (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>); }
function ChartIcon({ className }) { return (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>); }
function ShoppingIcon({ className }) { return (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>); }
function ClockIcon({ className }) { return (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>); }
function UserIcon({ className }) { return (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>); }
