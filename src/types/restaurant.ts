
export interface Restaurant {
  name: string;
  address: string;
  instagram: string;
  maps: string;
  delivery: "כן" | "לא";
  category: "burger" | "drink" | "coffee" | "noodles" | "default" | "wolt" | "fancy" | "crystal" | "grill" | "regular";
  tags: string;
  openingHours: string;
  whenToGo: string;
  aprilQuote: string;
  character: string;
  city: string;
}

export type Restaurants = Restaurant[];
