import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';

export default async function PrintableDisplayPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: event, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !event) {
    notFound();
  }

  // A URL que o QR code aponta
  const eventUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://memorywall.com.br'}/e/${event.slug}`;

  return (
    <div className="min-h-screen bg-white text-black print:bg-white flex items-center justify-center p-8">
      
      {/* Botão flutuante que não aparece na impressão */}
      <div className="fixed top-4 right-4 print:hidden">
        <button 
          onClick="window.print()" 
          className="bg-slate-800 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:bg-slate-700 transition-colors"
        >
          Imprimir / Salvar PDF
        </button>
      </div>

      {/* Conteúdo do Display (tamanho folha A4 proporcional) */}
      <div className="w-full max-w-3xl border-[16px] border-slate-900 rounded-[3rem] p-16 flex flex-col items-center justify-center text-center shadow-2xl print:shadow-none print:border-[12px]">
        
        <h2 className="text-2xl font-bold uppercase tracking-[0.2em] text-slate-500 mb-8">
          Participe do nosso álbum
        </h2>
        
        <h1 className="text-6xl font-black text-slate-900 mb-12 uppercase leading-tight">
          {event.name}
        </h1>

        <div className="bg-white p-8 rounded-3xl shadow-xl border-4 border-slate-100 mb-12 print:shadow-none print:border-slate-300">
          <QRCodeSVG 
            value={eventUrl} 
            size={300} 
            level="H"
            includeMargin={false}
          />
        </div>

        <p className="text-3xl font-medium text-slate-700 max-w-lg leading-relaxed">
          Aponte a câmera do seu celular para o QR Code e envie suas melhores fotos da festa!
        </p>

        <div className="mt-16 w-32 h-2 bg-slate-900 rounded-full" />
      </div>

      {/* Script inline simples para lidar com o click */}
      <script dangerouslySetInnerHTML={{
        __html: `
          const btn = document.querySelector('button');
          if (btn) btn.onclick = () => window.print();
        `
      }} />
    </div>
  );
}
