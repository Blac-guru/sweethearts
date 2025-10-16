// client/src/pages/paystack-callback.tsx
import { useEffect } from "react";
import { useLocation } from "wouter";
import Navbar from "@/components/navbar.jsx";
import { useToast } from "@/hooks/use-toast.js";

export default function PaystackCallback() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    (async () => {
      const params = new URLSearchParams(window.location.search);
      const reference = params.get("reference");
      const hairdresserId = params.get("hairdresserId");

      if (!reference || !hairdresserId) {
        toast({
          title: "Payment failed",
          description: "Missing reference or hairdresser id.",
          variant: "destructive",
        });
        setLocation("/");
        return;
      }

      try {
        const res = await fetch(
          `/api/hairdressers/${hairdresserId}/verify-payment`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ reference }),
          }
        );
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || JSON.stringify(data));
        }

        toast({
          title: "Payment verified",
          description: "Your profile is now active.",
        });

        // redirect to profile page to see updated paid state
        setLocation(`/profile/${hairdresserId}`);
      } catch (err: any) {
        toast({
          title: "Payment verification failed",
          description: err.message || "Please contact support.",
          variant: "destructive",
        });
        // still redirect to profile; their payment may not have been applied
        setLocation(`/profile/${hairdresserId}`);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-3xl mx-auto py-20 text-center">
        <p>Processing your payment — please wait...</p>
      </div>
    </div>
  );
}
