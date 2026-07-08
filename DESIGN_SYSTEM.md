# EventWall - Sistema de Design

## Princípio Central

O produto precisa ser **lúdico, simples e encantador** — mas isso não significa "colorido e com confete em tudo". Significa que cada interação tem um motivo de existir e um momento de deleite bem colocado, sem virar poluição visual.

A marca EventWall (o app em si — telas de admin, marketing) tem identidade própria. Cada **evento individual**, dentro do app, tem seu próprio tema visual — são camadas diferentes.

---

## Duas Camadas de Design

### Camada 1 — EventWall (o produto)

Aplica-se a: Admin do App, Admin do Evento (a "casca" da interface, não o preview do mural).

Esta camada tem identidade fixa e consistente, como qualquer SaaS. Não muda por evento.

* **Paleta**: tons neutros e confiáveis para telas de gestão (quem está mexendo aqui é o organizador trabalhando, não um convidado se divertindo) — evitar cores berrantes na UI de admin, que compete com o conteúdo real (fotos e tema do evento sendo configurado).
* **Tipografia**: uma fonte de interface limpa e legível (ex: Inter, Manrope) para toda a UI de gestão.
* **Tom**: eficiente, claro, sem infantilizar — o organizador quer configurar rápido e sair.

### Camada 2 — Tema do Evento (dinâmico)

Aplica-se a: Página do Convidado e Telão.

Esta camada é 100% definida pelos campos de `event_themes` (ver `DATABASE_SCHEMA.md`) e muda a cada evento. É aqui que mora o "lúdico e encantador".

**Tokens dinâmicos por evento:**
* `primary_color`, `secondary_color`, `accent_color`, `background_color`, `text_color`
* `font_display` (título/headline do evento) e `font_body` (recados, textos)
* `background_image_url` opcional
* `animation_style`: confetti / hearts / balloons / sparkles / none

**Implementação técnica**: os tokens viram CSS custom properties (`--color-primary`, `--font-display`, etc.) injetadas no `<html>` ou container raiz da Página do Convidado e do Telão a partir dos dados do evento carregado. Nenhuma cor ou fonte deve estar hardcoded nessas duas telas — tudo deriva do tema.

---

## Evitando o Genérico

Mesmo sendo customizável por evento, o **template padrão** (o que aparece antes de o organizador customizar) não pode cair nos clichês de design gerado por IA:

Proibido como default:
* Gradiente roxo/violeta genérico
* Fundo bege (#F4F1EA) + acento terracota (#D97757) — combinação identificável como "gerada por IA"
* Ícones genéricos de banco de imagem
* Confete/animação disparando em toda interação, sem hierarquia (se tudo é especial, nada é)

O tema padrão (antes de customização) deve já ser bonito e ter personalidade própria — não um placeholder cinza esperando o cliente "consertar depois".

---

## Página do Convidado — Direção de Design

* **Mobile-first real**: projetar primeiro para tela de 375px de largura, não adaptar depois.
* **Um objetivo por tela**: tirar foto/escolher da galeria → escrever recado → enviar. Sem distrações, sem menu lateral, sem múltiplas ações competindo.
* **O momento de confirmação é o momento de encantar**: depois que o convidado envia, é aqui — não antes — que cabe uma animação de celebração (usando o `animation_style` do evento). É o "signature moment" da experiência do convidado.
* **Feedback imediato**: o convidado precisa sentir "funcionou" em menos de 1 segundo depois de tocar em enviar, mesmo que o upload real ainda esteja processando em background (otimistic UI).
* **Tolerância a conexão ruim**: loading states claros, opção de tentar novamente sem perder o que já foi digitado.

---

## Telão — Direção de Design

* **Tela cheia, sem UI de navegador, sem elementos de interação** — é uma vitrine, não um app.
* **Legibilidade a distância**: tipografia grande o suficiente para ler de longe (mesa a alguns metros da TV/projetor). Contraste alto entre texto e fundo, sempre respeitando o tema, mas nunca sacrificando legibilidade por estética.
* **Ritmo de rotação**: definir um padrão de quanto tempo cada foto/recado fica em destaque antes de trocar (ex: 8-12 segundos), com possibilidade de mostrar múltiplos itens simultaneamente em grid quando o volume de envios for alto.
* **Entrada de novo conteúdo**: quando uma nova submission aprovada chega via Realtime, ela deve ter uma transição de entrada que usa o `animation_style` do evento — esse é o "momento vivo" que dá a sensação de mural em tempo real.
* **Nunca travar**: o Telão roda por horas sem F5 manual. Testar exaustivamente reconexão de Realtime e memory leak de animações acumuladas.

---

## Elemento de Assinatura do Produto

O elemento que torna o EventWall reconhecível (independente do tema de cada evento) é o **momento de transição no Telão** quando uma nova foto/recado entra — a forma como o conteúdo "chega" na tela é a assinatura visual do produto, mesmo que as cores mudem a cada evento. Vale investir tempo de execução ali.

---

## Restrição de Execução

Seguindo o princípio de "gastar a ousadia em um lugar só": a Camada 1 (Admin) deve ser discreta e funcional. Toda a energia visual/lúdica vai para a Camada 2 (Convidado + Telão), que é o que os convidados de fato veem e sentem.
