import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://nquuldatarrlysyqywet.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xdXVsZGF0YXJybHlzeXF5d2V0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk4MDE2NTAsImV4cCI6MjA1NTM3NzY1MH0.GBxrG3L0nhnvqcSpvnpUew4xlmgs_h_JhCfqlRWGgIU';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function getProjects() {
  try {
    const { data, error } = await supabase.from('projects').select('*');

    if (error) {
      throw new Error(`Erro ao buscar projetos: ${error.message}`);
    }

    return data || [];
  } catch (err) {
    console.error(err.message);
    return [];
  }
}
