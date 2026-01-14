"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
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

    supabase.auth.getUser().then(({ data: { user } }) => handleAuth(user));

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
    await supabase.auth.signOut();
    router.replace("/admin/login");
  };

  return { user, loading, logout };
};
