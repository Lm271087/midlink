import React from 'react';

export default function Layout({ children }) {
    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-slate-200 selection:text-slate-900">
            <link rel="icon" href="https://api.iconify.design/lucide:sparkles.svg?color=%230f172a" />
            <title>midlink - Visual Link Cards</title>
            {children}
        </div>
    );
}