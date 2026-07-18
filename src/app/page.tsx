'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Camera, LayoutDashboard, ShieldCheck, Palette, Images, ChevronRight, Sparkles, Zap, Smartphone } from 'lucide-react';
import { Playfair_Display, Inter } from 'next/font/google';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

const playfair = Playfair_Display({ subsets: ['latin'] });
const inter = Inter({ subsets: ['latin'] });

const IMAGES = [
  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1525268771113-32d9e9021a97?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1478146059778-26028b07395a?auto=format&fit=crop&w=600&q=80"
];

// Reusable animated section wrapper
const FadeIn = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.7, delay, ease: "easeOut" }}
    className={className}
  >
    {children}
  </motion.div>
);

const FloatingPolaroid = ({ src, initialX, initialY, rotate, delay }: { src: string, initialX: string, initialY: string, rotate: number, delay: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: [0, 1, 1],
        scale: 1,
        y: ["0%", "-10%", "5%", "0%"],
        x: ["0%", "5%", "-5%", "0%"]
      }}
      transition={{ 
        opacity: { duration: 1, delay },
        scale: { duration: 1, delay },
        y: { duration: 20, repeat: Infinity, ease: "easeInOut", delay: delay },
        x: { duration: 25, repeat: Infinity, ease: "easeInOut", delay: delay }
      }}
      className="absolute hidden md:block"
      style={{ left: initialX, top: initialY, rotate: rotate }}
    >
      <div className="bg-white/10 backdrop-blur-md p-2 pb-8 rounded-xl shadow-2xl border border-white/20 transform transition-transform hover:scale-105 hover:z-50 cursor-pointer">
        <div className="w-40 h-48 sm:w-48 sm:h-56 relative rounded-lg overflow-hidden">
          <img src={src} alt="Polaroid" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/20" />
        </div>
      </div>
    </motion.div>
  );
};

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.2], ["0%", "20%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <main className={`w-full min-h-screen bg-[#0A0A0A] text-white selection:bg-indigo-500/30 selection:text-white flex flex-col overflow-x-hidden ${inter.className}`}>
      
      {/* Navbar Moderna */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-black/50 backdrop-blur-xl border-b border-white/10 py-4' : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <span className={`text-2xl font-bold tracking-tight ${playfair.className}`}>EventWall</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/70">
            <a href="#como-funciona" className="hover:text-white transition-colors">Como Funciona</a>
            <a href="#recursos" className="hover:text-white transition-colors">Recursos</a>
            <a href="#precos" className="hover:text-white transition-colors">Preços</a>
          </div>
          <Link href="/admin" className="px-6 py-2.5 bg-white/10 hover:bg-white hover:text-black text-white text-sm font-semibold rounded-full border border-white/20 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.4)]">
            Acessar Painel
          </Link>
        </div>
      </motion.nav>

      {/* HERO SECTION DARK & IMMERSIVE */}
      <section className="relative w-full min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        {/* Abstract Background Gradients */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-600/30 rounded-full blur-[120px] mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[150px] mix-blend-screen animate-pulse" style={{ animationDuration: '12s' }} />
        
        {/* Decorative Grid */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay z-0"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_10%,transparent_100%)] z-0" />

        {/* Floating Polaroids (Parallax) */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <FloatingPolaroid src={IMAGES[0]} initialX="10%" initialY="15%" rotate={-12} delay={0.2} />
          <FloatingPolaroid src={IMAGES[1]} initialX="80%" initialY="20%" rotate={15} delay={0.4} />
          <FloatingPolaroid src={IMAGES[2]} initialX="5%" initialY="65%" rotate={8} delay={0.6} />
          <FloatingPolaroid src={IMAGES[3]} initialX="75%" initialY="60%" rotate={-10} delay={0.8} />
          <FloatingPolaroid src={IMAGES[4]} initialX="25%" initialY="80%" rotate={-5} delay={1.0} />
        </div>

        <motion.div 
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-20 w-full max-w-5xl mx-auto flex flex-col items-center justify-center px-6 text-center"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8"
          >
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span className="text-sm font-medium text-white/80">O mural digital do seu evento</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className={`text-4xl sm:text-6xl md:text-8xl font-bold tracking-tight mb-6 ${playfair.className} bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60 drop-shadow-sm`}
          >
            Eternize momentos,<br/>em tempo real.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="text-xl md:text-2xl text-white/60 font-light mb-12 max-w-2xl leading-relaxed"
          >
            Transforme seus convidados nos fotógrafos oficiais. Um álbum vivo e colaborativo projetado no telão da sua festa.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-5 w-full max-w-md justify-center"
          >
            <a 
              href="#precos" 
              className="group relative flex-1 py-4 px-6 bg-white text-black rounded-full font-semibold flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.3)] overflow-hidden"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-black/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
              Criar meu Evento
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            
            <button 
              onClick={() => {
                const slug = prompt("Qual o link/slug da festa? (Ex: festa-do-joao)");
                if(slug) window.location.href = `/e/${slug}`;
              }}
              className="flex-1 py-4 px-6 bg-white/10 backdrop-blur-xl hover:bg-white/20 text-white border border-white/20 rounded-full font-semibold flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95"
            >
              Entrar em uma Festa
            </button>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40"
        >
          <span className="text-xs uppercase tracking-[0.2em] font-medium">Descubra</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-white/40 to-transparent"></div>
        </motion.div>
      </section>

      {/* COMO FUNCIONA (Clean Light/Glass Transition) */}
      <section id="como-funciona" className="py-32 relative bg-[#0A0A0A] z-20">
        <div className="max-w-7xl mx-auto px-6 relative">
          <FadeIn className="text-center mb-24">
            <h2 className={`text-4xl md:text-6xl font-bold mb-6 ${playfair.className}`}>A mágica em 3 passos</h2>
            <p className="text-xl text-white/50 max-w-2xl mx-auto font-light">Sem downloads, sem aplicativos. Apenas aponte a câmera e comece a compartilhar os melhores ângulos da festa.</p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative">
            {/* Linha conectora (só visível no desktop) */}
            <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-indigo-500/0 via-indigo-500/50 to-purple-500/0"></div>

            {[
              {
                step: '01',
                icon: <Palette className="w-6 h-6 text-indigo-400" />,
                title: 'Personalize o Espaço',
                desc: 'Crie seu evento no painel, defina as cores da sua festa e baixe o QR Code exclusivo.'
              },
              {
                step: '02',
                icon: <Smartphone className="w-6 h-6 text-purple-400" />,
                title: 'Escaneie e Fotografe',
                desc: 'Convidados leem o QR Code nas mesas e acessam a câmera pelo próprio navegador.'
              },
              {
                step: '03',
                icon: <Zap className="w-6 h-6 text-amber-400" />,
                title: 'Telão Interativo',
                desc: 'A mágica acontece: fotos e recados surgem instantaneamente no telão principal.'
              }
            ].map((s, i) => (
              <FadeIn key={i} delay={i * 0.2} className="relative z-10 flex flex-col items-center text-center group">
                <div className="w-24 h-24 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-center mb-8 relative transform transition-transform group-hover:scale-110 duration-500 shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent rounded-3xl"></div>
                  {s.icon}
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-indigo-500/50">
                    {s.step}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{s.title}</h3>
                <p className="text-white/50 leading-relaxed font-light">{s.desc}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* BENTO GRID RECURSOS */}
      <section id="recursos" className="py-32 bg-black relative">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <FadeIn className="mb-20">
            <h2 className={`text-4xl md:text-6xl font-bold mb-6 ${playfair.className}`}>O espetáculo mora nos detalhes.</h2>
            <p className="text-xl text-white/50 max-w-2xl font-light">Uma suíte completa para gerenciar, moderar e encantar. Feito para eventos que buscam excelência.</p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:auto-rows-[250px]">
            {/* Card 1: Telão (Ocupa 2 colunas) */}
            <FadeIn delay={0.1} className="md:col-span-2 md:row-span-2 group relative rounded-[2rem] overflow-hidden bg-[#111] border border-white/10 hover:border-white/20 transition-colors">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="p-10 relative z-10 h-full flex flex-col">
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-6">
                  <LayoutDashboard className="w-7 h-7" />
                </div>
                <h3 className="text-3xl font-bold mb-4">Telão Cinematográfico</h3>
                <p className="text-white/60 text-lg font-light max-w-md">Layouts dinâmicos que organizam as fotos como um mosaico vivo. Animações de entrada suaves e adaptação automática para qualquer TV ou projetor.</p>
                
                {/* Decorative UI element */}
                <div className="mt-auto self-end w-3/4 h-32 bg-white/5 border border-white/10 rounded-t-2xl translate-y-10 group-hover:translate-y-5 transition-transform duration-500 backdrop-blur-md flex p-4 gap-4">
                  <div className="w-1/2 bg-white/10 rounded-lg animate-pulse"></div>
                  <div className="w-1/2 flex flex-col gap-2">
                    <div className="h-1/2 bg-white/5 rounded-lg"></div>
                    <div className="h-1/2 bg-indigo-500/20 rounded-lg"></div>
                  </div>
                </div>
              </div>
            </FadeIn>
            
            {/* Card 2: Moderação */}
            <FadeIn delay={0.2} className="md:col-span-1 md:row-span-1 group relative rounded-[2rem] overflow-hidden bg-[#111] border border-white/10 hover:border-white/20 transition-colors">
              <div className="absolute inset-0 bg-gradient-to-bl from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="p-8 relative z-10">
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-5">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Controle Total</h3>
                <p className="text-white/60 font-light">Modere todas as submissões em tempo real pelo seu celular. Somente o que você aprova aparece.</p>
              </div>
            </FadeIn>

            {/* Card 3: Personalização */}
            <FadeIn delay={0.3} className="md:col-span-1 md:row-span-1 group relative rounded-[2rem] overflow-hidden bg-[#111] border border-white/10 hover:border-white/20 transition-colors">
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="p-8 relative z-10">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-5">
                  <Palette className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Sua Identidade</h3>
                <p className="text-white/60 font-light">Deixe com a cara do seu casamento ou marca. Fontes, cores e efeitos 100% customizáveis.</p>
              </div>
            </FadeIn>

            {/* Card 4: Galeria */}
            <FadeIn delay={0.4} className="md:col-span-3 md:row-span-1 group relative rounded-[2rem] overflow-hidden bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border border-white/10 hover:border-white/20 transition-colors flex items-center">
              <div className="p-10 flex flex-col md:flex-row items-center gap-10 w-full">
                <div className="flex-1">
                  <div className="w-12 h-12 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center mb-5">
                    <Images className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Galeria Eterna em Alta Resolução</h3>
                  <p className="text-white/60 font-light text-lg">Acabou a festa? Você recebe um link exclusivo com todas as fotos e mensagens enviadas pelos convidados para baixar e guardar para sempre.</p>
                </div>
                <div className="hidden md:flex gap-4">
                  {[IMAGES[5], IMAGES[6], IMAGES[7]].map((img, i) => (
                    <div key={i} className={`w-32 h-40 rounded-xl overflow-hidden border-2 border-white/20 shadow-2xl transform rotate-${i === 1 ? '3' : '-3'} group-hover:rotate-0 transition-transform duration-500`}>
                      <img src={img} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" alt="Galeria" />
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="precos" className="py-32 bg-[#0A0A0A] relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#0A0A0A] to-[#0A0A0A]"></div>
        
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <FadeIn className="text-center mb-16">
            <h2 className={`text-4xl md:text-6xl font-bold mb-6 ${playfair.className}`}>Acesso Ilimitado</h2>
            <p className="text-xl text-white/50 font-light">Sem surpresas, sem mensalidades. Pague apenas pelo seu evento.</p>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="bg-[#111]/80 backdrop-blur-2xl rounded-[3rem] p-8 md:p-14 shadow-2xl border border-white/10 relative overflow-hidden group hover:border-indigo-500/30 transition-colors duration-500">
              {/* Glow effect */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[200px] bg-indigo-500/20 blur-[100px] rounded-full pointer-events-none"></div>

              <div className="absolute top-0 right-0 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold px-6 py-2 rounded-bl-3xl tracking-widest uppercase">
                Preço Único
              </div>
              
              <div className="flex flex-col md:flex-row gap-12 items-center justify-between relative z-10 mt-6">
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-3xl font-bold text-white mb-2">Passe Completo</h3>
                  <p className="text-white/50 mb-8 font-light">Tudo que você precisa para tornar o seu evento inesquecível, liberado instantaneamente.</p>
                  
                  <div className="flex items-baseline justify-center md:justify-start gap-2 mb-10">
                    <span className="text-2xl text-white/50">R$</span>
                    <span className="text-7xl font-bold text-white tracking-tight">49</span>
                    <span className="text-2xl font-bold text-indigo-400">,90</span>
                    <span className="text-white/50 font-light ml-2">/ evento</span>
                  </div>
                  
                  <a 
                    href="https://wa.me/5548999324253?text=Ol%C3%A1%21%20Gostaria%20de%20criar%20um%20evento%20no%20EventWall." 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center py-5 px-8 bg-white hover:bg-gray-100 text-black rounded-2xl font-bold transition-all hover:scale-[1.02] active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.2)] text-lg"
                  >
                    Criar Evento Agora
                  </a>
                  <p className="text-white/40 text-sm mt-4 text-center">Pagamento único. Sem surpresas ou mensalidades.</p>
                </div>
                
                <div className="flex-1 w-full bg-white/5 backdrop-blur-md rounded-3xl p-8 md:p-10 border border-white/10">
                  <p className="font-bold text-white mb-8 text-lg">Incluso no pacote:</p>
                  <ul className="space-y-5">
                    {[
                      'Envio de fotos ilimitado',
                      'Telão Interativo Premium',
                      'Painel de Moderação ao Vivo',
                      'Cores e Tema Personalizados',
                      'QR Code em Alta Resolução',
                      'Galeria Digital Pós-evento',
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-4">
                        <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
                          <svg className="w-3.5 h-3.5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-white/70 font-light">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black border-t border-white/10 py-16 relative overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[300px] bg-indigo-900/10 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
              <Camera className="w-4 h-4 text-white" />
            </div>
            <span className={`text-xl font-bold ${playfair.className}`}>EventWall</span>
          </div>
          
          <p className="text-sm text-white/40 font-light text-center md:text-left">
            Um produto da <span className="font-bold text-white/80">NexaSync</span>. Inovando interações.<br/>
            &copy; {new Date().getFullYear()} Todos os direitos reservados.
          </p>
          
          <div className="flex items-center gap-8 text-sm font-light text-white/50">
            <a href="#" className="hover:text-white transition-colors">Termos</a>
            <a href="#" className="hover:text-white transition-colors">Privacidade</a>
            <a href="#" className="hover:text-white transition-colors">Suporte</a>
          </div>
        </div>
      </footer>

    </main>
  );
}
