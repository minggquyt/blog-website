import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project-ref.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_b0blRqWEypfLN4NMorcRQg_f0ZBv95A'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)