export default function Card({ className = '', hover = false, children, ...props }) {
    return (
        <div
            className={`
                bg-white rounded-xl border border-slate-200 shadow-sm
                dark:bg-slate-800 dark:border-slate-700
                ${hover ? 'hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300' : ''}
                ${className}
            `}
            {...props}
        >
            {children}
        </div>
    );
}

Card.Header = function CardHeader({ className = '', children }) {
    return (
        <div className={`px-6 py-4 border-b border-slate-100 dark:border-slate-700 ${className}`}>
            {children}
        </div>
    );
};

Card.Body = function CardBody({ className = '', children }) {
    return (
        <div className={`p-6 ${className}`}>
            {children}
        </div>
    );
};

Card.Footer = function CardFooter({ className = '', children }) {
    return (
        <div className={`px-6 py-4 border-t border-slate-100 bg-slate-50/50 rounded-b-xl dark:border-slate-700 dark:bg-slate-800/50 ${className}`}>
            {children}
        </div>
    );
};
