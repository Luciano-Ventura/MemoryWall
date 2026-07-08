import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { ThemeProvider, EventTheme } from '@/components/ThemeProvider';
import DisplayWall from '@/components/display/DisplayWall';

export const revalidate = 60; 

export default async function TelaoPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: event, error: eventError } = await supabase
    .from('events')
    .select('*')
    .eq('slug', slug)
    .single();

  if (eventError || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white p-6 text-center">
        <h1 className="text-4xl font-semibold">Evento não encontrado</h1>
      </div>
    );
  }

  const { data: theme } = await supabase
    .from('event_themes')
    .select('*')
    .eq('event_id', event.id)
    .single();

  return (
    <ThemeProvider theme={theme as EventTheme}>
      <DisplayWall 
        eventId={event.id}
        animationStyle={theme?.animation_style || 'none'}
      />
    </ThemeProvider>
  );
}
