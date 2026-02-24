import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';
import Card from '../../Components/Card';
import Button from '../../Components/Button';
import Input from '../../Components/Input';
import Select from '../../Components/Select';
import { useState } from 'react';

export default function Checkout({ produk }) {
    const [step, setStep] = useState(1);
    const [preview, setPreview] = useState(null);
    const { data, setData, post, processing, errors } = useForm({
        produk_id: produk?.id,
        kuantitas: 1,
        game_id: '',
        server_id: '',
        catatan: '',
        payment_method: '',
        bukti_pembayaran: null,
    });

    const total = (produk?.harga || 0) * data.kuantitas;

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setData('bukti_pembayaran', file);
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => setPreview(e.target.result);
            reader.readAsDataURL(file);
        } else {
            setPreview(null);
        }
    };

    const nextStep = () => {
        if (step === 1) {
            if (produk?.kategori_input === 'id_server' && (!data.game_id || !data.server_id)) {
                return alert('User ID dan Server ID wajib diisi!');
            }
            if (produk?.kategori_input !== 'id_server' && !data.catatan) {
                return alert('Catatan wajib diisi!');
            }
            setStep(2);
        } else if (step === 2) {
            if (!data.payment_method) {
                return alert('Silakan pilih metode pembayaran.');
            }
            setStep(3);
        }
    };

    const prevStep = () => setStep(step - 1);

    const submit = (e) => {
        e.preventDefault();
        post('/buy');
    };

    return (
        <AuthenticatedLayout title="Checkout">
            <Head title="Checkout" />

            <div className="max-w-4xl mx-auto pb-24 md:pb-8">
                <div className="flex items-center justify-between mb-8 px-4 md:px-0">
                    <Link href="/" className="inline-flex items-center text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-primary-600 transition-all hover:-translate-x-1">
                        ← KEMBALI
                    </Link>
                    
                    {/* Stepper Indicator */}
                    <div className="hidden md:flex items-center gap-3">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm shadow-sm transition-colors duration-500 ${step >= 1 ? 'bg-primary-600 text-white' : 'bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-400'}`}>1</div>
                        <div className={`w-10 h-1.5 rounded-full transition-colors duration-500 ${step >= 2 ? 'bg-primary-500' : 'bg-slate-200 dark:bg-slate-700'}`}></div>
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm shadow-sm transition-colors duration-500 ${step >= 2 ? 'bg-primary-600 text-white' : 'bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-400'}`}>2</div>
                        <div className={`w-10 h-1.5 rounded-full transition-colors duration-500 ${step >= 3 ? 'bg-primary-500' : 'bg-slate-200 dark:bg-slate-700'}`}></div>
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm shadow-sm transition-colors duration-500 ${step === 3 ? 'bg-primary-600 text-white' : 'bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-400'}`}>3</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 px-4 md:px-0">
                    {/* Left Column - Wizard Form */}
                    <div className="md:col-span-7 lg:col-span-8 space-y-6">
                        <Card className="border-0 shadow-xl shadow-slate-200/50 dark:shadow-black/20 overflow-hidden ring-1 ring-slate-200/50 dark:ring-slate-700/50 animate-fade-in-up duration-500">
                            {/* Horizontal Progress Bar for Mobile */}
                            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 md:hidden">
                                <div className="h-full bg-primary-600 transition-all duration-500 ease-out" style={{ width: `${(step / 3) * 100}%` }}></div>
                            </div>
                            
                            <Card.Body className="p-6 sm:p-8">
                                {/* Wizard Step 1 */}
                                {step === 1 && (
                                    <div className="space-y-6 animate-fade-in duration-300">
                                        <div>
                                            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Data Akun Game</h2>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Lengkapi tujuan pengiriman pesanan Anda dengan benar.</p>
                                        </div>

                                        <div className="space-y-5">
                                            {produk?.kategori_input === 'id_server' ? (
                                                <>
                                                    <div className="grid grid-cols-2 gap-5">
                                                        <Input
                                                            label="User ID"
                                                            placeholder="Contoh: 12345678"
                                                            value={data.game_id}
                                                            onChange={(e) => setData('game_id', e.target.value)}
                                                            error={errors.game_id}
                                                            required
                                                            className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700"
                                                        />
                                                        <Input
                                                            label="Server ID"
                                                            placeholder="Contoh: 1234"
                                                            value={data.server_id}
                                                            onChange={(e) => setData('server_id', e.target.value)}
                                                            error={errors.server_id}
                                                            required
                                                            className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700"
                                                        />
                                                    </div>
                                                    <div className="space-y-2 mt-2">
                                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Catatan Ekstra (Opsional)</label>
                                                        <textarea
                                                            rows={3}
                                                            placeholder="Nickname, atau pesan lain untuk admin..."
                                                            value={data.catatan}
                                                            onChange={(e) => setData('catatan', e.target.value)}
                                                            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all resize-none shadow-sm"
                                                        />
                                                        {errors.catatan && <p className="text-sm text-red-600 font-medium">{errors.catatan}</p>}
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="space-y-2">
                                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Catatan Pesanan <span className="text-red-500">*</span></label>
                                                    <textarea
                                                        rows={4}
                                                        placeholder="Masukkan email, atau login details yang diperlukan..."
                                                        value={data.catatan}
                                                        onChange={(e) => setData('catatan', e.target.value)}
                                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all resize-none shadow-sm"
                                                        required
                                                    />
                                                    {errors.catatan && <p className="text-sm text-red-600 font-medium">{errors.catatan}</p>}
                                                </div>
                                            )}
                                        </div>

                                        <div className="pt-6 flex justify-end">
                                            <Button onClick={nextStep} variant="primary" className="px-8 shadow-xl shadow-primary-500/30 w-full sm:w-auto hover:-translate-y-0.5 transition-all">
                                                Lanjut Metode Bayar →
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {/* Wizard Step 2 */}
                                {step === 2 && (
                                    <div className="space-y-6 animate-fade-in duration-300">
                                        <div>
                                            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Metode Pembayaran</h2>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Pilih e-wallet atau bank tujuan deposit.</p>
                                        </div>

                                        <div className="space-y-5">
                                            <Select
                                                label="Pilih Metode"
                                                value={data.payment_method}
                                                onChange={(e) => setData('payment_method', e.target.value)}
                                                error={errors.payment_method}
                                                required
                                                className="bg-slate-50 dark:bg-slate-900 shadow-sm"
                                            >
                                                <option value="">-- Pilih Pembayaran --</option>
                                                <option value="gopay">💳 GoPay Apps</option>
                                                <option value="dana">💶 DANA Dompet Digital</option>
                                                <option value="qris">📱 QRIS (Scan Semua Bank)</option>
                                            </Select>

                                            {data.payment_method === 'qris' && (
                                                <div className="p-6 border border-slate-200 rounded-2xl bg-white dark:bg-slate-800/50 dark:border-slate-700 text-center animate-fade-in-up shadow-sm">
                                                    <p className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white mb-4">Scan QRIS Ini</p>
                                                    <div className="inline-block p-2 bg-white rounded-2xl shadow-md border border-slate-100 hover:scale-105 transition-transform duration-300 mb-4">
                                                        <img src="/images/qris.jpeg" alt="QRIS" className="w-56 h-56 object-contain rounded-xl pointer-events-none" />
                                                    </div>
                                                    <div>
                                                        <a 
                                                            href="/images/qris.jpeg" 
                                                            download="QRIS_AcaStore.jpeg"
                                                            className="inline-flex items-center justify-center gap-2 px-5 py-2 text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 dark:text-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-lg transition-colors shadow-sm active:scale-95"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                                            Download QR Code
                                                        </a>
                                                    </div>
                                                </div>
                                            )}

                                            {(data.payment_method === 'dana' || data.payment_method === 'gopay') && (
                                                <div className={`p-6 rounded-2xl border ${data.payment_method === 'dana' ? 'bg-blue-50/50 border-blue-200 dark:bg-blue-900/10 dark:border-blue-800/50' : 'bg-green-50/50 border-green-200 dark:bg-green-900/10 dark:border-green-800/50'} animate-fade-in-up shadow-sm`}>
                                                    <p className={`text-xs font-black uppercase tracking-wider mb-4 ${data.payment_method === 'dana' ? 'text-blue-800 dark:text-blue-400' : 'text-green-800 dark:text-green-400'}`}>
                                                        Transfer ke {data.payment_method === 'dana' ? 'Rekening DANA' : 'Rekening GoPay'}
                                                    </p>
                                                    <div className="flex flex-col sm:flex-row items-center justify-between bg-white dark:bg-slate-900/80 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm gap-4">
                                                        <span className="text-2xl font-black tracking-widest text-slate-900 dark:text-white font-mono break-all text-center">
                                                            {data.payment_method === 'dana' ? '0895384661641' : '082229828972'}
                                                        </span>
                                                        <button 
                                                            type="button"
                                                            onClick={async () => {
                                                                await navigator.clipboard.writeText(data.payment_method === 'dana' ? '0895384661641' : '082229828972');
                                                                alert('Nomor disalin ke clipboard!');
                                                            }}
                                                            className={`w-full sm:w-auto text-sm font-bold px-6 py-2.5 rounded-lg transition-all active:scale-95 hover:shadow-md ${data.payment_method === 'dana' ? 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500' : 'bg-green-600 text-white hover:bg-green-700 dark:bg-emerald-600 dark:hover:bg-emerald-500'}`}
                                                        >
                                                            SALIN
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="pt-6 flex items-center justify-between border-t border-slate-100 dark:border-slate-700 mt-8">
                                            <button onClick={prevStep} type="button" className="text-sm font-bold text-slate-400 hover:text-slate-800 dark:text-slate-500 dark:hover:text-white transition-colors">
                                                ← Kembali
                                            </button>
                                            <Button onClick={nextStep} variant="primary" className="px-8 shadow-xl shadow-primary-500/30 hover:-translate-y-0.5 transition-all">
                                                Validasi Bukti →
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {/* Wizard Step 3 */}
                                {step === 3 && (
                                    <div className="space-y-6 animate-fade-in duration-300">
                                        <div>
                                            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Verifikasi Akhir</h2>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Unggah bukti atau screenshot resi Anda di sini.</p>
                                        </div>

                                        <div className="p-8 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300 hover:border-primary-500 hover:bg-primary-50/50 dark:bg-slate-900/50 dark:border-slate-700 dark:hover:border-primary-500 dark:hover:bg-primary-900/20 transition-all duration-300 group cursor-pointer relative overflow-hidden text-center shadow-inner">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                required
                                            />
                                            
                                            {!preview ? (
                                                <div className="flex flex-col items-center justify-center space-y-4 pointer-events-none py-6">
                                                    <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 mb-2 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-sm">
                                                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                                    </div>
                                                    <div>
                                                        <p className="text-base font-black text-slate-800 dark:text-white mb-1">Upload Bukti Transfer</p>
                                                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Tekan atau seret file (Max 2MB)</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="pointer-events-none flex flex-col items-center">
                                                    <div className="relative w-full max-w-sm rounded-xl overflow-hidden shadow-lg border-4 border-white dark:border-slate-800 mb-6 group-hover:scale-[1.02] transition-transform duration-300">
                                                        <img src={preview} alt="Preview Bukti" className="w-full aspect-[4/3] object-cover" />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                                                    </div>
                                                    <span className="text-sm font-bold text-white bg-primary-600 dark:bg-primary-500 px-5 py-2 rounded-full shadow-lg shadow-primary-500/30">
                                                        Sentuh Untuk Mengganti
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        {errors.bukti_pembayaran && (
                                            <p className="text-sm text-red-500 font-bold text-center bg-red-50 dark:bg-red-900/20 py-2 rounded-lg">{errors.bukti_pembayaran}</p>
                                        )}

                                        <div className="pt-6 flex items-center justify-between border-t border-slate-100 dark:border-slate-700 mt-8">
                                            <button onClick={prevStep} type="button" className="text-sm font-bold text-slate-400 hover:text-slate-800 dark:text-slate-500 dark:hover:text-white transition-colors">
                                                ← Kembali
                                            </button>
                                            
                                            <Button
                                                onClick={submit}
                                                variant="primary"
                                                size="lg"
                                                className="px-10 py-3 text-base shadow-xl shadow-primary-500/30 hidden md:inline-flex hover:-translate-y-1 transition-all group"
                                                disabled={processing}
                                            >
                                                {processing ? 'Memproses...' : (
                                                    <span className="flex items-center gap-2">
                                                        Konfirmasi & Bayar
                                                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                                                    </span>
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </Card.Body>
                        </Card>
                    </div>

                    {/* Right Column - Order Summary (Sticky) */}
                    <div className="md:col-span-5 lg:col-span-4">
                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 lg:p-8 border border-slate-200 dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-black/20 sticky top-24 ring-1 ring-slate-200/50 dark:ring-slate-700/50">
                            <h3 className="font-black text-slate-900 dark:text-white mb-6 uppercase tracking-widest text-xs text-center border-b border-slate-100 dark:border-slate-700 pb-4">Ringkasan Tagihan</h3>
                            
                            <div className="flex items-center gap-4 mb-6 pt-2">
                                <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-700 overflow-hidden flex-shrink-0 border border-slate-200 dark:border-slate-600 shadow-sm">
                                    {produk?.lokasi_gambar && <img src={produk.lokasi_gambar_url} className="w-full h-full object-cover" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-slate-800 dark:text-white line-clamp-2 leading-tight mb-1 text-sm">{produk?.nama}</h4>
                                    <p className="text-sm font-black text-primary-600 dark:text-primary-400">Rp {produk?.harga?.toLocaleString('id-ID', { maximumFractionDigits: 0 })}<span className="text-slate-400 font-medium text-xs">/item</span></p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                                    <Input
                                        type="number"
                                        label="Berapa Banyak (Qty)?"
                                        value={data.kuantitas}
                                        onChange={(e) => setData('kuantitas', parseInt(e.target.value) || 1)}
                                        min={1}
                                        max={produk?.stok}
                                        error={errors.kuantitas}
                                        required
                                        className="bg-white dark:bg-slate-800 border-none shadow-sm text-center font-bold text-lg"
                                    />
                                </div>
                                
                                <div className="flex justify-between items-end pt-4 border-t border-slate-100 dark:border-slate-700">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-xs text-slate-400 uppercase tracking-widest">Total Bayar</span>
                                    </div>
                                    <span className="font-black text-primary-600 dark:text-primary-400 text-2xl tracking-tight leading-none">
                                        Rp {total.toLocaleString('id-ID', { maximumFractionDigits: 0 })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Floating Action Bar */}
                <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-700 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] dark:shadow-black/50 p-4 z-40">
                    <div className="flex items-center justify-between gap-4 max-w-3xl mx-auto">
                        <div className="flex-shrink-0">
                            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5">Total</p>
                            <p className="text-xl font-black text-primary-600 dark:text-primary-400 leading-none">
                                Rp {total.toLocaleString('id-ID', { maximumFractionDigits: 0 })}
                            </p>
                        </div>
                        
                        {step < 3 ? (
                            <Button onClick={nextStep} variant="primary" className="w-full text-base shadow-lg shadow-primary-500/30 flex justify-center py-3">
                                Lanjut
                            </Button>
                        ) : (
                            <Button onClick={submit} variant="primary" className="w-full text-base shadow-lg shadow-primary-500/30 animate-pulse flex justify-center py-3" disabled={processing || !preview}>
                                {processing ? 'Tunggu...' : 'Bayar Sekarang!'}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
