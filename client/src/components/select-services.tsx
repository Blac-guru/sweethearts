import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, ChevronDown } from "lucide-react";
import { useState } from "react";

const HAIR_SERVICES = [
  "Girlfriend experience",
  "Dinner Date",
  "Trip partner",
  "Massage",
  "Lesbian Show",
  "Rimming",
  "Blow job",
  "3 Some",
];

export default function ServicesDropdown({
  value,
  onChange,
}: {
  value: string[];
  onChange: (val: string[]) => void;
}) {
  const toggleService = (service: string) => {
    if (value.includes(service)) {
      onChange(value.filter((s) => s !== service));
    } else {
      onChange([...value, service]);
    }
  };

  return (
    <div className="space-y-3">
      {/* Selected services shown as badges */}
      <div className="flex flex-wrap gap-2">
        {value.map((service) => (
          <Badge
            key={service}
            variant="secondary"
            className="flex items-center gap-1"
          >
            {service}
            <button
              type="button"
              onClick={() => toggleService(service)}
              className="ml-1 hover:text-destructive"
            >
              <X size={14} />
            </button>
          </Badge>
        ))}
      </div>

      {/* Dropdown with searchable services */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="w-full justify-between"
          >
            {value.length > 0
              ? `${value.length} service${value.length > 1 ? "s" : ""} selected`
              : "Select services"}
            <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-[250px] p-2">
          <Command>
            <CommandInput placeholder="Search services..." />
            <CommandList>
              <CommandEmpty>No services found.</CommandEmpty>
              <CommandGroup>
                {HAIR_SERVICES.map((service) => (
                  <CommandItem
                    key={service}
                    onSelect={() => toggleService(service)}
                    className="cursor-pointer"
                  >
                    <div
                      className={`mr-2 h-4 w-4 rounded border flex items-center justify-center ${
                        value.includes(service)
                          ? "bg-primary text-white"
                          : "opacity-50"
                      }`}
                    >
                      {value.includes(service) && "✓"}
                    </div>
                    {service}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
