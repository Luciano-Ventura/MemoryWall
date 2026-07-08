-- Script para gerar MOCK DATA completo para o EventWall
-- Execute isso no SQL Editor do seu Supabase

DO $$
DECLARE
  mock_user_id uuid := '00000000-0000-0000-0000-000000000000';
  mock_client_id uuid := '11111111-1111-1111-1111-111111111111';
  mock_event_id uuid := '22222222-2222-2222-2222-222222222222';
BEGIN
  
  -- 1. Cria um usuário fake na tabela de autenticação
  INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role, confirmation_token, email_change, email_change_token_new, recovery_token)
  VALUES (mock_user_id, '00000000-0000-0000-0000-000000000000', 'mock@eventwall.com', '', now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), 'authenticated', '', '', '', '')
  ON CONFLICT (id) DO NOTHING;

  -- 2. Cria o Client (Organizador)
  INSERT INTO public.clients (id, user_id, name, email, phone)
  VALUES (mock_client_id, mock_user_id, 'João Organizador', 'mock@eventwall.com', '11999999999')
  ON CONFLICT (id) DO NOTHING;

  -- 3. Cria o Evento (já ativo)
  INSERT INTO public.events (id, client_id, name, slug, event_date, status, moderation_enabled, allow_guest_name, welcome_message)
  VALUES (mock_event_id, mock_client_id, 'Festa do João', 'festa-do-joao', '2026-12-31', 'active', false, true, 'Bem-vindo à festa! Compartilhe seus momentos com a gente!')
  ON CONFLICT (id) DO NOTHING;

  -- 4. Cria o Tema (Design Layer 2) - Cores elegantes para combinar com o Designer
  INSERT INTO public.event_themes (event_id, primary_color, secondary_color, background_color, accent_color, text_color, font_display, font_body, animation_style)
  VALUES (mock_event_id, '#7C3AED', '#A78BFA', '#F5F3FF', '#FBBF24', '#2E1065', 'Outfit', 'Inter', 'confetti')
  ON CONFLICT (event_id) DO NOTHING;

  -- 5. Cria as Submissions (Recados e Fotos reais do Unsplash)
  INSERT INTO public.submissions (event_id, guest_name, message, photo_url, status, featured)
  VALUES 
    (mock_event_id, 'Maria Eduarda', 'Festa incrível!! Parabéns João! 🎈', 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800', 'approved', true),
    (mock_event_id, 'Carlos & Ana', 'Que vibe maravilhosa! Aproveite muito o seu dia!', 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800', 'approved', false),
    (mock_event_id, 'Família Silva', 'Tudo perfeito! O buffet está maravilhoso e a decoração impecável. Amamos você!', null, 'approved', false),
    (mock_event_id, 'Lucas', 'Melhor festa do ano! 🍻', 'https://images.unsplash.com/photo-1533174000224-63c89710f582?auto=format&fit=crop&q=80&w=800', 'approved', false);

END $$;
