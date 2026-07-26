import { Restaurant, Restaurants } from "../types/restaurant";
import { characterFor } from "../lib/characters";
import bundled from "../data/restaurants.json";

// April's notebook: a public Google Sheet, read through OpenSheet.
// Every row is a restaurant; columns are in Hebrew, exactly as Yam writes them.
const SHEET_URL = "https://opensheet.elk.sh/1h1IIi8Ns3j8z2VoLs6Hr-3yl58LV3PhevL_qIKNU8SY/1";

// The bundled dataset (July 2026) is corrected and richer than the sheet:
// closed places removed, poses/quotes filled, 19 new verified places added.
// Flip to true AFTER the sheet is synced with this data — then the sheet is
// the live source again and the bundle becomes the offline fallback.
const USE_SHEET = false;

// Sheet placeholders that mean "nothing here" (אין / - / empty).
const clean = (v: unknown): string => {
  const s = String(v ?? "").trim();
  if (!s || s === "אין" || s === "-") return "";
  return s;
};

export async function getAllRestaurants(): Promise<Restaurants> {
  if (USE_SHEET) {
    try {
      const response = await fetch(SHEET_URL);
      if (!response.ok) {
        throw new Error(`Sheet fetch failed: ${response.status}`);
      }
      return mapRows(await response.json());
    } catch (error) {
      console.error("Sheet unreachable, serving bundled data:", error);
    }
  }
  return mapRows(bundled);
}

function mapRows(rawData: any[]): Restaurants {
  // Rows without a name are trailing empties — skip them.
  return rawData
      .filter((item: any) => clean(item["שם המקום"]).length > 0)
      .map((item: any) => {
        const category = clean(item["קטגוריה"]);
        const drySeries = clean(item["קטגוריה יבשה ?"]);
        const whenToGo = clean(item["מתי ללכת?"]);
        const tags = clean(item["תגיות"]);
        const character = characterFor(
          clean(item["שם תמונה מתאימה"]),
          drySeries,
          category,
          whenToGo,
          tags,
          clean(item["שם המקום"])
        );

        // A restaurant photo is shown only when the sheet holds a real URL —
        // anything else was a character-image name and just duplicated April.
        const imageValue = clean(item["שם תמונה מתאימה"]);
        const image = /^https?:\/\//.test(imageValue) ? imageValue : "";

        return {
          name: clean(item["שם המקום"]),
          address: clean(item["כתובת (אופציונלי)"]),
          instagram: clean(item["לינק לאינסטגרם"]),
          maps: clean(item["לינק לגוגל מפות"]),
          // Column is "לינק וולט"; older sheets said "לינק לוולט".
          wolt: clean(item["לינק וולט"] || item["לינק לוולט"]),
          delivery: clean(item["משלוחים?"]) || "לא",
          category: category || "default",
          tags,
          openingHours: "",
          whenToGo,
          aprilQuote: clean(item["משפט"]) || fallbackQuote(category, drySeries),
          character: character.key,
          characterSrc: character.src,
          characterAlt: character.alt,
          city: clean(item["עיר"]),
          image,
          website: clean(item["אתר"]),
          orderLink: clean(item["לינק להזמנות - לא וולט"]),
        };
      });
}

// Sassy defaults for rows where the משפט column is empty.
function fallbackQuote(category: string, drySeries: string): string {
  const cat = `${category} ${drySeries}`.toLowerCase();
  if (/קפה|cafe|מאפיה|bakery/.test(cat)) {
    return "מקום קפה קטן ושווה. תזמיני משהו מתוק וקחי רגע לעצמך 🍑";
  }
  if (/בורגר|burger/.test(cat)) {
    return "בורגר רציני, צ'יפס שמבקש עוד. את יודעת מה לעשות 🍔";
  }
  if (/אסייתי|asian|נודל|סושי|רמן/.test(cat)) {
    return "מנה אסייתית שתחמם ותתבל את היום. תזמיני משהו חריף 🍜";
  }
  if (/קוקטייל|cocktail|בר|wine/.test(cat)) {
    return "מקום עם משקאות שכדאי להכיר. שבי ליד הבר 🍸";
  }
  if (/שף|fancy|gourmet/.test(cat)) {
    return "מסעדה ששווה לפנק בה את עצמך. תזמיני יין ותעצמי עיניים 🍷";
  }
  return "מקום שאני אוהבת. תני לו צ'אנס, את לא תתאכזבי 🍑";
}

export const restaurantKey = (r: Restaurant) => `${r.name}|${r.city}`;

/**
 * Pick a random restaurant, avoiding everything in `exclude` until the pool
 * (for the selected city) is exhausted — so tapping "מקום אחר" never shows
 * the same place twice in a row, or at all until April ran out of ideas.
 */
export function pickRestaurant(
  restaurants: Restaurants,
  city: string | undefined,
  exclude: Set<string>
): { restaurant: Restaurant | null; poolExhausted: boolean } {
  const pool = city ? restaurants.filter((r) => r.city === city) : restaurants;
  if (pool.length === 0) return { restaurant: null, poolExhausted: false };

  const fresh = pool.filter((r) => !exclude.has(restaurantKey(r)));
  const candidates = fresh.length > 0 ? fresh : pool;
  const pick = candidates[Math.floor(Math.random() * candidates.length)];
  return { restaurant: pick, poolExhausted: fresh.length === 0 };
}

export function getAllCities(restaurants: Restaurants): string[] {
  const cities = new Set<string>();
  restaurants.forEach((r) => {
    if (r.city) cities.add(r.city);
  });
  return Array.from(cities).sort();
}
