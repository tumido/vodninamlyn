"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import { Input } from "@/app/components/ui/Input";
import { Button } from "@/app/components/ui/Button";
import { FormField } from "@/app/components/ui/FormField";

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
        console.error("Auth check failed:", error);
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

    try {
      const adminUser = process.env.NEXT_PUBLIC_ADMIN_USER;

      if (!adminUser) {
        setError("Admin user is not configured");
        setIsSubmitting(false);
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: adminUser,
        password,
      });

      if (error) {
        setError(error.message);
        setIsSubmitting(false);
      } else if (data.user) {
        router.replace("/admin");
      }
    } catch (error) {
      console.error("Login failed:", error);
      // Re-throw so Sentry captures login failures
      throw error;
    }
  }

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen hero-gradient flex items-center justify-center">
        <div className="text-lg">Načítání...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center hero-gradient">
      <div className="max-w-md w-full space-y-8 p-8 bg-palette-beige rounded-lg shadow-md">
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
