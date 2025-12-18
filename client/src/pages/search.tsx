import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/navbar.jsx";
import SearchFilters from "@/components/search-filters.jsx";
import HairdresserCard from "@/components/hairdresser-card.jsx";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import Footer from "@/components/footer.jsx";
import type { HairdresserWithLocation } from "@shared/schema.js";
import { motion, AnimatePresence } from "framer-motion";

export default function SearchPage() {
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [hasSearched, setHasSearched] = useState(false);

  const {
    data: hairdressers = [],
    isLoading,
    isFetching,
  } = useQuery<HairdresserWithLocation[]>({
    queryKey: ["/api/hairdressers", filters],
    enabled: hasSearched,
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });

      const response = await fetch(`/api/hairdressers?${params}`);
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

  const resultsLabel = useMemo(() => {
    if (!hasSearched) return "Run a search to see matches";
    if (isLoading || isFetching) return "Searching...";
    return `${hairdressers.length} ${
      hairdressers.length === 1 ? "match" : "matches"
    } found`;
  }, [hasSearched, isLoading, isFetching, hairdressers.length]);

  const handleSearch = (nextFilters: Record<string, any>) => {
    setFilters(nextFilters);
    setHasSearched(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <AnimatePresence mode="wait">
        <motion.div
          key="filters"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -24 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <SearchFilters onSearch={handleSearch} />
        </motion.div>
      </AnimatePresence>

      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              Search results
            </h2>
            <p
              className="text-muted-foreground mt-1"
              data-testid="results-count"
            >
              {resultsLabel}
            </p>
          </div>
        </div>

        {!hasSearched ? (
          <motion.div
            className="text-center py-12 text-muted-foreground"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            Use filters above to find your match.
          </motion.div>
        ) : isLoading || isFetching ? (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
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
        ) : hairdressers.length === 0 ? (
          <motion.div
            className="text-center py-12"
            data-testid="no-results"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <p className="text-muted-foreground">
              No matches found. Try adjusting your filters.
            </p>
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl-grid-cols-4 gap-6"
            data-testid="hairdressers-grid"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05 }}
          >
            {hairdressers.map((hairdresser: HairdresserWithLocation, idx) => (
              <motion.div
                key={hairdresser.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.04 * idx }}
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
