import { router, usePage } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';

export default function NotificationDropdown() {
    const { notifications, unread_notifications_count } = usePage().props;
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close on outside click
    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const markAsRead = (id) => {
        router.post(`/notifications/${id}/read`, {}, { preserveScroll: true });
    };

    const markAllAsRead = () => {
        router.post('/notifications/read-all', {}, { preserveScroll: true });
        setIsOpen(false);
    };

    const getIcon = (type) => {
        switch (type) {
            case 'payment_confirmed': return '✅';
            case 'payment_rejected': return '❌';
            case 'transaction_deleted': return '🗑️';
            case 'order_completed': return '📦';
            default: return '📢';
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative w-10 h-10 rounded-full bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center text-slate-400 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 hover:border-primary-200 transition-colors shadow-sm"
            >
                🔔
                {unread_notifications_count > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full border-2 border-white dark:border-slate-800">
                        {unread_notifications_count > 9 ? '9+' : unread_notifications_count}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <>
                    {/* Mobile backdrop */}
                    <div className="fixed inset-0 z-40 bg-black/20 sm:hidden" onClick={() => setIsOpen(false)} />

                    <div className="fixed inset-x-3 top-20 z-50 sm:absolute sm:inset-auto sm:right-0 sm:top-full sm:mt-2 sm:w-80 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden">
                        {/* Header */}
                        <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                            <h3 className="font-bold text-slate-800 dark:text-white text-sm">Notifikasi</h3>
                            <div className="flex items-center gap-2">
                                {unread_notifications_count > 0 && (
                                    <button
                                        onClick={markAllAsRead}
                                        className="text-[11px] text-primary-600 dark:text-primary-400 hover:underline font-medium"
                                    >
                                        Tandai semua dibaca
                                    </button>
                                )}
                                <button onClick={() => setIsOpen(false)} className="sm:hidden w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-600 text-lg">✕</button>
                            </div>
                        </div>

                        {/* Notifications List */}
                        <div className="max-h-[60vh] sm:max-h-[400px] overflow-y-auto">
                            {notifications?.length === 0 ? (
                                <div className="px-8 py-12 text-center text-slate-400 dark:text-slate-500">
                                    <div className="text-4xl mb-3 opacity-50">🔕</div>
                                    <p className="text-sm font-medium">Belum ada notifikasi</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-100 dark:divide-slate-700">
                                    {notifications.map((n) => (
                                        <div
                                            key={n.id}
                                            onClick={() => {
                                                if (!n.read_at) markAsRead(n.id);
                                            }}
                                            className={`px-4 py-3 flex gap-3 cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50 relative ${
                                                !n.read_at ? 'bg-primary-50/40 dark:bg-primary-900/10' : ''
                                            }`}
                                        >
                                            <div className="text-xl shrink-0 mt-0.5">{getIcon(n.type)}</div>
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-sm font-medium leading-tight ${!n.read_at ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                                                    {n.title}
                                                </p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">{n.message}</p>
                                                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">{n.time_ago}</p>
                                            </div>
                                            {!n.read_at && (
                                                <div className="absolute top-1/2 right-3 -translate-y-1/2 w-2 h-2 rounded-full bg-primary-500" />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
