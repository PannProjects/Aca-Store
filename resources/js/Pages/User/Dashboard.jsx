import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';
import Card from '../../Components/Card';
import Button from '../../Components/Button';

export default function Dashboard({ transaksis, totalPengeluaran }) {
    return (
        <AuthenticatedLayout title="Dashboard Saya">
            <Head title="Dashboard" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Stats Card - Bento Style */}
                <div className="md:col-span-2 bg-white dark:bg-slate-800 rounded-2xl p-5 md:p-8 border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden flex flex-col justify-center transition-colors">
                    <div className="relative z-10">
                        <p className="text-slate-500 dark:text-slate-400 font-medium mb-2">Total Pengeluaran</p>
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
                            Rp {totalPengeluaran?.toLocaleString('id-ID', { maximumFractionDigits: 0 }) || '0'}
                        </h2>
                        <p className="text-sm text-slate-400 dark:text-slate-500 mt-2">Terupdate secara real-time</p>
                    </div>
                     <div className="absolute right-0 bottom-0 opacity-5 dark:opacity-10 pointer-events-none">
                        <svg className="w-64 h-64 text-slate-900 dark:text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                </div>

                {/* Quick Action Profile */}
                <div className="bg-primary-600 dark:bg-primary-700 rounded-2xl p-5 md:p-8 border border-primary-500 dark:border-primary-600 shadow-sm text-white flex flex-col justify-between">
                    <div>
                        <h3 className="text-xl font-bold mb-2">Profil Kamu</h3>
                        <p className="text-primary-100 text-sm">Update informasi akunmu untuk keamanan yang lebih baik.</p>
                    </div>
                    <Link href="/profile">
                        <Button variant="ghost" className="bg-white/10 text-white hover:bg-white/20 border-0 w-full justify-between mt-4">
                            Edit Profil →
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Recent Orders & Quick Menu */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white">Transaksi Terakhir</h3>
                        <Link href="/pesanan" className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700">
                            Lihat Semua
                        </Link>
                    </div>
                    
                    <Card className="overflow-hidden border-0 shadow-sm">
                         {transaksis?.length > 0 ? (
                            <div className="divide-y divide-slate-100 dark:divide-slate-700">
                                {transaksis.map((transaksi) => (
                                    <div key={transaksi.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-700 overflow-hidden flex-shrink-0">
                                             {transaksi.produk?.lokasi_gambar && (
                                                <img src={transaksi.produk.lokasi_gambar_url} className="w-full h-full object-cover" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">{transaksi.produk?.nama}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">{new Date(transaksi.created_at).toLocaleDateString('id-ID')}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-slate-900 dark:text-white">
                                                Rp {transaksi.total_harga?.toLocaleString('id-ID', { maximumFractionDigits: 0 })}
                                            </p>
                                            <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${
                                                transaksi.status === 'paid' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                                transaksi.status === 'pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                                                'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
                                            }`}>
                                                {transaksi.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                         ) : (
                            <div className="p-8 text-center text-slate-400">Belum ada transaksi</div>
                         )}
                    </Card>
                </div>

                <div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Akses Cepat</h3>
                    <div className="space-y-3">
                         <Link href="/" className="block">
                            <Card hover className="p-4 flex items-center gap-4 group">
                                <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                    🛒
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-900 dark:text-white">Belanja Lagi</h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Cari produk baru</p>
                                </div>
                            </Card>
                         </Link>
                         <Link href="/pesanan" className="block">
                            <Card hover className="p-4 flex items-center gap-4 group">
                                <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                    📦
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-900 dark:text-white">Cek Pesanan</h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Lihat status pesanan</p>
                                </div>
                            </Card>
                         </Link>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
