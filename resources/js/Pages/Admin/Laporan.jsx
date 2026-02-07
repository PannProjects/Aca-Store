import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';
import Card from '../../Components/Card';
import Button from '../../Components/Button';
import Select from '../../Components/Select';
import { useState } from 'react';

export default function Laporan({ monthlyStats, topProducts, recentTransactions, totalPendapatan }) {
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());

    const handleFilter = () => {
        router.get('/admin/laporan', { month, year }, { preserveState: true });
    };

    return (
        <AuthenticatedLayout title="Laporan Keuangan">
            <Head title="Laporan Keuangan" />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                {/* Filter and Summary */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="border-0 shadow-md">
                        <Card.Header className="bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700">
                            <h3 className="font-bold text-slate-800 dark:text-white">Filter Laporan</h3>
                        </Card.Header>
                        <Card.Body className="space-y-4">
                            <Select
                                label="Bulan"
                                value={month}
                                onChange={(e) => setMonth(e.target.value)}
                            >
                                {Array.from({ length: 12 }, (_, i) => (
                                    <option key={i + 1} value={i + 1}>
                                        {new Date(0, i).toLocaleString('id-ID', { month: 'long' })}
                                    </option>
                                ))}
                            </Select>
                            <Select
                                label="Tahun"
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                            >
                                <option value="2024">2024</option>
                                <option value="2025">2025</option>
                                <option value="2026">2026</option>
                            </Select>
                            <Button onClick={handleFilter} variant="primary" className="w-full justify-center">
                                Terapkan Filter
                            </Button>
                        </Card.Body>
                    </Card>

                    <div className="bg-emerald-600 dark:bg-emerald-700 rounded-2xl p-6 text-white shadow-lg shadow-emerald-600/20">
                        <p className="text-emerald-100 font-medium mb-1">Total Pendapatan</p>
                        <h2 className="text-3xl font-bold">
                            Rp {totalPendapatan?.toLocaleString('id-ID', { maximumFractionDigits: 0 }) || '0'}
                        </h2>
                        <p className="text-xs text-emerald-200 mt-4 opacity-80">
                            *Periode {new Date(0, month - 1).toLocaleString('id-ID', { month: 'long' })} {year}
                        </p>
                    </div>
                </div>

                {/* Charts/Tables Area */}
                <div className="lg:col-span-3 space-y-6">
                    {/* Top Products */}
                    <Card className="border-0 shadow-sm">
                        <Card.Header className="bg-white dark:bg-slate-800 flex justify-between items-center border-b border-slate-100 dark:border-slate-700">
                            <h3 className="font-bold text-slate-800 dark:text-white">Produk Terlaris</h3>
                        </Card.Header>
                        <Card.Body>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                                        <tr>
                                            <th className="text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase px-4 py-3 rounded-l-lg">Produk</th>
                                            <th className="text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase px-4 py-3">Terjual</th>
                                            <th className="text-right text-xs font-bold text-slate-500 dark:text-slate-400 uppercase px-4 py-3 rounded-r-lg">Pendapatan</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                        {topProducts?.map((p, index) => (
                                            <tr key={index}>
                                                <td className="px-4 py-3 text-slate-900 dark:text-white font-medium">{p.nama}</td>
                                                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{p.total_terjual}x</td>
                                                <td className="px-4 py-3 text-right text-emerald-600 dark:text-emerald-400 font-bold">
                                                    Rp {p.total_pendapatan?.toLocaleString('id-ID', { maximumFractionDigits: 0 })}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card.Body>
                    </Card>

                    {/* Pending/Recent Audit */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                            <h3 className="font-bold text-slate-800 dark:text-white mb-4">Statistik Bulanan</h3>
                            <div className="space-y-4">
                                {monthlyStats?.map((m, index) => (
                                     <div key={index} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg">
                                        <span className="text-slate-600 dark:text-slate-300 capitalize">
                                            {new Date(0, m.bulan - 1).toLocaleString('id-ID', { month: 'long' })}
                                        </span>
                                        <span className="font-bold text-slate-900 dark:text-white">
                                            Rp {m.total_pendapatan?.toLocaleString('id-ID', { maximumFractionDigits: 0 })}
                                        </span>
                                     </div>
                                ))}
                            </div>
                         </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
