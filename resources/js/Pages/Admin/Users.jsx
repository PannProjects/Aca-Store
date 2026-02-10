import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';
import Card from '../../Components/Card';
import Button from '../../Components/Button';
import Input from '../../Components/Input';
import { useState } from 'react';

export default function Users({ users }) {
    const [showForm, setShowForm] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/admin/add-admin', {
            onSuccess: () => {
                reset();
                setShowForm(false);
            },
        });
    };

    const handleDelete = (id) => {
        if (confirm('Yakin ingin menghapus user ini?')) {
            router.delete(`/admin/user/${id}`);
        }
    };

    return (
        <AuthenticatedLayout title="Kelola Users">
            <Head title="Kelola Users" />

            <div className="flex justify-end mb-6">
                <Button onClick={() => setShowForm(!showForm)} variant="primary">
                    {showForm ? 'Tutup Form' : '+ Tambah Admin'}
                </Button>
            </div>

            {showForm && (
                <Card className="mb-6 border-0 shadow-md">
                    <Card.Header className="bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700">
                        <h3 className="font-bold text-slate-800 dark:text-white">Tambah Admin Baru</h3>
                    </Card.Header>
                    <Card.Body>
                        <form onSubmit={submit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                <Input
                                    label="Nama"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    error={errors.name}
                                    required
                                />
                                <Input
                                    type="email"
                                    label="Email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    error={errors.email}
                                    required
                                />
                                <Input
                                    type="password"
                                    label="Password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    error={errors.password}
                                    required
                                />
                            </div>
                            <div className="flex justify-end mt-2">
                                <Button type="submit" disabled={processing} variant="primary">
                                    {processing ? 'Menyimpan...' : 'Tambah Admin'}
                                </Button>
                            </div>
                        </form>
                    </Card.Body>
                </Card>
            )}

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
                            <tr>
                                <th className="text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase px-6 py-4">Nama</th>
                                <th className="text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase px-6 py-4">Email</th>
                                <th className="text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase px-6 py-4">Role</th>
                                <th className="text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase px-6 py-4">Tanggal Daftar</th>
                                <th className="text-right text-xs font-bold text-slate-500 dark:text-slate-400 uppercase px-6 py-4">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {users?.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{user.name}</td>
                                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{user.email}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                                            user.role === 'admin' 
                                                ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' 
                                                : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
                                        }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-sm">
                                        {new Date(user.created_at).toLocaleDateString('id-ID')}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {user.role !== 'admin' && (
                                            <Button variant="danger" size="sm" onClick={() => handleDelete(user.id)} className="px-3" title="Hapus User">
                                                🗑️
                                            </Button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
