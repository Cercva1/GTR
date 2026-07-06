// Shared Supabase configuration
// SUPABASE_URL and SUPABASE_ANON_KEY are safe to be public — access is controlled
// by Row Level Security policies set up in the database, not by hiding these values.
const SUPABASE_URL = "https://cwzxiihxpnvjuanoxzoj.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_XMFIYUfsaW2HHkmk1vqvaw_XpG1U0R6";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
