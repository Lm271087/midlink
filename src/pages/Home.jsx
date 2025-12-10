import React, { useState } from 'react';
import { base44 } from "@/api/base44Client";
import UrlForm from "@/components/midlink/UrlForm";
import ResultCard from "@/components/midlink/ResultCard";
import ShareActions from "@/components/midlink/ShareActions";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function HomePage() {
    const [result, setResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

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
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50">
            <div className="w-full max-w-4xl space-y-12">
                
                {/* Input Section */}
                <div className={result ? "scale-90 opacity-80 transition-all hover:scale-100 hover:opacity-100" : "scale-100 transition-all"}>
                    <UrlForm onSubmit={handleAnalyze} isLoading={isLoading} />
                </div>

                {/* Error Display */}
                {error && (
                    <div className="max-w-lg mx-auto">
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Erro</AlertTitle>
                            <AlertDescription>
                                {error}
                            </AlertDescription>
                        </Alert>
                    </div>
                )}

                {/* Result Section */}
                {result && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <div className="flex justify-center">
                            <ResultCard data={result} />
                        </div>
                        <ShareActions data={result} />
                    </div>
                )}
            </div>
            
            <Toaster position="top-center" />
        </div>
    );
}