import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/navbar.jsx";
import SearchFilters from "@/components/search-filters.jsx";
import HairdresserCard from "@/components/hairdresser-card.jsx";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import type { HairdresserWithLocation } from "@shared/schema.js";
import { apiRequest } from "@/lib/queryClient";

export default function Homepage() {
  const [searchFilters, setSearchFilters] = useState<any>({});

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

      const response = await apiRequest("GET", `/api/hairdressers?${params}`);
      if (!response.ok) throw new Error("Failed to fetch hairdressers");
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
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
              {isLoading
                ? "Loading..."
                : `${hairdressers.length} ${
                    hairdressers.length === 1 ? "profile" : "profiles"
                  } found`}
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
          </div>
        ) : hairdressers.length === 0 ? (
          <div className="text-center py-12" data-testid="no-results">
            <p className="text-muted-foreground">
              No sweethearts found matching your criteria.
            </p>
          </div>
        ) : (
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            data-testid="hairdressers-grid"
          >
            {hairdressers.map((hairdresser: HairdresserWithLocation) => (
              <HairdresserCard key={hairdresser.id} hairdresser={hairdresser} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
