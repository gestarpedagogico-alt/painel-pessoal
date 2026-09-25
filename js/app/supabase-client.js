import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

/* Cole aqui a URL e a anon key do seu projeto Supabase (Project Settings > API).
   A anon key é pública por natureza (protegida pelas policies de RLS em
   supabase/schema.sql), então pode ficar em texto no código do site estático. */
const SUPABASE_URL = 'https://SEU-PROJETO.supabase.co';
const SUPABASE_ANON_KEY = 'SUA_ANON_KEY_AQUI';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
