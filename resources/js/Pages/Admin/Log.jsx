import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';

export default function Log({ activities }) {
    const getActionBadge = (action) => {
        const config = {
            login: { color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400', label: 'Login' },
            logout: { color: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400', label: 'Logout' },
            register: { color: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400', label: 'Register' },
            purchase: { color: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', label: 'Pembelian' },
            confirm_payment: { color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400', label: 'Konfirmasi' },
            reject_payment: { color: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400', label: 'Tolak' },
            add_product: { color: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', label: 'Produk Baru' },
            edit_product: { color: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', label: 'Edit Produk' },
            delete_product: { color: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400', label: 'Hapus Produk' },
            add_admin: { color: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400', label: 'Admin Baru' },
            delete_user: { color: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400', label: 'Hapus User' },
            rating: { color: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', label: 'Rating' },
            update_profile: { color: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', label: 'Update Profil' },
        };
        const c = config[action] || { color: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400', label: action };
        
        return (
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${c.color}`}>
                {c.label}
            </span>
        );
    };

    return (
        <AuthenticatedLayout title="Log Aktivitas">
            <Head title="Log Aktivitas" />

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
                            <tr>
                                <th className="text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase px-6 py-4">Waktu</th>
                                <th className="text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase px-6 py-4">User</th>
                                <th className="text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase px-6 py-4">Aksi</th>
                                <th className="text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase px-6 py-4">Deskripsi</th>
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
                                        <p className="text-slate-900 dark:text-white font-medium text-sm">{activity.user?.name || '-'}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">{activity.user?.email}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        {getActionBadge(activity.action)}
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300 text-sm">{activity.description}</td>
                                    </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {activities?.length === 0 && (
                <div className="p-12 text-center mt-6">
                    <p className="text-slate-400 dark:text-slate-500">Belum ada aktivitas</p>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
