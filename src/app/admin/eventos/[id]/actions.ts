'use server'

import { createClient } from '@/lib/supabase/server'

export async function deleteEvent(eventId: string) {
  const supabase = await createClient()

  // 1. Pega usuário atual
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Usuário não autenticado")

  // 2. Buscar fotos para deletar do Storage
  const { data: submissions } = await supabase
    .from('submissions')
    .select('photo_url')
    .eq('event_id', eventId)
    .not('photo_url', 'is', null)

  if (submissions && submissions.length > 0) {
    const filesToRemove = submissions
      .map(s => {
        const parts = s.photo_url.split('/event-photos/')
        return parts.length > 1 ? parts[1] : null
      })
      .filter(Boolean) as string[]

    if (filesToRemove.length > 0) {
      await supabase.storage.from('event-photos').remove(filesToRemove)
    }
  }

  // 3. Deletar as submissions (pois não tem ON DELETE CASCADE no schema)
  await supabase.from('submissions').delete().eq('event_id', eventId)

  // 4. Deletar o tema
  await supabase.from('event_themes').delete().eq('event_id', eventId)

  // 5. Por fim, deletar o evento
  const { data, error } = await supabase.from('events').delete().eq('id', eventId).select('id')
  
  if (error) {
    console.error("Erro ao deletar evento:", error)
    return { error: 'Erro ao deletar o evento. Verifique as permissões (RLS).' }
  }

  if (!data || data.length === 0) {
    return { error: 'Você não tem permissão para excluir. Você rodou as regras de segurança no SQL Editor?' }
  }

  return { success: true }
}
