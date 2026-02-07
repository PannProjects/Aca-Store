import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';
import Card from '../../Components/Card';

export default function Dashboard({ totalStoreRevenue, totalProduk, totalUsers, pendingCount }) {
    const stats = [
        { label: 'Total Pendapatan', value: `Rp ${totalStoreRevenue?.toLocaleString('id-ID', { maximumFractionDigits: 0 }) || '0'}`, icon: '💰', color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400' },
        { label: 'Total Produk', value: totalProduk || 0, icon: '📦', color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' },
        { label: 'Total Users', value: totalUsers || 0, icon: 'Users', color: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400' },
        { label: 'Menunggu Verifikasi', value: pendingCount || 0, icon: '⏳', color: 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400', warning: pendingCount > 0 },
    ];

    return (
        <AuthenticatedLayout title="Dashboard Admin">
            <Head title="Dashboard Admin" />

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <Card key={index} className="p-6 border-0 shadow-sm relative overflow-hidden bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
                                <p className={`text-2xl font-bold mt-2 ${stat.warning ? 'text-amber-600 dark:text-amber-400' : 'text-slate-900 dark:text-white'}`}>
                                    {stat.value}
                                </p>
                            </div>
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                                {stat.icon === 'Users' ? (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                ) : (
                                    <span className="text-lg">{stat.icon}</span>
                                )}
                            </div>
                        </div>
                        {stat.warning && (
                            <Link href="/admin/pembayaran" className="absolute inset-0 z-10" aria-label="Lihat Pembayaran" />
                        )}
                    </Card>
                ))}
            </div>

            {/* Admin Quick Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-8 text-white col-span-full md:col-span-1 shadow-lg">
                    <h3 className="text-xl font-bold mb-2">Admin Control Center</h3>
                    <p className="text-slate-400 text-sm mb-6">Kelola semua aspek AcaStore dari satu tempat.</p>
                    <Link href="/admin/produk">
                        <button className="bg-white text-slate-900 px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-100 transition-colors w-full">
                            Kelola Produk →
                        </button>
                    </Link>
                </div>

                <Link href="/admin/users" className="group">
                    <Card hover className="h-full p-6 flex flex-col justify-center items-center text-center border-dashed border-2 border-slate-200 dark:border-slate-700 shadow-none hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/10 dark:hover:border-primary-500 transition-all bg-white dark:bg-slate-800">
                        <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            👥
                        </div>
                        <h3 className="font-bold text-slate-800 dark:text-white">Kelola Pengguna</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Lihat & edit data user</p>
                    </Card>
                </Link>

                <Link href="/admin/laporan" className="group">
                    <Card hover className="h-full p-6 flex flex-col justify-center items-center text-center border-dashed border-2 border-slate-200 dark:border-slate-700 shadow-none hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 dark:hover:border-emerald-500 transition-all bg-white dark:bg-slate-800">
                        <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            📊
                        </div>
                        <h3 className="font-bold text-slate-800 dark:text-white">Laporan Keuangan</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Cek pendapatan bulanan</p>
                    </Card>
                </Link>
            </div>
        </AuthenticatedLayout>
    );
}
