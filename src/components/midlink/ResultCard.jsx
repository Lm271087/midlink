import React from 'react';
import { motion } from "framer-motion";
import { ExternalLink, Quote } from "lucide-react";

export default function ResultCard({ data }) {
    if (!data) return null;

    const { title, summary, key_points, image_url, source_name, original_url } = data;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-[400px] mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col aspect-[4/5] border border-slate-100"
        >
            {/* Header Image */}
            <div className="relative h-[35%] w-full bg-slate-100 overflow-hidden group">
                {image_url ? (
                    <img 
                        src={image_url} 
                        alt={title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        onError={(e) => {
                            e.target.onerror = null; 
                            e.target.src = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2070&auto=format&fit=crop";
                        }}
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                        <Quote className="w-12 h-12 text-indigo-300" />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-6 right-6">
                    <span className="inline-block px-2 py-1 bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider rounded mb-2">
                        Destaque
                    </span>
                    <h2 className="text-white font-bold text-lg leading-tight line-clamp-2 drop-shadow-md">
                        {title}
                    </h2>
                </div>
            </div>

            {/* Content Body */}
            <div className="flex-1 p-6 flex flex-col bg-white relative">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                    <Quote className="w-24 h-24" />
                </div>

                <div className="mb-4 relative z-10">
                    <p className="text-slate-600 text-sm leading-relaxed font-medium">
                        {summary}
                    </p>
                </div>

                <div className="flex-1 space-y-3 relative z-10">
                    {key_points && key_points.map((point, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0" />
                            <p className="text-slate-800 text-sm font-semibold leading-snug">
                                {point}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center text-xs text-slate-400">
                    <div className="flex items-center gap-1 font-medium text-slate-500">
                        <span>Fonte:</span>
                        <span className="text-indigo-600 font-bold">{source_name || "Web"}</span>
                    </div>
                    <div className="font-mono opacity-50">
                        midlink.app
                    </div>
                </div>
            </div>
        </motion.div>
    );
}