import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';
import Card from '../../Components/Card';
import Button from '../../Components/Button';
import Input from '../../Components/Input';
import { useState } from 'react';

export default function Produk({ produks }) {
    const [showForm, setShowForm] = useState(false);
    const [preview, setPreview] = useState(null);
    const { data, setData, post, processing, errors, reset } = useForm({
        nama: '',
        deskripsi: '',
        harga: '',
        stok: '',
        gambar: null,
        is_active: true,
    });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setData('gambar', file);
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
        post('/admin/produk', {
            onSuccess: () => {
                reset();
                setPreview(null);
                setShowForm(false);
            },
        });
    };

    const handleDelete = (id) => {
        if (confirm('Yakin ingin menghapus produk ini?')) {
            router.delete(`/admin/produk/${id}`);
        }
    };

    return (
        <AuthenticatedLayout title="Kelola Produk">
            <Head title="Kelola Produk" />

            {/* Header Action */}
            <div className="flex justify-end mb-6">
                <Button onClick={() => setShowForm(!showForm)} variant="primary">
                    {showForm ? 'Tutup Form' : '+ Tambah Produk'}
                </Button>
            </div>

            {/* Add Form */}
            {showForm && (
                <Card className="mb-8 border-0 shadow-md">
                    <Card.Body>
                        <form onSubmit={submit} className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <Input
                                    label="Nama Produk"
                                    value={data.nama}
                                    onChange={(e) => setData('nama', e.target.value)}
                                    error={errors.nama}
                                    required
                                />
                                <Input
                                    type="number"
                                    label="Harga (Rp)"
                                    value={data.harga}
                                    onChange={(e) => setData('harga', e.target.value)}
                                    error={errors.harga}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-5">
                                    <Input
                                        type="number"
                                        label="Stok"
                                        value={data.stok}
                                        onChange={(e) => setData('stok', e.target.value)}
                                        error={errors.stok}
                                        required
                                    />
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id="is_active"
                                            checked={data.is_active}
                                            onChange={(e) => setData('is_active', e.target.checked)}
                                            className="w-5 h-5 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                                        />
                                        <label htmlFor="is_active" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                            Status Aktif
                                        </label>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Gambar Produk</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="w-full text-slate-500 dark:text-slate-400 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-100 dark:file:bg-slate-700 file:text-slate-700 dark:file:text-white hover:file:bg-slate-200 dark:hover:file:bg-slate-600"
                                    />
                                    {errors.gambar && <p className="text-sm text-red-600">{errors.gambar}</p>}
                                    {preview && (
                                        <div className="mt-2 w-32 h-32 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                                            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Deskripsi</label>
                                <textarea
                                    rows={3}
                                    value={data.deskripsi}
                                    onChange={(e) => setData('deskripsi', e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                                    required
                                />
                                {errors.deskripsi && <p className="text-sm text-red-600">{errors.deskripsi}</p>}
                            </div>
                            <div className="flex justify-end pt-2">
                                <Button type="submit" disabled={processing} variant="primary">
                                    {processing ? 'Menyimpan...' : 'Simpan Produk'}
                                </Button>
                            </div>
                        </form>
                    </Card.Body>
                </Card>
            )}

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {produks?.map((produk) => (
                    <Card key={produk.id} hover className={`border-0 shadow-sm overflow-hidden group h-full flex flex-col bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 ${!produk.is_active ? 'opacity-75 grayscale' : ''}`}>
                        <div className="aspect-[4/3] bg-slate-100 dark:bg-slate-700 relative overflow-hidden">
                            {produk.lokasi_gambar ? (
                                <img
                                    src={produk.lokasi_gambar_url}
                                    alt={produk.nama}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-slate-500">
                                    No Image
                                </div>
                            )}
                            {!produk.is_active && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Non-Aktif</span>
                                </div>
                            )}
                            <div className="absolute top-2 right-2 flex gap-2">
                                <button
                                    onClick={() => router.visit(`/admin/produk/${produk.id}/edit`)}
                                    className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm p-2 rounded-full shadow-sm text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 border border-slate-200 dark:border-slate-700"
                                    title="Edit Produk"
                                >
                                    ✏️
                                </button>
                                <button
                                    onClick={() => handleDelete(produk.id)}
                                    className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm p-2 rounded-full shadow-sm text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 border border-slate-200 dark:border-slate-700"
                                    title="Hapus Produk"
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                        <Card.Body className="flex-1 flex flex-col">
                            <h3 className="font-bold text-slate-900 dark:text-white line-clamp-1">{produk.nama}</h3>
                            <div className="flex items-center justify-between mt-auto pt-4">
                                <p className="text-primary-600 dark:text-primary-400 font-bold">
                                    Rp {produk.harga?.toLocaleString('id-ID', { maximumFractionDigits: 0 })}
                                </p>
                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${produk.stok > 0 ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                                    Stok: {produk.stok}
                                </span>
                            </div>
                        </Card.Body>
                    </Card>
                ))}
            </div>

            {produks?.length === 0 && (
                <div className="p-12 text-center bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                    <p className="text-slate-400">Belum ada produk</p>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
