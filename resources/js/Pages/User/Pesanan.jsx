import { Head, Link, usePage, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';
import Card from '../../Components/Card';
import Button from '../../Components/Button';
import Pagination from '../../Components/Pagination';

export default function Pesanan({ transaksis }) {
    const { flash } = usePage().props;
    const [ratingModalOpen, setRatingModalOpen] = useState(false);
    const [selectedProdukId, setSelectedProdukId] = useState(null);
    const [ratingValue, setRatingValue] = useState(5);
    const [reviewText, setReviewText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (flash?.whatsapp_url) {
            window.open(flash.whatsapp_url, '_blank');
        }
    }, [flash]);

    const openRatingModal = (produkId) => {
        setSelectedProdukId(produkId);
        setRatingValue(5);
        setReviewText('');
        setRatingModalOpen(true);
    };

    const submitRating = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        router.post('/rate', {
            produk_id: selectedProdukId,
            rating: ratingValue,
            review: reviewText
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setRatingModalOpen(false);
                setIsSubmitting(false);
            },
            onError: () => setIsSubmitting(false)
        });
    };
    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/30',
            paid: 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/30',
            cancelled: 'bg-red-50 text-red-700 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/30',
            failed: 'bg-red-50 text-red-700 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/30',
            default: 'bg-slate-50 text-slate-700 border-slate-100 dark:bg-slate-700/50 dark:text-slate-400 dark:border-slate-600/50',
        };
        return colors[status] || colors.default;
    };

    return (
        <AuthenticatedLayout title="Pesanan Saya">
            <Head title="Pesanan Saya" />

            {transaksis?.data?.length > 0 ? (
                <div className="space-y-4">
                    {transaksis.data.map((transaksi) => (
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
                                            {transaksi.status === 'failed' ? 'ditolak' : transaksi.status}
                                        </span>
                                    </div>

                                    {/* Alasan Penolakan Alert */}
                                    {transaksi.status === 'failed' && transaksi.alasan_penolakan && (
                                        <div className="mt-4 p-3 bg-red-50/50 dark:bg-red-900/10 rounded-lg border border-red-100 dark:border-red-900/30">
                                            <p className="text-xs font-bold text-red-800 dark:text-red-400 mb-1 uppercase tracking-wide">Alasan Penolakan:</p>
                                            <p className="text-sm text-red-600 dark:text-red-400/80">{transaksi.alasan_penolakan}</p>
                                        </div>
                                    )}
                                    
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
                                            <p className="text-xs text-slate-400 font-bold uppercase text-right leading-none mb-1">Total Harga</p>
                                            <p className="text-lg font-bold text-primary-600 dark:text-primary-400 leading-none">
                                                Rp {transaksi.total_harga?.toLocaleString('id-ID')}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    {/* Action Buttons for Paid */}
                                    {transaksi.status === 'paid' && (
                                        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/50 flex flex-wrap gap-2 justify-end">
                                            <a 
                                                href={`/invoice/${transaksi.id}`} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 dark:text-slate-200 dark:bg-slate-800 dark:border-slate-600 dark:hover:bg-slate-700 rounded-lg transition-colors shadow-sm active:scale-95"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                                                Cetak Nota
                                            </a>
                                            <Button size="sm" onClick={() => openRatingModal(transaksi.produk_id)} className="gap-2 shrink-0">
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                                Beri Ulasan
                                            </Button>
                                        </div>
                                    )}
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

            <Pagination links={transaksis?.links} />

            {/* Rating Modal */}
            {ratingModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-700 animate-slide-up">
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Beri Ulasan</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Bagaimana pengalaman belanja Anda untuk produk ini?</p>
                            
                            <form onSubmit={submitRating} className="space-y-6">
                                <div className="flex justify-center gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRatingValue(star)}
                                            className={`p-2 transition-transform hover:scale-110 focus:outline-none ${ratingValue >= star ? 'text-amber-400' : 'text-slate-300 dark:text-slate-600'}`}
                                        >
                                            <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        </button>
                                    ))}
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Tulis Pengalaman Anda (Opsional)</label>
                                    <textarea
                                        rows={4}
                                        value={reviewText}
                                        onChange={(e) => setReviewText(e.target.value)}
                                        placeholder="Pesanan masuk super cepat! Recommended banget..."
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all resize-none shadow-sm"
                                        maxLength={1000}
                                    />
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <Button type="button" variant="secondary" onClick={() => setRatingModalOpen(false)} className="flex-1 justify-center">Batal</Button>
                                    <Button type="submit" disabled={isSubmitting} className="flex-1 justify-center relative">
                                        {isSubmitting ? (
                                            <span className="flex items-center gap-2">
                                                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                                                Mengirim...
                                            </span>
                                        ) : 'Kirim Ulasan'}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
