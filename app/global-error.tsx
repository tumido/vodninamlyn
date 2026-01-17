"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";
import "./globals.css";
import Icon from "./components/ui/Icon";
import { logger } from "./lib/monitoring";

const GlobalError = ({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  useEffect(() => {
    // Log error to Sentry
    Sentry.captureException(error);

    // Also log using our logger
    logger.error("GlobalError caught an error", error, {
      component: "GlobalError",
      metadata: {
        digest: error.digest,
      },
      operation: "error_boundary",
    });
  }, [error]);

  return (
    <html lang="cs">
      <body>
        <div className="flex flex-col">
          <div className="hero-gradient relative flex min-h-screen flex-1 items-center justify-center">
            <div className="z-10 max-w-2xl px-6 text-center">
              <div className="mx-auto mb-8 h-48 w-48">
                <Icon icon="ufo" className="stroke-palette-beige" />
              </div>
              <div className="mb-4 text-2xl font-semibold text-amber-200/90 normal-case md:text-4xl">
                Něco se pokazilo
              </div>
              <div className="text-palette-beige mb-8 text-lg">
                Omlouváme se, ale došlo k neočekávané chybě. Zkuste prosím
                obnovit stránku.
              </div>
              {error.message && (
                <div className="mb-4 rounded border border-red-200 bg-red-50 p-3">
                  <p className="font-mono text-sm text-red-800">
                    {error.message}
                  </p>
                </div>
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => reset()}
                  className="bg-palette-green hover:bg-palette-dark-green flex-1 rounded px-4 py-2 font-medium text-white transition-colors"
                >
                  Zkusit znovu
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-palette-beige flex-1 rounded px-4 py-2 font-medium text-gray-800 transition-colors hover:bg-gray-300"
                >
                  Obnovit stránku
                </button>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
};

export default GlobalError;
