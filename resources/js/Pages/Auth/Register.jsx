import { Head, Link, useForm } from '@inertiajs/react';
import GuestLayout from '../../Layouts/GuestLayout';
import Input from '../../Components/Input';
import Button from '../../Components/Button';

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/register');
    };

    return (
        <GuestLayout>
            <Head title="Daftar" />

            <div className="text-center mb-8">
                <h2 className="text-xl font-semibold text-slate-800 dark:text-white">Buat Akun Baru</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Bergabung dengan AcaStore sekarang</p>
            </div>

            <form onSubmit={submit} className="space-y-5">
                <Input
                    label="Nama Lengkap"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    error={errors.name}
                    placeholder="John Doe"
                    required
                />

                <Input
                    type="email"
                    label="Email Address"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    error={errors.email}
                    placeholder="email@example.com"
                    required
                />

                <Input
                    type="password"
                    label="Password"
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    error={errors.password}
                    placeholder="••••••••"
                    required
                />

                <Input
                    type="password"
                    label="Konfirmasi Password"
                    value={data.password_confirmation}
                    onChange={(e) => setData('password_confirmation', e.target.value)}
                    error={errors.password_confirmation}
                    placeholder="••••••••"
                    required
                />

                <Button type="submit" variant="primary" size="lg" className="w-full mt-2" disabled={processing}>
                    {processing ? 'Mendaftar...' : 'Daftar Sekarang'}
                </Button>

                <div className="text-center mt-6">
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Sudah punya akun?{' '}
                        <Link href="/login" className="font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">
                            Masuk disini
                        </Link>
                    </p>
                </div>
            </form>
        </GuestLayout>
    );
}
