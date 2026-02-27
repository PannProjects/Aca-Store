import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';
import Card from '../../Components/Card';
import Button from '../../Components/Button';
import Select from '../../Components/Select';
import { useState } from 'react';

const StatCard = ({ label, value, icon, color = 'primary' }) => {
    const colors = {
        primary: 'bg-primary-600 shadow-primary-600/20',
        emerald: 'bg-emerald-600 shadow-emerald-600/20',
        amber: 'bg-amber-500 shadow-amber-500/20',
        rose: 'bg-rose-500 shadow-rose-500/20',
    };
    return (
        <div className={`${colors[color]} rounded-2xl p-5 text-white shadow-lg`}>
            <div className="flex items-center justify-between mb-3">
                <span className="text-white/70 text-sm font-medium">{label}</span>
                <span className="text-2xl">{icon}</span>
            </div>
            <p className="text-2xl font-bold leading-tight">{value}</p>
        </div>
    );
};

const BarChart = ({ data, activeBulan }) => {
    const maxVal = Math.max(...data.map(d => d.total_pendapatan), 1);
    return (
        <div className="flex items-end gap-1.5 h-52">
            {data.map((d, i) => {
                const height = maxVal > 0 ? (d.total_pendapatan / maxVal) * 100 : 0;
                const isActive = activeBulan === 'all' || parseInt(activeBulan) === d.bulan;
                return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <span className={`text-[10px] font-bold ${d.total_pendapatan > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-transparent'}`}>
                            {d.jumlah_transaksi}
                        </span>
                        <div className="w-full flex items-end justify-center" style={{ height: '160px' }}>
                            <div
                                className={`w-full max-w-[40px] rounded-t-md transition-all duration-500 ${
                                    isActive
                                        ? 'bg-gradient-to-t from-primary-600 to-primary-400'
                                        : 'bg-slate-200 dark:bg-slate-700'
                                }`}
                                style={{ height: `${Math.max(height, 2)}%` }}
                                title={`${d.nama_bulan}: Rp ${d.total_pendapatan?.toLocaleString('id-ID')}`}
                            />
                        </div>
                        <span className={`text-[10px] font-medium ${isActive ? 'text-slate-800 dark:text-white' : 'text-slate-400 dark:text-slate-500'}`}>
                            {d.nama_bulan}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};

export default function Laporan({
    totalPendapatan, totalTransaksi, totalItemTerjual, rataRataOrder,
    produkBreakdown, monthlyStats, recentTransactions, pendingCount,
    bulan, tahun, years, namaBulan,
}) {
    const [filterBulan, setFilterBulan] = useState(bulan);
    const [filterTahun, setFilterTahun] = useState(tahun);

    const handleFilter = () => {
        router.get('/admin/laporan', { bulan: filterBulan, tahun: filterTahun }, { preserveState: true });
    };

    const formatRp = (val) => `Rp ${(val || 0).toLocaleString('id-ID', { maximumFractionDigits: 0 })}`;

    const periodeLabel = bulan === 'all'
        ? `Tahun ${tahun}`
        : `${Object.values(namaBulan)[bulan - 1] || ''} ${tahun}`;

    return (
        <AuthenticatedLayout title="Laporan Keuangan">
            <Head title="Laporan Keuangan" />

            {/* Filter Bar */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 mb-6 shadow-sm">
                <div className="flex flex-wrap items-end gap-4">
                    <div className="flex-1 min-w-[140px]">
                        <Select label="Bulan" value={filterBulan} onChange={(e) => setFilterBulan(e.target.value)}>
                            <option value="all">Semua Bulan</option>
                            {Object.entries(namaBulan).map(([key, val]) => (
                                <option key={key} value={key}>{val}</option>
                            ))}
                        </Select>
                    </div>
                    <div className="flex-1 min-w-[120px]">
                        <Select label="Tahun" value={filterTahun} onChange={(e) => setFilterTahun(parseInt(e.target.value))}>
                            {years?.map((y) => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </Select>
                    </div>
                    <Button onClick={handleFilter} variant="primary" className="h-[42px] px-6">
                        Terapkan
                    </Button>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard label="Total Pendapatan" value={formatRp(totalPendapatan)} icon="💰" color="emerald" />
                <StatCard label="Total Transaksi" value={totalTransaksi} icon="📦" color="primary" />
                <StatCard label="Item Terjual" value={totalItemTerjual} icon="🛒" color="amber" />
                <StatCard label="Rata-rata Order" value={formatRp(rataRataOrder)} icon="📊" color="rose" />
            </div>

            {/* Pending Alert */}
            {pendingCount > 0 && (
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">⏳</span>
                        <div>
                            <p className="font-semibold text-amber-800 dark:text-amber-200">{pendingCount} Transaksi Menunggu</p>
                            <p className="text-sm text-amber-600 dark:text-amber-400">Ada pembayaran yang belum dikonfirmasi</p>
                        </div>
                    </div>
                    <Button variant="secondary" size="sm" onClick={() => router.visit('/admin/pembayaran')}>
                        Cek Sekarang
                    </Button>
                </div>
            )}

            {/* Chart + Product Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
                {/* Monthly Chart */}
                <div className="lg:col-span-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-slate-800 dark:text-white">Pendapatan {tahun}</h3>
                        <span className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2.5 py-1 rounded-full">
                            Tahunan
                        </span>
                    </div>
                    <BarChart data={monthlyStats || []} activeBulan={bulan} />
                </div>

                {/* Product Breakdown */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700">
                        <h3 className="font-bold text-slate-800 dark:text-white">Produk Terlaris</h3>
                        <p className="text-xs text-slate-400 mt-0.5">{periodeLabel}</p>
                    </div>
                    <div className="p-4 space-y-3 max-h-[280px] overflow-y-auto">
                        {produkBreakdown?.length > 0 ? produkBreakdown.map((p, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white ${
                                    i === 0 ? 'bg-amber-500' : i === 1 ? 'bg-slate-400' : i === 2 ? 'bg-amber-700' : 'bg-slate-300 dark:bg-slate-600'
                                }`}>
                                    {i + 1}
                                </span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-slate-800 dark:text-white truncate">{p.nama}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="flex-1 bg-slate-100 dark:bg-slate-700 rounded-full h-1.5">
                                            <div
                                                className="bg-primary-500 rounded-full h-1.5 transition-all"
                                                style={{ width: `${p.persentase}%` }}
                                            />
                                        </div>
                                        <span className="text-[10px] text-slate-400 font-medium">{p.persentase}%</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{formatRp(p.total_pendapatan)}</p>
                                    <p className="text-[10px] text-slate-400">{p.jumlah_terjual}x terjual</p>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-8 text-slate-400">
                                <p className="text-3xl mb-2">📭</p>
                                <p className="text-sm">Belum ada transaksi di periode ini</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                    <h3 className="font-bold text-slate-800 dark:text-white">Transaksi Terakhir</h3>
                    <span className="text-xs text-slate-400">{periodeLabel}</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 dark:bg-slate-700/50">
                            <tr>
                                <th className="text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase px-6 py-3">User</th>
                                <th className="text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase px-6 py-3">Produk</th>
                                <th className="text-center text-xs font-bold text-slate-500 dark:text-slate-400 uppercase px-6 py-3">Qty</th>
                                <th className="text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase px-6 py-3">Status</th>
                                <th className="text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase px-6 py-3">Tanggal</th>
                                <th className="text-right text-xs font-bold text-slate-500 dark:text-slate-400 uppercase px-6 py-3">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {recentTransactions?.length > 0 ? recentTransactions.map((t) => (
                                <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                    <td className="px-6 py-3 text-sm text-slate-800 dark:text-white font-medium">{t.user}</td>
                                    <td className="px-6 py-3 text-sm text-slate-600 dark:text-slate-300">{t.produk}</td>
                                    <td className="px-6 py-3 text-sm text-center text-slate-600 dark:text-slate-300">{t.kuantitas}</td>
                                    <td className="px-6 py-3">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                            t.status === 'completed' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                            : 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                        }`}>
                                            {t.status === 'completed' ? 'Selesai' : 'Dibayar'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3 text-sm text-slate-500 dark:text-slate-400">{t.tanggal}</td>
                                    <td className="px-6 py-3 text-sm text-right font-bold text-emerald-600 dark:text-emerald-400">{formatRp(t.total_harga)}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                                        <p className="text-3xl mb-2">📭</p>
                                        <p className="text-sm">Belum ada transaksi di periode ini</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
