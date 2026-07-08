import { login } from './actions'
import { Camera } from 'lucide-react'

export default async function LoginPage(props: { searchParams: Promise<{ message?: string }> }) {
  // No Next.js mais recente, searchParams é uma Promise
  const searchParams = await props.searchParams;
  const message = searchParams?.message;
  
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <Camera className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Acessar Painel</h1>
          <p className="text-slate-500 mt-2">Faça login para gerenciar seu EventWall.</p>
        </div>

        <form className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1" htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="seu@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1" htmlFor="password">Senha</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="••••••••"
            />
          </div>
          
          {message && (
            <div className="p-4 bg-red-50 text-red-700 text-sm font-semibold rounded-lg text-center mt-2">
              {message}
            </div>
          )}

          <button
            formAction={login}
            className="w-full py-4 mt-4 bg-slate-900 hover:bg-black text-white font-bold rounded-xl transition-colors shadow-lg"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  )
}
