# EventWall - Especificação das Telas

Este documento detalha o fluxo e os requisitos funcionais de cada uma das 4 telas. Ver `DATABASE_SCHEMA.md` para as tabelas referenciadas e `DESIGN_SYSTEM.md` para a direção visual de cada camada.

---

## 1. Admin do App

**Rota sugerida**: `/admin`
**Acesso**: apenas usuários em `app_admins`
**Camada de design**: Camada 1 (interface neutra de gestão)

### Funcionalidades

* Login (Supabase Auth)
* Lista de todos os `clients` cadastrados
* Lista de todos os `events`, com filtro por status (draft / active / ended) e por client
* Criar novo client manualmente (enquanto não houver self-signup)
* Visão simples de uso: quantos eventos ativos, quantos criados no mês
* Acesso de leitura a qualquer evento para suporte/debug (não deve editar tema ou moderar submissions de outros — isso é função do Admin do Evento)

### Fora de escopo nesta v1

* Faturamento/cobrança automatizada
* Self-signup de novos clients

---

## 2. Admin do Evento

**Rota sugerida**: `/admin/eventos/{event_id}`
**Acesso**: o `client` dono do evento (via `client_id`), autenticado
**Camada de design**: Camada 1 para a casca da interface; a área de "Preview do Tema" renderiza a Camada 2 em miniatura

### Funcionalidades

**Configuração do Evento**
* Editar nome, data, `welcome_message`
* Ativar/desativar `moderation_enabled`
* Ativar/desativar `allow_guest_name`
* Mudar `status` (draft → active → ended)

**Configuração de Tema**
* Editor visual dos campos de `event_themes`: cores (color picker), fontes (dropdown com opções pré-aprovadas, não upload livre de fonte), `animation_style`, upload opcional de logo e imagem de fundo
* Preview ao vivo mostrando como a Página do Convidado e o Telão vão ficar com o tema escolhido

**QR Code**
* Geração automática do QR Code apontando para `eventwall.app/e/{slug}`
* Botão para baixar QR Code em alta resolução (para impressão nas mesas)

**Moderação** (visível apenas se `moderation_enabled = true`)
* Fila de `submissions` com `status = 'pending'`
* Ação de aprovar/rejeitar por item
* Preview da foto e do recado antes de decidir

**Mural ao Vivo**
* Visão em tempo real (mesma lógica Realtime do Telão) para o organizador acompanhar sem precisar abrir o Telão

**Link do Telão**
* Botão destacado "Abrir Telão" que leva para a rota pública do Telão daquele evento, pronta para jogar na TV/projetor

### Estado Vazio

Evento recém-criado sem tema configurado: mostrar o tema padrão do EventWall (bonito por padrão, ver `DESIGN_SYSTEM.md`) com uma chamada clara para customizar.

---

## 3. Página do Convidado

**Rota sugerida**: `/e/{slug}`
**Acesso**: público, sem login, via QR Code
**Camada de design**: Camada 2 (tema dinâmico do evento)

### Fluxo

1. Convidado escaneia QR Code → carrega o evento pelo `slug`
2. Se `status != 'active'`: mostrar tela de "evento ainda não começou" ou "evento encerrado", com o tema do evento mesmo assim (não deixar em branco/erro genérico)
3. Tela principal mostra o `welcome_message` do evento
4. Convidado toca em botão único e claro para: tirar foto ou escolher da galeria
5. Campo de texto para recado (opcional se já tem foto, obrigatório se não tem foto — pelo menos um dos dois é necessário)
6. Campo de nome (só aparece se `allow_guest_name = true`), sempre opcional
7. Botão de enviar
8. Tela de confirmação com a animação de `animation_style` do evento (o "momento de encantar")
9. Opção de enviar outra foto/recado sem sair da página

### Requisitos Técnicos

* Compressão de imagem no client antes do upload (evitar uploads de 8MB de fotos de celular moderno, que travam em Wi-Fi de evento)
* Upload direto para o bucket `event-photos` do Supabase Storage
* Insert em `submissions` só acontece após upload da foto ter sucesso (ou imediatamente, se for só recado sem foto)
* UI otimista: mostrar sucesso assim que o insert for confirmado, sem travar o convidado esperando o Realtime propagar

---

## 4. Telão / Display

**Rota sugerida**: `/e/{slug}/telao`
**Acesso**: público (a própria TV/projetor do evento acessa a URL), sem login
**Camada de design**: Camada 2 (tema dinâmico do evento), otimizada para tela grande

### Fluxo

1. Carrega o evento e o tema pelo `slug`
2. Carrega as `submissions` já `approved` existentes (estado inicial)
3. Assina o canal Realtime filtrado por `event_id` e `status = approved`
4. Novo item aprovado chega → entra na fila de exibição com animação de entrada
5. Rotação entre os itens em destaque (foto grande + recado + nome, se houver), com layout que se adapta ao volume: poucos itens = um por vez em destaque; muitos itens = grid com rotação mais rápida

### Requisitos Técnicos

* Deve rodar em loop por várias horas sem intervenção manual — testar reconexão automática do canal Realtime em caso de queda de rede momentânea
* Sem elementos de UI de navegador/interação — modo apresentação puro
* Fallback visual caso não haja nenhuma submission ainda: tela de "aguardando as primeiras fotos", não tela em branco ou erro
* Considerar um modo de "destaque" (`featured = true` em `submissions`) que o Admin do Evento pode marcar para fixar um recado específico por mais tempo (ex: mensagem dos noivos, do aniversariante)

---

## Resumo de Rotas

| Tela | Rota | Autenticação |
|---|---|---|
| Admin do App | `/admin` | app_admin |
| Admin do Evento | `/admin/eventos/{event_id}` | client (dono do evento) |
| Página do Convidado | `/e/{slug}` | pública |
| Telão | `/e/{slug}/telao` | pública |
