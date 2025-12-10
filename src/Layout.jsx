import React from 'react';

export default function Layout({ children }) {
    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
            <link rel="icon" href="https://api.iconify.design/lucide:sparkles.svg?color=%234f46e5" />
            <title>midlink - Visual Link Cards</title>
            {children}
        </div>
    );
}