import React, { useState, useRef } from 'react';
import { base44 } from "@/api/base44Client";
import UrlForm from "@/components/midlink/UrlForm";
import ResultCard from "@/components/midlink/ResultCard";
import ShareActions from "@/components/midlink/ShareActions";
import LanguageSelector from "@/components/midlink/LanguageSelector";
import InstallPrompt from "@/components/midlink/InstallPrompt";
import { translations } from "@/components/midlink/translations";
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
    const [language, setLanguage] = useState('pt-BR');
    const cardRef = useRef(null);

    const t = translations[language] || translations['pt-BR'];

    const handleDownload = async () => {
        if (!cardRef.current) return;
        setIsDownloading(true);
        try {
            // Wait a bit for any images to be fully rendered/loaded if they just appeared
            await new Promise(resolve => setTimeout(resolve, 500));

            const canvas = await html2canvas(cardRef.current, {
                useCORS: true,
                scale: 3, // Higher resolution
                backgroundColor: null,
                logging: false,
                allowTaint: true,
                onclone: (documentClone) => {
                    const card = documentClone.querySelector('.group\\/card');
                    if (card) {
                        // Reset transforms that might interfere
                        card.style.transform = 'none';
                    }
                        }
            });
            
            const image = canvas.toDataURL("image/png");
            const link = document.createElement("a");
            link.href = image;
            link.download = `midlink-${result.title.slice(0, 20).replace(/\s+/g, '-').toLowerCase()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast.success(t.download_start);
        } catch (err) {
            console.error("Erro no download:", err);
            toast.error(t.download_error, { description: t.download_retry });
        } finally {
            setIsDownloading(false);
        }
    };

    const handleAnalyze = async (url) => {
        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            // Increase timeout to 90 seconds to handle longer content generation
            const response = await base44.functions.invoke('analyzeLink', { url, language }, { timeout: 90000 });

            if (response.data.error) {
                throw new Error(response.data.error);
            }

            // The data might be directly in response.data or nested depending on function return
            // Our function returns { data: analysis, id: ... } or { error: ... }
            const analysisData = response.data.data;
            
            if (!analysisData) {
                 throw new Error(t.failed_extract);
            }

            // Enrich with original url for sharing
            setResult({ ...analysisData, original_url: url });
        } catch (err) {
            console.error(err);
            let errorMessage = err.message || t.analyze_error;
            
            // Handle timeout/gateway errors specifically
            if (errorMessage.includes('5024') || errorMessage.includes('timeout') || errorMessage.includes('504') || errorMessage.includes('Network Error')) {
                errorMessage = t.timeout_error || 'The analysis took too long or failed to connect. Please try again.';
            }

            // If it's a 500 error from our function, it might be generic. Try to be helpful.
            if (errorMessage.includes('500') || errorMessage.includes('status code 500')) {
                 errorMessage = "Service temporarily unavailable or link content not accessible. Please try a different link or try again later.";
            }

            setError(errorMessage);
            toast.error(t.analyze_fail_title, { description: errorMessage });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 md:p-6 bg-slate-50 text-slate-900 selection:bg-indigo-500/10 selection:text-indigo-700 relative overflow-hidden">
            {/* Minimalist Ambient Background */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-100/40 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-100/40 rounded-full blur-[120px] pointer-events-none" />

            <div className="absolute top-6 right-6 z-50">
                <LanguageSelector currentLang={language} onLanguageChange={setLanguage} />
            </div>

            <InstallPrompt t={t} />

            <div className="w-full max-w-4xl space-y-6 md:space-y-8 relative z-10 pt-8 md:pt-0">
                
                {/* Input Section - smoothly transitions when result is present */}
                <motion.div 
                    layout
                    className={`transition-all duration-700 ease-spring ${result ? "scale-90 opacity-60 hover:opacity-100 hover:scale-95" : "scale-100"}`}
                >
                    <UrlForm onSubmit={handleAnalyze} isLoading={isLoading} t={t} />
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
                                <AlertTitle>{t.analyze_fail_title}</AlertTitle>
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
                                <ResultCard 
                                    ref={cardRef} 
                                    data={result} 
                                    t={t}
                                    onImageUpdate={(newImage) => setResult(prev => ({ ...prev, image_url: newImage }))}
                                    onTitleUpdate={(newTitle) => setResult(prev => ({ ...prev, title: newTitle }))}
                                />
                            </div>
                            <ShareActions 
                                data={result}
                                onDownload={handleDownload} 
                                isDownloading={isDownloading} 
                                t={t}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            
            <Toaster position="top-center" theme="light" closeButton />
        </div>
    );
}