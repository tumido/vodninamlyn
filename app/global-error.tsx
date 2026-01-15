"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

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

    // Also log to console for development
    console.error("GlobalError caught an error:", error);
  }, [error]);

  return (
    <html lang="cs">
      <body>
        <div className="min-h-screen flex items-center justify-center bg-palette-beige p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-palette-dark-green mb-4">
              Něco se pokazilo
            </h2>
            <p className="text-gray-600 mb-4">
              Omlouváme se, ale došlo k neočekávané chybě. Zkuste prosím obnovit
              stránku.
            </p>
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
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded transition-colors"
              >
                Obnovit stránku
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
};

export default GlobalError;
