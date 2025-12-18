import { useState, useEffect, useMemo, useRef } from "react";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { ChevronDown, ChevronUp, Loader2, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.jsx";
import { KENYA_LOCATIONS } from "@/data/kenya-locations.js";
import { HAIR_SERVICES, ORIENTATIONS } from "@/data/kenya-locations.js";
import { AnimatePresence, motion } from "framer-motion";

interface SearchFiltersProps {
  onSearch: (filters: {
    town?: string;
    estate?: string;
    subEstate?: string;
    type?: string;
    maxPrice?: number;
    search?: string;
    orientation?: string;
  }) => void;
}

const SLIDES = [
  {
    image:
      "https://i0.wp.com/exotickenya.date/wp-content/uploads/2017/01/11185929753_3303300733_b.jpg?resize=1200%2C800&ssl=1",
    title: "Discover Trusted Companions",
    subtitle:
      "From relaxing massages to city tours, find the right match for your needs.",
  },
  {
    image:
      "https://www.shutterstock.com/image-photo/fit-athletic-african-american-woman-600nw-2346908027.jpg",
    title: "More Than Just Encounters",
    subtitle:
      "Connect with professionals offering unique skills and experiences.",
  },
  {
    image:
      "https://i.pinimg.com/originals/e8/1a/fc/e81afce6353fd42fcfa27c0bb275ff7e.jpg",
    title: "Tailored For You",
    subtitle:
      "Whether for companionship, guidance, or leisure, the choice is yours.",
  },
];

export default function SearchFilters({ onSearch }: SearchFiltersProps) {
  const [town, setTown] = useState("all");
  const [estate, setEstate] = useState("all");
  const [subEstate, setSubEstate] = useState("all");
  const [service, setService] = useState("all");
  const [orientation, setOrientation] = useState("all");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const [showMore, setShowMore] = useState(false);

  // Slideshow state
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 6000); // change every 6s
    return () => clearInterval(interval);
  }, []);

  const majorTowns = [
    "Nairobi",
    "Mombasa",
    "Kisumu",
    "Ukunda-Diani",
    "Malindi",
    "Mtwapa",
    "Kilifi",
  ];

  const allTowns = useMemo(() => {
    const towns = KENYA_LOCATIONS.flatMap((loc) =>
      loc.towns.map((t) => t.name)
    );
    const major = majorTowns.filter((m) => towns.includes(m));
    const other = towns.filter((t) => !majorTowns.includes(t)).sort();
    return { major, other: other };
  }, []);

  const estates = useMemo(() => {
    if (town === "all") return [];
    const found = KENYA_LOCATIONS.flatMap((loc) => loc.towns).find(
      (t) => t.name === town
    );
    return found?.estates?.map((e) => e.name) || [];
  }, [town]);

  const subEstates = useMemo(() => {
    if (town === "all" || estate === "all") return [];
    const foundTown = KENYA_LOCATIONS.flatMap((loc) => loc.towns).find(
      (t) => t.name === town
    );
    if (!foundTown) return [];
    const foundEstate = foundTown.estates?.find((e) => e.name === estate);
    return foundEstate?.subEstates?.map((s) => s.name) || [];
  }, [town, estate]);

  const handleSearch = () => {
    setIsLoading(true);
    const filters: any = {};
    if (town !== "all") {
      const townObj = KENYA_LOCATIONS.flatMap((loc) => loc.towns).find(
        (t) => t.name === town
      );
      if (townObj) filters.townId = townObj.id;
    }
    if (estate !== "all" && town !== "all") {
      const townObj = KENYA_LOCATIONS.flatMap((loc) => loc.towns).find(
        (t) => t.name === town
      );
      const estateObj = townObj?.estates?.find((e) => e.name === estate);
      if (estateObj) filters.estateId = estateObj.id;
    }
    if (subEstate !== "all" && estate !== "all") {
      const townObj = KENYA_LOCATIONS.flatMap((loc) => loc.towns).find(
        (t) => t.name === town
      );
      const estateObj = townObj?.estates?.find((e) => e.name === estate);
      const subEstateObj = estateObj?.subEstates?.find(
        (s) => s.name === subEstate
      );
      if (subEstateObj) filters.subEstateId = subEstateObj.id;
    }
    if (service !== "all") filters.service = service;
    if (orientation !== "all") filters.orientation = orientation;
    if (search.trim()) filters.search = search.trim();

    onSearch(filters);

    setTimeout(() => {
      setIsLoading(false);
      if (filterRef.current) {
        const offsetTop =
          filterRef.current.getBoundingClientRect().bottom + window.scrollY;
        window.scrollTo({ top: offsetTop, behavior: "smooth" });
      }
    }, 500);
  };

  const handleReset = () => {
    setTown("all");
    setEstate("all");
    setSubEstate("all");
    setService("all");
    setOrientation("all");
    setSearch("");
    onSearch({});
  };

  const hasActiveFilters =
    town !== "all" ||
    estate !== "all" ||
    subEstate !== "all" ||
    service !== "all" ||
    orientation !== "all" ||
    search.trim().length > 0;

  return (
    <div
      ref={filterRef}
      className="relative min-h-[80vh] md:min-h-screen flex items-center overflow-hidden"
    >
      {/* Background slideshow */}
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${SLIDES[currentSlide].image})` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Content on top */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-10 md:py-20 w-full grid grid-cols-2 md:grid-cols-2 gap-2 items-center">
        {/* Filters Box */}
        <div className="bg-white/15 grid backdrop-blur-md rounded-2xl shadow-2xl p-4 md:p-6 w-full">
          {/* Town Dropdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
            <div className="space-y-1 sm:space-y-2 text-black">
              <Label>Town</Label>
              <Select
                value={town}
                onValueChange={(value) => {
                  setTown(value);
                  setEstate("all");
                  setSubEstate("all");
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Town" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Towns</SelectItem>
                  {allTowns.major.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                  {allTowns.other.length > 0 && (
                    <>
                      <hr className="my-1" />
                      {allTowns.other.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Estate Dropdown */}
            <div className="space-y-1 sm:space-y-2 text-black">
              <Label>Estate</Label>
              <Select
                value={estate}
                onValueChange={(value) => {
                  setEstate(value);
                  setSubEstate("all");
                }}
                disabled={town === "all"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Estate" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Estates</SelectItem>
                  {estates.map((e) => (
                    <SelectItem key={e} value={e}>
                      {e}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sub-Estate Dropdown */}
            <AnimatePresence>
              {subEstates.length > 0 && (
                <motion.div
                  className="space-y-1 sm:space-y-2 text-black"
                  key="sub-estate"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Label>Sub-Estate</Label>
                  <Select
                    value={subEstate}
                    onValueChange={(value) => {
                      setSubEstate(value);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Sub-Estate" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sub-Estates</SelectItem>
                      {subEstates.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile toggle */}
          <div className="md:hidden mb-4">
            <button
              onClick={() => setShowMore((prev) => !prev)}
              className="flex items-center justify-center w-full text-sm font-medium py-2 bg-black/30 rounded-lg text-white"
            >
              {showMore ? (
                <>
                  Hide Extra Filters <ChevronUp className="ml-2 w-4 h-4" />
                </>
              ) : (
                <>
                  Show More Filters <ChevronDown className="ml-2 w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {/* Mobile extra filters */}
          {showMore && (
            <div className="grid grid-cols-1 gap-4 mb-6 md:hidden">
              <div className="space-y-1 sm:space-y-2 text-black">
                <Label>Service</Label>
                <Select
                  value={service}
                  onValueChange={(value) => setService(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Services" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Services</SelectItem>
                    {HAIR_SERVICES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1 sm:space-y-2 text-black">
                <Label>Orientation</Label>
                <Select
                  value={orientation}
                  onValueChange={(value) => setOrientation(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sexual Orientation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Orientation</SelectItem>
                    {ORIENTATIONS.map((h) => (
                      <SelectItem key={h} value={h}>
                        {h}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Desktop extra filters */}
          <div className="hidden md:grid md:grid-cols-w gap-4 md:gap-6 mb-6">
            <div className="space-y-1 sm:space-y-2 text-black">
              <Label>Service</Label>
              <Select
                value={service}
                onValueChange={(value) => setService(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Services" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Services</SelectItem>
                  {HAIR_SERVICES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1 sm:space-y-2 text-black">
              <Label>Orientation</Label>
              <Select
                value={orientation}
                onValueChange={(value) => setOrientation(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sexual Orientation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Orientation</SelectItem>
                  {ORIENTATIONS.map((h) => (
                    <SelectItem key={h} value={h}>
                      {h}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Search */}
          <div className="mb-6 text-black">
            <Label>Search</Label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder="Search by title, description, or location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />{" "}
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5 mr-2" /> Search
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Reset */}
          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={handleReset}
              className="bg-primary"
              disabled={!hasActiveFilters}
            >
              Reset
            </Button>
          </div>
        </div>

        {/* Slide text */}
        <div className="text-center md:text-right md:pl-12 text-white">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 1 }}
            >
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
                {SLIDES[currentSlide].title}
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl opacity-90 drop-shadow-md">
                {SLIDES[currentSlide].subtitle}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
