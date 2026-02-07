import { Head, Link, useForm } from '@inertiajs/react';
import GuestLayout from '../../Layouts/GuestLayout';
import Input from '../../Components/Input';
import Button from '../../Components/Button';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <GuestLayout>
            <Head title="Masuk" />

            <div className="text-center mb-8">
                <h2 className="text-xl font-semibold text-slate-800 dark:text-white">Selamat Datang Kembali</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Masuk ke akun Anda untuk melanjutkan</p>
            </div>

            <form onSubmit={submit} className="space-y-5">
                <Input
                    type="email"
                    label="Email Address"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    error={errors.email}
                    placeholder="email@example.com"
                    autoComplete="username"
                    required
                />

                <div className="space-y-1">
                    <Input
                        type="password"
                        label="Password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        error={errors.password}
                        placeholder="••••••••"
                        autoComplete="current-password"
                        required
                    />
                </div>

                <Button type="submit" variant="primary" size="lg" className="w-full mt-2" disabled={processing}>
                    {processing ? 'Memuat...' : 'Masuk'}
                </Button>

                <div className="text-center mt-6">
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Belum punya akun?{' '}
                        <Link href="/register" className="font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">
                            Daftar sekarang
                        </Link>
                    </p>
                </div>
            </form>
        </GuestLayout>
    );
}
