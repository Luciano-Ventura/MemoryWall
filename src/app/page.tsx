'use client';

import React from 'react';
import Link from 'next/link';
import { Camera, LayoutDashboard, ShieldCheck, Palette, Images } from 'lucide-react';
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
    <main className="w-full min-h-screen bg-[#FAF9F6] text-slate-900 selection:bg-slate-900 selection:text-white flex flex-col overflow-x-hidden">
      
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="w-6 h-6 text-slate-800" />
            <span className={`text-xl font-bold ${playfair.className}`}>EventWall</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#como-funciona" className="hover:text-slate-900 transition-colors">Como Funciona</a>
            <a href="#recursos" className="hover:text-slate-900 transition-colors">Recursos</a>
            <a href="#precos" className="hover:text-slate-900 transition-colors">Preços</a>
          </div>
          <Link href="/admin" className="px-5 py-2.5 bg-slate-900 hover:bg-black text-white text-sm font-semibold rounded-full transition-all active:scale-95 shadow-md">
            Acessar Painel
          </Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative w-full h-screen overflow-hidden flex items-center justify-center pt-20">
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

        <div className="absolute inset-0 z-0 flex gap-4 p-4 transform scale-125 opacity-30 select-none pointer-events-none -rotate-2">
          <Column images={col1} speed={45} />
          <Column images={col2} reverse speed={35} />
          <Column images={col3} speed={50} />
          <Column images={col4} reverse speed={40} />
          <Column images={col5} speed={48} />
        </div>

        <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#FAF9F6]/90 via-[#FAF9F6]/40 to-[#FAF9F6] backdrop-blur-[2px]"></div>

        <div className="relative z-20 w-full h-full flex flex-col items-center justify-center px-6 text-center pb-20">
          <div className="w-12 h-12 border border-slate-300 rounded-full flex items-center justify-center mb-6 bg-white/50 backdrop-blur-md shadow-sm">
            <Camera className="w-5 h-5 text-slate-800" />
          </div>

          <h1 className={`text-6xl md:text-8xl lg:text-[9rem] font-bold tracking-tight mb-2 ${playfair.className}`}>
            EventWall
          </h1>
          
          <p className="text-xs md:text-sm font-semibold tracking-[0.3em] text-slate-500 uppercase mb-8">
            By NexaSync
          </p>

          <p className="text-xl md:text-2xl text-slate-600 font-medium mb-12 max-w-lg leading-relaxed">
            O álbum ao vivo do seu evento, construído por todos os seus convidados.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
            <a 
              href="#precos" 
              className="flex-1 py-4 px-6 bg-[#1A1A1A] hover:bg-black text-white rounded-[2rem] font-semibold flex items-center justify-center gap-2 transition-transform hover:scale-105 active:scale-95 shadow-xl"
            >
              Criar meu Evento
            </a>
            
            <button 
              onClick={() => {
                const slug = prompt("Qual o link/slug da festa? (Ex: festa-do-joao)");
                if(slug) window.location.href = `/e/${slug}`;
              }}
              className="flex-1 py-4 px-6 bg-white/70 backdrop-blur-md hover:bg-white text-slate-900 border border-slate-200 rounded-[2rem] font-semibold flex items-center justify-center gap-2 transition-transform hover:scale-105 active:scale-95 shadow-xl"
            >
              Entrar em uma Festa
            </button>
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section id="como-funciona" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${playfair.className}`}>Como a mágica acontece</h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">Em apenas 3 passos, você transforma a interação do seu evento e eterniza os melhores momentos sob a ótica dos convidados.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                step: '01',
                title: 'Crie e Personalize',
                desc: 'Acesse nosso painel para criar o evento, escolher as cores e configurar as regras de aprovação de fotos.'
              },
              {
                step: '02',
                title: 'Compartilhe o QR Code',
                desc: 'Imprima e espalhe o QR Code pelas mesas. Os convidados escaneiam e entram no app sem precisar baixar nada.'
              },
              {
                step: '03',
                title: 'Telão Interativo',
                desc: 'As fotos e recados enviados pelos convidados aparecem em tempo real no telão da festa de forma espetacular.'
              }
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center text-center p-8 rounded-3xl bg-slate-50 hover:bg-slate-100 transition-colors">
                <span className={`text-6xl font-bold text-slate-300 mb-6 ${playfair.className}`}>{s.step}</span>
                <h3 className="text-xl font-bold text-slate-800 mb-3">{s.title}</h3>
                <p className="text-slate-600 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RECURSOS PREMIUM */}
      <section id="recursos" className="py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16">
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${playfair.className}`}>Muito mais que um mural.</h2>
            <p className="text-xl text-slate-400 max-w-2xl">Uma experiência interativa desenhada para impressionar os seus convidados e facilitar a sua vida.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 rounded-3xl bg-slate-800/50 border border-slate-700 backdrop-blur-sm hover:bg-slate-800 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-6">
                <LayoutDashboard className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Telão Interativo Premium</h3>
              <p className="text-slate-400 leading-relaxed">Layout dinâmico estilo polaroid que valoriza cada foto. Compatível com qualquer tela, de Smart TVs a grandes projetores em 4K.</p>
            </div>
            
            <div className="p-8 rounded-3xl bg-slate-800/50 border border-slate-700 backdrop-blur-sm hover:bg-slate-800 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Moderação ao Vivo</h3>
              <p className="text-slate-400 leading-relaxed">Fique no controle. Aprove ou rejeite as fotos enviadas pelos convidados antes que elas apareçam no telão, tudo pelo seu celular.</p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-800/50 border border-slate-700 backdrop-blur-sm hover:bg-slate-800 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center mb-6">
                <Palette className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold mb-3">100% Personalizável</h3>
              <p className="text-slate-400 leading-relaxed">Adapte a plataforma à paleta de cores do seu casamento, formatura ou evento corporativo. Escolha fontes, cores e animações exclusivas.</p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-800/50 border border-slate-700 backdrop-blur-sm hover:bg-slate-800 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6">
                <Images className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Galeria Eterna</h3>
              <p className="text-slate-400 leading-relaxed">Após o evento, você recebe acesso a uma galeria digital lindíssima com todas as fotos e recados em alta resolução para guardar de lembrança.</p>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="precos" className="py-24 bg-[#FAF9F6]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${playfair.className}`}>Preço Simples e Transparente</h2>
            <p className="text-lg text-slate-500">Sem assinaturas ou surpresas. Você paga apenas pelo evento que for realizar.</p>
          </div>

          <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl border border-slate-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-bl-2xl">
              MAIS POPULAR
            </div>
            
            <div className="flex flex-col md:flex-row gap-12 items-center justify-between">
              <div className="flex-1">
                <h3 className="text-3xl font-bold text-slate-800 mb-2">Evento Completo</h3>
                <p className="text-slate-500 mb-6">Perfeito para casamentos, formaturas e eventos corporativos de médio a grande porte.</p>
                <div className="flex items-baseline gap-2 mb-8">
                  <span className="text-6xl font-bold text-slate-900">R$ 49</span>
                  <span className="text-xl font-bold text-slate-900">,90</span>
                  <span className="text-slate-500 font-medium">/ por evento</span>
                </div>
                <Link 
                  href="/admin" 
                  className="block w-full text-center py-4 px-8 bg-slate-900 hover:bg-black text-white rounded-2xl font-bold transition-transform active:scale-95 shadow-xl"
                >
                  Começar Agora
                </Link>
              </div>
              
              <div className="flex-1 w-full bg-slate-50 rounded-2xl p-8 border border-slate-100">
                <p className="font-bold text-slate-800 mb-6">O que está incluído:</p>
                <ul className="space-y-4">
                  {[
                    'Convidados ilimitados',
                    'Envio de fotos e recados ilimitado',
                    'Acesso ao Telão Interativo Premium',
                    'Painel de Moderação em Tempo Real',
                    'Personalização total de cores e fontes',
                    'Galeria digital disponível por 30 dias',
                    'Suporte prioritário via WhatsApp'
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                        <svg className="w-3 h-3 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-slate-600 font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Camera className="w-6 h-6 text-slate-800" />
            <span className={`text-xl font-bold ${playfair.className}`}>EventWall</span>
          </div>
          
          <p className="text-sm text-slate-500 font-medium">
            Um produto <span className="font-bold text-slate-800">NexaSync</span>. Inovando interações em eventos.
          </p>
          
          <div className="flex items-center gap-6 text-sm font-medium text-slate-500">
            <a href="#" className="hover:text-slate-900 transition-colors">Termos</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Privacidade</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Suporte</a>
          </div>
        </div>
      </footer>

    </main>
  );
}
