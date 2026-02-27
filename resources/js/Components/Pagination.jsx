import { Link } from '@inertiajs/react';

/**
 * Komponen Pagination untuk Inertia.js + Laravel paginate().
 * 
 * Gunakan: <Pagination links={data.links} />
 * di mana `data` adalah hasil dari ->paginate() di controller.
 */
export default function Pagination({ links }) {
    if (!links || links.length <= 3) return null;

    return (
        <nav className="flex items-center justify-center gap-1 mt-8">
            {links.map((link, i) => {
                if (!link.url) {
                    return (
                        <span
                            key={i}
                            className="px-3 py-2 text-sm text-slate-400 dark:text-slate-500 select-none"
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    );
                }

                return (
                    <Link
                        key={i}
                        href={link.url}
                        preserveScroll
                        className={`px-3 py-2 text-sm rounded-lg font-medium transition-all ${
                            link.active
                                ? 'bg-primary-600 text-white shadow-sm'
                                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                        }`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                );
            })}
        </nav>
    );
}
