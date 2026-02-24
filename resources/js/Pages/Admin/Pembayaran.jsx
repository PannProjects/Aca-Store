import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';
import Card from '../../Components/Card';
import Button from '../../Components/Button';

export default function Pembayaran({ pendingTransactions }) {
    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    const [selectedTrxId, setSelectedTrxId] = useState(null);
    const [rejectReason, setRejectReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAction = (id, status) => {
        if (status === 'paid') {
            if (confirm(`Yakin ingin mengkonfirmasi pembayaran ini?`)) {
                router.post(`/admin/transaction/${id}/${status}`);
            }
        } else {
            setSelectedTrxId(id);
            setRejectReason('');
            setRejectModalOpen(true);
        }
    };

    const submitReject = () => {
        if (!rejectReason.trim()) {
            alert('Alasan penolakan wajib diisi');
            return;
        }
        setIsSubmitting(true);
        router.post(`/admin/transaction/${selectedTrxId}/reject`, {
            alasan_penolakan: rejectReason
        }, {
            onFinish: () => {
                setRejectModalOpen(false);
                setIsSubmitting(false);
            }
        });
    };

    return (
        <AuthenticatedLayout title="Verifikasi Pembayaran">
            <Head title="Verifikasi Pembayaran" />

            {pendingTransactions?.length > 0 ? (
                <div className="space-y-4">
                    {pendingTransactions.map((trx) => (
                        <Card key={trx.id} className="border-0 shadow-sm">
                            <Card.Body>
                                <div className="flex flex-col lg:flex-row gap-8">
                                    {/* Transaction Info */}
                                    <div className="flex-1">
                                        <div className="flex items-start gap-4">
                                            <div className="w-14 h-14 rounded-lg bg-slate-100 dark:bg-slate-700 overflow-hidden flex-shrink-0 border border-slate-200 dark:border-slate-600">
                                                {trx.produk?.lokasi_gambar ? (
                                                    <img src={trx.produk.lokasi_gambar_url} alt={trx.produk?.nama} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">No img</div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-0.5">#INV-{String(trx.id).padStart(5, '0')}</p>
                                                <h3 className="font-bold text-slate-900 dark:text-white text-lg">{trx.produk?.nama || 'Produk'}</h3>
                                                <p className="text-sm text-slate-600 dark:text-slate-300">
                                                    User: <span className="font-medium text-slate-900 dark:text-white">{trx.user?.name}</span> ({trx.user?.email})
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100 dark:border-slate-700">
                                            <div>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide font-bold mb-1">Qty</p>
                                                <p className="text-slate-900 dark:text-white font-medium">{trx.kuantitas}</p>
                                            </div>
                                            {trx.produk?.kategori_input === 'id_server' ? (
                                                <>
                                                    <div>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide font-bold mb-1">Game ID</p>
                                                        <p className="text-slate-900 dark:text-white font-medium">{trx.game_id}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide font-bold mb-1">Server ID</p>
                                                        <p className="text-slate-900 dark:text-white font-medium">{trx.server_id}</p>
                                                    </div>
                                                    {trx.catatan && (
                                                        <div className="col-span-2 md:col-span-4">
                                                            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide font-bold mb-1">Catatan Tambahan</p>
                                                            <p className="text-slate-900 dark:text-white font-medium">{trx.catatan}</p>
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
                                                <div className="col-span-2 md:col-span-3">
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide font-bold mb-1">Catatan</p>
                                                    <p className="text-slate-900 dark:text-white font-medium">{trx.catatan}</p>
                                                </div>
                                            )}
                                            
                                            <div className="md:col-span-4 mt-2">
                                                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide font-bold mb-1">Total</p>
                                                <p className="text-primary-600 dark:text-primary-400 font-bold">
                                                    Rp {trx.total_harga?.toLocaleString('id-ID', { maximumFractionDigits: 0 })}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Proof & Actions */}
                                    <div className="lg:w-64 flex flex-col gap-4">
                                        <div className="bg-slate-50 dark:bg-slate-800/50 p-2 rounded-xl border border-slate-200 dark:border-slate-700">
                                            <p className="text-xs text-center text-slate-400 dark:text-slate-500 mb-2 font-medium">Bukti Pembayaran</p>
                                            {trx.bukti_pembayaran ? (
                                                <a href={trx.bukti_pembayaran_url} target="_blank" rel="noopener noreferrer" className="block relative group overflow-hidden rounded-lg">
                                                    <img src={trx.bukti_pembayaran_url} alt="Bukti" className="w-full h-32 object-cover transition-transform duration-500 group-hover:scale-110" />
                                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                                        <span className="opacity-0 group-hover:opacity-100 text-white text-xs font-bold bg-black/50 px-2 py-1 rounded">Lihat</span>
                                                    </div>
                                                </a>
                                            ) : (
                                                <div className="w-full h-32 bg-slate-200 dark:bg-slate-700 rounded-lg flex items-center justify-center text-slate-400 text-xs">Tidak ada</div>
                                            )}
                                        </div>

                                        <div className="flex gap-2">
                                            <Button variant="primary" size="sm" onClick={() => handleAction(trx.id, 'paid')} className="flex-1 justify-center bg-emerald-600 hover:bg-emerald-700 dark:text-white">
                                                TERIMA
                                            </Button>
                                            <Button variant="danger" size="sm" onClick={() => handleAction(trx.id, 'cancelled')} className="flex-1 justify-center dark:text-white">
                                                TOLAK
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="p-12 text-center bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                    <p className="text-slate-400">Tidak ada pembayaran pending</p>
                </div>
            )}

            {/* Reject Modal */}
            {rejectModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md shadow-2xl p-6 border border-slate-200 dark:border-slate-700">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Revisi / Tolak Pembayaran</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                            Sistem akan mengembalikan stok produk kepada sistem secara otomatis dan mengubah status transaksi pembeli menjadi gagal.
                        </p>
                        
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Alasan Penolakan</label>
                            <textarea
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                className="w-full rounded-xl border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white shadow-sm focus:border-red-500 focus:ring-red-500 min-h-[100px]"
                                placeholder="Contoh: Bukti transfer tidak valid/blur."
                            />
                        </div>

                        <div className="flex justify-end gap-3">
                            <Button 
                                variant="secondary" 
                                onClick={() => !isSubmitting && setRejectModalOpen(false)}
                                disabled={isSubmitting}
                            >
                                Batal
                            </Button>
                            <Button 
                                variant="danger" 
                                onClick={submitReject}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Menolak...' : 'Konfirmasi Tolak'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
