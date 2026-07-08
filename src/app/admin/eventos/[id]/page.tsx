import { createClient } from '@/lib/supabase/server';
import EventDashboard from '@/components/admin/EventDashboard';
import { redirect } from 'next/navigation';

export default async function EventAdminPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  // 1. Buscar evento
  const { data: event, error: eventError } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single();

  if (eventError || !event) {
    return (
      <div className="p-12 text-center bg-white rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Evento não encontrado</h2>
        <p className="text-slate-500">O evento pode ter sido excluído ou você não tem permissão para acessá-lo.</p>
      </div>
    );
  }

  // 2. Buscar tema associado
  const { data: theme } = await supabase
    .from('event_themes')
    .select('*')
    .eq('event_id', id)
    .single();

  return <EventDashboard initialEvent={event} initialTheme={theme} />;
}
