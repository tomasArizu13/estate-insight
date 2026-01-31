import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Si faltan variables de entorno, el cliente no se crea y la app mostrará mensajes claros.
// Añade a .env en la raíz del proyecto:
//   NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
//   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
if (!supabaseUrl) {
  console.warn(
    "[Supabase] Falta NEXT_PUBLIC_SUPABASE_URL en .env. Añade: NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co"
  );
}
if (!supabaseAnonKey) {
  console.warn(
    "[Supabase] Falta NEXT_PUBLIC_SUPABASE_ANON_KEY en .env. Añade: NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key"
  );
}

export const supabase = createClient(supabaseUrl ?? "", supabaseAnonKey ?? "");

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
