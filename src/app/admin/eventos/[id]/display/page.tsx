'use client';

import React, { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { notFound } from 'next/navigation';
import html2canvas from 'html2canvas';

interface DisplayPageProps {
  params: Promise<{ id: string }>;
}

export default function PrintableDisplayPage({ params }: DisplayPageProps) {
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [eventUrl, setEventUrl] = useState('');
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { id } = await params;
      const supabase = createClient();
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        setLoading(false);
        return;
      }

      setEvent(data);
      // Usa a origem real do browser — funciona em dev, staging e produção sem .env
      setEventUrl(`${window.location.origin}/e/${data.slug}`);
      setLoading(false);
    };
    load();
  }, [params]);

  const handleDownload = async () => {
    const element = document.getElementById('printable-display');
    if (!element) return;
    
    try {
      setDownloading(true);
      const canvas = await html2canvas(element, {
        scale: 2, // Resolução alta para impressão
        backgroundColor: '#ffffff',
      });
      
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `display-${event?.slug || 'evento'}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error generating image:', err);
      alert('Erro ao gerar a imagem.');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-slate-400" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-500 text-xl">Evento não encontrado.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black flex items-center justify-center p-8 print:p-0">

      {/* Botão de download — desaparece na impressão/PDF */}
      <div className="fixed top-4 right-4 z-50 print:hidden">
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-full font-bold shadow-xl hover:bg-slate-700 active:scale-95 transition-all disabled:opacity-50"
        >
          {downloading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
          {downloading ? 'Baixando...' : 'Baixar Imagem'}
        </button>
      </div>

      {/* Conteúdo imprimível */}
      <div id="printable-display" className="w-full max-w-3xl border-[16px] border-slate-900 rounded-[3rem] p-16 flex flex-col items-center justify-center text-center shadow-2xl print:shadow-none print:border-[12px] print:rounded-none print:max-w-none print:p-10">

        <h2 className="text-2xl font-bold uppercase tracking-[0.2em] text-slate-500 mb-8">
          Participe do nosso álbum
        </h2>

        <h1 className="text-5xl sm:text-6xl font-black text-slate-900 mb-12 uppercase leading-tight">
          {event.name}
        </h1>

        <div className="bg-white p-8 rounded-3xl shadow-xl border-4 border-slate-100 mb-12 print:shadow-none print:border-slate-300">
          {eventUrl && (
            <QRCodeSVG
              value={eventUrl}
              size={280}
              level="H"
              includeMargin={false}
            />
          )}
        </div>

        <p className="text-2xl sm:text-3xl font-medium text-slate-700 max-w-lg leading-relaxed">
          Aponte a câmera do seu celular para o QR Code e envie suas melhores fotos da festa!
        </p>

        <div className="mt-16 w-32 h-2 bg-slate-900 rounded-full" />

        {/* URL legível abaixo do QR */}
        <p className="mt-6 text-base text-slate-400 font-mono break-all">
          {eventUrl}
        </p>
      </div>
    </div>
  );
}

