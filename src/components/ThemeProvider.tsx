'use client';

import React from 'react';

// Tipagem baseada nos tokens dinâmicos que definimos no banco de dados
export interface EventTheme {
  primary_color: string;
  secondary_color: string;
  background_color: string;
  accent_color: string;
  text_color: string;
  font_display: string;
  font_body: string;
  animation_style: string;
  background_image_url?: string | null;
  logo_url?: string;
}

interface ThemeProviderProps {
  children: React.ReactNode;
  theme: EventTheme | null;
}

export function ThemeProvider({ children, theme }: ThemeProviderProps) {
  // Se não houver tema, usa o fallback definido no globals.css
  if (!theme) {
    return <div className="event-theme-layer w-full min-h-screen">{children}</div>;
  }

  // Transformar os dados do banco em variáveis CSS inline para sobrepor o globals.css
  const style = {
    '--theme-primary': theme.primary_color,
    '--theme-secondary': theme.secondary_color,
    '--theme-bg': theme.background_color,
    '--theme-accent': theme.accent_color,
    '--theme-text': theme.text_color,
    // Definimos a fonte dinâmica e adicionamos fallbacks genéricos de segurança
    '--font-display': `"${theme.font_display}", sans-serif`,
    '--font-body': `"${theme.font_body}", sans-serif`,
  } as React.CSSProperties;

  // Background image é tratado de forma especial
  if (theme.background_image_url) {
    style.backgroundImage = `url(${theme.background_image_url})`;
    style.backgroundSize = 'cover';
    style.backgroundPosition = 'center';
  }

  return (
    <div className="event-theme-layer w-full min-h-screen" style={style}>
      {children}
    </div>
  );
}
