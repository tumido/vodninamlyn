"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import type { User } from "@supabase/supabase-js";
import {
  logger,
  performance,
  metrics,
  OperationType,
} from "@/app/lib/monitoring";

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

    performance
      .measureAsync(
        OperationType.AUTH_CHECK,
        "auth_get_user",
        async () => {
          const {
            data: { user },
          } = await supabase.auth.getUser();
          return user;
        },
        {
          component: "useAuth",
        },
      )
      .then((user) => {
        handleAuth(user);
        logger.info("Auth check completed", {
          component: "useAuth",
          metadata: {
            authenticated: !!user,
          },
          operation: "getUser",
        });
      })
      .catch((error) => {
        logger.error("Failed to get user", error, {
          component: "useAuth",
          operation: "getUser",
        });
        // Re-throw so Sentry captures auth failures
        throw error;
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) =>
      handleAuth(session?.user ?? null),
    );

    return () => {
      ignore = true;
      subscription.unsubscribe();
    };
  }, [router]);

  const logout = async () => {
    try {
      await performance.measureAsync(
        OperationType.AUTH_LOGOUT,
        "auth_sign_out",
        async () => {
          await supabase.auth.signOut();
        },
        {
          component: "useAuth",
          metadata: {
            userId: user?.id,
          },
        },
      );

      logger.info("User logged out successfully", {
        component: "useAuth",
        metadata: {
          userId: user?.id,
        },
        operation: "logout",
      });

      // Track admin logout
      metrics.trackAdminOperation("logout", true, {
        component: "useAuth",
        userId: user?.id,
      });

      router.replace("/admin/login");
    } catch (error) {
      logger.error(
        "Logout failed",
        error instanceof Error ? error : new Error(String(error)),
        {
          component: "useAuth",
          metadata: {
            userId: user?.id,
          },
          operation: "logout",
        },
      );

      // Track logout failure
      metrics.trackAdminOperation("logout", false, {
        component: "useAuth",
        userId: user?.id,
      });

      // Re-throw so Sentry captures logout failures
      throw error;
    }
  };

  return { loading, logout, user };
};
