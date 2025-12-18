import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/navbar.jsx";
import HairdresserCard from "@/components/hairdresser-card.jsx";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Link } from "wouter";
import type { HairdresserWithLocation } from "@shared/schema.js";
import Footer from "@/components/footer.jsx";
import { motion } from "framer-motion";

export default function Homepage() {
  const { data: hairdressers = [], isLoading } = useQuery<
    HairdresserWithLocation[]
  >({
    queryKey: ["/api/hairdressers"],
    queryFn: async () => {
      const response = await fetch(`/api/hairdressers`);
      if (!response.ok) throw new Error("Failed to fetch hairdressers");
      const data: HairdresserWithLocation[] = await response.json();

      const planOrder: Record<string, number> = {
        VIP: 1,
        PRIME: 2,
        REGULAR: 3,
      };
      return data.slice().sort((a, b) => {
        const planA = (a.membershipPlan || "PRIME").toUpperCase();
        const planB = (b.membershipPlan || "PRIME").toUpperCase();
        return (planOrder[planA] || 2) - (planOrder[planB] || 2);
      });
    },
  });

  // const headline = useMemo(() => {
  //   const count = hairdressers.length;
  //   return count > 0
  //     ? `${count} ${count === 1 ? "profile" : "profiles"} ready to meet you`
  //     : "Discover local matches";
  // }, [hairdressers.length]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.div
          className="flex justify-between items-center mb-8"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div>
            <h2
              className="text-2xl font-bold text-foreground"
              data-testid="results-title"
            >
              Professional Call Girls
            </h2>
            {/* <p
              className="text-muted-foreground mt-1"
              data-testid="results-count"
            >
              {headline}
            </p> */}
          </div>
          <Link href="/search" className="hidden sm:block">
            <Button variant="outline" size="sm">
              Open Search Filters
            </Button>
          </Link>
        </motion.div>

        {isLoading ? (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.15 }}
          >
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-48 w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex space-x-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            data-testid="hairdressers-grid"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {hairdressers.map((hairdresser: HairdresserWithLocation, idx) => (
              <motion.div
                key={hairdresser.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.05 * idx }}
              >
                <HairdresserCard hairdresser={hairdresser} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>

      <Footer />
    </div>
  );
}
