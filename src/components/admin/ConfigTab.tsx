'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Save, Loader2, Download, Archive, Trash2 } from 'lucide-react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { deleteEvent } from '@/app/admin/eventos/[id]/actions';

export default function ConfigTab({ event }: { event: any }) {
  const [formData, setFormData] = useState({
    name: event.name || '',
    slug: event.slug || '',
    welcome_message: event.welcome_message || '',
    status: event.status || 'draft',
    moderation_enabled: event.moderation_enabled || false,
    allow_guest_name: event.allow_guest_name || false,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);
    try {
      const { error } = await supabase
        .from('events')
        .update({
          name: formData.name,
          slug: formData.slug,
          welcome_message: formData.welcome_message,
          status: formData.status,
          moderation_enabled: formData.moderation_enabled,
          allow_guest_name: formData.allow_guest_name,
        })
        .eq('id', event.id);

      if (error) throw error;
      setMessage({ type: 'success', text: 'Configurações salvas com sucesso!' });
    } catch (err: any) {
      console.error(err);
      setMessage({ type: 'error', text: err.message || 'Erro ao salvar. Verifique se você está logado.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportZIP = async () => {
    setIsExporting(true);
    setExportProgress(0);
    setMessage(null);
    try {
      // 1. Buscar fotos do evento
      const { data: submissions, error } = await supabase
        .from('submissions')
        .select('photo_url, guest_name')
        .eq('event_id', event.id)
        .not('photo_url', 'is', null);

      if (error) throw error;
      if (!submissions || submissions.length === 0) {
        throw new Error("Nenhuma foto encontrada para este evento.");
      }

      const zip = new JSZip();
      const folder = zip.folder(`fotos-${event.slug}`)!;

      // 2. Baixar cada foto
      for (let i = 0; i < submissions.length; i++) {
        const sub = submissions[i];
        try {
          const response = await fetch(sub.photo_url);
          const blob = await response.blob();
          const ext = sub.photo_url.split('.').pop()?.split('?')[0] || 'jpg';
          const namePrefix = sub.guest_name ? sub.guest_name.replace(/[^a-z0-9]/gi, '_') : 'convidado';
          const fileName = `${i + 1}-${namePrefix}.${ext}`;
          
          folder.file(fileName, blob);
        } catch (e) {
          console.error("Erro ao baixar a foto:", sub.photo_url, e);
        }
        setExportProgress(Math.round(((i + 1) / submissions.length) * 100));
      }

      // 3. Gerar e Salvar ZIP
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, `fotos-${event.slug}.zip`);
      
      setMessage({ type: 'success', text: 'Download concluído com sucesso!' });
    } catch (err: any) {
      console.error(err);
      setMessage({ type: 'error', text: err.message || 'Erro ao exportar fotos.' });
    } finally {
      setIsExporting(false);
      setTimeout(() => setExportProgress(0), 2000);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("ATENÇÃO: Tem certeza absoluta que deseja excluir este evento? TODAS as fotos, mensagens e configurações serão apagadas permanentemente. Essa ação não pode ser desfeita.")) {
      return;
    }
    
    setIsDeleting(true);
    setMessage(null);
    try {
      const res = await deleteEvent(event.id);
      if (res?.error) {
        throw new Error(res.error);
      }
    } catch (err: any) {
      console.error(err);
      setMessage({ type: 'error', text: err.message || 'Erro ao excluir evento.' });
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h3 className="text-xl font-bold text-slate-800">Configurações Gerais</h3>
        <p className="text-slate-500">Ajuste as informações principais do seu evento.</p>
      </div>

      <div className="space-y-4 bg-slate-50 p-6 rounded-xl border border-slate-100">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Nome do Evento</label>
          <input 
            type="text" 
            name="name" 
            value={formData.name} 
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Slug (URL)</label>
          <div className="flex rounded-lg overflow-hidden border border-slate-300 focus-within:ring-2 focus-within:ring-blue-500 w-full">
            <span className="inline-flex items-center px-3 sm:px-4 py-2 bg-slate-100 text-slate-500 text-sm border-r border-slate-300 whitespace-nowrap">
              eventwall.app/e/
            </span>
            <input 
              type="text" 
              name="slug" 
              value={formData.slug} 
              onChange={handleChange}
              className="flex-1 px-3 sm:px-4 py-2 outline-none w-full min-w-0"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Mensagem de Boas-vindas (Tela do Convidado)</label>
          <textarea 
            name="welcome_message" 
            value={formData.welcome_message} 
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none h-24 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Status</label>
          <select 
            name="status" 
            value={formData.status} 
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
          >
            <option value="draft">Rascunho (Draft)</option>
            <option value="active">Ativo (Active)</option>
            <option value="ended">Encerrado (Ended)</option>
          </select>
        </div>
      </div>

      <div className="space-y-4 bg-slate-50 p-6 rounded-xl border border-slate-100">
        <h4 className="font-semibold text-slate-800">Preferências</h4>
        
        <label className="flex items-start gap-3 cursor-pointer">
          <input 
            type="checkbox" 
            name="moderation_enabled" 
            checked={formData.moderation_enabled}
            onChange={handleChange}
            className="mt-1 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
          />
          <div>
            <span className="block font-medium text-slate-700">Moderação de Fotos</span>
            <span className="block text-sm text-slate-500">As fotos só aparecem no telão após você aprovar. (Se desativado, vão direto pro telão).</span>
          </div>
        </label>

        <label className="flex items-start gap-3 cursor-pointer">
          <input 
            type="checkbox" 
            name="allow_guest_name" 
            checked={formData.allow_guest_name}
            onChange={handleChange}
            className="mt-1 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
          />
          <div>
            <span className="block font-medium text-slate-700">Permitir Nome do Convidado</span>
            <span className="block text-sm text-slate-500">Exibe um campo para o convidado digitar o próprio nome ao enviar o recado.</span>
          </div>
        </label>
      </div>
      
      <div className="space-y-4 bg-blue-50 p-6 rounded-xl border border-blue-100">
        <h4 className="font-semibold text-blue-900 flex items-center gap-2">
          <Archive className="w-5 h-5" />
          Exportar Galeria
        </h4>
        <p className="text-sm text-blue-800">Baixe um arquivo .ZIP contendo todas as fotos enviadas pelos convidados durante o evento.</p>
        
        <button 
          onClick={handleExportZIP}
          disabled={isExporting}
          className="flex items-center gap-2 px-6 py-3 bg-white text-blue-700 hover:bg-blue-100 border border-blue-200 font-semibold rounded-lg transition-colors disabled:opacity-50"
        >
          {isExporting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
          {isExporting ? `Compactando... ${exportProgress}%` : 'Baixar ZIP das Fotos'}
        </button>
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
        Salvar Configurações
      </button>
      <div className="pt-8 border-t border-slate-200">
        <div className="p-6 bg-red-50 rounded-xl border border-red-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-red-900">Zona de Perigo</h4>
            <p className="text-sm text-red-700 mt-1">Excluir permanentemente este evento e todas as suas fotos.</p>
          </div>
          <button 
            onClick={handleDelete}
            disabled={isDeleting || isSaving}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
            Excluir Evento
          </button>
        </div>
      </div>
    </div>
  );
}
