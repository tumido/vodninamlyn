import { createClient } from "@supabase/supabase-js";
import { logWarn } from "./utils/logger";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
  logWarn("Supabase environment variables are not set", {
    operation: 'supabase_init',
    metadata: {
      hasUrl: !!supabaseUrl,
      hasAnonKey: !!supabaseAnonKey,
    },
  });
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
