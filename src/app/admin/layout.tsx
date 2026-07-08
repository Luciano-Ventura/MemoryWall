import React from 'react';
import { LayoutDashboard, Calendar, Users, LogOut, Home } from 'lucide-react';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--admin-bg)', color: 'var(--admin-text)' }}>
      {/* Sidebar - Camada 1: Neutra e Funcional focada em gestão */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col hidden md:flex border-r border-slate-800 shadow-xl z-20 relative">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-white tracking-tight">EventWall</h2>
          <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">Painel de Gestão</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-1 mt-6">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-slate-800 text-white font-medium shadow-sm border border-slate-700/50">
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 hover:text-white transition-all duration-200">
            <Calendar className="w-5 h-5 opacity-70" />
            Meus Eventos
          </Link>
        </nav>
        
        <div className="p-4 border-t border-slate-800 mt-auto">
          <button className="flex items-center gap-3 px-4 py-3 w-full rounded-lg hover:bg-slate-800 hover:text-white transition-colors text-left text-sm font-medium">
            <LogOut className="w-5 h-5 opacity-70" />
            Sair da conta
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <header className="h-16 border-b flex items-center justify-between px-4 sm:px-8 z-10" style={{ backgroundColor: 'var(--admin-surface)', borderColor: 'var(--admin-border)' }}>
          <div className="flex items-center gap-3">
            <Link href="/admin" className="md:hidden p-2 -ml-2 rounded-lg hover:bg-slate-100 text-slate-700" title="Dashboard">
              <Home className="w-5 h-5" />
            </Link>
            <h1 className="text-lg font-semibold tracking-tight">Administração</h1>
          </div>
          <Link href="/admin" className="md:hidden p-2 -mr-2 rounded-lg hover:bg-slate-100 text-slate-700" title="Sair (Em breve)">
            <LogOut className="w-5 h-5" />
          </Link>
        </header>
        <div className="flex-1 overflow-y-auto p-8 relative">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
