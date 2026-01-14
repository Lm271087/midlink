import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { X, Download, Share, PlusSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function InstallPrompt({ t }) {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showPrompt, setShowPrompt] = useState(false);
    const [isIOS, setIsIOS] = useState(false);

    useEffect(() => {
        // Handle Android/Desktop beforeinstallprompt
        const handler = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setShowPrompt(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        // Handle iOS detection
        const userAgent = window.navigator.userAgent.toLowerCase();
        const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;

        if (isIosDevice && !isStandalone) {
             // Show iOS prompt if not already in standalone mode
             // We use sessionStorage to only show it once per session to not be annoying
             const hasSeenPrompt = sessionStorage.getItem('iosInstallPromptSeen');
             if (!hasSeenPrompt) {
                 setIsIOS(true);
                 // Delay slightly to not overwhelm on load
                 setTimeout(() => setShowPrompt(true), 2000);
             }
        }

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstallClick = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                setDeferredPrompt(null);
            }
            setShowPrompt(false);
        }
    };

    const handleDismiss = () => {
        setShowPrompt(false);
        if (isIOS) {
            sessionStorage.setItem('iosInstallPromptSeen', 'true');
        }
    };

    if (!showPrompt) return null;

    return (
        <AnimatePresence>
            {showPrompt && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: "spring", damping: 20, stiffness: 300 }}
                    className="fixed bottom-0 left-0 right-0 z-50 p-4 md:right-4 md:left-auto md:bottom-4 md:w-[400px]"
                >
                    <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-5 border border-slate-200/60 flex flex-col gap-4">
                        <div className="flex justify-between items-start">
                            <div className="flex gap-4">
                                <div className="h-12 w-12 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shrink-0 shadow-md shadow-indigo-500/20 text-white">
                                    <Download className="h-6 w-6" />
                                </div>
                                <div className="pt-0.5">
                                    <h3 className="font-bold text-slate-900 text-base leading-tight">
                                        {t?.install_app || "Instalar Midlink"}
                                    </h3>
                                    <p className="text-sm text-slate-500 leading-snug mt-1">
                                        {isIOS 
                                            ? (t?.install_ios_desc || "Adicione à tela de início para acesso rápido.")
                                            : (t?.install_desc || "Instale nosso app para uma melhor experiência.")}
                                    </p>
                                </div>
                            </div>
                            <button 
                                onClick={handleDismiss} 
                                className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-full transition-colors -mr-2 -mt-2"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                        
                        {isIOS ? (
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-sm text-slate-600 bg-slate-50/80 p-3 rounded-lg border border-slate-100">
                                    <span className="shrink-0 flex items-center justify-center w-8 h-8 bg-white rounded-md shadow-sm text-blue-500">
                                        <Share className="h-4 w-4" />
                                    </span>
                                    <span>
                                        1. Toque em <span className="font-semibold text-slate-900">Compartilhar</span>
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-slate-600 bg-slate-50/80 p-3 rounded-lg border border-slate-100">
                                    <span className="shrink-0 flex items-center justify-center w-8 h-8 bg-white rounded-md shadow-sm text-slate-700">
                                        <PlusSquare className="h-4 w-4" />
                                    </span>
                                    <span>
                                        2. Escolha <span className="font-semibold text-slate-900">Adicionar à Tela de Início</span>
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <Button 
                                onClick={handleInstallClick} 
                                className="w-full bg-slate-900 hover:bg-black text-white font-medium h-11 rounded-xl shadow-lg shadow-slate-900/10 active:scale-[0.98] transition-all"
                            >
                                {t?.install_btn || "Instalar Agora"}
                            </Button>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}