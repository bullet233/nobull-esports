import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ihlwipbjhnqqiplsvqbf.supabase.co';
const supabaseKey = 'sb_publishable_ME1oOf9qFIOWLFDB8B3fhQ_QY9SMlzw';

export const supabase = createClient(supabaseUrl, supabaseKey);
