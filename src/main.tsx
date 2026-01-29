import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { isSupabaseConfigured } from './lib/supabase';
import './index.css';

function EnvConfigMessage() {
  return (
    <div className="min-h-screen theme-page-bg flex items-center justify-center p-6 text-center">
      <div className="max-w-md text-cafe-text">
        <h1 className="text-xl font-bold text-cafe-text mb-4">Angel Game Credits</h1>
        <p className="text-cafe-textMuted mb-4">
          Configure environment variables to run this app.
        </p>
        <p className="text-sm text-cafe-textMuted mb-2">
          On <strong>Vercel</strong>: Project Settings → Environment Variables
        </p>
        <ul className="text-left text-sm text-cafe-textMuted list-disc list-inside space-y-1">
          <li><code className="text-cafe-primary">VITE_SUPABASE_URL</code> – your Supabase project URL</li>
          <li><code className="text-cafe-primary">VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY</code> or <code className="text-cafe-primary">VITE_SUPABASE_ANON_KEY</code> – your anon/public key</li>
        </ul>
        <p className="text-xs text-cafe-textMuted mt-4">
          Redeploy after adding variables.
        </p>
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isSupabaseConfigured ? <App /> : <EnvConfigMessage />}
  </StrictMode>
);
