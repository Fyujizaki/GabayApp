import React, { memo, useEffect, useMemo } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

// --- ICONS ---
export const Icon = memo(({ d, className, ...props }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>{d}</svg>
));

export const Icons = {
    MessageSquare: (p) => <Icon {...p} d={<><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></>} />,
    Briefcase: (p) => <Icon {...p} d={<><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></>} />,
    User: (p) => <Icon {...p} d={<><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>} />,
    Award: (p) => <Icon {...p} d={<><circle cx="12" cy="8" r="7" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" /></>} />,
    Menu: (p) => <Icon {...p} d={<><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></>} />,
    X: (p) => <Icon {...p} d={<><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>} />,
    Send: (p) => <Icon {...p} d={<><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></>} />,
    Heart: (p) => <Icon {...p} d={<><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></>} />,
    MapPin: (p) => <Icon {...p} d={<><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></>} />,
    ShieldCheck: (p) => <Icon {...p} d={<><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></>} />,
    BookOpen: (p) => <Icon {...p} d={<><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></>} />,
    Sun: (p) => <Icon {...p} d={<><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /></>} />,
    Moon: (p) => <Icon {...p} d={<><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></>} />,
    LogOut: (p) => <Icon {...p} d={<><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></>} />,
    CheckCircle: (p) => <Icon {...p} d={<><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></>} />,
    Sparkles: (p) => <Icon {...p} d={<><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L12 3Z" /></>} />,
    PenTool: (p) => <Icon {...p} d={<><path d="m12 19 7-7 3 3-7 7-3-3z" /><path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" /><path d="m2 2 7.586 7.586" /><circle cx="11" cy="11" r="2" /></>} />,
    Lightbulb: (p) => <Icon {...p} d={<><line x1="9" y1="18" x2="15" y2="18" /><line x1="10" y1="22" x2="14" y2="22" /><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 9.5 6 4.65 4.65 0 0 0 7.5 11.5" /><path d="M9 18h6" /><path d="M10 22h4" /></>} />,
    Gift: (p) => <Icon {...p} d={<><polyline points="20 12 20 22 4 22 4 12" /><rect x="2" y="7" width="20" height="5" /><line x1="12" y1="22" x2="12" y2="7" /><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" /><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" /></>} />,
    Map: (p) => <Icon {...p} d={<><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" /><line x1="8" y1="2" x2="8" y2="18" /><line x1="16" y1="6" x2="16" y2="22" /></>} />,
    AlertTriangle: (p) => <Icon {...p} d={<><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></>} />,
    Phone: (p) => <Icon {...p} d={<><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></>} />,
};

// --- CARD ---
export const Card = memo(({ children, className = "" }) => (
    <div className={`glass-panel stitch-border p-6 rounded-2xl shadow-sm bg-white/50 dark:bg-slate-800/50 ${className}`}>
        {children}
    </div>
));

// --- BUTTON ---
export const Button = memo(({ children, onClick, variant = "primary", className = "", disabled = false }) => {
    const baseStyle = "px-4 py-2 rounded-xl font-bold transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2";
    const variants = {
        primary: "bg-barong-navy text-barong-gold border border-barong-gold shadow-md hover:bg-barong-navy/90",
        secondary: "bg-barong-gold/20 text-barong-navy border border-barong-gold/30 dark:text-white",
        outline: "border border-barong-navy/20 text-barong-navy hover:bg-barong-navy/5 dark:text-white dark:border-white/20",
        danger: "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
    };
    return (
        <button onClick={onClick} disabled={disabled} className={`${baseStyle} ${variants[variant] || variants.primary} ${className}`}>
            {children}
        </button>
    );
});

// --- TOGGLE ---
export const Toggle = memo(({ checked, onChange }) => (
    <button onClick={() => onChange(!checked)} className={`w-12 h-6 rounded-full p-1 transition-colors ${checked ? 'bg-barong-gold' : 'bg-slate-300 dark:bg-slate-600'}`}>
        <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${checked ? 'translate-x-6' : 'translate-x-0'}`} />
    </button>
));

// --- MARKDOWN BLOCK ---
export const MarkdownBlock = memo(({ content, className = "" }) => {
    const html = useMemo(() => {
        const rawHtml = marked.parse(content || "");
        return DOMPurify.sanitize(rawHtml);
    }, [content]);
    return (
        <div 
            className={`prose prose-sm dark:prose-invert max-w-none ${className}`} 
            dangerouslySetInnerHTML={{ __html: html }} 
        />
    );
});

// --- TOAST ---
export const Toast = ({ message, type, onClose }) => {
    useEffect(() => {
        if (message) {
            const timer = setTimeout(onClose, 3000);
            return () => clearTimeout(timer);
        }
    }, [message, onClose]);

    if (!message) return null;

    return (
        <div className={`fixed bottom-24 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-full shadow-xl z-50 animate-fade-in flex items-center gap-2 ${type === 'error' ? 'bg-red-500 text-white' : 'bg-barong-navy text-barong-gold border border-barong-gold'}`}>
            {type === 'success' ? <Icons.CheckCircle size={18} /> : <Icons.X size={18} />}
            <span className="font-serif tracking-wide">{message}</span>
        </div>
    );
};
