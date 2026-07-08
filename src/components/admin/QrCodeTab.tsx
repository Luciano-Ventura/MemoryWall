'use client';

import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Printer } from 'lucide-react';

export default function QrCodeTab({ event }: { event: any }) {
  // Em produção, isso seria a URL fixa do app
  const localUrl = typeof window !== 'undefined' ? `${window.location.origin}/e/${event.slug}` : `https://eventwall.app/e/${event.slug}`;

  const handleDownload = () => {
    const svg = document.getElementById('event-qrcode');
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `qrcode-${event.slug}.png`;
      downloadLink.href = `${pngFile}`;
      downloadLink.click();
    };
    
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <div className="flex flex-col items-center justify-center text-center py-12 space-y-8">
      <div>
        <h3 className="text-2xl font-bold text-slate-800">QR Code do Evento</h3>
        <p className="text-slate-500 mt-2">Imprima este QR Code e coloque nas mesas para os convidados acessarem a página.</p>
      </div>

      <div className="p-8 bg-white border-4 border-slate-100 rounded-3xl shadow-xl inline-block">
        <QRCodeSVG 
          id="event-qrcode"
          value={localUrl} 
          size={256}
          level="H"
          includeMargin={true}
          fgColor="#0f172a"
        />
      </div>

      <div className="flex gap-4">
        <button 
          onClick={handleDownload}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
        >
          <Download className="w-5 h-5" />
          Baixar PNG
        </button>
        <button 
          onClick={() => window.print()}
          className="flex items-center gap-2 px-6 py-3 border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold rounded-lg transition-colors"
        >
          <Printer className="w-5 h-5" />
          Imprimir
        </button>
      </div>
    </div>
  );
}
