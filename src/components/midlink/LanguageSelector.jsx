import React from 'react';
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function LanguageSelector({ currentLang, onLanguageChange }) {
  const languages = [
    { code: 'pt-BR', label: '🇧🇷 Português' },
    { code: 'es-419', label: '🇲🇽 Español' },
    { code: 'en-US', label: '🇺🇸 English' }
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full w-10 h-10 bg-white/50 backdrop-blur-sm border border-slate-200 hover:bg-white/80 transition-all">
          <Globe className="w-5 h-5 text-slate-600" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {languages.map((lang) => (
          <DropdownMenuItem 
            key={lang.code}
            onClick={() => onLanguageChange(lang.code)}
            className={`cursor-pointer ${currentLang === lang.code ? 'bg-indigo-50 text-indigo-700 font-medium' : ''}`}
          >
            {lang.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}