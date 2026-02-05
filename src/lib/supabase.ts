import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mcbtdazprezgpisfoaeo.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jYnRkYXpwcmV6Z3Bpc2ZvYWVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyOTIyMzEsImV4cCI6MjA4NTg2ODIzMX0.fZ6asSFSdsJLSjf_Nb3-MUfEb4lzBVX_iCXoi-ISCnI'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
