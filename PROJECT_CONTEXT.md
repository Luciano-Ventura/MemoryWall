# EventWall - Contexto do Projeto

## O que é

EventWall é uma plataforma onde convidados de um evento (aniversário, casamento, formatura, evento corporativo) escaneiam um QR Code na mesa, acessam uma página do evento pelo celular, e enviam fotos e recados que aparecem em tempo real em um telão durante a festa.

Cada evento tem sua própria personalização visual (cores, tema) — não existe uma identidade visual fixa da plataforma imposta a todos os eventos.

---

## Problema que resolve

Hoje, a interação dos convidados em um evento é passiva. O EventWall transforma isso em um momento coletivo: o convidado registra um momento (foto + recado) e vê isso reconhecido publicamente no telão, na hora, criando um mural vivo do evento.

---

## As 4 Telas do Produto

### 1. Admin do App (super admin)

Quem usa: você (dono da plataforma) ou sua equipe.

Função: gerenciar todos os clientes e eventos cadastrados na plataforma. Visão de negócio, não de operação de festa.

### 2. Admin do Evento

Quem usa: o organizador do evento (cliente que contratou o serviço).

Função: configurar o evento (tema visual, moderação), gerar o QR Code, moderar submissões (se moderação estiver ativa), acompanhar o mural em tempo real.

### 3. Página do Convidado

Quem usa: os convidados do evento, via QR Code, no celular.

Função: enviar foto + recado (+ nome opcional) que vai para o mural do evento.

### 4. Telão / Display

Quem usa: ninguém interage diretamente — é a tela projetada/na TV do evento.

Função: exibir em tempo real, em tela cheia, as fotos e recados aprovados, com o tema visual daquele evento específico.

---

## Personas

**Organizador do evento** — quer configurar rápido, sem fricção técnica, e ver o mural funcionando antes dos convidados chegarem. Provavelmente vai testar no celular dele mesmo.

**Convidado** — está no evento, com o celular na mão, talvez com pouco sinal de internet, quer fazer algo rápido (menos de 30 segundos) sem precisar criar conta.

**Você (dono da plataforma)** — precisa conseguir cadastrar um novo cliente/evento rapidamente e ter visibilidade de quantos eventos estão ativos.

---

## Requisitos Não-Funcionais Críticos

* **Mobile-first inegociável** na Página do Convidado — é a tela mais usada e é 100% acessada por celular, muitas vezes com conexão instável de evento (Wi-Fi lotado ou 4G fraco).
* **Tempo real** entre o envio do convidado e a exibição no Telão — segundos, não minutos.
* **Sem necessidade de login do convidado** — fricção zero. Nome é opcional.
* **Telão precisa rodar por horas sem intervenção** — sem travar, sem precisar dar refresh manual.
* **Personalização por evento** — cada evento define sua própria paleta e tema, sem precisar de um dev pra cada cliente novo.

---

## Stack Técnica

* **Frontend**: Next.js + React + TypeScript
* **Banco de Dados**: Supabase (Postgres + Realtime + Storage + Auth)
* **Hospedagem**: Vercel

Esta escolha segue o padrão técnico já usado nos demais projetos da operação (ver `desenvolvedor.md`).

---

## Ordem de Leitura para Implementação

Ao gerar o prompt de execução, seguir esta ordem:

1. PROJECT_CONTEXT.md (este arquivo)
2. DATABASE_SCHEMA.md
3. DESIGN_SYSTEM.md
4. PAGES_SPEC.md

O banco de dados deve ser modelado antes do design ser aplicado, e o design antes das telas serem construídas, para evitar retrabalho.
