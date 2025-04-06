
import { Restaurant, Restaurants } from "../types/restaurant";

const SHEET_URL = "https://opensheet.elk.sh/1h1IIi8Ns3j8z2VoLs6Hr-3yl58LV3PhevL_qIKNU8SY/Sheet1";

export async function getAllRestaurants(): Promise<Restaurants> {
  try {
    const response = await fetch(SHEET_URL);
    if (!response.ok) {
      throw new Error("Failed to fetch restaurant data");
    }
    const data = await response.json();
    return data as Restaurants;
  } catch (error) {
    console.error("Error fetching restaurant data:", error);
    return [];
  }
}

export function getRandomRestaurant(restaurants: Restaurants): Restaurant | null {
  if (restaurants.length === 0) {
    return null;
  }
  const randomIndex = Math.floor(Math.random() * restaurants.length);
  return restaurants[randomIndex];
}

export function getCharacterImage(category: string): string {
  switch (category) {
    case "burger":
      return "/images/burger.png";
    case "drink":
      return "/images/drink.png";
    case "coffee":
      return "/images/coffee.png";
    case "noodles":
      return "/images/noodles.png";
    default:
      return "/images/default.png";
  }
}
