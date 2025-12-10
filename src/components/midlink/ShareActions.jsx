import React from 'react';
import { Button } from "@/components/ui/button";
import { MessageCircle, Facebook, Linkedin, Twitter, Share2, Download, ImageIcon } from "lucide-react";
import { toast } from "sonner";

export default function ShareActions({ data, onDownload, isDownloading }) {
    if (!data) return null;

    const shareUrl = data.original_url || window.location.href;
    const shareText = `${data.title} - ${data.summary}`;

    // Social sharing logic removed as requested

    const copyToClipboard = () => {
        navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
        toast.success("Texto e link copiados!");
    };

    return (
        <div className="flex flex-col items-center gap-4 mt-8">
            <div className="flex flex-wrap justify-center gap-4">
                <div className="flex gap-3">
                    <Button 
                        variant="default"
                        onClick={onDownload}
                        disabled={isDownloading}
                        className="rounded-full h-12 px-6 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg transition-all"
                    >
                         {isDownloading ? (
                            <span className="flex items-center gap-2">
                                <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                Baixando...
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <Download className="w-4 h-4" /> Baixar Card
                            </span>
                        )}
                    </Button>
                    
                    <Button 
                        variant="outline" 
                        onClick={copyToClipboard}
                        className="rounded-full h-12 w-12 p-0 border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 shadow-sm"
                        title="Copiar Link"
                    >
                        <Share2 className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}