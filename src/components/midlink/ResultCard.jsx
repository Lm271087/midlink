import React, { forwardRef, useRef } from 'react';
import { motion } from "framer-motion";
import { Quote, PlayCircle, ImagePlus, Pencil } from "lucide-react";

const ResultCard = forwardRef(({ data, onImageUpdate, t }, ref) => {
    const fileInputRef = useRef(null);

    if (!data) return null;

    const { title, summary, key_points, image_url, source_name, author, published_date, content_type, target_audience, sentiment, author_intent } = data;

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file && onImageUpdate) {
            const reader = new FileReader();
            reader.onloadend = () => {
                onImageUpdate(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <motion.div
            ref={ref}
            className="w-full max-w-[400px] mx-auto aspect-[9/16] bg-white rounded-[32px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col ring-1 ring-black/5 relative group/card"
        >
            {/* Hidden File Input */}
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                className="hidden" 
                accept="image/*"
            />

            {/* Header Image Section */}
            <div className="relative h-[40%] w-full bg-slate-900 overflow-hidden shrink-0 group/image">
                {/* Image Edit Button */}
                <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute top-3 right-3 z-30 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-md opacity-0 group-hover/image:opacity-100 transition-opacity border border-white/20 shadow-lg"
                title={t?.change_image || "Alterar imagem"}
                >
                <ImagePlus className="w-4 h-4" />
                </button>
                {image_url ? (
                    <motion.img 
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        src={image_url} 
                        alt={title} 
                        crossOrigin="anonymous"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.target.onerror = null; 
                            e.target.src = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2070&auto=format&fit=crop";
                        }}
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                        <Quote className="w-12 h-12 text-slate-700" />
                    </div>
                )}



                {/* Video Play Overlay - Removed as requested */}
                
                {/* Title Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-5 pt-24 z-10 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent">
                     <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                     >
                        <h2 className="text-white font-extrabold text-xl md:text-2xl leading-tight tracking-tight drop-shadow-xl text-shadow-sm">
                            {title || t?.no_title || "Sem título disponível"}
                        </h2>
                     </motion.div>
                </div>
            </div>

            {/* Content Body */}
            <div className="flex-1 p-5 flex flex-col bg-white min-h-[200px]">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mb-4"
                >
                    <p className="text-slate-600 text-sm leading-relaxed font-medium">
                        {summary}
                    </p>
                </motion.div>

                <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                    {key_points && key_points.slice(0, 4).map((point, idx) => (
                        <motion.div 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 + (idx * 0.1) }}
                            key={idx} 
                            className="flex items-start gap-3 group"
                        >
                            <div className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5 shrink-0 group-hover:bg-teal-500 transition-colors shadow-[0_0_8px_rgba(45,212,191,0.5)]" />
                            <p className="text-slate-700 text-sm font-medium leading-relaxed tracking-tight group-hover:text-slate-900 transition-colors">
                                {point}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Footer */}
                <div className="mt-auto pt-5 border-t border-slate-50 flex justify-between items-center text-xs shrink-0">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-slate-400 font-medium">
                            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
                            <span className="text-slate-400">{t?.source_label || "Fonte:"} <span className="text-slate-600 font-semibold">{source_name || "Web"}</span></span>
                        </div>
                        {(author || published_date) && (
                            <div className="text-[10px] text-slate-400 pl-3.5">
                                {author && <span>{t?.by_label || "por"} {author}</span>}
                                {author && published_date && <span> • </span>}
                                {published_date && <span>{published_date}</span>}
                            </div>
                        )}
                    </div>
                    <div className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-violet-500 tracking-wide opacity-80">
                        midlink
                    </div>
                </div>
            </div>
        </motion.div>
    );
});

export default ResultCard;