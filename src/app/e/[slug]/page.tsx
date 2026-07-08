import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { ThemeProvider, EventTheme } from '@/components/ThemeProvider';
import GuestForm from '@/components/guest/GuestForm';
import { Camera } from 'lucide-react';

// Evita que cada novo acesso bata no banco no mesmo segundo
export const revalidate = 60; 

export default async function GuestPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  const supabase = await createClient();

  // 1. Buscar o evento pelo slug
  const { data: event, error: eventError } = await supabase
    .from('events')
    .select('*')
    .eq('slug', slug)
    .single();

  if (eventError || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 text-center">
        <h1 className="text-2xl font-semibold text-slate-800">Evento não encontrado</h1>
      </div>
    );
  }

  // 2. Buscar o Tema do Evento
  const { data: theme } = await supabase
    .from('event_themes')
    .select('*')
    .eq('event_id', event.id)
    .single();

  const isEventActive = event.status === 'active';

  return (
    <ThemeProvider theme={theme as EventTheme}>
      <main className="w-full max-w-md mx-auto min-h-screen flex flex-col relative px-4 py-8">
        {!isEventActive ? (
          <div className="flex-1 flex flex-col items-center justify-center">
            <div 
              className="bg-white/95 backdrop-blur shadow-xl rounded-3xl p-8 text-center w-full max-w-sm border-t-8"
              style={{ borderColor: 'var(--theme-primary)' }}
            >
              <h1 className="text-3xl font-display font-bold mb-4 opacity-90">
                {event.name}
              </h1>
              <p className="text-lg opacity-70">
                {event.status === 'draft' 
                  ? 'O evento ainda não começou. Prepare seu melhor sorriso!' 
                  : 'Este evento já foi encerrado. Obrigado por participar!'}
              </p>
            </div>
          </div>
        ) : (
          <GuestForm 
            eventId={event.id}
            welcomeMessage={event.welcome_message}
            allowGuestName={event.allow_guest_name}
            animationStyle={theme?.animation_style || 'none'}
          />
        )}
      </main>
    </ThemeProvider>
  );
}
