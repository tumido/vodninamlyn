import { createClient } from "@supabase/supabase-js";
import { logger } from "./monitoring";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
  logger.warn("Supabase environment variables are not set", {
    metadata: {
      hasAnonKey: !!supabaseAnonKey,
      hasUrl: !!supabaseUrl,
    },
    operation: "supabase_init",
  });
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
