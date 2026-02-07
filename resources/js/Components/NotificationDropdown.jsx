import { Link, router, usePage } from '@inertiajs/react';
import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';

export default function NotificationDropdown() {
    const { notifications, unread_notifications_count } = usePage().props;

    const markAsRead = (id) => {
        router.post(route('notifications.read', id), {}, {
            preserveScroll: true,
        });
    };

    const markAllAsRead = () => {
        router.post(route('notifications.read-all'), {}, {
            preserveScroll: true,
        });
    };

    const getIcon = (type) => {
        switch (type) {
            case 'payment_confirmed':
                return '✅';
            case 'payment_rejected':
                return '❌';
            default:
                return '📢';
        }
    };

    return (
        <Menu as="div" className="relative">
            <Menu.Button className="relative w-10 h-10 rounded-full bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center text-slate-400 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 hover:border-primary-200 transition-colors shadow-sm">
                🔔
                {unread_notifications_count > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-red-500 text-white text-xs font-bold rounded-full border-2 border-white dark:border-slate-800">
                        {unread_notifications_count > 9 ? '9+' : unread_notifications_count}
                    </span>
                )}
            </Menu.Button>

            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items className="absolute right-0 mt-2 w-80 origin-top-right rounded-xl bg-white dark:bg-slate-800 shadow-2xl focus:outline-none z-[100] border border-slate-100 dark:border-slate-700">
                    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-t-xl">
                        <h3 className="font-bold text-slate-800 dark:text-white">Notifikasi</h3>
                        {unread_notifications_count > 0 && (
                            <button 
                                onClick={markAllAsRead}
                                className="text-xs text-primary-600 dark:text-primary-400 hover:underline font-medium"
                            >
                                Tandai semua dibaca
                            </button>
                        )}
                    </div>

                    <div className="max-h-[400px] overflow-y-auto bg-white dark:bg-slate-800 rounded-b-xl">
                        {notifications?.length === 0 ? (
                            <div className="px-8 py-12 text-center text-slate-400 dark:text-slate-500">
                                <div className="text-4xl mb-3 opacity-50">🔕</div>
                                <p className="text-sm font-medium">Belum ada notifikasi</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100 dark:divide-slate-700">
                                {notifications.map((notification) => (
                                    <Menu.Item key={notification.id}>
                                        {({ active }) => (
                                            <div 
                                                onClick={() => !notification.read_at && markAsRead(notification.id)}
                                                className={`
                                                    px-4 py-3 flex gap-3 cursor-pointer transition-colors relative
                                                    ${active ? 'bg-slate-50 dark:bg-slate-700/50' : ''}
                                                    ${!notification.read_at ? 'bg-primary-50/30 dark:bg-primary-900/10' : ''}
                                                `}
                                            >
                                                <div className="text-xl shrink-0 mt-0.5">
                                                    {getIcon(notification.type)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className={`text-sm font-medium ${!notification.read_at ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                                                        {notification.title}
                                                    </p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                                                        {notification.message}
                                                    </p>
                                                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1.5">
                                                        {notification.time_ago}
                                                    </p>
                                                </div>
                                                {!notification.read_at && (
                                                    <div className="absolute top-1/2 right-3 -translate-y-1/2 w-2 h-2 rounded-full bg-primary-500"></div>
                                                )}
                                            </div>
                                        )}
                                    </Menu.Item>
                                ))}
                            </div>
                        )}
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    );
}
