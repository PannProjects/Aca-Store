import { Head, Link, usePage } from '@inertiajs/react';
import Card from '../Components/Card';
import Button from '../Components/Button';
import { useState } from 'react';
import { useTheme } from '../Hooks/useTheme';

export default function Welcome({ produks, reviews }) {
    const { auth } = usePage().props;
    const [search, setSearch] = useState('');
    const { theme, toggleTheme } = useTheme();

    const filteredProduks = produks?.filter(p => 
        p.nama.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <>
            <Head>
                <title>Topup Game Termurah - AcaStore</title>
                <meta head-key="description" name="description" content="Platform topup produk game termurah dan terpercaya di Indonesia. Beli chip, diamond, voucher otomatis 24/7." />
                <meta head-key="og:title" property="og:title" content="Topup Game Termurah - AcaStore" />
                <meta head-key="og:description" property="og:description" content="Platform topup produk game termurah dan terpercaya di Indonesia. Beli chip, diamond, voucher otomatis 24/7." />
            </Head>

            <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0f172a] selection:bg-primary-100 selection:text-primary-900 font-sans transition-colors duration-300">
                
                {/* Floating Navbar - Pill Shape */}
                <div className="fixed top-4 md:top-6 left-0 right-0 z-50 flex justify-center px-4">
                    <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/40 dark:border-slate-800/40 shadow-xl shadow-slate-200/40 dark:shadow-black/20 rounded-full px-4 py-3 md:px-6 flex items-center justify-between gap-4 md:gap-8 max-w-4xl w-full">
                        <Link href="/" className="text-xl font-bold tracking-tighter text-slate-900 dark:text-white shrink-0">
                            Aca<span className="text-primary-600">Store.</span>
                        </Link>

                        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-500 dark:text-slate-400">
                            <a href="#products" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Produk</a>
                            <a href="#features" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Fitur</a>
                            <a href="#faq" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Bantuan</a>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                            <button 
                                onClick={toggleTheme}
                                className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                            >
                                {theme === 'dark' ? '☀️' : '🌙'}
                            </button>

                            {auth?.user ? (
                                <Link href={auth.user.role === 'admin' ? '/admin' : '/dashboard'}>
                                    <button className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-2 rounded-full text-sm font-bold hover:bg-slate-800 dark:hover:bg-slate-100 transition-all hover:scale-105 active:scale-95">
                                        Dashboard
                                    </button>
                                </Link>
                            ) : (
                                <>
                                    <Link href="/login" className="hidden sm:block text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-white">
                                        Masuk
                                    </Link>
                                    <Link href="/register">
                                        <button className="bg-primary-600 text-white px-5 py-2 rounded-full text-sm font-bold shadow-lg shadow-primary-500/30 hover:bg-primary-700 transition-all hover:scale-105 active:scale-95">
                                            Daftar
                                        </button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>
                </div>

                {/* Hero Section - Centered & Clean */}
                <div className="relative pt-32 md:pt-40 pb-20 px-4 overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-primary-50/50 to-transparent dark:from-primary-900/20 dark:to-transparent rounded-full blur-3xl -z-10"></div>
                    
                    <div className="max-w-4xl mx-auto text-center relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 mb-6 animate-fade-in-up">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            Proses Otomatis 24/7
                        </div>
                        
                        <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6 leading-[1.1] animate-fade-in-up delay-100">
                            Topup Game <br className="hidden md:block"/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600 dark:from-primary-400 dark:to-indigo-400">
                                Tanpa Ribet.
                            </span>
                        </h1>
                        
                        <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up delay-200">
                            Platform topup produk game termurah dan terpercaya di Indonesia. Proses detik, harga bersahabat, dan layanan pelanggan prioritas.
                        </p>

                        {/* Search Bar - Replaces CTA */}
                        <div className="max-w-lg mx-auto relative group animate-fade-in-up delay-300">
                            <div className="absolute inset-0 bg-primary-500/20 rounded-2xl blur-xl group-hover:bg-primary-500/30 transition-all opacity-50 duration-500"></div>
                            <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-black/30 border border-slate-100 dark:border-slate-700 flex items-center p-2 transition-colors">
                                <span className="pl-4 text-slate-400">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                </span>
                                <input 
                                    type="text" 
                                    placeholder="Cari produk game favoritmu..." 
                                    className="w-full px-4 py-3 bg-transparent border-none outline-none text-slate-900 dark:text-white placeholder-slate-400 font-medium"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                <div className="hidden sm:flex items-center gap-1 pr-2 text-xs text-slate-400 font-mono border-l border-slate-100 dark:border-slate-700 pl-3">
                                    <span>⌘</span><span>K</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Testimonials Section */}
                {reviews?.length > 0 && (
                    <section className="py-16 md:py-24 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors duration-300">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center mb-12">
                                <h2 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
                                    Apa Kata <span className="text-primary-600 dark:text-primary-400">Mereka?</span>
                                </h2>
                                <p className="text-slate-500 dark:text-slate-400 text-lg">Ribuan gamers telah mempercayakan topup mereka di AcaStore.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {reviews.map((review) => (
                                    <div key={review.id} className="bg-slate-50 dark:bg-slate-800 p-6 flex flex-col justify-between rounded-2xl border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all hover:-translate-y-1">
                                        <div>
                                            <div className="flex gap-1 text-amber-400 mb-4">
                                                {[...Array(review.rating)].map((_, i) => (
                                                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                ))}
                                            </div>
                                            <p className="text-slate-700 dark:text-slate-300 italic mb-6 leading-relaxed">"{review.komentar}"</p>
                                        </div>
                                        <div className="flex items-center gap-3 pt-4 border-t border-slate-200 dark:border-slate-700 mt-auto">
                                            <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold uppercase shrink-0">
                                                {review.user?.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900 dark:text-white text-sm">{review.user?.name}</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate max-w-[200px]">Membeli {review.produk?.nama}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Features Marquee (Static for now but styled like marquee) */}
                <div className="border-y border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm py-6 overflow-hidden">
                    <div className="flex justify-center gap-8 md:gap-16 text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest text-sm text-center flex-wrap px-4">
                        <span className="flex items-center gap-2"><svg className="w-5 h-5 text-primary-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg> Resmi</span>
                        <span className="flex items-center gap-2"><svg className="w-5 h-5 text-primary-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"/></svg> Instan</span>
                        <span className="flex items-center gap-2"><svg className="w-5 h-5 text-primary-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg> Aman</span>
                        <span className="flex items-center gap-2"><svg className="w-5 h-5 text-primary-500" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z"/><path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd"/></svg> Murah</span>
                    </div>
                </div>

                {/* Products Grid - Masonry-ish Feel */}
                <div id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                    <div className="flex items-end justify-between mb-12">
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Pilih Produk</h2>
                            <p className="text-slate-500 dark:text-slate-400 mt-2">Daftar produk game yang tersedia.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                        {filteredProduks?.map((produk) => (
                            <div key={produk.id} className="group relative">
                                {produk.is_active ? (
                                    <Link href={`/produk/${produk.id}`} className="absolute inset-0 z-10">
                                        <span className="sr-only">View {produk.nama}</span>
                                    </Link>
                                ) : null}
                                
                                <div className={`aspect-[3/4] rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm transition-all duration-300 ${produk.is_active ? 'hover:shadow-xl hover:translate-y-[-4px]' : 'opacity-75 grayscale'}`}>
                                    <div className="w-full h-full bg-slate-100 dark:bg-slate-900 relative">
                                        {produk.lokasi_gambar ? (
                                            <img
                                                src={produk.lokasi_gambar_url}
                                                alt={produk.nama}
                                                className={`w-full h-full object-cover transition-transform duration-700 ${produk.is_active ? 'group-hover:scale-110' : ''}`}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 dark:text-slate-600 p-4 text-center">
                                                <span className="text-4xl mb-2">🎮</span>
                                                <span className="text-xs font-bold uppercase">No Image</span>
                                            </div>
                                        )}
                                        
                                        {!produk.is_active && (
                                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20 backdrop-blur-[2px]">
                                                <div className="bg-red-500 text-white px-4 py-2 rounded-full font-bold uppercase tracking-widest text-sm shadow-lg transform -rotate-12 border-2 border-white/20">
                                                    Maintenance
                                                </div>
                                            </div>
                                        )}

                                        {/* Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                                        
                                        {/* Content - Positioned Bottom Left */}
                                        <div className={`absolute bottom-0 left-0 right-0 p-5 ${produk.is_active ? 'translate-y-2 group-hover:translate-y-0' : ''} transition-transform`}>
                                            <h3 className="font-bold text-white text-lg leading-tight mb-1">{produk.nama}</h3>
                                            <p className="text-primary-300 text-sm font-bold flex items-center gap-1">
                                                <span className="text-xs font-normal text-white/70">Mulai</span> 
                                                Rp {produk.harga?.toLocaleString('id-ID', { maximumFractionDigits: 0 })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredProduks?.length === 0 && (
                        <div className="text-center py-32">
                            <div className="text-6xl mb-4">🔍</div>
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white">Produk tidak ditemukan</h3>
                            <p className="text-slate-500 dark:text-slate-400">Coba kata kunci lain atau lihat semua produk.</p>
                            <button 
                                onClick={() => setSearch('')}
                                className="mt-6 text-primary-600 dark:text-primary-400 font-bold hover:underline"
                            >
                                Reset Pencarian
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer - Simple & Clean */}
                <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 pt-16 pb-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                            <div className="col-span-1 md:col-span-1">
                                <Link href="/" className="text-2xl font-bold tracking-tighter text-slate-900 dark:text-white">
                                    Aca<span className="text-primary-600">Store.</span>
                                </Link>
                                <p className="text-slate-500 dark:text-slate-400 mt-4 text-sm leading-relaxed">
                                    Platform topup produk game digital terpercaya dengan proses otomatis dan harga termurah.
                                </p>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 dark:text-white mb-4">Hubungi Kami</h4>
                                <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
                                    <li>
                                        <a href="https://wa.me/62895384661641" target="_blank" rel="noopener noreferrer" className="hover:text-primary-600 dark:hover:text-primary-400 flex items-center gap-2">
                                            <span>WhatsApp Pandu</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="https://wa.me/6282229828972" target="_blank" rel="noopener noreferrer" className="hover:text-primary-600 dark:hover:text-primary-400 flex items-center gap-2">
                                            <span>WhatsApp Acaa</span>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 dark:text-white mb-4">Legal</h4>
                                <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
                                    <li><a href="#" className="hover:text-primary-600 dark:hover:text-primary-400">Privacy Policy</a></li>
                                    <li><a href="#" className="hover:text-primary-600 dark:hover:text-primary-400">Terms of Service</a></li>
                                    <li><a href="#" className="hover:text-primary-600 dark:hover:text-primary-400">Refund Policy</a></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 dark:text-white mb-4">Follow Us</h4>
                                <div className="flex flex-col gap-3">
                                    <a href="https://www.instagram.com/acastore.xoxo/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 group-hover:bg-pink-600 group-hover:text-white transition-all">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                                        </div>
                                        <span className="text-sm text-slate-500 dark:text-slate-400 group-hover:text-primary-600 dark:group-hover:text-white">@acastore.xoxo</span>
                                    </a>
                                    <a href="https://www.instagram.com/acaciwak/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 group-hover:bg-pink-600 group-hover:text-white transition-all">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                                        </div>
                                        <span className="text-sm text-slate-500 dark:text-slate-400 group-hover:text-primary-600 dark:group-hover:text-white">@acaciwak</span>
                                    </a>
                                    <a href="https://www.instagram.com/just_360p/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 group-hover:bg-pink-600 group-hover:text-white transition-all">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                                        </div>
                                        <span className="text-sm text-slate-500 dark:text-slate-400 group-hover:text-primary-600 dark:group-hover:text-white">@just_360p</span>
                                    </a>
                                </div>
                            </div>

                        </div>
                        <div className="border-t border-slate-100 dark:border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-400">
                            <p>© {new Date().getFullYear()} AcaStore. All rights reserved.</p>
                            <p>Made with ❤️ by Pandu & Acaa</p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
