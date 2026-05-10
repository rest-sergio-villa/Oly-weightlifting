import { createClient } from '@supabase/supabase-js';

// Publishable key: designed to be safe in the browser. Row-level
// security policies on the comments table enforce what's allowed.
const SUPABASE_URL = 'https://ootypiaqdqzxhabryszw.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_BAVYcYDlnQCh38byn1dUQQ_i4m2Ylb5';

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
