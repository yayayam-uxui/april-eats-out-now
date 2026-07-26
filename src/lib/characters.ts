// April Kot's wardrobe — the single source of truth for every character pose.
//
// Every image lives in /public/characters/<key>.png with a name a human can
// read. The Google Sheet's "שם תמונה מתאימה" column accepts any alias below
// (Hebrew or English, with or without .png) — or can be left empty, and April
// picks a pose herself from the restaurant's category.

export interface Character {
  key: string;
  src: string;
  alt: string;
}

const pose = (key: string, alt: string): Character => ({
  key,
  src: `/characters/${key}.png`,
  alt,
});

export const CHARACTERS: Record<string, Character> = {
  toast: pose("toast", "אפריל קוט מרימה כוסית"),
  sassy: pose("sassy", "אפריל קוט עם מרטיני ומבט שובב"),
  wink: pose("wink", "אפריל קוט קורצת"),
  surprised: pose("surprised", "אפריל קוט מופתעת"),
  thinking: pose("thinking", "אפריל קוט מהרהרת"),
  excited: pose("excited", "אפריל קוט מתלהבת"),
  crystal: pose("crystal", "אפריל קוט עם כדור בדולח"),
  cafe: pose("cafe", "אפריל קוט בבית קפה עם מאפים"),
  burger: pose("burger", "אפריל קוט אוכלת בורגר"),
  noodles: pose("noodles", "אפריל קוט אוכלת נודלס"),
  bbq: pose("bbq", "אפריל קוט על האש"),
  scooter: pose("scooter", "אפריל קוט על קטנוע משלוחים"),
  // Generated poses — added as the wardrobe grows. Keys must match the file
  // names in /public/characters. Registered here only once the file exists.
  wine: pose("wine", "אפריל קוט עם כוס יין"),
  fancy: pose("fancy", "אפריל קוט עם מנת שף"),
  dessert: pose("dessert", "אפריל קוט עם גלידה"),
  pizza: pose("pizza", "אפריל קוט עם פיצה"),
  shakshuka: pose("shakshuka", "אפריל קוט עם מחבת שקשוקה"),
  hummus: pose("hummus", "אפריל קוט מנגבת חומוס"),
  sushi: pose("sushi", "אפריל קוט עם סושי"),
  seafood: pose("seafood", "אפריל קוט עם דגים ופירות ים"),
};

// Sheet-value aliases → pose key. Lowercased, ".png" stripped before lookup.
// Includes every name the old sheet ever used, so no row breaks.
const ALIASES: Record<string, string> = {
  // Legacy sheet values (and the poses they were always MEANT to show)
  cafe_baked_goods: "cafe",
  cafe_april: "cafe",
  baked_goods: "cafe",
  burger_april: "burger",
  noodle_april: "noodles",
  bbq_april: "bbq",
  wolter: "scooter",
  scooter_april: "scooter",
  cocktail_april: "toast",
  drink: "toast",
  wine_april: "wine",
  fancy_april: "fancy",
  crystal_april: "crystal",
  surprise_april: "surprised",
  wink_april: "wink",
  yes_april: "excited",
  beta: "cafe",
  // Hebrew — so the sheet can simply say "קפה" or "בורגר"
  "קפה": "cafe",
  "בית קפה": "cafe",
  "מאפים": "cafe",
  "בורגר": "burger",
  "נודלס": "noodles",
  "אסייתי": "noodles",
  "על האש": "bbq",
  "מנגל": "bbq",
  "קוקטייל": "toast",
  "כוסית": "toast",
  "יין": "wine",
  "פיצה": "pizza",
  "גלידה": "dessert",
  "קינוח": "dessert",
  "שף": "fancy",
  "שקשוקה": "shakshuka",
  "בוקר": "shakshuka",
  "חומוס": "hummus",
  "סושי": "sushi",
  "דגים": "seafood",
  "פירות ים": "seafood",
  "בר": "sassy",
  "קריצה": "wink",
  "הפתעה": "surprised",
  "חושבת": "thinking",
  "מתלהבת": "excited",
  "קסם": "crystal",
  "משלוחים": "scooter",
  "וולט": "scooter",
};

/** Resolve a sheet value ("cafe_baked_goods.png", "קפה", "wink") to a pose. */
export function resolveCharacter(sheetValue: string): Character | null {
  const raw = (sheetValue || "").trim().toLowerCase().replace(/\.png$/, "");
  if (!raw || raw === "default") return null;
  const key = CHARACTERS[raw] ? raw : ALIASES[raw];
  return key ? CHARACTERS[key] : null;
}

// When the sheet doesn't name a pose, infer one from what we know about the
// place. First match wins — ordered from most to least specific.
const INFERENCE_RULES: Array<{ test: RegExp; key: string }> = [
  { test: /יין|wine/, key: "wine" },
  { test: /קוקטייל|cocktail/, key: "toast" },
  { test: /\bבר\b|\bbar\b|לילה|night/, key: "sassy" },
  { test: /פיצה|pizza/, key: "pizza" },
  { test: /גלידה|קינוח|dessert|מתוק|שוקולד|עוגה/, key: "dessert" },
  { test: /שקשוקה|shakshuka/, key: "shakshuka" },
  { test: /חומוס|hummus|פלאפל|falafel|סטריט פוד|street food/, key: "hummus" },
  { test: /סושי|sushi/, key: "sushi" },
  { test: /דגים|פירות ים|seafood|fish|shrimp|שרימפס/, key: "seafood" },
  { test: /קפה|cafe|coffee|מאפי|bakery|בייקרי|קרואסון|בראנץ|בוקר|brunch/, key: "cafe" },
  { test: /בורגר|burger|המבורגר/, key: "burger" },
  { test: /אסיאתי|אסייתי|asian|נודל|ramen|רמן|noodle|יפני|תאילנדי|וייטנאמי|סיני|ווק/, key: "noodles" },
  { test: /על האש|מנגל|grill|bbq|בשרים|שיפוד|טאבון/, key: "bbq" },
  { test: /שף|fancy|gourmet|גורמה|יוקרת|fine dining|טעימות/, key: "fancy" },
  { test: /משלוח|delivery|wolt|וולט|טייק אווי|takeaway/, key: "scooter" },
];

// Poses that work for any restaurant — used when nothing else matches, chosen
// deterministically per restaurant so the same place always gets the same look.
const NEUTRAL_KEYS = ["thinking", "excited", "sassy", "wink", "crystal"];

function stableHash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/** Pick a pose for a restaurant: sheet value first, then category inference,
 *  then a stable per-restaurant neutral pose (never the same "default" for everyone). */
export function characterFor(
  sheetValue: string,
  ...signals: string[]
): Character {
  const named = resolveCharacter(sheetValue);
  if (named) return named;

  const haystack = signals.join(" ").toLowerCase();
  for (const { test, key } of INFERENCE_RULES) {
    if (test.test(haystack)) return CHARACTERS[key];
  }

  const neutral = NEUTRAL_KEYS[stableHash(haystack || "אפריל") % NEUTRAL_KEYS.length];
  return CHARACTERS[neutral];
}

export const DEFAULT_CHARACTER = CHARACTERS.thinking;
export const WELCOME_CHARACTER = CHARACTERS.toast;
export const LOADING_CHARACTER = CHARACTERS.crystal;
