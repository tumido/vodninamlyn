"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { supabase } from "../lib/supabase";
import type { User } from "@supabase/supabase-js";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { FormField } from "../components/ui/FormField";

function Tooltip({
  content,
  children,
}: {
  content: string;
  children: React.ReactNode;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);

  if (!content || content === "-") {
    return <>{children}</>;
  }

  const handleMouseEnter = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.top + window.scrollY - 8,
        left: rect.left + rect.width / 2 + window.scrollX,
      });
      setIsVisible(true);
    }
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  return (
    <>
      <div
        ref={triggerRef}
        className="inline-block"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </div>
      {isVisible &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg w-max max-w-xs whitespace-normal pointer-events-none transform -translate-x-1/2 -translate-y-full"
            style={{
              top: `${position.top}px`,
              left: `${position.left}px`,
            }}
          >
            {content}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>,
          document.body
        )}
    </>
  );
}

interface RsvpSubmission {
  attendee_id: string;
  attendee_name: string;
  created_at: string;
  primary_rsvp_id: string;
  primary_name: string;
  attending: "yes" | "no";
  accommodation: string | null;
  drink_choice: string | null;
  custom_drink: string | null;
  dietary_restrictions: string | null;
  message: string | null;
  is_primary: boolean;
}

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rsvps, setRsvps] = useState<RsvpSubmission[]>([]);
  const [rsvpsLoading, setRsvpsLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchRsvps = useCallback(async () => {
    setRsvpsLoading(true);
    const { data, error } = await supabase
      .from("rsvp_submissions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching RSVPs:", error);
    } else {
      setRsvps(data || []);
    }
    setRsvpsLoading(false);
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Opravdu chcete smazat tuto RSVP odpověď?")) {
      return;
    }

    setDeletingId(id);
    const { error } = await supabase.from("rsvps").delete().eq("id", id);

    if (error) {
      console.error("Error deleting RSVP:", error);
      alert("Chyba při mazání RSVP: " + error.message);
    } else {
      fetchRsvps();
    }
    setDeletingId(null);
  };

  useEffect(() => {
    let ignore = false;

    async function getUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!ignore) {
        setUser(user);
        setLoading(false);
        if (user) {
          fetchRsvps();
        }
      }
    }

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!ignore) {
        setUser(session?.user ?? null);
        setLoading(false);
        if (session?.user) {
          fetchRsvps();
        }
      }
    });

    return () => {
      ignore = true;
      subscription.unsubscribe();
    };
  }, [fetchRsvps]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

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
    } else {
      setUser(data.user);
    }

    setIsSubmitting(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null);
  }

  if (loading) {
    return (
      <div className="min-h-screen hero-gradient flex items-center justify-center">
        <div className="text-lg">Načítání...</div>
      </div>
    );
  }

  if (!user) {
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("cs-CZ", {
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getAttendingLabel = (attending: "yes" | "no") => {
    return attending === "yes" ? "Dorazí" : "Nedorazí";
  };

  const getAccommodationLabel = (accommodation: string | null) => {
    if (!accommodation) return "-";
    switch (accommodation) {
      case "roof":
        return "Chce střechu";
      case "own-tent":
        return "Stan";
      case "no-sleep":
        return "Nespím";
      default:
        return accommodation;
    }
  };

  const getDrinkLabel = (drink: string | null, customDrink: string | null) => {
    if (!drink) return "-";
    switch (drink) {
      case "pivo":
        return "Pivo";
      case "vino":
        return "Víno";
      case "nealko":
        return "Nealko";
      case "other":
        return customDrink || "Jiné";
      default:
        return drink;
    }
  };

  const calculateStats = () => {
    const attendingRsvps = rsvps.filter((rsvp) => rsvp.attending === "yes");

    // Each row is now an individual attendee
    const totalAttending = attendingRsvps.length;

    const drinkCounts: Record<string, number> = {};
    attendingRsvps.forEach((rsvp) => {
      const drink = rsvp.drink_choice;
      if (drink) {
        drinkCounts[drink] = (drinkCounts[drink] || 0) + 1;
      }
    });

    const accommodationCounts: Record<string, number> = {};
    attendingRsvps.forEach((rsvp) => {
      const accommodation = rsvp.accommodation;
      if (accommodation) {
        accommodationCounts[accommodation] =
          (accommodationCounts[accommodation] || 0) + 1;
      }
    });

    return {
      totalAttending,
      drinkCounts,
      accommodationCounts,
    };
  };

  const stats = calculateStats();

  return (
    <div className="min-h-screen bg-palette-beige">
      <nav className="max-w-64 ml-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-end h-16 items-center gap-4">
          <Button onClick={handleLogout}>Odhlásit se</Button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {rsvpsLoading ? (
            <div className="text-center py-12">
              <div className="text-lg">Načítání RSVP...</div>
            </div>
          ) : rsvps.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6 text-center text-gray-600">
              Zatím žádné RSVP odpovědi.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                    Celkem přítomných
                  </h3>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.totalAttending}
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                    Nápoje
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(stats.drinkCounts).map(([drink, count]) => (
                      <div
                        key={drink}
                        className="flex justify-between items-center"
                      >
                        <span className="text-sm text-gray-700">
                          {getDrinkLabel(drink, null)}
                        </span>
                        <span className="text-lg font-semibold text-gray-900">
                          {count}
                        </span>
                      </div>
                    ))}
                    {Object.keys(stats.drinkCounts).length === 0 && (
                      <p className="text-sm text-gray-500">
                        Zatím žádné odpovědi
                      </p>
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                    Ubytování
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(stats.accommodationCounts).map(
                      ([accommodation, count]) => (
                        <div
                          key={accommodation}
                          className="flex justify-between items-center"
                        >
                          <span className="text-sm text-gray-700">
                            {getAccommodationLabel(accommodation)}
                          </span>
                          <span className="text-lg font-semibold text-gray-900">
                            {count}
                          </span>
                        </div>
                      )
                    )}
                    {Object.keys(stats.accommodationCounts).length === 0 && (
                      <p className="text-sm text-gray-500">
                        Zatím žádné odpovědi
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Jméno účastníka
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Účast
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ubytování
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nápoj
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Omezení
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Zpráva
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Datum
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Akce
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {rsvps.map((rsvp) => (
                        <tr
                          key={rsvp.attendee_id}
                          className={`hover:bg-gray-50 ${
                            !rsvp.is_primary
                              ? "bg-gray-50/50 border-l-4 border-l-palette-green"
                              : ""
                          }`}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div
                              className={`text-sm font-medium text-gray-900 flex items-center gap-2 ${
                                !rsvp.is_primary ? "pl-4" : ""
                              }`}
                            >
                              {rsvp.attendee_name}
                              {rsvp.is_primary && (
                                <span className="text-xs text-gray-500">
                                  (primární)
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                rsvp.attending === "yes"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {getAttendingLabel(rsvp.attending)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {rsvp.attending === "yes"
                              ? getAccommodationLabel(rsvp.accommodation)
                              : "-"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {rsvp.attending === "yes"
                              ? getDrinkLabel(
                                  rsvp.drink_choice,
                                  rsvp.custom_drink
                                )
                              : "-"}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-600">
                            <Tooltip content={rsvp.dietary_restrictions || ""}>
                              <div className="max-w-30 truncate cursor-help">
                                {rsvp.dietary_restrictions || "-"}
                              </div>
                            </Tooltip>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-600">
                            <Tooltip content={rsvp.message || ""}>
                              <div className="max-w-30 truncate cursor-help">
                                {rsvp.message || "-"}
                              </div>
                            </Tooltip>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(rsvp.created_at)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button
                              onClick={() => handleDelete(rsvp.primary_rsvp_id)}
                              disabled={deletingId === rsvp.primary_rsvp_id}
                              className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed p-1 transition-colors"
                              title="Smazat celou RSVP skupinu"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-5 h-5"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
