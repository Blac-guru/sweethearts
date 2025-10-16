import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/navbar.jsx";
import SearchFilters from "@/components/search-filters.jsx";
import HairdresserCard from "@/components/hairdresser-card.jsx";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import type { HairdresserWithLocation } from "@shared/schema.js";
import Footer from "@/components/footer.jsx";
import { motion } from "framer-motion";

export default function Homepage() {
  const [searchFilters, setSearchFilters] = useState<any>({});
  const hasSearched = Object.keys(searchFilters).length > 0;

  const { data: hairdressers = [], isLoading } = useQuery<
    HairdresserWithLocation[]
  >({
    queryKey: ["/api/hairdressers", searchFilters],
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(searchFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });

      const response = await fetch(`/api/hairdressers?${params}`);
      if (!response.ok) throw new Error("Failed to fetch hairdressers");
      const data: HairdresserWithLocation[] = await response.json();

      // 🔹 Sort by membershipPlan: VIP > PRIME > REGULAR
      const planOrder: Record<string, number> = {
        VIP: 1,
        PRIME: 2,
        REGULAR: 3,
      };
      data.sort((a, b) => {
        const planA = (a.membershipPlan || "PRIME").toUpperCase();
        const planB = (b.membershipPlan || "PRIME").toUpperCase();
        return (planOrder[planA] || 2) - (planOrder[planB] || 2);
      });

      return data;
    },
  });

  const { data: blogs = [] } = useQuery<HairdresserWithLocation[]>({
    queryKey: ["/api/blogs", searchFilters],
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(searchFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });

      const response = await fetch(`/api/blogs?${params}`);
      if (!response.ok) throw new Error("Failed to fetch blogs");
      return response.json();
    },
  });

  const handleSearch = (filters: any) => {
    setSearchFilters(filters);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <SearchFilters onSearch={handleSearch} />

      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <motion.div
          className="flex justify-between items-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div>
            <h2
              className="text-2xl font-bold text-foreground"
              data-testid="results-title"
            >
              Professional Call Girls
            </h2>
            <p
              className="text-muted-foreground mt-1"
              data-testid="results-count"
            >
              {hasSearched
                ? isLoading
                  ? "Loading..."
                  : `${hairdressers.length} ${
                      hairdressers.length === 1 ? "profile" : "profiles"
                    } found`
                : ""}
            </p>
          </div>
        </motion.div>

        {isLoading ? (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <p className="text-muted-foreground">
              No sweethearts found matching your criteria.
            </p>
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            data-testid="hairdressers-grid"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            {hairdressers.map((hairdresser: HairdresserWithLocation, idx) => (
              <motion.div
                key={hairdresser.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 0.1 * idx, // 🔹 stagger animation
                }}
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
