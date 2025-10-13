// Kenya locations data structure
export interface LocationData {
  counties: {
    id: number;
    name: string;
    code: string;
  }[];
}

// This would be populated from the API, but here's the structure
export const KENYA_LOCATIONS: LocationData = {
  counties: [
    { id: 1, name: "Nairobi", code: "047" },
    { id: 2, name: "Mombasa", code: "001" },
    { id: 3, name: "Kisumu", code: "042" },
    { id: 4, name: "Nakuru", code: "032" },
    { id: 5, name: "Kiambu", code: "022" },
    { id: 6, name: "Machakos", code: "016" },
    { id: 7, name: "Kajiado", code: "034" },
  ],
};

export const HAIR_SERVICES = [
  "Raw BJ",
  "BJ",
  "COB(Cum On Body)",
  "COF(Cum On Face)",
  "Cum In Mouth",
  "ThreeSome",
  "Raw Pussy",
  "Cum On Tits",
  "OWC(Oral Without Condom)",
];
