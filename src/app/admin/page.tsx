import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export const revalidate = 0; // Para dev/demo

export default async function AdminDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: client } = await supabase.from('clients').select('id').eq('user_id', user?.id).single();

  // Busca os eventos filtrando pelo client_id para não misturar com eventos de outros usuários
  const { data: events, error } = await supabase
    .from('events')
    .select('*')
    .eq('client_id', client?.id || '00000000-0000-0000-0000-000000000000')
    .order('name');
    
  if (error) console.error("Erro ao buscar eventos:", error);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Dashboard</h2>
        <p className="text-slate-500">Bem-vindo ao painel de controle do EventWall.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-800">Seus Eventos</h3>
          <Link href="/admin/eventos/novo" className="px-4 py-2 bg-slate-900 text-white rounded-lg font-medium text-sm hover:bg-slate-800 transition-colors">
            + Novo Evento
          </Link>
        </div>
        
        <div className="divide-y divide-slate-100">
          {events?.map(event => (
            <div key={event.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div>
                <Link href={`/admin/eventos/${event.id}`} className="text-lg font-bold text-blue-600 hover:underline">
                  {event.name}
                </Link>
                <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                  <span>/e/{event.slug}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    event.status === 'active' ? 'bg-green-100 text-green-700' : 
                    event.status === 'ended' ? 'bg-slate-100 text-slate-700' : 
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {event.status.toUpperCase()}
                  </span>
                </div>
              </div>
              
              <Link 
                href={`/admin/eventos/${event.id}`}
                className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg font-medium text-sm hover:bg-slate-100 transition-colors"
              >
                Gerenciar
              </Link>
            </div>
          ))}

          {(!events || events.length === 0) && (
            <div className="p-12 text-center text-slate-500 flex flex-col items-center">
              <span className="text-4xl mb-4">🎈</span>
              <p>Nenhum evento encontrado.</p>
              <p className="text-sm mt-2">No seu Supabase, insira um client e um evento na tabela `events` para vê-lo aqui.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
