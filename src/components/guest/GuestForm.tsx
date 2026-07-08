'use client';

import React, { useState, useRef } from 'react';
import { Camera, Send, CheckCircle2, Loader2 } from 'lucide-react';
import imageCompression from 'browser-image-compression';
import { supabase } from '@/lib/supabase/client';
import confetti from 'canvas-confetti';

interface GuestFormProps {
  eventId: string;
  welcomeMessage: string | null;
  allowGuestName: boolean;
  moderationEnabled: boolean;
  animationStyle: string;
}

export default function GuestForm({ eventId, welcomeMessage, allowGuestName, moderationEnabled, animationStyle }: GuestFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [guestName, setGuestName] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      
      // Otimização estrita e obrigatória do Checklist do Desenvolvedor
      // Compressão rigorosa para mobile 4G fraco
      const options = {
        maxSizeMB: 1.5,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        initialQuality: 0.8
      };
      
      try {
        const compressedFile = await imageCompression(selectedFile, options);
        setFile(compressedFile);
        
        // Criar preview para UI Otimista
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(compressedFile);
      } catch (err) {
        console.error("Erro ao comprimir imagem:", err);
        setError("Erro ao processar a imagem. Tente uma foto diferente.");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validação de input (Checklist de Segurança)
    const cleanMessage = message.trim();
    const cleanName = guestName.trim();

    if (!file && !cleanMessage) {
      setError('Adicione uma foto ou escreva um recado para enviar!');
      return;
    }

    setIsSubmitting(true);

    try {
      let photoUrl = null;

      if (file) {
        // Nome de arquivo aleatório e seguro
        const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        const filePath = `${eventId}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('event-photos')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from('event-photos').getPublicUrl(filePath);
        photoUrl = data.publicUrl;
      }

      // Prevenção de injeção: SDK do Supabase cuida da parametrização automaticamente
      const { error: insertError } = await supabase
        .from('submissions')
        .insert({
          event_id: eventId,
          guest_name: cleanName || null,
          message: cleanMessage || null,
          photo_url: photoUrl,
          status: moderationEnabled ? 'pending' : 'approved'
        });

      if (insertError) throw insertError;

      setIsSuccess(true);
      
      // Disparar confetes!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF6B6B', '#4ECDC4', '#FFD93D'] // Cores vibrantes
      });
      
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Ocorreu um erro ao enviar. O sinal de internet pode estar fraco.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreviewUrl(null);
    setMessage('');
    setGuestName('');
    setIsSuccess(false);
    setError(null);
  };

  if (isSuccess) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center animate-in zoom-in duration-500">
        {/* Momento de Assinatura: Confirmação Lúdica */}
        <div 
          className="bg-white/95 backdrop-blur-md rounded-3xl p-8 shadow-2xl border-t-8 w-full transition-transform" 
          style={{ borderColor: 'var(--theme-primary)' }}
        >
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ backgroundColor: 'var(--theme-primary)' }} />
            <CheckCircle2 className="w-full h-full relative z-10" style={{ color: 'var(--theme-primary)' }} />
          </div>
          <h2 className="text-3xl font-display font-bold mb-2" style={{ color: 'var(--theme-text)' }}>Enviado!</h2>
          <p className="text-lg opacity-80 mb-8 font-body">Sua mensagem aparecerá no telão em instantes.</p>
          <button 
            onClick={handleReset}
            className="w-full py-4 rounded-xl font-bold font-body text-white transition-transform active:scale-95 shadow-lg"
            style={{ backgroundColor: 'var(--theme-primary)' }}
          >
            Enviar outra foto
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col max-w-sm mx-auto w-full">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-display font-bold mb-2 opacity-90">{welcomeMessage}</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-5 bg-white/95 backdrop-blur-md p-6 rounded-3xl shadow-xl">
        
        <div 
          className="relative aspect-[3/4] bg-slate-100 rounded-2xl overflow-hidden border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors active:scale-[0.98]"
          style={{ borderColor: previewUrl ? 'transparent' : 'var(--theme-primary)' }}
          onClick={() => !previewUrl && fileInputRef.current?.click()}
        >
          {previewUrl ? (
            <>
              <img src={previewUrl} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
              <button 
                type="button"
                onClick={(e) => { e.stopPropagation(); setFile(null); setPreviewUrl(null); }}
                className="absolute top-3 right-3 bg-black/60 backdrop-blur text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-black/80"
              >
                Trocar Foto
              </button>
            </>
          ) : (
            <div className="text-center p-6">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'var(--theme-bg)' }}>
                <Camera className="w-8 h-8" style={{ color: 'var(--theme-primary)' }} />
              </div>
              <p className="font-semibold text-slate-700 font-body">Tirar foto na hora</p>
              <p className="text-xs text-slate-500 mt-2 font-body opacity-80">(Apenas fotos tiradas no momento)</p>
            </div>
          )}
          <input 
            type="file" 
            accept="image/*" 
            capture="environment"
            className="hidden" 
            ref={fileInputRef}
            onChange={handleFileChange}
          />
        </div>

        <div className="space-y-4">
          <textarea 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Escreva um recado (opcional)..."
            className="w-full bg-slate-50 border-none rounded-xl p-4 resize-none h-24 font-body outline-none focus:ring-2 transition-shadow"
            style={{ '--tw-ring-color': 'var(--theme-primary)' } as any}
          />

          {allowGuestName && (
            <input 
              type="text" 
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="Seu nome (opcional)"
              className="w-full bg-slate-50 border-none rounded-xl p-4 font-body outline-none focus:ring-2 transition-shadow"
              style={{ '--tw-ring-color': 'var(--theme-primary)' } as any}
            />
          )}
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-xl text-sm font-medium text-center">
            {error}
          </div>
        )}

        <button 
          type="submit" 
          disabled={isSubmitting || (!file && !message.trim())}
          className="mt-2 w-full py-4 rounded-xl font-bold font-body text-white flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 shadow-lg"
          style={{ backgroundColor: 'var(--theme-primary)' }}
        >
          {isSubmitting ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>Enviar para o Telão</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
