// src/pages/age-consent.tsx
import { useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button.jsx";

export default function AgeConsentPage() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    // If already confirmed, skip this page
    try {
      const consent = localStorage.getItem("ageConsent");
      if (consent === "true") {
        setLocation("/");
      }
    } catch {
      // ignore storage issues
    }
  }, [setLocation]);

  const handleAgree = () => {
    try {
      localStorage.setItem("ageConsent", "true");
      localStorage.setItem("isAdult", "true");
    } catch {}
    setLocation("/"); // ✅ immediately go home
  };

  const handleDisagree = () => {
    try {
      window.close();
    } catch {}
    setTimeout(() => {
      try {
        // fallback if close is blocked
        window.open("", "_self");
        window.location.href = "about:blank";
      } catch {
        window.location.href = "about:blank";
      }
    }, 200);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6 text-center">
      <div className="max-w-2xl">
        <h1 className="text-4xl font-bold mb-6 text-foreground">
          Age Consent Required
        </h1>

        <p className="mb-4 text-lg leading-relaxed text-muted-foreground">
          Welcome to <strong>HireSweetheart.co.ke</strong>. This platform is
          strictly intended for <strong>adults aged 18 years and older</strong>.
          If you are under 18, you must leave immediately to protect yourself
          from content not suitable for minors.
        </p>

        <p className="mb-8 text-sm text-muted-foreground">
          By clicking <strong>Yes</strong>, you confirm that you are at least 18
          years old and agree to our{" "}
          <a
            href="/terms-of-service"
            className="underline text-primary hover:text-primary/80"
          >
            Terms of Service
          </a>
          .
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={handleAgree} className="px-8 py-3 text-lg">
            Yes, I am 18+
          </Button>

          <Button
            onClick={handleDisagree}
            variant="destructive"
            className="px-8 py-3 text-lg"
          >
            No, I am under 18
          </Button>
        </div>
      </div>
    </div>
  );
}
