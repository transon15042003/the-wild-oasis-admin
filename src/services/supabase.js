import { createClient } from "@supabase/supabase-js";
export const supabaseUrl = "https://qsmwnmhfoijnnmbyjvcn.supabase.co";
const supabaseKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzbXdubWhmb2lqbm5tYnlqdmNuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjI1MTUyMDQsImV4cCI6MjAzODA5MTIwNH0.DdBL4Qn-rrkC0A76uSmCmhPA0dmYGAPdC-agYSEDvQs";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
