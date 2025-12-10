import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Sparkles, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function UrlForm({ onSubmit, isLoading }) {
    const [url, setUrl] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!url) {
            setError("Por favor, insira uma URL.");
            return;
        }
        try {
            new URL(url);
        } catch (_) {
            setError("Por favor, insira uma URL válida (inclua http:// ou https://).");
            return;
        }
        setError("");
        onSubmit(url);
    };

    return (
        <div className="w-full max-w-2xl mx-auto text-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
            >
                <div className="space-y-2">
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900">
                        mid<span className="text-indigo-600">link</span>
                    </h1>
                    <p className="text-lg text-slate-600 max-w-lg mx-auto">
                        Transforme qualquer link em um card visual incrível para redes sociais em segundos.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="relative max-w-lg mx-auto group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative flex p-2 bg-white rounded-xl shadow-xl ring-1 ring-slate-900/5">
                        <div className="flex-1">
                            <Input
                                type="url"
                                placeholder="Cole seu link aqui (ex: https://noticia.com/artigo)"
                                value={url}
                                onChange={(e) => {
                                    setUrl(e.target.value);
                                    if(error) setError("");
                                }}
                                className="w-full border-none shadow-none focus-visible:ring-0 text-base h-12 bg-transparent"
                                disabled={isLoading}
                            />
                        </div>
                        <Button 
                            type="submit" 
                            disabled={isLoading}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white h-12 px-6 rounded-lg font-medium transition-all shadow-lg shadow-indigo-200"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <span className="flex items-center gap-2">
                                    Gerar <Sparkles className="w-4 h-4" />
                                </span>
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