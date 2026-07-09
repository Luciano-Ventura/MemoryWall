'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Trash2, Image as ImageIcon } from 'lucide-react';

export default function GalleryTab({ eventId }: { eventId: string }) {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGallery = async () => {
    const { data } = await supabase
      .from('submissions')
      .select('*')
      .eq('event_id', eventId)
      .order('created_at', { ascending: false });
    
    if (data) setSubmissions(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchGallery();

    const channel = supabase.channel('gallery')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'submissions', filter: `event_id=eq.${eventId}` }, (payload) => {
        setSubmissions(prev => [payload.new, ...prev]);
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'submissions', filter: `event_id=eq.${eventId}` }, (payload) => {
        setSubmissions(prev => prev.filter(s => s.id !== payload.old.id));
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); }
  }, [eventId]);

  const handleDelete = async (id: string, photoUrl: string | null) => {
    if (!window.confirm("Tem certeza que deseja excluir esta foto permanentemente?")) return;

    // Atualização Otimista
    setSubmissions(prev => prev.filter(s => s.id !== id));
    
    // Deleta do DB
    await supabase
      .from('submissions')
      .delete()
      .eq('id', id);

    // Se tiver foto, deleta do storage
    if (photoUrl) {
      // Extrai o filePath do photoUrl
      // O URL publico é: https://.../storage/v1/object/public/event-photos/[eventId]/[filename]
      const urlParts = photoUrl.split('/event-photos/');
      if (urlParts.length > 1) {
        const filePath = urlParts[1];
        await supabase.storage.from('event-photos').remove([filePath]);
      }
    }
  };

  if (loading) return (
    <div className="p-12 text-center text-slate-500 font-medium">Carregando galeria...</div>
  );

  if (submissions.length === 0) {
    return (
      <div className="py-24 text-center">
        <h3 className="text-xl font-bold text-slate-400 mb-2">A Galeria está vazia!</h3>
        <p className="text-slate-500">Nenhuma foto foi enviada para este evento ainda.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Galeria do Evento</h3>
          <p className="text-slate-500 text-sm">Visualize e gerencie todas as fotos e recados recebidos.</p>
        </div>
        <span className="bg-blue-100 text-blue-700 font-bold px-4 py-2 rounded-full text-sm">
          {submissions.length} envios
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {submissions.map(sub => (
          <div key={sub.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col group">
            {sub.photo_url ? (
              <div className="w-full aspect-square bg-black/5 relative">
                <img src={sub.photo_url} alt="Envio" className="absolute inset-0 w-full h-full object-cover" />
                <button 
                  onClick={() => handleDelete(sub.id, sub.photo_url)}
                  className="absolute top-2 right-2 p-2 bg-white/90 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all"
                  title="Excluir Foto"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="w-full aspect-square bg-slate-50 flex flex-col items-center justify-center text-slate-300 border-b border-slate-100 relative">
                <ImageIcon className="w-8 h-8 mb-2" />
                <span className="text-xs">Apenas Texto</span>
                <button 
                  onClick={() => handleDelete(sub.id, sub.photo_url)}
                  className="absolute top-2 right-2 p-2 bg-white/90 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all"
                  title="Excluir"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            )}
            
            <div className="p-4 flex-1 flex flex-col">
              {sub.message && <p className="text-slate-800 font-medium mb-2 text-sm line-clamp-3">"{sub.message}"</p>}
              {sub.guest_name && <p className="text-xs text-slate-500 font-semibold mt-auto">— {sub.guest_name}</p>}
              
              <div className="mt-2 text-[10px] text-slate-400 font-medium">
                {new Date(sub.created_at).toLocaleString('pt-BR')}
                {sub.status === 'pending' && <span className="ml-2 text-amber-500 bg-amber-50 px-1.5 py-0.5 rounded">Pendente</span>}
                {sub.status === 'rejected' && <span className="ml-2 text-red-500 bg-red-50 px-1.5 py-0.5 rounded">Recusado</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
