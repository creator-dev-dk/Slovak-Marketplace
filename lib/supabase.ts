import { createClient } from '@supabase/supabase-js';

// Safely access environment variables, handling cases where import.meta.env might be undefined
const env = (import.meta as any).env || {};

// Use provided keys as fallback if env vars are missing
const supabaseUrl = env.VITE_SUPABASE_URL || 'https://rowqvmiszyzwpnqxsmjn.supabase.co';
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvd3F2bWlzenl6d3BucXhzbWpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3OTkxNDcsImV4cCI6MjA4NjM3NTE0N30.Y9j-JNRz13qlZGrTVpIEBLiBY3yLv26UKlIFodULiV8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);