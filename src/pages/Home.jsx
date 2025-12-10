import React, { useState, useRef } from 'react';
import { base44 } from "@/api/base44Client";
import UrlForm from "@/components/midlink/UrlForm";
import ResultCard from "@/components/midlink/ResultCard";
import ShareActions from "@/components/midlink/ShareActions";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AnimatePresence, motion } from "framer-motion";
import html2canvas from 'html2canvas';

export default function HomePage() {
    const [result, setResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [error, setError] = useState(null);
    const cardRef = useRef(null);

    const handleDownload = async () => {
        if (!cardRef.current) return;
        setIsDownloading(true);
        try {
            // Wait a bit for any images to be fully rendered/loaded if they just appeared
            await new Promise(resolve => setTimeout(resolve, 500));

            const canvas = await html2canvas(cardRef.current, {
                useCORS: true,
                scale: 2, // Higher resolution
                backgroundColor: null,
                logging: false,
                allowTaint: true,
            });
            
            const image = canvas.toDataURL("image/png");
            const link = document.createElement("a");
            link.href = image;
            link.download = `midlink-${result.title.slice(0, 20).replace(/\s+/g, '-').toLowerCase()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast.success("Download iniciado!");
        } catch (err) {
            console.error("Erro no download:", err);
            toast.error("Erro ao gerar imagem", { description: "Tente novamente." });
        } finally {
            setIsDownloading(false);
        }
    };

    const handleAnalyze = async (url) => {
        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await base44.functions.invoke('analyzeLink', { url });
            
            if (response.data.error) {
                throw new Error(response.data.error);
            }

            // The data might be directly in response.data or nested depending on function return
            // Our function returns { data: analysis, id: ... } or { error: ... }
            const analysisData = response.data.data;
            
            if (!analysisData) {
                 throw new Error("Não foi possível extrair dados desta URL.");
            }

            // Enrich with original url for sharing
            setResult({ ...analysisData, original_url: url });
        } catch (err) {
            console.error(err);
            setError(err.message || "Ocorreu um erro ao analisar o link. Tente novamente.");
            toast.error("Falha na análise", { description: "Verifique o link ou tente outro site." });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#FAFAFA] text-slate-900 selection:bg-indigo-100 selection:text-indigo-900 relative overflow-hidden">
            {/* Subtle Background Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-50/50 via-white/50 to-purple-50/50 pointer-events-none"></div>

            <div className="w-full max-w-4xl space-y-8 relative z-10">
                
                {/* Input Section - smoothly transitions when result is present */}
                <motion.div 
                    layout
                    className={`transition-all duration-700 ease-spring ${result ? "scale-90 opacity-60 hover:opacity-100 hover:scale-95" : "scale-100"}`}
                >
                    <UrlForm onSubmit={handleAnalyze} isLoading={isLoading} />
                </motion.div>

                {/* Error Display */}
                <AnimatePresence>
                    {error && (
                        <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="max-w-lg mx-auto"
                        >
                            <Alert variant="destructive" className="border-red-100 bg-red-50/50 backdrop-blur-sm">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Erro na análise</AlertTitle>
                                <AlertDescription>
                                    {error}
                                </AlertDescription>
                            </Alert>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Result Section */}
                <AnimatePresence mode="wait">
                    {result && (
                        <motion.div 
                            initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
                            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                            exit={{ opacity: 0, y: 40, filter: "blur(10px)" }}
                            transition={{ duration: 0.6, type: "spring", bounce: 0.3 }}
                            className="space-y-8"
                        >
                            <div className="flex justify-center">
                                <ResultCard data={result} />
                            </div>
                            <ShareActions data={result} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            
            <Toaster position="top-center" theme="light" closeButton />
        </div>
    );
}