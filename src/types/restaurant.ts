
export interface Restaurant {
  name: string;
  address: string;
  instagram: string;
  maps: string;
  delivery: string;
  category: string;
  tags: string;
  openingHours: string;
  whenToGo: string;
  aprilQuote: string;
  character: string;
  city: string;
  image?: string;
  wolt?: string;
  website?: string;
  orderLink?: string; // New field for non-Wolt order links
}

export type Restaurants = Restaurant[];
