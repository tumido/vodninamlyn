"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import type { User } from "@supabase/supabase-js";
import { logInfo, logError } from "@/app/lib/utils/logger";
import { measureAsync, OperationType } from "@/app/lib/utils/performance";
import { trackAdminOperation } from "@/app/lib/utils/metrics";

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

    measureAsync(
      OperationType.AUTH_CHECK,
      'auth_get_user',
      async () => {
        const { data: { user } } = await supabase.auth.getUser();
        return user;
      },
      {
        component: 'useAuth',
      }
    )
      .then((user) => {
        handleAuth(user);
        logInfo("Auth check completed", {
          component: 'useAuth',
          operation: 'getUser',
          metadata: {
            authenticated: !!user,
          },
        });
      })
      .catch((error) => {
        logError("Failed to get user", error, {
          component: 'useAuth',
          operation: 'getUser',
        });
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
      await measureAsync(
        OperationType.AUTH_LOGOUT,
        'auth_sign_out',
        async () => {
          await supabase.auth.signOut();
        },
        {
          component: 'useAuth',
          metadata: {
            userId: user?.id,
          },
        }
      );

      logInfo("User logged out successfully", {
        component: 'useAuth',
        operation: 'logout',
        metadata: {
          userId: user?.id,
        },
      });

      // Track admin logout
      trackAdminOperation('logout', true, {
        component: 'useAuth',
        userId: user?.id,
      });

      router.replace("/admin/login");
    } catch (error) {
      logError("Logout failed", error instanceof Error ? error : new Error(String(error)), {
        component: 'useAuth',
        operation: 'logout',
        metadata: {
          userId: user?.id,
        },
      });

      // Track logout failure
      trackAdminOperation('logout', false, {
        component: 'useAuth',
        userId: user?.id,
      });

      // Re-throw so Sentry captures logout failures
      throw error;
    }
  };

  return { user, loading, logout };
};
