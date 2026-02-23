import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';
import Card from '../../Components/Card';
import Button from '../../Components/Button';

export default function Pesanan({ transaksis }) {
    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/30',
            paid: 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/30',
            cancelled: 'bg-red-50 text-red-700 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/30',
            default: 'bg-slate-50 text-slate-700 border-slate-100 dark:bg-slate-700/50 dark:text-slate-400 dark:border-slate-600/50',
        };
        return colors[status] || colors.default;
    };

    return (
        <AuthenticatedLayout title="Pesanan Saya">
            <Head title="Pesanan Saya" />

            {transaksis?.length > 0 ? (
                <div className="space-y-4">
                    {transaksis.map((transaksi) => (
                        <div key={transaksi.id} className="bg-white dark:bg-slate-800 rounded-xl p-4 sm:p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                            <div className="flex flex-col sm:flex-row gap-6">
                                {/* Image */}
                                <div className="w-20 h-20 rounded-lg bg-slate-100 dark:bg-slate-700 overflow-hidden flex-shrink-0 border border-slate-100 dark:border-slate-700">
                                    {transaksi.produk?.lokasi_gambar ? (
                                        <img src={transaksi.produk.lokasi_gambar_url} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="flex items-center justify-center w-full h-full text-slate-400 text-xs">No Img</div>
                                    )}
                                </div>

                                {/* Main Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-slate-900 dark:text-white text-lg">{transaksi.produk?.nama}</h3>
                                            <div className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 space-y-1">
                                                {transaksi.produk?.kategori_input === 'id_server' ? (
                                                    <>
                                                        <p>ID: {transaksi.game_id} • Server: {transaksi.server_id}</p>
                                                        {transaksi.catatan && <p className="italic">Catatan: {transaksi.catatan}</p>}
                                                    </>
                                                ) : (
                                                    <p>Catatan: {transaksi.catatan}</p>
                                                )}
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${getStatusColor(transaksi.status)}`}>
                                            {transaksi.status}
                                        </span>
                                    </div>
                                    
                                    <div className="mt-4 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-50 dark:border-slate-700">
                                        <div className="flex gap-6">
                                            <div>
                                                <p className="text-xs text-slate-400 font-bold uppercase">Tanggal</p>
                                                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                    {new Date(transaksi.created_at).toLocaleDateString('id-ID')}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-400 font-bold uppercase">Jumlah</p>
                                                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{transaksi.kuantitas}x</p>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-400 font-bold uppercase text-right">Total Harga</p>
                                            <p className="text-lg font-bold text-primary-600 dark:text-primary-400">
                                                Rp {transaksi.total_harga?.toLocaleString('id-ID', { maximumFractionDigits: 0 })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="p-12 text-center bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                    <div className="text-4xl mb-4">📭</div>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Belum ada pesanan</p>
                    <Link href="/" className="inline-block mt-4 text-primary-600 dark:text-primary-400 hover:text-primary-700 font-medium">
                        Mulai Belanja →
                    </Link>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
