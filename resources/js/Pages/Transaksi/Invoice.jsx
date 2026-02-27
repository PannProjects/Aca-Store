import { Head } from '@inertiajs/react';

export default function Invoice({ transaksi }) {
    const isGameAccount = transaksi.produk?.kategori_input === 'id_server';

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-900 py-8 print:py-0 print:bg-white flex items-center justify-center">
            <Head title={`Invoice #${transaksi.id}`} />
            
            <div className="bg-white dark:bg-slate-800 w-full max-w-2xl mx-auto rounded-none sm:rounded-2xl shadow-xl print:shadow-none print:w-full print:max-w-full overflow-hidden">
                {/* Header Pattern */}
                <div className="h-4 bg-gradient-to-r from-primary-600 to-indigo-600 print:bg-slate-900"></div>

                <div className="p-8 sm:p-12">
                    {/* Brand & Invoice Info */}
                    <div className="flex justify-between items-start mb-12">
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 dark:text-white print:text-black tracking-tighter">AcaStore<span className="text-primary-600 print:text-slate-600">.</span></h1>
                            <p className="text-sm text-slate-500 dark:text-slate-400 print:text-slate-500 mt-1">Layanan Topup Premium</p>
                        </div>
                        <div className="text-right">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white print:text-black uppercase tracking-widest text-primary-600 dark:text-primary-400 print:text-slate-800">INVOICE</h2>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 print:text-slate-600 mt-1">#INV-{String(transaksi.id).padStart(5, '0')}</p>
                            <p className="text-xs text-slate-400 dark:text-slate-500 print:text-slate-400 uppercase tracking-widest mt-1">
                                {new Date(transaksi.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                    </div>

                    {/* Customer & Order Basic Info */}
                    <div className="grid grid-cols-2 gap-8 mb-12 bg-slate-50 dark:bg-slate-800/50 print:bg-slate-50 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 print:border-slate-200">
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Ditagih Ke</p>
                            <p className="font-bold text-slate-900 dark:text-white print:text-black">{transaksi.user?.name}</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400 print:text-slate-600 mt-1">{transaksi.user?.email}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Status Pembayaran</p>
                            {transaksi.status === 'paid' ? (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200 print:text-black print:bg-transparent print:border-slate-300">
                                    <svg className="w-4 h-4 print:hidden" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                    LUNAS / BERHASIL
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200 print:text-black">
                                    {transaksi.status.toUpperCase()}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Order Items Table */}
                    <div className="mb-12 overflow-hidden border border-slate-200 dark:border-slate-700 print:border-slate-300 rounded-xl">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800 print:bg-slate-100 text-slate-500 dark:text-slate-400 print:text-slate-600 text-xs font-bold uppercase tracking-wider">
                                    <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 print:border-slate-300">Deskripsi Item</th>
                                    <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 print:border-slate-300 w-24 text-center">Kuantitas</th>
                                    <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 print:border-slate-300 w-40 text-right">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50 print:divide-slate-200">
                                <tr className="group">
                                    <td className="px-6 py-5">
                                        <p className="font-bold text-slate-900 dark:text-white print:text-black text-base group-hover:text-primary-600 transition-colors">
                                            {transaksi.produk?.nama}
                                        </p>
                                        <div className="mt-2 text-sm text-slate-500 dark:text-slate-400 print:text-slate-600 space-y-1">
                                            {isGameAccount ? (
                                                <>
                                                    <p><span className="font-medium text-slate-400 mr-2">Player ID:</span>{transaksi.game_id}</p>
                                                    <p><span className="font-medium text-slate-400 mr-2">Server/Zone ID:</span>{transaksi.server_id}</p>
                                                </>
                                            ) : null}
                                            {transaksi.catatan && (
                                                <p><span className="font-medium text-slate-400 mr-2">Catatan Pesanan:</span><i>{transaksi.catatan}</i></p>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-center font-medium text-slate-700 dark:text-slate-300 print:text-slate-800">
                                        {transaksi.kuantitas}x
                                    </td>
                                    <td className="px-6 py-5 text-right font-bold text-slate-900 dark:text-white print:text-black">
                                        Rp {transaksi.total_harga?.toLocaleString('id-ID')}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Summary & Totals */}
                    <div className="flex flex-col items-end pt-6 border-t border-slate-200 dark:border-slate-700 print:border-slate-300">
                        <div className="w-full max-w-sm space-y-4">
                            <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 print:text-slate-600">
                                <span>Metode Pembayaran</span>
                                <span className="font-bold uppercase">{transaksi.payment_method === 'qris' ? 'QR Code (QRIS)' : transaksi.payment_method}</span>
                            </div>
                            <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-700/50 print:border-slate-200">
                                <span className="text-base font-bold text-slate-900 dark:text-white print:text-slate-800">Total Tagihan</span>
                                <span className="text-2xl font-black text-primary-600 dark:text-primary-400 print:text-black">
                                    Rp {transaksi.total_harga?.toLocaleString('id-ID')}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Footer / Notes */}
                    <div className="mt-20 pt-8 border-t border-slate-100 dark:border-slate-800 print:border-slate-200 text-center text-sm text-slate-400 dark:text-slate-500">
                        <p className="font-bold tracking-wider uppercase mb-1">Terima Kasih Atas Kepercayaan Anda!</p>
                        <p>Simpan tanda terima ini sebagai bukti pembelian digital yang sah.</p>
                    </div>
                </div>
            </div>

            {/* Print Buttons (Hidden during actual print) */}
            <div className="fixed bottom-8 right-8 flex gap-4 print:hidden animate-fade-in-up">
                <button
                    onClick={() => window.history.back()}
                    className="px-6 py-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold rounded-full shadow-lg border border-slate-200 dark:border-slate-700 hover:scale-105 transition-transform"
                >
                    Kembali
                </button>
                <button
                    onClick={() => window.print()}
                    className="flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-full shadow-lg shadow-primary-600/30 hover:scale-105 active:scale-95 transition-all"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                    Print Tanda Terima
                </button>
            </div>
        </div>
    );
}
