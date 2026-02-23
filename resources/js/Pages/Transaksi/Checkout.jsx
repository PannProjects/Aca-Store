import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';
import Card from '../../Components/Card';
import Button from '../../Components/Button';
import Input from '../../Components/Input';
import Select from '../../Components/Select';
import { useState } from 'react';

export default function Checkout({ produk }) {
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

    const submit = (e) => {
        e.preventDefault();
        post('/buy');
    };

    return (
        <AuthenticatedLayout title="Checkout">
            <Head title="Checkout" />

            <div className="max-w-3xl mx-auto">
                <Link href="/" className="inline-flex items-center text-sm text-slate-500 dark:text-slate-400 hover:text-primary-600 mb-6 group">
                    <span className="mr-1 group-hover:-translate-x-1 transition-transform">←</span> Batal
                </Link>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left Column - Form */}
                    <div className="md:col-span-2 space-y-6">
                        <Card className="border-0 shadow-sm">
                            <Card.Header>
                                <h3 className="font-bold text-slate-800 dark:text-white">Detail Akun Game</h3>
                            </Card.Header>
                            <Card.Body className="space-y-4">
                                {produk?.kategori_input === 'id_server' ? (
                                    <>
                                        <div className="grid grid-cols-2 gap-4">
                                            <Input
                                                label="User ID"
                                                placeholder="Contoh: 12345678"
                                                value={data.game_id}
                                                onChange={(e) => setData('game_id', e.target.value)}
                                                error={errors.game_id}
                                                required
                                            />
                                            <Input
                                                label="Server ID"
                                                placeholder="Contoh: 1234"
                                                value={data.server_id}
                                                onChange={(e) => setData('server_id', e.target.value)}
                                                error={errors.server_id}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-1.5 mt-4">
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Catatan Tambahan (Opsional)</label>
                                            <textarea
                                                rows={2}
                                                placeholder="Contoh: Nickname akun, atau request khusus"
                                                value={data.catatan}
                                                onChange={(e) => setData('catatan', e.target.value)}
                                                className="w-full px-4 py-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                                            />
                                            {errors.catatan && <p className="text-sm text-red-600">{errors.catatan}</p>}
                                        </div>
                                    </>
                                ) : (
                                    <div className="space-y-1.5">
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Catatan Pesanan (Wajib)</label>
                                        <textarea
                                            rows={4}
                                            placeholder="Masukkan Email, Password, atau catatan lainnya yang dibutuhkan"
                                            value={data.catatan}
                                            onChange={(e) => setData('catatan', e.target.value)}
                                            className="w-full px-4 py-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                                            required
                                        />
                                        {errors.catatan && <p className="text-sm text-red-600">{errors.catatan}</p>}
                                    </div>
                                )}
                            </Card.Body>
                        </Card>

                        <Card className="border-0 shadow-sm">
                            <Card.Header>
                                <h3 className="font-bold text-slate-800 dark:text-white">Pembayaran</h3>
                            </Card.Header>
                            <Card.Body className="space-y-4">
                                <Select
                                    label="Metode Pembayaran"
                                    value={data.payment_method}
                                    onChange={(e) => setData('payment_method', e.target.value)}
                                    error={errors.payment_method}
                                    required
                                >
                                    <option value="">Pilih Metode</option>
                                    <option value="gopay">GoPay</option>
                                    <option value="dana">DANA</option>
                                    <option value="qris">QRIS</option>
                                </Select>

                                {data.payment_method === 'qris' && (
                                    <div className="mt-4 p-4 border rounded-lg bg-gray-50 dark:bg-slate-700 dark:border-slate-600 flex flex-col items-center">
                                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Scan QRIS untuk Pembayaran</p>
                                        <img 
                                            src="/images/qris.jpeg" 
                                            alt="QRIS Acastore" 
                                            className="w-full max-w-xs object-contain border rounded-md shadow-sm"
                                        />
                                    </div>
                                )}

                                {data.payment_method === 'dana' && (
                                    <div className="mt-4 p-4 border rounded-lg bg-blue-50 border-blue-100 dark:bg-blue-900/20 dark:border-blue-800">
                                        <p className="text-sm text-blue-800 dark:text-blue-300 font-medium mb-1">Transfer ke DANA</p>
                                        <div className="flex items-center justify-between bg-white dark:bg-slate-800 p-3 rounded border border-blue-200 dark:border-blue-700">
                                            <span className="text-lg font-bold text-slate-800 dark:text-white tracking-wide font-mono">0895384661641</span>
                                            <button 
                                                type="button"
                                                onClick={() => {
                                                    navigator.clipboard.writeText('0895384661641');
                                                    alert('Nomor DANA berhasil disalin!');
                                                }}
                                                className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium px-3 py-1.5 rounded transition-colors"
                                            >
                                                Salin
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {data.payment_method === 'gopay' && (
                                    <div className="mt-4 p-4 border rounded-lg bg-green-50 border-green-100 dark:bg-green-900/20 dark:border-green-800">
                                        <p className="text-sm text-green-800 dark:text-green-300 font-medium mb-1">Transfer ke GoPay</p>
                                        <div className="flex items-center justify-between bg-white dark:bg-slate-800 p-3 rounded border border-green-200 dark:border-green-700">
                                            <span className="text-lg font-bold text-slate-800 dark:text-white tracking-wide font-mono">082229828972</span>
                                            <button 
                                                type="button"
                                                onClick={() => {
                                                    navigator.clipboard.writeText('082229828972');
                                                    alert('Nomor GoPay berhasil disalin!');
                                                }}
                                                className="text-xs bg-green-100 hover:bg-green-200 text-green-700 font-medium px-3 py-1.5 rounded transition-colors"
                                            >
                                                Salin
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-300 dark:bg-slate-800/50 dark:border-slate-600">
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Bukti Transfer
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="w-full text-slate-500 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                                        required
                                    />
                                    {errors.bukti_pembayaran && (
                                        <p className="text-sm text-red-600 mt-2">{errors.bukti_pembayaran}</p>
                                    )}
                                    {preview && (
                                        <div className="mt-4 relative w-full h-32 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                                            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                </div>
                            </Card.Body>
                        </Card>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="md:col-span-1">
                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm sticky top-24">
                            <h3 className="font-bold text-slate-900 dark:text-white mb-4">Ringkasan Pesanan</h3>
                            
                            <div className="flex gap-4 mb-4 pb-4 border-b border-slate-100 dark:border-slate-700">
                                <div className="w-16 h-16 rounded-lg bg-slate-100 dark:bg-slate-700 overflow-hidden flex-shrink-0">
                                    {produk?.lokasi_gambar && (
                                        <img src={`/storage/${produk.lokasi_gambar}`} className="w-full h-full object-cover" />
                                    )}
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-800 dark:text-white line-clamp-1">{produk?.nama}</h4>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Rp {produk?.harga?.toLocaleString('id-ID', { maximumFractionDigits: 0 })}</p>
                                </div>
                            </div>

                            <div className="space-y-3 mb-6">
                                <Input
                                    type="number"
                                    label="Jumlah"
                                    value={data.kuantitas}
                                    onChange={(e) => setData('kuantitas', parseInt(e.target.value) || 1)}
                                    min={1}
                                    max={produk?.stok}
                                    error={errors.kuantitas}
                                    required
                                />
                                
                                <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-700">
                                    <span className="font-bold text-slate-900 dark:text-white">Total Tagihan</span>
                                    <span className="font-bold text-primary-600 text-lg">
                                        Rp {total.toLocaleString('id-ID', { maximumFractionDigits: 0 })}
                                    </span>
                                </div>
                            </div>

                            <Button
                                onClick={submit}
                                variant="primary"
                                size="lg"
                                className="w-full shadow-primary-500/25"
                                disabled={processing}
                            >
                                {processing ? 'Memproses...' : 'Bayar Sekarang'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
