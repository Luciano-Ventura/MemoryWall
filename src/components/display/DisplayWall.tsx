'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';

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
      <div 
        key={currentItem.id} // key id força remontagem e animação a cada troca
        className="w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16 animate-slide-up-fade"
      >
        {currentItem.photo_url && (
          <div className="flex-1 w-full max-h-[85vh] flex justify-center">
            <img 
              src={currentItem.photo_url} 
              alt="Momento do Evento" 
              className="max-w-full max-h-[85vh] object-contain rounded-[3rem] shadow-2xl border-[12px]"
              style={{ borderColor: 'var(--theme-secondary)' }}
            />
          </div>
        )}
        
        {currentItem.message && (
          <div className={`flex-1 flex flex-col justify-center ${!currentItem.photo_url ? 'items-center text-center w-full max-w-4xl mx-auto' : ''}`}>
            <div className="bg-white/95 backdrop-blur-xl p-16 rounded-[4rem] shadow-2xl relative w-full border-t-[16px]" style={{ borderColor: 'var(--theme-primary)' }}>
              <span className="text-[10rem] absolute -top-16 -left-8 opacity-10 font-display leading-none" style={{ color: 'var(--theme-primary)' }}>"</span>
              <p className="text-6xl font-body leading-tight whitespace-pre-wrap relative z-10 font-medium" style={{ color: 'var(--theme-text)' }}>
                {currentItem.message}
              </p>
              {currentItem.guest_name && (
                <p className="text-4xl font-display font-bold mt-12 text-right" style={{ color: 'var(--theme-primary)' }}>
                  — {currentItem.guest_name}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
