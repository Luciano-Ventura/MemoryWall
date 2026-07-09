'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import { AnimatePresence, motion } from 'framer-motion';

interface Submission {
  id: string;
  guest_name: string | null;
  message: string | null;
  photo_url: string | null;
  featured: boolean;
  created_at: string;
}

interface DisplayWallProps {
  eventId: string;
  animationStyle: string;
}

export default function DisplayWall({ eventId, animationStyle }: DisplayWallProps) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Buscar estado inicial
  const fetchSubmissions = useCallback(async () => {
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .eq('event_id', eventId)
      .eq('status', 'approved')
      .order('created_at', { ascending: false }); // mais novos primeiro

    if (!error && data) {
      setSubmissions(data);
    }
    setIsLoading(false);
  }, [eventId]);

  useEffect(() => {
    fetchSubmissions();

    // Assinatura do Realtime (Regra técnica crítica de tempo real)
    const channel = supabase
      .channel(`public:submissions:event_id=eq.${eventId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'submissions',
          filter: `event_id=eq.${eventId}`
        },
        (payload) => {
          // Se for uma nova submissão aprovada ou atualizada para aprovada, joga pro topo
          const newPayload = payload.new as any;
          if (newPayload && newPayload.status === 'approved') {
            const newSub = payload.new as Submission;
            setSubmissions(prev => {
              const exists = prev.find(s => s.id === newSub.id);
              if (exists) {
                return prev.map(s => s.id === newSub.id ? newSub : s);
              }
              
              // Se é novo, exibe imediatamente jogando o index para 0
              setCurrentIndex(0);
              return [newSub, ...prev];
            });
          }
          
          // Se foi rejeitada, remove da lista
          const newPayloadRejected = payload.new as any;
          if (newPayloadRejected && newPayloadRejected.status === 'rejected') {
            setSubmissions(prev => prev.filter(s => s.id !== newPayloadRejected.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [eventId, fetchSubmissions]);

  // Lógica de Rotação contínua (8s por slide)
  useEffect(() => {
    if (submissions.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % submissions.length);
    }, 5000); 

    return () => clearInterval(timer);
  }, [submissions.length]);

  if (isLoading) {
    return (
    <div className="relative w-full h-screen overflow-hidden flex items-center justify-center">
      {/* Overlay escuro de segurança para o background */}
      <div className="absolute inset-0 bg-black/40 z-0 pointer-events-none"></div>
      
      {/* Main Content */}
        <div className="animate-spin w-20 h-20 border-8 border-t-transparent rounded-full" style={{ borderColor: 'var(--theme-primary)', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center p-12 text-center relative z-10">
        <h1 className="text-6xl font-display font-bold opacity-90 mb-6 drop-shadow-lg text-white">
          Aguardando as primeiras fotos...
        </h1>
        <p className="text-3xl opacity-80 font-body drop-shadow-md text-white">Escaneie o QR Code na sua mesa para participar!</p>
      </div>
    );
  }

  const currentItem = submissions[currentIndex];

  return (
    <div className="w-full h-screen flex items-center justify-center p-12 overflow-hidden relative">
      {/* Overlay escuro de segurança para a imagem de fundo não atrapalhar o conteúdo */}
      <div className="absolute inset-0 bg-black/40 z-0 pointer-events-none"></div>

      
      {/* Efeito visual da Camada 2 - Assinatura do Evento */}
      {animationStyle !== 'none' && currentIndex === 0 && (
         <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-30">
           {/* Placeholder para as animações complexas que podem ser adicionadas futuramente */}
           <div className={`animate-pulse w-[100vw] h-[100vh] bg-gradient-to-tr from-[var(--theme-primary)] to-transparent opacity-10 mix-blend-overlay`} />
         </div>
      )}

      {/* Conteúdo Dinâmico */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={currentItem.id} // key id força remontagem e animação a cada troca
          initial={{ opacity: 0, scale: 0.9, rotate: -2, y: 40 }}
          animate={{ opacity: 1, scale: 1, rotate: 0, y: 0 }}
          exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)", transition: { duration: 0.4 } }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
          className="w-full max-w-[90vw] 2xl:max-w-[85vw] mx-auto relative z-10"
        >
          <div className="bg-white/95 backdrop-blur-xl p-10 md:p-16 rounded-[4rem] shadow-2xl relative flex flex-col md:flex-row items-center gap-16"
               style={{ borderBottom: '16px solid var(--theme-primary)' }}>
            
            {/* Elemento decorativo de aspas */}
            {currentItem.message && (
               <span className="text-[15rem] absolute -top-12 -left-4 opacity-5 font-display leading-none z-0 pointer-events-none" style={{ color: 'var(--theme-primary)' }}>"</span>
            )}

            {currentItem.photo_url && (
              <div className={`relative z-10 flex-shrink-0 w-full ${currentItem.message ? 'md:w-1/2' : 'max-w-3xl mx-auto'}`}>
                {/* Polaroid styling */}
                <div className="bg-white p-5 pb-10 md:pb-16 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] transform -rotate-2 hover:rotate-0 transition-transform duration-500">
                  <div className="relative w-full h-[55vh] md:h-[650px] bg-slate-100 rounded-2xl overflow-hidden flex items-center justify-center">
                     {/* Blurred background for padding */}
                     <div 
                       className="absolute inset-0 bg-cover bg-center blur-2xl scale-125 opacity-40" 
                       style={{ backgroundImage: `url(${currentItem.photo_url})` }} 
                     />
                     <img 
                       src={currentItem.photo_url} 
                       alt="Momento" 
                       className="relative z-10 w-full h-full object-contain drop-shadow-xl"
                     />
                  </div>
                </div>
              </div>
            )}
            
            {currentItem.message && (
              <div className={`flex-1 flex flex-col justify-center relative z-10 ${!currentItem.photo_url ? 'items-center text-center w-full max-w-5xl mx-auto py-16' : ''}`}>
                <p className={`${currentItem.photo_url ? 'text-5xl md:text-6xl' : 'text-6xl md:text-8xl'} font-body leading-tight whitespace-pre-wrap font-medium`} style={{ color: 'var(--theme-text)' }}>
                  {currentItem.message}
                </p>
                {currentItem.guest_name && (
                  <p className={`${currentItem.photo_url ? 'text-3xl md:text-4xl' : 'text-4xl md:text-5xl'} font-display font-bold mt-12 text-right`} style={{ color: 'var(--theme-primary)' }}>
                    — {currentItem.guest_name}
                  </p>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
