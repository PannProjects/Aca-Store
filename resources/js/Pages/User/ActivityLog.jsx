import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';

export default function ActivityLog({ activities }) {
    const getActionBadge = (action) => {
        const config = {
            login: { color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400', label: 'Login' },
            logout: { color: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300', label: 'Logout' },
            register: { color: 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400', label: 'Register' },
            checkout: { color: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', label: 'Checkout' },
            update_profile: { color: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400', label: 'Profile' },
            rating: { color: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', label: 'Rating' },
            print_invoice: { color: 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400', label: 'Invoice' },
            confirm_payment: { color: 'bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400', label: 'Confirm' },
            reject_payment: { color: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400', label: 'Reject' },
            add_product: { color: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400', label: 'Add Produk' },
            edit_product: { color: 'bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400', label: 'Edit Produk' },
            delete_product: { color: 'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400', label: 'Hapus Produk' },
            add_admin: { color: 'bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400', label: 'Add Admin' },
            delete_user: { color: 'bg-pink-50 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400', label: 'Hapus User' },
        };
        const c = config[action] || { color: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300', label: action || '-' };
        
        return (
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${c.color}`}>
                {c.label}
            </span>
        );
    };

    return (
        <AuthenticatedLayout title="Log Aktivitas">
            <Head title="Log Aktivitas" />

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm dark:shadow-lg dark:shadow-black/20 border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                            <tr>
                                <th className="text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase px-6 py-4">Waktu</th>
                                <th className="text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase px-6 py-4">Aksi</th>
                                <th className="text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase px-6 py-4">Keterangan</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {activities?.map((activity) => (
                                <tr key={activity.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-sm whitespace-nowrap font-mono">
                                        {new Date(activity.created_at).toLocaleString('id-ID', {
                                            day: 'numeric',
                                            month: 'short',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </td>
                                    <td className="px-6 py-4">
                                        {getActionBadge(activity.activity_type)}
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300 text-sm">{activity.description}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {activities?.length === 0 && (
                <div className="p-12 text-center bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-300 dark:border-slate-600 mt-6">
                    <p className="text-slate-400 dark:text-slate-500">Belum ada aktivitas tercatat</p>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
