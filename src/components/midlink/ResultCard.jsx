import React from 'react';
import { motion } from "framer-motion";
import { ExternalLink, Quote } from "lucide-react";

export default function ResultCard({ data }) {
    if (!data) return null;

    const { title, summary, key_points, image_url, source_name, original_url } = data;

    return (
        <motion.div
            className="w-full max-w-[380px] mx-auto bg-white rounded-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col aspect-[4/5] ring-1 ring-black/5 relative"
        >
            {/* Header Image Section */}
            <div className="relative h-[40%] w-full bg-slate-50 overflow-hidden">
                {image_url ? (
                    <motion.img 
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        src={image_url} 
                        alt={title} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.target.onerror = null; 
                            e.target.src = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2070&auto=format&fit=crop";
                        }}
                    />
                ) : (
                    <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                        <Quote className="w-12 h-12 text-slate-300" />
                    </div>
                )}
                
                {/* Gradient Overlay for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                
                {/* Title Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 pt-12">
                     <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                     >
                        <span className="inline-flex px-2.5 py-0.5 bg-white/20 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold uppercase tracking-wider rounded-full mb-3">
                            {source_name || "News"}
                        </span>
                        <h2 className="text-white font-bold text-xl leading-tight line-clamp-2 tracking-tight">
                            {title}
                        </h2>
                     </motion.div>
                </div>
            </div>

            {/* Content Body */}
            <div className="flex-1 p-6 flex flex-col bg-white">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mb-6"
                >
                    <p className="text-slate-600 text-[15px] leading-relaxed font-medium">
                        {summary}
                    </p>
                </motion.div>

                <div className="flex-1 space-y-3.5">
                    {key_points && key_points.slice(0, 3).map((point, idx) => (
                        <motion.div 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 + (idx * 0.1) }}
                            key={idx} 
                            className="flex items-start gap-3 group"
                        >
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0 group-hover:bg-indigo-600 transition-colors" />
                            <p className="text-slate-800 text-sm font-semibold leading-snug tracking-tight">
                                {point}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Footer */}
                <div className="mt-6 pt-5 border-t border-slate-50 flex justify-between items-center text-xs">
                    <div className="flex items-center gap-1.5 text-slate-400 font-medium">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        <span>Fonte: <span className="text-slate-700">{source_name || "Web"}</span></span>
                    </div>
                    <div className="font-medium text-indigo-500 tracking-wide">
                        midlink.app
                    </div>
                </div>
            </div>
        </motion.div>
    );
}