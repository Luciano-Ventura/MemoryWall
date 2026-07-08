'use client';

import React from 'react';
import Link from 'next/link';
import { Camera, LayoutDashboard } from 'lucide-react';
import { Playfair_Display } from 'next/font/google';

const playfair = Playfair_Display({ subsets: ['latin'] });

const IMAGES = [
  "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1519671482749-fd098f39dfa4?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1533174000224-63c89710f582?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1478146059778-26028b07395a?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1522158637959-30385a09e0da?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=600&q=80"
];

// Duplicamos as arrays para o loop infinito do CSS não quebrar
const col1 = [...IMAGES.slice(0, 4), ...IMAGES.slice(0, 4)];
const col2 = [...IMAGES.slice(4, 8), ...IMAGES.slice(4, 8)];
const col3 = [...IMAGES.slice(8, 12), ...IMAGES.slice(8, 12)];
const col4 = [...IMAGES.slice(0, 2), ...IMAGES.slice(6, 8), ...IMAGES.slice(0, 2), ...IMAGES.slice(6, 8)];
const col5 = [...IMAGES.slice(2, 6), ...IMAGES.slice(2, 6)];

const Column = ({ images, reverse, speed = 40 }: { images: string[], reverse?: boolean, speed?: number }) => (
  <div className="flex flex-col gap-4 min-w-[200px] sm:min-w-[280px]">
    <div 
      className="flex flex-col gap-4"
      style={{ 
        animation: `scroll-${reverse ? 'down' : 'up'} ${speed}s linear infinite` 
      }}
    >
      {images.map((src, i) => (
        <div key={i} className="w-full relative rounded-2xl overflow-hidden aspect-[4/3] sm:aspect-square shadow-sm">
          <img 
            src={src} 
            alt="Event Moment" 
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      ))}
    </div>
  </div>
);

export default function LandingPage() {
  return (
    <main className="relative w-full h-screen overflow-hidden bg-[#FAF9F6] text-slate-900 selection:bg-slate-900 selection:text-white">
      
      {/* CSS para as animações do Carrossel */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scroll-up {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        @keyframes scroll-down {
          0% { transform: translateY(-50%); }
          100% { transform: translateY(0); }
        }
      `}} />

      {/* Carrossel de Background com leve inclinação e opacidade */}
      <div className="absolute inset-0 z-0 flex gap-4 p-4 transform scale-125 opacity-30 select-none pointer-events-none -rotate-2">
        <Column images={col1} speed={45} />
        <Column images={col2} reverse speed={35} />
        <Column images={col3} speed={50} />
        <Column images={col4} reverse speed={40} />
        <Column images={col5} speed={48} />
      </div>

      {/* Gradient Overlay para garantir a legibilidade do texto (Foco em UX) */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#FAF9F6]/90 via-[#FAF9F6]/40 to-[#FAF9F6]/90 backdrop-blur-[2px]"></div>

      {/* Conteúdo Central */}
      <div className="relative z-20 w-full h-full flex flex-col items-center justify-center px-6 text-center">
        
        {/* Ícone de Câmera minimalista */}
        <div className="w-12 h-12 border border-slate-300 rounded-full flex items-center justify-center mb-6 bg-white/50 backdrop-blur-md shadow-sm">
          <Camera className="w-5 h-5 text-slate-800" />
        </div>

        {/* Nome da Marca com Fonte Elegante (Playfair) */}
        <h1 className={`text-6xl md:text-8xl lg:text-[9rem] font-bold tracking-tight mb-2 ${playfair.className}`}>
          EventWall
        </h1>
        
        <p className="text-xs md:text-sm font-semibold tracking-[0.3em] text-slate-500 uppercase mb-8">
          By NexaSync
        </p>

        <p className="text-xl md:text-2xl text-slate-600 font-medium mb-12 max-w-lg leading-relaxed">
          O álbum ao vivo do seu evento.
        </p>

        {/* Botões - Inspirados na referência (Um escuro, outro translúcido) */}
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <Link 
            href="/admin" 
            className="flex-1 py-4 px-6 bg-[#1A1A1A] hover:bg-black text-white rounded-[2rem] font-semibold flex items-center justify-center gap-2 transition-transform hover:scale-105 active:scale-95 shadow-xl"
          >
            <LayoutDashboard className="w-5 h-5" />
            Acessar Painel
          </Link>
          
          <button 
            onClick={() => {
              const slug = prompt("Qual o link/slug da festa? (Ex: festa-do-joao)");
              if(slug) window.location.href = `/e/${slug}`;
            }}
            className="flex-1 py-4 px-6 bg-white/70 backdrop-blur-md hover:bg-white text-slate-900 border border-slate-200 rounded-[2rem] font-semibold flex items-center justify-center gap-2 transition-transform hover:scale-105 active:scale-95 shadow-xl"
          >
            <Camera className="w-5 h-5" />
            Acessar Festa
          </button>
        </div>
      </div>
    </main>
  );
}
