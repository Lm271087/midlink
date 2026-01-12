import React, { forwardRef, useRef } from 'react';
import { motion } from "framer-motion";
import { Quote, ImagePlus } from "lucide-react";

const ResultCard = forwardRef(({ data, onImageUpdate, onTitleUpdate, t }, ref) => {
    const fileInputRef = useRef(null);
    const [isEditingTitle, setIsEditingTitle] = React.useState(false);
    const [editedTitle, setEditedTitle] = React.useState('');

    if (!data) return null;

    const { title, summary, description, key_points, keywords, image_url, source_name, channel_name, author, published_date, content_type } = data;
    const isVideo = content_type?.toLowerCase().includes('vídeo') || content_type?.toLowerCase().includes('video') || content_type?.toLowerCase().includes('tutorial');
    const displayAuthor = isVideo ? channel_name : author;

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

    const handleTitleEdit = () => {
        setEditedTitle(title);
        setIsEditingTitle(true);
    };

    const handleTitleSave = () => {
        if (editedTitle.trim() && onTitleUpdate) {
            onTitleUpdate(editedTitle.trim());
        }
        setIsEditingTitle(false);
    };

    const handleTitleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleTitleSave();
        } else if (e.key === 'Escape') {
            setIsEditingTitle(false);
        }
    };

    return (
        <motion.div
            ref={ref}
            className="w-full max-w-[400px] mx-auto aspect-[9/16] bg-white rounded-none shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col ring-1 ring-black/5 relative group/card"
        >
            {/* Hidden File Input */}
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                className="hidden" 
                accept="image/*"
            />

            {/* Header Image Section - 50% Height */}
            <div className="relative h-[50%] w-full bg-slate-900 overflow-hidden shrink-0 group/image">
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
                <div className="absolute bottom-0 left-0 right-0 p-4 pt-16 z-10 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent group/title">
                     <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-2"
                     >
                        {isVideo && content_type && (
                            <div className="flex items-center gap-2">
                                <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-red-600 text-white rounded-md shadow-lg">
                                    {content_type}
                                </span>
                            </div>
                        )}
                        <div className="relative">
                            {isEditingTitle ? (
                                <input
                                    type="text"
                                    value={editedTitle}
                                    onChange={(e) => setEditedTitle(e.target.value)}
                                    onBlur={handleTitleSave}
                                    onKeyDown={handleTitleKeyDown}
                                    autoFocus
                                    className="w-full bg-white/10 backdrop-blur-sm text-white font-black text-[26px] leading-[1.1] tracking-tight px-2 py-1 rounded border-2 border-white/30 focus:outline-none focus:border-white/60"
                                />
                            ) : (
                                <h2 
                                onClick={handleTitleEdit}
                                className="text-white font-black text-2xl sm:text-[28px] leading-[1.1] tracking-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] cursor-pointer hover:text-white/95 transition-all hover:scale-[1.02]"
                                >
                                {title || t?.no_title || "Sem título disponível"}
                                </h2>
                            )}
                        </div>
                     </motion.div>
                </div>
            </div>

            {/* Content Body - ~40% Content + 10% Footer */}
            <div className="h-[50%] px-4 sm:px-5 pt-4 sm:pt-6 pb-3 sm:pb-4 flex flex-col bg-white overflow-hidden">
                {/* Summary/Description */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex-1 shrink-0 px-[15px] flex items-center"
                >
                    <p className="text-slate-700 text-sm sm:text-[15px] leading-[1.6] sm:leading-[1.7] font-semibold line-clamp-[10] text-justify">
                        {summary}
                    </p>
                </motion.div>

                {/* Footer - ~10% Height target */}
                <div className="mt-auto pt-3 border-t border-slate-100 flex justify-between items-center text-xs shrink-0 h-[10%] min-h-[40px]">
                    <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-teal-400 to-cyan-500 animate-pulse shadow-[0_0_6px_rgba(45,212,191,0.6)]"></span>
                            <span className="text-[10px]">
                                <span className="text-slate-400">{isVideo ? (t?.channel_label || "Canal:") : (t?.source_label || "Fonte:")}</span>
                                {" "}
                                <span className="text-slate-700 font-bold">{source_name || "Web"}</span>
                            </span>
                        </div>
                        {(displayAuthor || published_date) && (
                            <div className="text-[9px] text-slate-500 pl-3 flex items-center gap-1.5">
                                {displayAuthor && (
                                    <span className="font-medium">
                                        {isVideo ? displayAuthor : `${t?.by_label || "por"} ${displayAuthor}`}
                                    </span>
                                )}
                                {displayAuthor && published_date && <span className="text-slate-300">•</span>}
                                {published_date && <span className="text-slate-400">{published_date}</span>}
                            </div>
                        )}
                    </div>
                    <div className="font-bold text-[10px] text-indigo-600 tracking-wide">
                        midlink
                    </div>
                </div>
            </div>
        </motion.div>
    );
});

ResultCard.displayName = 'ResultCard';

export default ResultCard;