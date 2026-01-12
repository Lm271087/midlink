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
                <div className="space-y-4 flex flex-col items-center mb-10">
                    <div className="flex flex-col items-center gap-2">
                        <div className="flex items-center gap-2 text-slate-900">
                             <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center">
                                <Sparkles className="w-4 h-4 text-white" />
                             </div>
                             <h1 className="text-3xl font-bold tracking-tight">midlink</h1>
                        </div>
                        <p className="text-base text-slate-500 max-w-md mx-auto font-normal text-center leading-relaxed">
                            {t.subtitle}
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="relative max-w-lg mx-auto w-full">
                    <div className="relative flex items-center p-1.5 bg-white rounded-full shadow-[0_2px_20px_rgba(0,0,0,0.04)] ring-1 ring-slate-100 transition-all hover:shadow-[0_4px_24px_rgba(0,0,0,0.06)] focus-within:ring-slate-200 focus-within:shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
                        <div className="pl-4 flex-1 flex items-center min-w-0">
                            <Input
                                type="url"
                                placeholder={t.placeholder}
                                value={url}
                                onChange={(e) => {
                                    setUrl(e.target.value);
                                    if(error) setError("");
                                }}
                                className="w-full border-none shadow-none focus-visible:ring-0 text-base h-11 bg-transparent placeholder:text-slate-400/80 font-normal px-0"
                                disabled={isLoading}
                            />
                        </div>
                        <div className="flex items-center gap-1 pr-1.5">
                            <Button
                                type="button"
                                onClick={handlePaste}
                                variant="ghost"
                                className="text-slate-400 hover:text-indigo-600 hover:bg-indigo-50/50 rounded-full h-9 w-9 p-0 transition-all shrink-0"
                                title={url ? t.replace_link : t.paste_link}
                            >
                                <ClipboardPaste className={`w-4 h-4 ${url ? 'text-indigo-600' : ''}`} />
                            </Button>
                            <Button 
                                type="submit" 
                                disabled={isLoading}
                                className="bg-slate-900 hover:bg-black text-white h-10 px-5 rounded-full font-medium text-sm transition-all shadow-sm hover:shadow-md"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <ArrowRight className="w-4 h-4" />
                                )}
                            </Button>
                        </div>
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