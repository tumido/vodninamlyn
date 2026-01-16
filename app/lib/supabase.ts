import { createClient } from "@supabase/supabase-js";
import { logger } from "./monitoring";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
  logger.warn("Supabase environment variables are not set", {
    operation: 'supabase_init',
    metadata: {
      hasUrl: !!supabaseUrl,
      hasAnonKey: !!supabaseAnonKey,
    },
  });
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
