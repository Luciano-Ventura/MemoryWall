'use client';

import React, { useState, useRef } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Save, Loader2, Sparkles, Wand2, Image as ImageIcon } from 'lucide-react';
import imageCompression from 'browser-image-compression';

export default function ThemeTab({ theme, eventId }: { theme: any, eventId: string }) {
  const [formData, setFormData] = useState({
    primary_color: theme?.primary_color || '#FF6B6B',
    secondary_color: theme?.secondary_color || '#4ECDC4',
    background_color: theme?.background_color || '#FFF8F0',
    text_color: theme?.text_color || '#2D2D2D',
    animation_style: theme?.animation_style || 'none',
    background_image_url: theme?.background_image_url || '',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);
    try {
      const { error } = await supabase
        .from('event_themes')
        .update({
          primary_color: formData.primary_color,
          secondary_color: formData.secondary_color,
          background_color: formData.background_color,
          text_color: formData.text_color,
          animation_style: formData.animation_style,
          background_image_url: formData.background_image_url
        })
        .eq('event_id', eventId);

      if (error) throw error;
      setMessage({ type: 'success', text: 'Tema salvo com sucesso! O Telão já será atualizado.' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Erro ao salvar o tema.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setIsUploading(true);
    setMessage(null);
    try {
      const file = e.target.files[0];
      const compressedFile = await imageCompression(file, { maxSizeMB: 1, maxWidthOrHeight: 1920 });
      
      const fileName = `bg-${eventId}-${Date.now()}.jpg`;
      const { error: uploadError } = await supabase.storage
        .from('event-photos')
        .upload(fileName, compressedFile);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('event-photos').getPublicUrl(fileName);
      setFormData(prev => ({ ...prev, background_image_url: data.publicUrl }));
      setMessage({ type: 'success', text: 'Imagem de fundo carregada! Lembre-se de clicar em Aplicar Tema.' });
    } catch (err: any) {
      setMessage({ type: 'error', text: 'Erro ao fazer upload da imagem.' });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Formulário */}
      <div className="flex-1 space-y-6">
        <div>
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-blue-600" />
            Identidade do Evento
          </h3>
          <p className="text-slate-500">Personalize as cores e a experiência visual do Telão e do celular.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-6 rounded-xl border border-slate-100">
          {[
            { label: 'Cor Principal', name: 'primary_color' },
            { label: 'Cor Secundária', name: 'secondary_color' },
            { label: 'Cor de Fundo', name: 'background_color' },
            { label: 'Cor do Texto', name: 'text_color' }
          ].map(field => (
            <div key={field.name} className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-700">{field.label}</label>
              <div className="flex gap-2 items-center">
                <input 
                  type="color" 
                  name={field.name}
                  value={(formData as any)[field.name]}
                  onChange={handleChange}
                  className="w-12 h-12 rounded cursor-pointer border-0 p-0"
                />
                <input 
                  type="text" 
                  name={field.name}
                  value={(formData as any)[field.name]}
                  onChange={handleChange}
                  className="flex-1 px-3 py-2 rounded-lg border border-slate-300 font-mono text-sm"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4 bg-slate-50 p-6 rounded-xl border border-slate-100">
          <label className="block text-sm font-semibold text-slate-700 mb-1 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            Estilo de Animação (Telão)
          </label>
          <select 
            name="animation_style" 
            value={formData.animation_style} 
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
          >
            <option value="none">Sem Animação (Minimalista)</option>
            <option value="confetti">Chuva de Confetes</option>
            <option value="hearts">Corações Flutuantes</option>
            <option value="balloons">Balões Subindo</option>
          </select>
        </div>

        <div className="space-y-4 bg-slate-50 p-6 rounded-xl border border-slate-100">
          <label className="block text-sm font-semibold text-slate-700 mb-1 flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-purple-500" />
            Imagem de Fundo (Opcional)
          </label>
          <div className="flex items-center gap-4">
            <div 
              className="w-24 h-24 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center bg-white cursor-pointer overflow-hidden relative"
              onClick={() => fileInputRef.current?.click()}
            >
              {formData.background_image_url ? (
                <img src={formData.background_image_url} alt="Fundo" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs text-slate-400 text-center px-2">Clique para enviar</span>
              )}
              {isUploading && <div className="absolute inset-0 bg-white/80 flex items-center justify-center"><Loader2 className="w-5 h-5 animate-spin" /></div>}
            </div>
            <div className="flex-1 text-sm text-slate-500">
              <p>Envie uma imagem para ficar de fundo no celular dos convidados e no Telão.</p>
              {formData.background_image_url && (
                <button onClick={() => setFormData(prev => ({ ...prev, background_image_url: '' }))} className="text-red-500 hover:underline mt-2">
                  Remover Imagem
                </button>
              )}
            </div>
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
          </div>
        </div>

        {message && (
          <div className={`p-4 rounded-lg font-medium text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {message.text}
          </div>
        )}

        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          Aplicar Tema
        </button>
      </div>

      {/* Live Preview (Simulado) */}
      <div className="w-full max-w-[300px] mx-auto lg:mx-0 lg:w-80 flex flex-col gap-4">
        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider text-center lg:text-left">Preview (Celular)</h4>
        <div 
          className="w-full aspect-[9/19] rounded-[2rem] border-[8px] border-slate-900 shadow-xl overflow-hidden relative flex flex-col transition-colors duration-500 bg-cover bg-center"
          style={{ 
            backgroundColor: formData.background_color,
            backgroundImage: formData.background_image_url ? `url(${formData.background_image_url})` : 'none'
          }}
        >
          {/* Overlay Escuro caso tenha imagem para ajudar na leitura */}
          {formData.background_image_url && <div className="absolute inset-0 bg-black/40 z-0"></div>}
          
          {/* Header Preview */}
          <div className="p-6 text-center relative z-10">
            <h1 className="text-lg font-bold" style={{ color: formData.text_color }}>Envie sua foto!</h1>
          </div>
          {/* Box Preview */}
          <div className="m-4 flex-1 rounded-xl flex flex-col justify-end p-4 border border-black/10" style={{ backgroundColor: 'rgba(255,255,255,0.5)' }}>
             <div className="w-full h-10 rounded-lg mb-2 opacity-50" style={{ backgroundColor: formData.secondary_color }}></div>
             <div className="w-full h-12 rounded-lg font-bold flex items-center justify-center text-white" style={{ backgroundColor: formData.primary_color }}>
               Enviar para Telão
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
