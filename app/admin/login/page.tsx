"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import { Input } from "@/app/components/ui/Input";
import { Button } from "@/app/components/ui/Button";
import { FormField } from "@/app/components/ui/FormField";
import {
  logger,
  performance,
  metrics,
  OperationType,
  MetricEvent,
} from "@/app/lib/monitoring";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          router.replace("/admin");
        } else {
          setIsCheckingAuth(false);
        }
      } catch (error) {
        logger.error(
          "Auth check failed",
          error instanceof Error ? error : new Error(String(error)),
          {
            component: "AdminLoginPage",
            operation: "checkAuth",
          },
        );
        // Re-throw so Sentry captures auth check failures
        throw error;
      }
    }

    checkAuth();
  }, [router]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    // Track login attempt
    metrics.track(MetricEvent.ADMIN_LOGIN_ATTEMPT, {
      component: "AdminLoginPage",
    });

    try {
      const adminUser = process.env.NEXT_PUBLIC_ADMIN_USER;

      if (!adminUser) {
        setError("Admin user is not configured");
        setIsSubmitting(false);

        logger.error("Admin user not configured", undefined, {
          component: "AdminLoginPage",
          operation: "handleLogin",
        });

        return;
      }

      const result = await performance.measureAsync(
        OperationType.AUTH_LOGIN,
        "auth_sign_in",
        async () => {
          return await supabase.auth.signInWithPassword({
            email: adminUser,
            password,
          });
        },
        {
          component: "AdminLoginPage",
        },
      );

      const { data, error } = result;

      if (error) {
        setError(error.message);
        setIsSubmitting(false);

        logger.error("Login failed", error, {
          component: "AdminLoginPage",
          operation: "handleLogin",
        });

        // Track login failure
        metrics.trackAdminOperation("login", false, {
          component: "AdminLoginPage",
          errorMessage: error.message,
        });
      } else if (data.user) {
        logger.info("Login successful", {
          component: "AdminLoginPage",
          metadata: {
            userId: data.user.id,
          },
          operation: "handleLogin",
        });

        // Track successful login
        metrics.trackAdminOperation("login", true, {
          component: "AdminLoginPage",
          userId: data.user.id,
        });

        router.replace("/admin");
      }
    } catch (error) {
      logger.error(
        "Login failed",
        error instanceof Error ? error : new Error(String(error)),
        {
          component: "AdminLoginPage",
          operation: "handleLogin",
        },
      );

      // Track login failure
      metrics.trackAdminOperation("login", false, {
        component: "AdminLoginPage",
      });

      // Re-throw so Sentry captures login failures
      throw error;
    }
  }

  if (isCheckingAuth) {
    return (
      <div className="hero-gradient flex min-h-screen items-center justify-center">
        <div className="text-lg">Načítání...</div>
      </div>
    );
  }

  return (
    <div className="hero-gradient flex min-h-screen items-center justify-center">
      <div className="bg-palette-beige w-full max-w-md space-y-8 rounded-lg p-8 shadow-md">
        <form className="space-y-6" onSubmit={handleLogin}>
          <FormField label="Heslo" error={error} required htmlFor="password">
            <Input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </FormField>

          <Button type="submit" isLoading={isSubmitting}>
            Přihlásit se
          </Button>
        </form>
      </div>
    </div>
  );
}
