export default function Select({ label, error, className = '', children, ...props }) {
    return (
        <div className="space-y-1.5">
            {label && (
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    {label}
                </label>
            )}
            <select
                className={`
                    w-full px-4 py-2.5 rounded-lg
                    bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700
                    text-slate-900 dark:text-white
                    focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500
                    transition-all duration-200
                    disabled:bg-slate-50 dark:disabled:bg-slate-700 disabled:text-slate-500
                    ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
                    ${className}
                `}
                {...props}
            >
                {children}
            </select>
            {error && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">{error}</p>
            )}
        </div>
    );
}
