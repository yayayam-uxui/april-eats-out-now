
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
      // Extract image filename from the sheet and log it for debugging
      const imageFileName = item["שם תמונה מתאימה"] || "";
      console.log(`Restaurant ${item["שם המקום"]} - Image filename:`, imageFileName);
      
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
        image: imageFileName,  // Store the raw image filename exactly as it appears in the sheet
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
    "beta": "/lovable-uploads/bdcca772-60da-46da-8de8-2b388085ef94.png",       // Added without extension
    // New mappings for April images
    "bbq_april": "/lovable-uploads/d900efb1-bb87-41f3-ba74-7042158c507b.png",
    "burger_april": "/lovable-uploads/cc012936-bcba-403f-9524-4d1defb9d5b5.png",
    "cafe_april": "/lovable-uploads/85b09cf2-41e8-4dab-a03c-94b7b81d00b8.png",
    "cocktail_april": "/lovable-uploads/902d3945-6236-4cb2-b4e0-a9fae144a8cb.png",
    "crystal_april": "/lovable-uploads/a3434e13-b2af-4b4a-9936-f743970f15c0.png",
    "fancy_april": "/lovable-uploads/7f8a0789-f4b4-4fca-b48f-102a60c2491c.png",
    "noodle_april": "/lovable-uploads/852d3b43-f8b7-4306-900e-7be840ab4c38.png",
    "scooter_april": "/lovable-uploads/11708440-3f90-40f6-a95b-c5d5e5a1fa4d.png",
    "surprise_april": "/lovable-uploads/1357226a-3fd2-4d3f-99b4-418598b4925f.png",
    "wink_april": "/lovable-uploads/b7fb9ba8-3676-4eac-95f1-1e4ce6111ed1.png",
    "wine_april": "/lovable-uploads/cf032c4c-3aef-4c3f-8ac8-414c3df52ac5.png",
    "yes_april": "/lovable-uploads/4b2217e2-65cf-4ded-80df-2beb0fb67395.png"
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
