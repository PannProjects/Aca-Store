export default function Button({
    type = 'button',
    variant = 'primary',
    size = 'md',
    className = '',
    disabled = false,
    children,
    ...props
}) {
    const variants = {
        primary: 'bg-primary-600 hover:bg-primary-700 text-white shadow-sm hover:shadow active:translate-y-px border border-transparent',
        secondary: 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow',
        outline: 'bg-transparent border border-primary-600 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20',
        ghost: 'bg-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white',
        danger: 'bg-red-600 hover:bg-red-700 text-white shadow-sm hover:shadow border border-transparent',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-2.5 text-base',
        xl: 'px-8 py-3 text-lg',
    };

    return (
        <button
            type={type}
            disabled={disabled}
            className={`
                inline-flex items-center justify-center gap-2 font-medium rounded-lg
                transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-500 active:scale-95
                disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600
                ${variants[variant]}
                ${sizes[size]}
                ${className}
            `}
            {...props}
        >
            {children}
        </button>
    );
}
