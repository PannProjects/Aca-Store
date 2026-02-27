import { Head, Link } from '@inertiajs/react';
import GuestLayout from '../../Layouts/GuestLayout';
import Button from '../../Components/Button';

export default function ForgotPassword() {
    const waNumber = '62895384661641';
    const waMessage = encodeURIComponent('Halo Admin AcaStore! Saya lupa password akun saya. Bisakah dibantu reset?\n\nEmail: [tulis email kamu di sini]');
    const waUrl = `https://api.whatsapp.com/send?phone=${waNumber}&text=${waMessage}`;

    return (
        <GuestLayout>
            <Head title="Lupa Password" />

            <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                    <svg className="w-8 h-8 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                </div>
                <h2 className="text-xl font-semibold text-slate-800 dark:text-white">Lupa Password?</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                    Hubungi admin melalui WhatsApp untuk mereset password akun Anda.
                </p>
            </div>

            <div className="space-y-4">
                <a href={waUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="primary" size="lg" className="w-full gap-2 justify-center">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        Chat Admin via WhatsApp
                    </Button>
                </a>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
                    </div>
                    <div className="relative flex justify-center text-xs">
                        <span className="px-3 bg-white dark:bg-slate-800 text-slate-400">Langkah reset</span>
                    </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                    <ol className="list-decimal list-inside space-y-2 text-sm text-slate-600 dark:text-slate-400">
                        <li>Chat admin via WhatsApp di atas</li>
                        <li>Beritahu <strong className="text-slate-800 dark:text-slate-200">email akun</strong> kamu</li>
                        <li>Admin akan mereset password kamu</li>
                        <li>Login dengan password baru dari admin</li>
                    </ol>
                </div>
            </div>

            <div className="text-center mt-6">
                <Link href="/login" className="text-sm font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 inline-flex items-center gap-1">
                    <span>←</span> Kembali ke Login
                </Link>
            </div>
        </GuestLayout>
    );
}
