// src/components/CookieConsent.tsx
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button.jsx";
import { X } from "lucide-react";
import { useLocation } from "wouter";

/**
 * Cookie preference shape saved to localStorage
 * cookiePrefs = { essential: true, analytics: boolean, marketing: boolean }
 */
const STORAGE_KEY = "cookiePreferences";

export default function CookieConsent({ showOnlyOn }: { showOnlyOn?: string }) {
  const [location] = useLocation();
  const [visible, setVisible] = useState(false);
  const [manageOpen, setManageOpen] = useState(false);
  const [prefs, setPrefs] = useState({
    essential: true,
    analytics: false,
    marketing: false,
  });

  // Read existing preferences (if any)
  useEffect(() => {
    try {
      // if we only want to show on a specific route (e.g. "/"), skip otherwise
      if (typeof showOnlyOn === "string" && location !== showOnlyOn) {
        return;
      }

      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        // show popup if no prefs saved
        setVisible(true);
        return;
      }
      const parsed = JSON.parse(raw);
      setPrefs((p) => ({ ...p, ...parsed }));
    } catch (err) {
      // ignore storage errors
      setVisible(true);
    }
  }, [location, showOnlyOn]);

  // Apply analytics if previously allowed
  useEffect(() => {
    if (prefs.analytics) {
      injectUmamiIfNeeded();
    }
  }, [prefs.analytics]);

  function savePrefs(newPrefs: typeof prefs) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newPrefs));
    } catch {}
    setPrefs(newPrefs);
    setVisible(false);
    setManageOpen(false);

    if (newPrefs.analytics) {
      injectUmamiIfNeeded();
    }
  }

  function acceptAll() {
    savePrefs({ essential: true, analytics: true, marketing: true });
  }

  function rejectNonEssential() {
    savePrefs({ essential: true, analytics: false, marketing: false });
  }

  function toggleCategory(key: "analytics" | "marketing") {
    const next = { ...prefs, [key]: !prefs[key] };
    setPrefs(next);
  }

  return visible ? (
    <>
      {/* overlay */}
      <div
        aria-hidden
        className="fixed inset-0 bg-black/40 z-[1000] backdrop-blur-sm"
      />

      {/* modal */}
      <div className="fixed inset-0 z-[1001] flex items-center justify-center p-4">
        <div className="w-full max-w-2xl bg-card rounded-2xl shadow-xl border border-border overflow-hidden">
          <div className="flex justify-end p-3">
            <button
              onClick={() => {
                // By default treat closing as reject non-essential
                rejectNonEssential();
              }}
              aria-label="Close cookie dialog"
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="px-8 pb-8 pt-2">
            <h2 className="text-2xl font-semibold text-foreground mb-3">
              We use cookies to improve your experience
            </h2>

            <p className="text-muted-foreground leading-relaxed mb-4">
              We (and partners) use cookies for essential site functionality,
              analytics and marketing. You can accept all cookies, reject
              non-essential ones, or manage preferences.
            </p>

            <div className="grid md:grid-cols-2 gap-6 items-start">
              {/* Left — explanation & links */}
              <div>
                <h3 className="font-medium text-foreground mb-2">What we use</h3>
                <ul className="text-sm text-muted-foreground space-y-2 mb-4">
                  <li>
                    <strong>Essential</strong> — required for the site to work.
                  </li>
                  <li>
                    <strong>Analytics</strong> — anonymous usage tracking (helps
                    us improve).
                  </li>
                  <li>
                    <strong>Marketing</strong> — personalized content & adverts.
                  </li>
                </ul>

                <div className="flex gap-3">
                  <a
                    href="/cookie-policy"
                    className="text-sm underline text-primary hover:text-primary/80"
                  >
                    View Cookie Policy
                  </a>
                  <a
                    href="/privacy-policy"
                    className="text-sm underline text-primary hover:text-primary/80"
                  >
                    Privacy Policy
                  </a>
                </div>
              </div>

              {/* Right — quick actions and manage */}
              <div>
                <div className="space-y-3">
                  <Button
                    onClick={acceptAll}
                    className="w-full py-2"
                    data-testid="cookie-accept-all"
                  >
                    Accept all
                  </Button>

                  <Button
                    variant="outline"
                    onClick={rejectNonEssential}
                    className="w-full py-2"
                    data-testid="cookie-reject"
                  >
                    Reject non-essential
                  </Button>

                  <Button
                    variant="ghost"
                    onClick={() => setManageOpen(true)}
                    className="w-full py-2"
                  >
                    Manage preferences
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Manage modal (simple inline modal) */}
      {manageOpen && (
        <>
          <div
            aria-hidden
            className="fixed inset-0 bg-black/40 z-[1010] backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-[1011] flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-card rounded-2xl shadow-xl border border-border overflow-hidden">
              <div className="px-6 py-5">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">
                      Manage cookie preferences
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Toggle categories you allow. Essential cookies are always
                      required.
                    </p>
                  </div>
                  <button
                    onClick={() => setManageOpen(false)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="mt-6 space-y-4">
                  {/* Essential (fixed) */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-foreground">Essential</div>
                      <div className="text-sm text-muted-foreground">
                        Required for core functionality.
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">Always on</div>
                  </div>

                  {/* Analytics */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-foreground">Analytics</div>
                      <div className="text-sm text-muted-foreground">
                        Help us understand usage (anonymous).
                      </div>
                    </div>
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={prefs.analytics}
                        onChange={() => toggleCategory("analytics")}
                        className="sr-only"
                      />
                      <span
                        className={`w-11 h-6 inline-block rounded-full transition ${
                          prefs.analytics ? "bg-primary" : "bg-gray-300"
                        }`}
                        aria-hidden
                      />
                    </label>
                  </div>

                  {/* Marketing */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-foreground">Marketing</div>
                      <div className="text-sm text-muted-foreground">
                        Personalised content and offers.
                      </div>
                    </div>
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={prefs.marketing}
                        onChange={() => toggleCategory("marketing")}
                        className="sr-only"
                      />
                      <span
                        className={`w-11 h-6 inline-block rounded-full transition ${
                          prefs.marketing ? "bg-primary" : "bg-gray-300"
                        }`}
                        aria-hidden
                      />
                    </label>
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      // cancel: close manage modal (do not persist)
                      setManageOpen(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      savePrefs(prefs);
                    }}
                  >
                    Save preferences
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  ) : null;
}

/**
 * Small helper that injects the Umami script if it's not already present.
 * - Replace the data-website-id value with your real umami id.
 * - If you use a different analytics product, adapt this function accordingly.
 */
function injectUmamiIfNeeded() {
  try {
    if ((window as any).__UMAMI_INJECTED) return;
    // NOTE: replace with your own umami URL + website id (or remove if you don't use umami)
    const id = "27cb7cf9-b974-43ab-8c97-30e1b977ac73"; // <- replace with your id
    const src = "https://cloud.umami.is/script.js";
    const existing = document.querySelector(`script[src="${src}"]`);
    if (!existing) {
      const s = document.createElement("script");
      s.src = src;
      s.defer = true;
      s.setAttribute("data-website-id", id);
      s.id = "umami-script";
      document.head.appendChild(s);
    }
    (window as any).__UMAMI_INJECTED = true;
  } catch (err) {
    // ignore
  }
}
