import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';
import Card from '../../Components/Card';
import Button from '../../Components/Button';
import Pagination from '../../Components/Pagination';

const statusConfig = {
    pending: { label: 'Menunggu', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
    paid: { label: 'Dibayar', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
    completed: { label: 'Selesai', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
    failed: { label: 'Gagal', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
    cancelled: { label: 'Dibatalkan', color: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400' },
};

const tabs = [
    { key: 'pending', label: 'Menunggu', icon: '⏳' },
    { key: 'paid', label: 'Dibayar', icon: '💳' },
    { key: 'completed', label: 'Selesai', icon: '✅' },
    { key: 'failed', label: 'Gagal', icon: '❌' },
    { key: 'all', label: 'Semua', icon: '📋' },
];

export default function Pembayaran({ transactions, pendingCount, activeStatus }) {
    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    const [proofModalOpen, setProofModalOpen] = useState(false);
    const [proofImage, setProofImage] = useState('');
    const [selectedTrxId, setSelectedTrxId] = useState(null);
    const [rejectReason, setRejectReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const switchTab = (status) => {
        router.get('/admin/pembayaran', { status }, { preserveState: true });
    };

    const handleConfirm = (id) => {
        if (confirm('Yakin ingin mengkonfirmasi pembayaran ini?')) {
            router.post(`/admin/transaction/${id}/paid`);
        }
    };

    const openReject = (id) => {
        setSelectedTrxId(id);
        setRejectReason('');
        setRejectModalOpen(true);
    };

    const submitReject = () => {
        if (!rejectReason.trim()) { alert('Alasan penolakan wajib diisi'); return; }
        setIsSubmitting(true);
        router.post(`/admin/transaction/${selectedTrxId}/reject`, { alasan_penolakan: rejectReason }, {
            onFinish: () => { setRejectModalOpen(false); setIsSubmitting(false); }
        });
    };

    const handleDelete = (id) => {
        if (confirm('Yakin ingin HAPUS transaksi ini? Data tidak bisa dikembalikan.')) {
            router.delete(`/admin/transaction/${id}`);
        }
    };

    const openProof = (url) => {
        setProofImage(url);
        setProofModalOpen(true);
    };

    return (
        <AuthenticatedLayout title="Riwayat Transaksi">
            <Head title="Riwayat Transaksi" />

            {/* Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => switchTab(tab.key)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                            activeStatus === tab.key
                                ? 'bg-primary-600 text-white shadow-md shadow-primary-600/20'
                                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                        }`}
                    >
                        <span>{tab.icon}</span>
                        {tab.label}
                        {tab.key === 'pending' && pendingCount > 0 && (
                            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                                activeStatus === 'pending' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                            }`}>{pendingCount}</span>
                        )}
                    </button>
                ))}
            </div>

            {/* Transactions */}
            {transactions?.data?.length > 0 ? (
                <div className="space-y-4">
                    {transactions.data.map((trx) => {
                        const cfg = statusConfig[trx.status] || statusConfig.pending;
                        return (
                            <Card key={trx.id} className="border-0 shadow-sm overflow-hidden">
                                <Card.Body>
                                    <div className="flex flex-col lg:flex-row gap-6">
                                        {/* Transaction Info */}
                                        <div className="flex-1">
                                            <div className="flex items-start gap-4 mb-4">
                                                <div className="w-14 h-14 rounded-lg bg-slate-100 dark:bg-slate-700 overflow-hidden flex-shrink-0 border border-slate-200 dark:border-slate-600">
                                                    {trx.produk?.lokasi_gambar_url ? (
                                                        <img src={trx.produk.lokasi_gambar_url} alt={trx.produk?.nama} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">📦</div>
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400">#INV-{String(trx.id).padStart(5, '0')}</p>
                                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${cfg.color}`}>{cfg.label}</span>
                                                    </div>
                                                    <h3 className="font-bold text-slate-900 dark:text-white text-lg mt-0.5">{trx.produk?.nama || 'Produk Dihapus'}</h3>
                                                    <p className="text-sm text-slate-600 dark:text-slate-300">
                                                        User: <span className="font-medium text-slate-900 dark:text-white">{trx.user?.name || '-'}</span>
                                                        <span className="text-slate-400 ml-1">({trx.user?.email})</span>
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Detail Grid */}
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 border border-slate-100 dark:border-slate-700">
                                                <div>
                                                    <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold mb-1">Qty</p>
                                                    <p className="text-slate-900 dark:text-white font-medium">{trx.kuantitas}x</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold mb-1">Total</p>
                                                    <p className="text-emerald-600 dark:text-emerald-400 font-bold">
                                                        Rp {trx.total_harga?.toLocaleString('id-ID', { maximumFractionDigits: 0 })}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold mb-1">Metode</p>
                                                    <p className="text-slate-900 dark:text-white font-medium uppercase text-xs">{trx.payment_method || '-'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold mb-1">Tanggal</p>
                                                    <p className="text-slate-900 dark:text-white font-medium text-xs">
                                                        {new Date(trx.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </div>

                                                {/* Game ID & Server */}
                                                {trx.produk?.kategori_input === 'id_server' ? (
                                                    <>
                                                        <div>
                                                            <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold mb-1">Game ID</p>
                                                            <p className="text-slate-900 dark:text-white font-medium font-mono">{trx.game_id || '-'}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold mb-1">Server ID</p>
                                                            <p className="text-slate-900 dark:text-white font-medium font-mono">{trx.server_id || '-'}</p>
                                                        </div>
                                                    </>
                                                ) : null}

                                                {trx.catatan && (
                                                    <div className="col-span-2 md:col-span-4">
                                                        <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold mb-1">Catatan</p>
                                                        <p className="text-slate-900 dark:text-white font-medium text-sm">{trx.catatan}</p>
                                                    </div>
                                                )}

                                                {trx.alasan_penolakan && (
                                                    <div className="col-span-2 md:col-span-4">
                                                        <p className="text-[10px] text-red-500 uppercase tracking-wider font-bold mb-1">Alasan Penolakan</p>
                                                        <p className="text-red-600 dark:text-red-400 font-medium text-sm">{trx.alasan_penolakan}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Right Side: Proof & Actions */}
                                        <div className="lg:w-56 flex flex-col gap-3">
                                            {/* Bukti Pembayaran */}
                                            <div className="bg-slate-50 dark:bg-slate-900/50 p-2 rounded-xl border border-slate-200 dark:border-slate-700">
                                                <p className="text-[10px] text-center text-slate-400 mb-1.5 font-bold uppercase tracking-wider">Bukti Transfer</p>
                                                {trx.bukti_pembayaran_url ? (
                                                    <button onClick={() => openProof(trx.bukti_pembayaran_url)} className="block w-full relative group overflow-hidden rounded-lg cursor-pointer">
                                                        <img src={trx.bukti_pembayaran_url} alt="Bukti" className="w-full h-28 object-cover transition-transform duration-500 group-hover:scale-110" />
                                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                                                            <span className="opacity-0 group-hover:opacity-100 text-white text-xs font-bold bg-black/50 px-3 py-1.5 rounded-lg">🔍 Perbesar</span>
                                                        </div>
                                                    </button>
                                                ) : (
                                                    <div className="w-full h-28 bg-slate-200 dark:bg-slate-700 rounded-lg flex items-center justify-center text-slate-400 text-xs">Tidak ada bukti</div>
                                                )}
                                            </div>

                                            {/* Actions */}
                                            <div className="flex flex-col gap-2">
                                                {trx.status === 'pending' && (
                                                    <div className="flex gap-2">
                                                        <Button variant="primary" size="sm" onClick={() => handleConfirm(trx.id)} className="flex-1 justify-center bg-emerald-600 hover:bg-emerald-700 dark:text-white text-xs">
                                                            ✓ Terima
                                                        </Button>
                                                        <Button variant="danger" size="sm" onClick={() => openReject(trx.id)} className="flex-1 justify-center dark:text-white text-xs">
                                                            ✕ Tolak
                                                        </Button>
                                                    </div>
                                                )}
                                                <Button variant="secondary" size="sm" onClick={() => handleDelete(trx.id)} className="w-full justify-center text-xs text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20">
                                                    🗑️ Hapus Transaksi
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        );
                    })}
                </div>
            ) : (
                <div className="p-16 text-center bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                    <p className="text-4xl mb-3">{activeStatus === 'pending' ? '🎉' : '📭'}</p>
                    <p className="font-medium text-slate-600 dark:text-slate-300">
                        {activeStatus === 'pending' ? 'Semua pembayaran sudah diproses!' : 'Tidak ada transaksi'}
                    </p>
                    <p className="text-sm text-slate-400 mt-1">
                        {activeStatus === 'pending' ? 'Tidak ada yang menunggu verifikasi' : `Belum ada transaksi dengan status "${tabs.find(t => t.key === activeStatus)?.label || activeStatus}"`}
                    </p>
                </div>
            )}

            <Pagination links={transactions?.links} />

            {/* Reject Modal */}
            {rejectModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => !isSubmitting && setRejectModalOpen(false)}>
                    <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md shadow-2xl p-6 border border-slate-200 dark:border-slate-700" onClick={e => e.stopPropagation()}>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Tolak Pembayaran</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                            Stok produk akan dikembalikan dan user akan menerima notifikasi.
                        </p>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Alasan Penolakan</label>
                            <textarea
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                className="w-full rounded-xl border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white shadow-sm focus:border-red-500 focus:ring-red-500 min-h-[100px]"
                                placeholder="Contoh: Bukti transfer tidak valid/blur."
                                autoFocus
                            />
                        </div>
                        <div className="flex justify-end gap-3">
                            <Button variant="secondary" onClick={() => !isSubmitting && setRejectModalOpen(false)} disabled={isSubmitting}>Batal</Button>
                            <Button variant="danger" onClick={submitReject} disabled={isSubmitting}>
                                {isSubmitting ? 'Menolak...' : 'Konfirmasi Tolak'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Image Preview Modal */}
            {proofModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 cursor-pointer" onClick={() => setProofModalOpen(false)}>
                    <div className="relative max-w-2xl w-full max-h-[85vh]" onClick={e => e.stopPropagation()}>
                        <button onClick={() => setProofModalOpen(false)} className="absolute -top-3 -right-3 w-8 h-8 bg-white dark:bg-slate-700 rounded-full shadow-lg flex items-center justify-center text-slate-500 hover:text-red-500 z-10 text-sm font-bold">✕</button>
                        <img src={proofImage} alt="Bukti Pembayaran" className="w-full h-auto max-h-[85vh] object-contain rounded-xl shadow-2xl" />
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
