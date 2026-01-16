"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";
import "./globals.css";
import Icon from "./components/ui/Icon";
import { logger } from "./lib/utils/logger";

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
      component: 'GlobalError',
      operation: 'error_boundary',
      metadata: {
        digest: error.digest,
      },
    });
  }, [error]);

  return (
    <html lang="cs">
      <body>
        <div className=" flex flex-col">
          <div className="hero-gradient min-h-screen flex-1 flex items-center justify-center relative">
            <div className="z-10 text-center px-6 max-w-2xl">
              <div className="h-48 w-48 mx-auto mb-8">
                <Icon icon="ufo" className="stroke-palette-beige" />
              </div>
              <div className="text-2xl md:text-4xl font-semibold text-amber-200/90 mb-4 normal-case">
                Něco se pokazilo
              </div>
              <div className="text-lg text-palette-beige mb-8">
                Omlouváme se, ale došlo k neočekávané chybě. Zkuste prosím
                obnovit stránku.
              </div>
              {error.message && (
                <div className="bg-red-50 border border-red-200 rounded p-3 mb-4">
                  <p className="text-sm text-red-800 font-mono">
                    {error.message}
                  </p>
                </div>
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => reset()}
                  className="flex-1 bg-palette-green hover:bg-palette-dark-green text-white font-medium py-2 px-4 rounded transition-colors"
                >
                  Zkusit znovu
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="flex-1 bg-palette-beige hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded transition-colors"
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
