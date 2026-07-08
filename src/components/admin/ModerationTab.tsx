'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Check, X, Image as ImageIcon } from 'lucide-react';

export default function ModerationTab({ eventId }: { eventId: string }) {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPending = async () => {
    const { data } = await supabase
      .from('submissions')
      .select('*')
      .eq('event_id', eventId)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });
    
    if (data) setSubmissions(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPending();

    const channel = supabase.channel('moderation')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'submissions', filter: `event_id=eq.${eventId}` }, (payload) => {
        if (payload.new.status === 'pending') {
          setSubmissions(prev => [payload.new, ...prev]);
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); }
  }, [eventId]);

  const handleAction = async (id: string, status: 'approved' | 'rejected') => {
    // Atualização Otimista
    setSubmissions(prev => prev.filter(s => s.id !== id));
    
    await supabase
      .from('submissions')
      .update({ status })
      .eq('id', id);
  };

  if (loading) return (
    <div className="p-12 text-center text-slate-500 font-medium">Carregando fila de moderação...</div>
  );

  if (submissions.length === 0) {
    return (
      <div className="py-24 text-center">
        <h3 className="text-xl font-bold text-slate-400 mb-2">A Fila está vazia!</h3>
        <p className="text-slate-500">Nenhum recado aguardando moderação no momento.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Fila de Moderação</h3>
          <p className="text-slate-500 text-sm">Aprove as fotos para enviá-las ao Telão em tempo real.</p>
        </div>
        <span className="bg-amber-100 text-amber-700 font-bold px-4 py-2 rounded-full text-sm">
          {submissions.length} pendentes
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {submissions.map(sub => (
          <div key={sub.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
            {sub.photo_url ? (
              <div className="w-full h-56 bg-black/5 relative">
                <img src={sub.photo_url} alt="Envio" className="absolute inset-0 w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-full h-24 bg-slate-50 flex items-center justify-center text-slate-300 border-b border-slate-100">
                <ImageIcon className="w-8 h-8" />
              </div>
            )}
            
            <div className="p-5 flex-1 flex flex-col">
              <p className="text-slate-800 font-medium mb-3 flex-1 text-lg">"{sub.message}"</p>
              {sub.guest_name && <p className="text-sm text-slate-500 font-semibold mb-5">— {sub.guest_name}</p>}
              
              <div className="flex gap-3 mt-auto">
                <button 
                  onClick={() => handleAction(sub.id, 'rejected')}
                  className="flex-1 py-3 flex items-center justify-center gap-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl font-bold transition-colors"
                >
                  <X className="w-5 h-5" /> Recusar
                </button>
                <button 
                  onClick={() => handleAction(sub.id, 'approved')}
                  className="flex-1 py-3 flex items-center justify-center gap-2 text-white bg-green-600 hover:bg-green-700 rounded-xl font-bold transition-colors shadow-sm"
                >
                  <Check className="w-5 h-5" /> Aprovar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
