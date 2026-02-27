import { Head, Link, usePage } from '@inertiajs/react';
import Card from '../../Components/Card';
import Button from '../../Components/Button';
import { useTheme } from '../../Hooks/useTheme';

export default function Show({ produk, avgRating }) {
    const { auth } = usePage().props;
    const { theme, toggleTheme } = useTheme();

    return (
        <>
            <Head>
                <title>{`Beli ${produk?.nama || 'Produk'} Termurah`}</title>
                <meta head-key="description" name="description" content={produk?.deskripsi?.substring(0, 150) + '...'} />
                <meta head-key="og:title" property="og:title" content={`Beli ${produk?.nama} Termurah - AcaStore`} />
                <meta head-key="og:description" property="og:description" content={produk?.deskripsi?.substring(0, 150) + '...'} />
                {produk?.lokasi_gambar_url && <meta head-key="og:image" property="og:image" content={produk.lokasi_gambar_url} />}
            </Head>

            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
                {/* Navbar (Simplified for internal page) */}
                <nav className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50 transition-colors duration-300">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                         <Link href="/" className="font-bold text-slate-900 dark:text-white text-xl">
                            Aca<span className="text-primary-600 dark:text-primary-400">Store</span>
                        </Link>
                        
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={toggleTheme}
                                className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                            >
                                {theme === 'dark' ? '☀️' : '🌙'}
                            </button>

                            {auth?.user ? (
                                <Link href="/dashboard" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400">Dashboard</Link>
                            ) : (
                                <Link href="/login" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400">Masuk</Link>
                            )}
                        </div>
                    </div>
                </nav>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        {/* Image Column */}
                        <div className="lg:col-span-5">
                            <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700 sticky top-24 transition-colors duration-300">
                                <div className="aspect-square bg-slate-100 dark:bg-slate-900 relative">
                                    {produk?.lokasi_gambar ? (
                                        <img
                                            src={produk.lokasi_gambar_url}
                                            alt={produk.nama}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-slate-600">
                                            No Image
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Detail Column */}
                        <div className="lg:col-span-7">
                            <Link href="/" className="inline-flex items-center text-sm text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 mb-6 group">
                                <span className="mr-1 group-hover:-translate-x-1 transition-transform">←</span> Kembali
                            </Link>

                            <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">{produk?.nama}</h1>
                            
                            <div className="flex items-center gap-4 mb-6">
                                <span className="flex items-center gap-1 text-slate-700 dark:text-slate-200 font-medium bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full text-sm">
                                    <span className="text-amber-400">★</span>
                                    {avgRating ? Number(avgRating).toFixed(1) : 'Belum ada rating'}
                                </span>
                                <span className={`text-sm px-3 py-1 rounded-full font-medium ${produk?.stok > 0 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                                    {produk?.stok > 0 ? `Stok: ${produk.stok}` : 'Stok Habis'}
                                </span>
                            </div>

                            <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-8">
                                Rp {produk?.harga?.toLocaleString('id-ID', { maximumFractionDigits: 0 })}
                            </div>

                            <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 mb-10 leading-relaxed">
                                {produk?.deskripsi}
                            </div>

                            <div className="flex flex-col gap-4 p-6 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-10 border border-slate-200 dark:border-slate-700">
                                <div className="flex justify-between items-center text-sm text-slate-500 dark:text-slate-400">
                                    <span>Proses Otomatis</span>
                                    <span className="font-semibold text-slate-900 dark:text-white">1-5 Menit</span>
                                </div>
                                <div className="flex justify-between items-center text-sm text-slate-500 dark:text-slate-400">
                                    <span>Layanan Pelanggan</span>
                                    <span className="font-semibold text-slate-900 dark:text-white">24/7 Support</span>
                                </div>
                            </div>

                            {auth?.user ? (
                                produk?.stok > 0 ? (
                                    <Link href={`/checkout/${produk?.id}`}>
                                        <Button variant="primary" size="xl" className="w-full shadow-primary-500/25">
                                            Beli Sekarang
                                        </Button>
                                    </Link>
                                ) : (
                                    <Button variant="ghost" size="xl" className="w-full bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500" disabled>
                                        Stok Habis
                                    </Button>
                                )
                            ) : (
                                <Link href="/login">
                                    <Button variant="secondary" size="xl" className="w-full">
                                        Login untuk Membeli
                                    </Button>
                                </Link>
                            )}

                            {/* Reviews Section */}
                            <div className="mt-16 pt-10 border-t border-slate-200 dark:border-slate-700">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Ulasan Pengguna</h3>
                                {produk?.ratings && produk.ratings.length > 0 ? (
                                    <div className="space-y-6">
                                        {produk.ratings.map((rating) => (
                                            <div key={rating.id} className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <span className="font-bold text-slate-900 dark:text-white block">{rating.user?.name}</span>
                                                        <span className="text-xs text-slate-400">{new Date(rating.created_at).toLocaleDateString('id-ID')}</span>
                                                    </div>
                                                    <span className="text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded text-sm font-bold">★ {rating.rating}</span>
                                                </div>
                                                <p className="text-slate-600 dark:text-slate-300 mt-2">{rating.review}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-slate-500 dark:text-slate-400 italic">Belum ada ulasan untuk produk ini.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
