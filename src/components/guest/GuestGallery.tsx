'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Camera, ImageOff, ArrowLeft, X } from 'lucide-react';
import Link from 'next/link';

interface Submission {
  id: string;
  guest_name: string | null;
  message: string | null;
  photo_url: string | null;
  created_at: string;
}

interface GuestGalleryProps {
  eventId: string;
  eventSlug: string;
}

export default function GuestGallery({ eventId, eventSlug }: GuestGalleryProps) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSub, setSelectedSub] = useState<Submission | null>(null);

  const fetchSubmissions = useCallback(async () => {
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .eq('event_id', eventId)
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setSubmissions(data);
    }
    setIsLoading(false);
  }, [eventId]);

  useEffect(() => {
    fetchSubmissions();

    const channel = supabase
      .channel(`public:submissions:event_id=eq.${eventId}:gallery`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'submissions',
          filter: `event_id=eq.${eventId}`
        },
        (payload) => {
          const newPayload = payload.new as any;
          if (newPayload && newPayload.status === 'approved') {
            const newSub = payload.new as Submission;
            setSubmissions(prev => {
              const exists = prev.find(s => s.id === newSub.id);
              if (exists) {
                return prev.map(s => s.id === newSub.id ? newSub : s);
              }
              return [newSub, ...prev];
            });
          }
          
          if (newPayload && newPayload.status === 'rejected') {
            setSubmissions(prev => prev.filter(s => s.id !== newPayload.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [eventId, fetchSubmissions]);

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="animate-spin w-12 h-12 border-4 border-t-transparent rounded-full" style={{ borderColor: 'var(--theme-primary)', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-6 p-4 pb-24">
      {/* Botão de Voltar */}
      <div className="flex items-center justify-between mb-2">
        <Link 
          href={`/e/${eventSlug}`}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-md shadow-sm text-sm font-semibold text-slate-700 hover:bg-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Link>
        <span className="text-sm font-semibold opacity-70 font-display">Galeria da Festa</span>
      </div>

      {submissions.length === 0 ? (
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-12 text-center shadow-lg border-t-4" style={{ borderColor: 'var(--theme-primary)' }}>
          <ImageOff className="w-16 h-16 mx-auto mb-4 opacity-40" />
          <h2 className="text-xl font-display font-bold opacity-80 mb-2">Nenhuma foto ainda</h2>
          <p className="text-sm opacity-70 font-body">Seja o primeiro a enviar uma foto para a galeria!</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-1 sm:gap-2">
          {submissions.map((sub) => (
            <div 
              key={sub.id} 
              onClick={() => setSelectedSub(sub)}
              className="aspect-square bg-slate-200 cursor-pointer overflow-hidden relative group"
            >
              {sub.photo_url ? (
                <img 
                  src={sub.photo_url} 
                  alt="Momento da festa" 
                  className="w-full h-full object-cover transition-transform duration-300 group-active:scale-95"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-white p-2 text-center transition-transform duration-300 group-active:scale-95">
                  <p className="text-xs font-body line-clamp-4 text-slate-600">{sub.message}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal de Foto Expandida */}
      {selectedSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-200">
          <button 
            onClick={() => setSelectedSub(null)}
            className="absolute top-4 right-4 z-50 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="relative w-full max-w-lg max-h-[90vh] flex flex-col bg-slate-900 rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            {selectedSub.photo_url && (
              <div className="flex-1 min-h-0 bg-black flex items-center justify-center">
                <img 
                  src={selectedSub.photo_url} 
                  alt="Expandida" 
                  className="w-full h-full object-contain max-h-[65vh]" 
                />
              </div>
            )}
            
            {(selectedSub.message || selectedSub.guest_name) && (
              <div className="p-6 bg-white/95 backdrop-blur shrink-0">
                {selectedSub.message && (
                  <p className="text-slate-800 font-body text-base whitespace-pre-wrap">{selectedSub.message}</p>
                )}
                {selectedSub.guest_name && (
                  <p className="text-sm font-bold text-slate-500 mt-3 font-display uppercase tracking-wider text-right">
                    {selectedSub.guest_name}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
