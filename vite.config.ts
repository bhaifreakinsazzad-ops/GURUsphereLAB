import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// Public (publishable) backend values. Used as build-time fallbacks so the
// deployed bundle always has a valid client even when .env is not present.
const FALLBACK_SUPABASE_URL = "https://kehlqbhfjavuwculgvkw.supabase.co";
const FALLBACK_SUPABASE_PROJECT_ID = "kehlqbhfjavuwculgvkw";
const FALLBACK_SUPABASE_PUBLISHABLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtlaGxxYmhmamF2dXdjdWxndmt3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzNjM1MzUsImV4cCI6MjA5MTkzOTUzNX0.E5tglPWApLXqnjKCmzNfLHkWalVEIG-DUb6uhm9SVww";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
  define: {
    "import.meta.env.VITE_SUPABASE_URL": JSON.stringify(env.VITE_SUPABASE_URL || FALLBACK_SUPABASE_URL),
    "import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY": JSON.stringify(
      env.VITE_SUPABASE_PUBLISHABLE_KEY || FALLBACK_SUPABASE_PUBLISHABLE_KEY,
    ),
    "import.meta.env.VITE_SUPABASE_PROJECT_ID": JSON.stringify(
      env.VITE_SUPABASE_PROJECT_ID || FALLBACK_SUPABASE_PROJECT_ID,
    ),
  },
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
