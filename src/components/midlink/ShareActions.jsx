import React from 'react';
import { Button } from "@/components/ui/button";
import { MessageCircle, Facebook, Linkedin, Twitter, Share2 } from "lucide-react";
import { toast } from "sonner";

export default function ShareActions({ data }) {
    if (!data) return null;

    const shareUrl = data.original_url || window.location.href;
    const shareText = `${data.title} - ${data.summary}`;

    const handleShare = (platform) => {
        let url = '';
        const encodedUrl = encodeURIComponent(shareUrl);
        const encodedText = encodeURIComponent(shareText);

        switch (platform) {
            case 'whatsapp':
                url = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
                break;
            case 'facebook':
                url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
                break;
            case 'twitter':
                url = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
                break;
            case 'linkedin':
                url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
                break;
            default:
                break;
        }

        if (url) {
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
        toast.success("Texto e link copiados!");
    };

    return (
        <div className="flex flex-col items-center gap-4 mt-8">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">Compartilhar</span>
            <div className="flex flex-wrap justify-center gap-4">
                <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleShare('whatsapp')}
                    className="rounded-full w-12 h-12 bg-white hover:bg-green-50 text-slate-400 hover:text-green-600 border border-slate-100 hover:border-green-200 shadow-sm transition-all hover:scale-110"
                    title="WhatsApp"
                >
                    <MessageCircle className="w-5 h-5" />
                </Button>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleShare('facebook')}
                    className="rounded-full w-12 h-12 bg-white hover:bg-blue-50 text-slate-400 hover:text-blue-600 border border-slate-100 hover:border-blue-200 shadow-sm transition-all hover:scale-110"
                    title="Facebook"
                >
                    <Facebook className="w-5 h-5" />
                </Button>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleShare('twitter')}
                    className="rounded-full w-12 h-12 bg-white hover:bg-slate-50 text-slate-400 hover:text-black border border-slate-100 hover:border-slate-300 shadow-sm transition-all hover:scale-110"
                    title="X (Twitter)"
                >
                    <Twitter className="w-5 h-5" />
                </Button>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleShare('linkedin')}
                    className="rounded-full w-12 h-12 bg-white hover:bg-sky-50 text-slate-400 hover:text-sky-600 border border-slate-100 hover:border-sky-200 shadow-sm transition-all hover:scale-110"
                    title="LinkedIn"
                >
                    <Linkedin className="w-5 h-5" />
                </Button>
                <div className="w-px h-8 bg-slate-200 mx-2 self-center hidden sm:block"></div>
                <Button 
                    variant="outline" 
                    onClick={copyToClipboard}
                    className="rounded-full h-12 px-6 border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 shadow-sm"
                >
                    <Share2 className="w-4 h-4 mr-2" /> Copiar Link
                </Button>
            </div>
        </div>
    );
}