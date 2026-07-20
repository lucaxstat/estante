import { createClient } from '@supabase/supabase-js';

// Pega as variáveis secretas que ficarão guardadas na Vercel (ou no arquivo .env)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Cria a ponte (cliente) e a exporta para usarmos em outras páginas
export const supabase = createClient(supabaseUrl, supabaseKey);