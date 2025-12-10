import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Sparkles, ArrowRight, ClipboardPaste } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function UrlForm({ onSubmit, isLoading, t }) {
    const [url, setUrl] = useState("");
    const [error, setError] = useState("");

    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText();
            if (text) {
                setUrl(text);
                toast.success(t.paste_success);
            }
        } catch (err) {
            toast.error(t.paste_error);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!url) {
            setError(t.error_empty);
            return;
        }
        try {
            new URL(url);
        } catch (_) {
            setError(t.error_invalid);
            return;
        }
        setError("");
        onSubmit(url);
    };

    return (
        <div className="w-full max-w-2xl mx-auto text-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
            >
                <div className="space-y-6 flex flex-col items-center">
                    <div className="relative inline-flex items-center justify-center">
                        <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full"></div>
                        <div className="flex items-center gap-3 relative z-10">
                            <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 rotate-3 transition-transform hover:rotate-6">
                                <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-white" />
                            </div>
                            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-slate-900">
                                mid<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">link</span>
                            </h1>
                        </div>
                    </div>
                    <p className="text-lg md:text-xl text-slate-500 max-w-lg mx-auto font-light leading-relaxed">
                        {t.subtitle}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="relative max-w-xl mx-auto group pt-4 w-full">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-50 transition duration-1000 group-hover:duration-200 group-hover:opacity-75"></div>
                    <div className="relative flex p-2 bg-white rounded-2xl shadow-sm ring-1 ring-slate-200/50 transition-all focus-within:ring-indigo-500/30 focus-within:shadow-xl focus-within:shadow-indigo-100/50">
                        <div className="flex-1 flex items-center pr-2 min-w-0">
                            <Input
                                type="url"
                                placeholder={t.placeholder}
                                value={url}
                                onChange={(e) => {
                                    setUrl(e.target.value);
                                    if(error) setError("");
                                }}
                                className="w-full border-none shadow-none focus-visible:ring-0 text-base md:text-lg h-14 bg-transparent placeholder:text-slate-300 font-medium"
                                disabled={isLoading}
                            />
                            <Button
                                type="button"
                                onClick={handlePaste}
                                variant="ghost"
                                className="text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg mr-2 h-10 w-10 p-0 transition-colors shrink-0"
                                title={url ? t.replace_link : t.paste_link}
                            >
                                <ClipboardPaste className={`w-5 h-5 ${url ? 'text-indigo-500' : ''}`} />
                            </Button>
                        </div>
                        <Button 
                            type="submit" 
                            disabled={isLoading}
                            className="bg-slate-900 hover:bg-black text-white h-14 px-8 rounded-xl font-medium transition-all shadow-none hover:shadow-lg hover:-translate-y-0.5"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Sparkles className="w-5 h-5" />
                            )}
                        </Button>
                    </div>
                </form>
                
                {error && (
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-red-500 text-sm font-medium"
                    >
                        {error}
                    </motion.p>
                )}
            </motion.div>
        </div>
    );
}