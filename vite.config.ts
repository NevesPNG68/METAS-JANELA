import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Carrega variáveis de ambiente (se existirem). Não precisa ter .env/.env.local para rodar.
  const env = loadEnv(mode, '.', '');

  return {
    // IMPORTANTÍSSIMO para o GitHub Pages quando o site roda em /METAS-JANELA/
    base: '/METAS-JANELA/',

    server: {
      port: 3000,
      host: '0.0.0.0',
    },

    plugins: [react()],

    // Mantém compatibilidade com código que referencie process.env.*
    // Se GEMINI_API_KEY não existir, vira undefined (não quebra o build).
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY ?? ''),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY ?? ''),
    },

    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
  };
});
