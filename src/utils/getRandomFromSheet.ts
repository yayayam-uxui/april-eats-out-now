
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
    const rawData = await response.json();
    console.log("Successfully fetched data:", rawData);
    
    // Transform the raw data into our Restaurant type
    const restaurants: Restaurants = rawData.map((item: any) => {
      // Log Wolt data for debugging
      console.log(`Restaurant ${item["שם המקום"]} - Wolt link:`, item["לינק לוולט"]);
      
      return {
        name: item["שם המקום"] || "",
        address: item["כתובת (אופציונלי)"] || "",
        instagram: item["לינק לאינסטגרם"] || "",
        maps: item["לינק לגוגל מפות"] || "",
        wolt: item["לינק לוולט"] || "",
        delivery: item["משלוחים?"] || "לא",
        category: item["קטגוריה"] || "default",
        tags: item["תגיות"] || "",
        openingHours: "",  // Not available in the source data
        whenToGo: item["מתי ללכת?"] || "",
        aprilQuote: item["משפט"] || "",
        character: item["תמונה מתאימה"] || "default.png",
        city: item["עיר"] || "",
        image: item["שם תמונה מתאימה"] || "default.png",
        website: item["אתר"] || "",
        orderLink: item["לינק להזמנות - לא וולט"] || ""
      };
    });
    
    console.log("Transformed restaurant data:", restaurants);
    return restaurants;
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

export function getCharacterImage(characterName: string): string {
  // Match character name to uploaded images - with improved handling
  if (!characterName) {
    console.log("No character name provided, using default");
    return "/lovable-uploads/bdcca772-60da-46da-8de8-2b388085ef94.png"; // Default April
  }
  
  characterName = characterName.trim().toLowerCase(); // Normalize to lowercase for case-insensitive matching
  console.log("Getting character image for:", characterName);
  
  // Map of character identifiers to their image paths
  const characterMap: Record<string, string> = {
    "thinking.png": "/lovable-uploads/bdcca772-60da-46da-8de8-2b388085ef94.png",
    "thinking": "/lovable-uploads/bdcca772-60da-46da-8de8-2b388085ef94.png",
    "wink.png": "/lovable-uploads/04e3a1b3-5de7-4c46-93cf-a09537c3064c.png",
    "wink": "/lovable-uploads/04e3a1b3-5de7-4c46-93cf-a09537c3064c.png",
    "cafe_baked_goods.png": "/lovable-uploads/b991275a-ed8d-47b2-a8fb-afe392ab24b4.png",
    "cafe": "/lovable-uploads/b991275a-ed8d-47b2-a8fb-afe392ab24b4.png",
    "baked_goods": "/lovable-uploads/b991275a-ed8d-47b2-a8fb-afe392ab24b4.png",
    "burger.png": "/lovable-uploads/7ebf112b-555f-4a38-bd16-d53ed8fac45f.png",
    "burger": "/lovable-uploads/7ebf112b-555f-4a38-bd16-d53ed8fac45f.png",
    "wolter.png": "/lovable-uploads/09a70519-ae80-4625-b5a6-5abd495ec6f8.png",
    "wolter": "/lovable-uploads/09a70519-ae80-4625-b5a6-5abd495ec6f8.png",
    "scooter.png": "/lovable-uploads/09a70519-ae80-4625-b5a6-5abd495ec6f8.png",
    "scooter": "/lovable-uploads/09a70519-ae80-4625-b5a6-5abd495ec6f8.png",
    "drink.png": "/lovable-uploads/04e3a1b3-5de7-4c46-93cf-a09537c3064c.png",
    "drink": "/lovable-uploads/04e3a1b3-5de7-4c46-93cf-a09537c3064c.png",
    "fancy.png": "/lovable-uploads/04e3a1b3-5de7-4c46-93cf-a09537c3064c.png",
    "fancy": "/lovable-uploads/04e3a1b3-5de7-4c46-93cf-a09537c3064c.png",
    "crystal.png": "/lovable-uploads/34184948-4bc8-4a28-9f22-7f995fc6506a.png",
    "crystal": "/lovable-uploads/34184948-4bc8-4a28-9f22-7f995fc6506a.png",
    "noodles.png": "/lovable-uploads/3b19f7ea-541e-430c-bdd8-4cd065f40397.png",
    "noodles": "/lovable-uploads/3b19f7ea-541e-430c-bdd8-4cd065f40397.png",
    "bbq.png": "/lovable-uploads/62085b43-4555-4809-afc3-4a1c195c8c3c.png",
    "bbq": "/lovable-uploads/62085b43-4555-4809-afc3-4a1c195c8c3c.png",
    "default.png": "/lovable-uploads/bdcca772-60da-46da-8de8-2b388085ef94.png",
    "default": "/lovable-uploads/bdcca772-60da-46da-8de8-2b388085ef94.png",
    "beta.png": "/lovable-uploads/bdcca772-60da-46da-8de8-2b388085ef94.png",  // Added for Beta cafe
    "beta": "/lovable-uploads/bdcca772-60da-46da-8de8-2b388085ef94.png"       // Added without extension
  };

  // Check if we have a mapping for this character
  if (characterMap[characterName]) {
    console.log("Found character image:", characterName, "->", characterMap[characterName]);
    return characterMap[characterName];
  }
  
  // If not found in our map, log it and return default
  console.log("Character image not found:", characterName, "Using default instead");
  return "/lovable-uploads/bdcca772-60da-46da-8de8-2b388085ef94.png"; // Default April
}
