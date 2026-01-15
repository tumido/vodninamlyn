"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import type { User } from "@supabase/supabase-js";

export const useAuth = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    const handleAuth = (user: User | null) => {
      if (ignore) return;

      setUser(user);
      setLoading(false);

      if (!user) {
        router.replace("/admin/login");
      }
    };

    supabase.auth.getUser()
      .then(({ data: { user } }) => handleAuth(user))
      .catch((error) => {
        console.error("Failed to get user:", error);
        // Re-throw so Sentry captures auth failures
        throw error;
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) =>
      handleAuth(session?.user ?? null)
    );

    return () => {
      ignore = true;
      subscription.unsubscribe();
    };
  }, [router]);

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      router.replace("/admin/login");
    } catch (error) {
      console.error("Logout failed:", error);
      // Re-throw so Sentry captures logout failures
      throw error;
    }
  };

  return { user, loading, logout };
};
