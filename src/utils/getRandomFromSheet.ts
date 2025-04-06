
import { Restaurant, Restaurants } from "../types/restaurant";

// Updated with a more specific sheet URL format
const SHEET_URL = "https://opensheet.elk.sh/1h1IIi8Ns3j8z2VoLs6Hr-3yl58LV3PhevL_qIKNU8SY/1";

export async function getAllRestaurants(): Promise<Restaurants> {
  try {
    console.log("Fetching from:", SHEET_URL);
    const response = await fetch(SHEET_URL);
    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error:", errorText);
      throw new Error("Failed to fetch restaurant data");
    }
    const data = await response.json();
    console.log("Successfully fetched data:", data);
    return data as Restaurants;
  } catch (error) {
    console.error("Error fetching restaurant data:", error);
    return [];
  }
}

export function getRandomRestaurant(restaurants: Restaurants, selectedCity?: string): Restaurant | null {
  if (restaurants.length === 0) {
    return null;
  }
  
  // Filter by city if provided
  const filteredRestaurants = selectedCity 
    ? restaurants.filter(restaurant => restaurant.city === selectedCity)
    : restaurants;
    
  // If no restaurants match the filter, return null
  if (filteredRestaurants.length === 0) {
    return null;
  }
  
  const randomIndex = Math.floor(Math.random() * filteredRestaurants.length);
  return filteredRestaurants[randomIndex];
}

export function getAllCities(restaurants: Restaurants): string[] {
  // Extract unique cities from restaurant data
  const cities = new Set<string>();
  
  restaurants.forEach(restaurant => {
    if (restaurant.city) {
      cities.add(restaurant.city);
    }
  });
  
  return Array.from(cities).sort();
}

export function getCharacterImage(category: string): string {
  // Match category to uploaded images
  switch (category) {
    case "burger":
      return "/lovable-uploads/7ebf112b-555f-4a38-bd16-d53ed8fac45f.png"; // April with burger
    case "drink":
      return "/lovable-uploads/6ff257be-188d-4cd9-9e54-ab6571d57980.png"; // April with drink
    case "coffee":
      return "/lovable-uploads/b991275a-ed8d-47b2-a8fb-afe392ab24b4.png"; // April with coffee
    case "noodles":
      return "/lovable-uploads/3b19f7ea-541e-430c-bdd8-4cd065f40397.png"; // April with noodles
    case "wolt":
      return "/lovable-uploads/09a70519-ae80-4625-b5a6-5abd495ec6f8.png"; // April on scooter
    case "fancy":
      return "/lovable-uploads/04e3a1b3-5de7-4c46-93cf-a09537c3064c.png"; // April with drink/martini
    case "crystal":
      return "/lovable-uploads/34184948-4bc8-4a28-9f22-7f995fc6506a.png"; // April with crystal ball
    case "grill":
      return "/lovable-uploads/62085b43-4555-4809-afc3-4a1c195c8c3c.png"; // April with BBQ
    case "regular":
      return "/lovable-uploads/bdcca772-60da-46da-8de8-2b388085ef94.png"; // Regular April
    default:
      return "/lovable-uploads/704febbb-e3b1-404e-9a4d-0ba66ffbc511.png"; // Default April
  }
}
