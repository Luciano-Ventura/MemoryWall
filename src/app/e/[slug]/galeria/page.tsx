import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { ThemeProvider, EventTheme } from '@/components/ThemeProvider';
import GuestGallery from '@/components/guest/GuestGallery';

export const revalidate = 60;

export default async function GalleryPage({ 
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
    notFound();
  }

  const { data: theme } = await supabase
    .from('event_themes')
    .select('*')
    .eq('event_id', event.id)
    .single();

  return (
    <ThemeProvider theme={theme as EventTheme}>
      <main className="w-full min-h-screen flex flex-col relative bg-slate-50">
        <GuestGallery eventId={event.id} eventSlug={slug} />
      </main>
    </ThemeProvider>
  );
}
