import { Head, useForm, Link } from '@inertiajs/react';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';
import Card from '../../Components/Card';
import Button from '../../Components/Button';
import Input from '../../Components/Input';

export default function EditProduk({ produk }) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        nama: produk.nama,
        deskripsi: produk.deskripsi,
        harga: produk.harga,
        stok: produk.stok,
        kategori_input: produk.kategori_input ?? 'id_server',
        gambar: null,
        is_active: produk.is_active,
    });

    const submit = (e) => {
        e.preventDefault();
        post(`/admin/produk/${produk.id}`);
    };

    return (
        <AuthenticatedLayout title="Edit Produk">
            <Head title="Edit Produk" />

            <div className="max-w-3xl mx-auto">
                <Link href="/admin/produk" className="inline-flex items-center text-sm text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 mb-6 group">
                    <span className="mr-1 group-hover:-translate-x-1 transition-transform">←</span> Kembali
                </Link>

                <Card className="border-0 shadow-md">
                    <Card.Header className="bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700">
                        <h3 className="font-bold text-slate-800 dark:text-white">Edit Produk: {produk.nama}</h3>
                    </Card.Header>
                    <Card.Body className="bg-white dark:bg-slate-800">
                        <form onSubmit={submit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Tipe Input Pesanan</label>
                                    <select
                                        value={data.kategori_input}
                                        onChange={(e) => setData('kategori_input', e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all appearance-none"
                                        required
                                    >
                                        <option value="id_server">ID Game + Server ID + Catatan (Opsional)</option>
                                        <option value="catatan">Catatan Saja (Wajib)</option>
                                    </select>
                                    {errors.kategori_input && <p className="text-sm text-red-600">{errors.kategori_input}</p>}
                                </div>

                                <div className="space-y-6">
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
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Ganti Gambar (Opsional)</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setData('gambar', e.target.files[0])}
                                        className="w-full text-slate-500 dark:text-slate-400 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-100 dark:file:bg-slate-700 file:text-slate-700 dark:file:text-white hover:file:bg-slate-200 dark:hover:file:bg-slate-600"
                                    />
                                    {errors.gambar && <p className="text-sm text-red-600">{errors.gambar}</p>}
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Deskripsi</label>
                                <textarea
                                    rows={4}
                                    value={data.deskripsi}
                                    onChange={(e) => setData('deskripsi', e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                                    required
                                />
                                {errors.deskripsi && <p className="text-sm text-red-600">{errors.deskripsi}</p>}
                            </div>

                            <div className="flex justify-end pt-4 border-t border-slate-50 dark:border-slate-700">
                                <Button type="submit" disabled={processing} variant="primary" size="lg">
                                    {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </Button>
                            </div>
                        </form>
                    </Card.Body>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
