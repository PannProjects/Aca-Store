import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';
import Card from '../../Components/Card';
import Input from '../../Components/Input';
import Button from '../../Components/Button';

export default function EditProfile({ auth }) {
    const { data, setData, put, processing, errors } = useForm({
        name: auth.user.name,
        email: auth.user.email,
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        put('/profile');
    };

    return (
        <AuthenticatedLayout title="Edit Profil">
            <Head title="Edit Profil" />

            <div className="max-w-2xl mx-auto">
                <Card className="border-0 shadow-md dark:shadow-lg dark:shadow-black/20">
                    <Card.Header className="bg-white dark:bg-slate-800 dark:border-slate-700">
                        <h3 className="font-bold text-slate-800 dark:text-white">Informasi Pribadi</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Update informasi akun dan password Anda</p>
                    </Card.Header>
                    
                    <Card.Body>
                        <form onSubmit={submit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input
                                    label="Nama Lengkap"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    error={errors.name}
                                    required
                                />
                                <Input
                                    type="email"
                                    label="Email Address"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    error={errors.email}
                                    required
                                />
                            </div>

                            <div className="border-t border-slate-100 dark:border-slate-700 pt-6">
                                <h4 className="font-semibold text-slate-800 dark:text-white mb-4">Ganti Password (Opsional)</h4>
                                <div className="space-y-4">
                                    <Input
                                        type="password"
                                        label="Password Saat Ini"
                                        value={data.current_password}
                                        onChange={(e) => setData('current_password', e.target.value)}
                                        error={errors.current_password}
                                        placeholder="Kosongkan jika tidak ingin mengganti"
                                    />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <Input
                                            type="password"
                                            label="Password Baru"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            error={errors.password}
                                        />
                                        <Input
                                            type="password"
                                            label="Konfirmasi Password Baru"
                                            value={data.password_confirmation}
                                            onChange={(e) => setData('password_confirmation', e.target.value)}
                                            error={errors.password_confirmation}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <Button type="submit" variant="primary" disabled={processing}>
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
