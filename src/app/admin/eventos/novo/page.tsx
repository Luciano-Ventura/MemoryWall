'use client'

import React, { useState } from 'react'
import { createEvent } from './actions'
import { Calendar, Link as LinkIcon, Type, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function NovoEventoPage() {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    try {
      const res = await createEvent(formData)
      if (res?.error) {
        setError(res.error)
        setIsLoading(false)
      }
    } catch (err: any) {
      setError(err.message || 'Erro inesperado')
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto space-y-6 pt-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Criar Novo Evento</h2>
        <p className="text-slate-500">Configure os dados básicos para iniciar o EventWall.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1 flex items-center gap-2">
              <Type className="w-4 h-4 text-slate-400" /> Nome do Evento
            </label>
            <input
              type="text"
              name="name"
              required
              placeholder="Ex: Casamento João e Maria"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1 flex items-center gap-2">
              <LinkIcon className="w-4 h-4 text-slate-400" /> Link Personalizado (Slug)
            </label>
            <div className="flex items-center">
              <span className="px-4 py-3 bg-slate-50 border border-slate-300 border-r-0 rounded-l-xl text-slate-500 text-sm">
                /e/
              </span>
              <input
                type="text"
                name="slug"
                required
                pattern="[a-z0-9-]+"
                title="Apenas letras minúsculas, números e traços"
                placeholder="casamento-joao-maria"
                className="w-full px-4 py-3 rounded-r-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">Isso será usado no link: /e/slug e no QR Code.</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" /> Data do Evento
            </label>
            <input
              type="date"
              name="event_date"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {error && (
            <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm font-medium">
              {error}
            </div>
          )}

          <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
            <Link href="/admin" className="px-6 py-3 text-slate-600 font-semibold hover:bg-slate-50 rounded-lg transition-colors">
              Cancelar
            </Link>
            <button 
              type="submit"
              disabled={isLoading}
              className="flex-1 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Criar Evento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
