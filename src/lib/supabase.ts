import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// We use the service role key for the admin backend to bypass RLS,
// since we haven't set up explicit policies in the Supabase UI.
export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false }
});
