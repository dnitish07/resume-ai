
import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

const supabaseUrl = 'https://mnvbcyquwsvfjxprbnhx.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1udmJjeXF1d3N2Zmp4cHJibmh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzMDg5MTksImV4cCI6MjA2Nzg4NDkxOX0._qEtAMsg7y3X1g7ASF5i-yfAUx0pgYBwZvET5RJ4O1E'

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})
