'use client';

import React, { useState } from 'react';
import { Settings, Palette, CheckSquare, QrCode, ExternalLink, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import ConfigTab from './ConfigTab';
import ThemeTab from './ThemeTab';
import QrCodeTab from './QrCodeTab';
import ModerationTab from './ModerationTab';
import GalleryTab from './GalleryTab';

interface EventDashboardProps {
  initialEvent: any;
  initialTheme: any;
}

export default function EventDashboard({ initialEvent, initialTheme }: EventDashboardProps) {
  const [activeTab, setActiveTab] = useState<'config' | 'theme' | 'moderation' | 'gallery' | 'qr'>('config');

  const tabs = [
    { id: 'config', label: 'Configurações', icon: Settings },
    { id: 'theme', label: 'Tema Visual', icon: Palette },
    ...(initialEvent.moderation_enabled ? [{ id: 'moderation', label: 'Moderação', icon: CheckSquare }] : []),
    { id: 'gallery', label: 'Galeria', icon: ImageIcon },
    { id: 'qr', label: 'QR Code', icon: QrCode },
  ] as const;

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Header do Dashboard do Evento */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-2xl font-bold text-slate-800">{initialEvent.name}</h2>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              initialEvent.status === 'active' ? 'bg-green-100 text-green-700' : 
              initialEvent.status === 'ended' ? 'bg-slate-100 text-slate-700' : 
              'bg-amber-100 text-amber-700'
            }`}>
              {initialEvent.status.toUpperCase()}
            </span>
          </div>
          <p className="text-sm text-slate-500">
            Link público: eventwall.app/e/{initialEvent.slug}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Link 
            href={`/e/${initialEvent.slug}`} 
            target="_blank"
            className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors w-full sm:w-auto"
          >
            Página do Convidado
            <ExternalLink className="w-4 h-4" />
          </Link>
          <Link 
            href={`/e/${initialEvent.slug}/telao`} 
            target="_blank"
            className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-medium shadow-md transition-colors w-full sm:w-auto"
          >
            Abrir Telão
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex gap-2 border-b border-slate-200 overflow-x-auto whitespace-nowrap scrollbar-hide">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors border-b-2 ${
                isActive 
                  ? 'border-blue-600 text-blue-600' 
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        {activeTab === 'config' && <ConfigTab event={initialEvent} />}
        {activeTab === 'theme' && <ThemeTab theme={initialTheme} eventId={initialEvent.id} />}
        {activeTab === 'moderation' && <ModerationTab eventId={initialEvent.id} />}
        {activeTab === 'gallery' && <GalleryTab eventId={initialEvent.id} />}
        {activeTab === 'qr' && <QrCodeTab event={initialEvent} />}
      </div>
    </div>
  );
}
