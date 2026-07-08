'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function createEvent(formData: FormData) {
  const supabase = await createClient()

  // 1. Pega usuário atual
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Usuário não autenticado")

  // 2. Busca ou cria o registro do Cliente
  let { data: client } = await supabase.from('clients').select('id').eq('user_id', user.id).single()

  if (!client) {
    const { data: newClient, error: clientError } = await supabase.from('clients').insert({
      user_id: user.id,
      name: user.email?.split('@')[0] || 'Usuário',
      email: user.email || ''
    }).select('id').single()
    
    if (clientError) {
      console.error("Erro ao criar cliente:", clientError)
      throw new Error("Erro ao configurar sua conta de cliente.")
    }
    client = newClient
  }

  // 3. Cria o Evento
  const slug = formData.get('slug') as string
  const name = formData.get('name') as string
  const event_date = formData.get('event_date') as string

  const { data: event, error: eventError } = await supabase.from('events').insert({
    client_id: client.id,
    name,
    slug,
    event_date: event_date || null,
    status: 'draft'
  }).select('id').single()

  if (eventError) {
    console.error("Erro ao criar evento:", eventError)
    // Se o slug já existir, vai cair aqui
    return { error: 'Esse slug já está em uso ou ocorreu um erro.' }
  }

  // 4. Inicializa o Tema Padrão
  await supabase.from('event_themes').insert({
    event_id: event.id
  })

  // 5. Redireciona pro dashboard do evento recém-criado
  redirect(`/admin/eventos/${event.id}`)
}
