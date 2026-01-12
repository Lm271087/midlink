import React from 'react';
import { Button } from "@/components/ui/button";
import { MessageCircle, Facebook, Linkedin, Twitter, Share2, Download, ImageIcon } from "lucide-react";
import { toast } from "sonner";

export default function ShareActions({ data, onDownload, isDownloading, t }) {
    if (!data) return null;

    const shareUrl = data.original_url || window.location.href;
    const shareText = `${data.title} - ${data.summary}`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
        toast.success(t.copy_success);
    };

    return (
        <div className="flex flex-col items-center gap-4 mt-8">
            <div className="flex flex-wrap justify-center gap-4">
                <div className="flex gap-3">
                    <Button 
                        variant="default"
                        onClick={onDownload}
                        disabled={isDownloading}
                        className="rounded-full h-10 px-6 bg-slate-900 hover:bg-black text-white shadow-sm hover:shadow-md transition-all text-sm font-medium"
                    >
                         {isDownloading ? (
                            <span className="flex items-center gap-2">
                                <span className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                {t.downloading}
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <Download className="w-4 h-4" /> {t.download_btn}
                            </span>
                        )}
                    </Button>
                    
                    <Button 
                        variant="outline" 
                        onClick={copyToClipboard}
                        className="rounded-full h-10 w-10 p-0 border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 transition-all"
                        title={t.copy_btn}
                    >
                        <Share2 className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}