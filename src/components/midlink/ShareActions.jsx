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
        <div className="flex flex-wrap justify-center gap-3 mt-8">
            <Button 
                variant="outline" 
                size="icon" 
                onClick={() => handleShare('whatsapp')}
                className="rounded-full bg-green-50 hover:bg-green-100 hover:text-green-600 border-green-200 text-green-500"
                title="Compartilhar no WhatsApp"
            >
                <MessageCircle className="w-5 h-5" />
            </Button>
            <Button 
                variant="outline" 
                size="icon" 
                onClick={() => handleShare('facebook')}
                className="rounded-full bg-blue-50 hover:bg-blue-100 hover:text-blue-600 border-blue-200 text-blue-500"
                title="Compartilhar no Facebook"
            >
                <Facebook className="w-5 h-5" />
            </Button>
            <Button 
                variant="outline" 
                size="icon" 
                onClick={() => handleShare('twitter')}
                className="rounded-full bg-slate-50 hover:bg-slate-100 hover:text-black border-slate-200 text-slate-700"
                title="Compartilhar no X (Twitter)"
            >
                <Twitter className="w-5 h-5" />
            </Button>
            <Button 
                variant="outline" 
                size="icon" 
                onClick={() => handleShare('linkedin')}
                className="rounded-full bg-sky-50 hover:bg-sky-100 hover:text-sky-700 border-sky-200 text-sky-600"
                title="Compartilhar no LinkedIn"
            >
                <Linkedin className="w-5 h-5" />
            </Button>
            <Button 
                variant="outline" 
                onClick={copyToClipboard}
                className="rounded-full gap-2 border-slate-200 text-slate-600"
            >
                <Share2 className="w-4 h-4" /> Copiar
            </Button>
        </div>
    );
}