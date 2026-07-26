interface MapHandlerProps {
  mapUrl: string;
  name: string;
  city: string;
}

// Google's public Maps Embed demo key (from their own docs samples). The Embed
// API is free; set VITE_GOOGLE_MAPS_API_KEY to use a project-owned key instead.
const FALLBACK_KEY = "AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8";

// Builds a Maps Embed API URL for the restaurant. Returns null when there's
// nothing to search for.
const MapHandler = ({ mapUrl, name, city }: MapHandlerProps): string | null => {
  if (!mapUrl && !name) return null;

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || FALLBACK_KEY;
  const embed = (query: string) =>
    `https://www.google.com/maps/embed/v1/place?key=${apiKey}&language=he&q=${encodeURIComponent(query)}`;

  try {
    if (mapUrl) {
      const url = new URL(mapUrl);
      const params = new URLSearchParams(url.search);
      const q = params.get("q") || params.get("query");
      if (q) return embed(q);

      // /place/<name>/ URLs carry the place name in the path
      const placeMatch = mapUrl.match(/\/place\/([^\/]+)/);
      if (placeMatch?.[1]) return embed(decodeURIComponent(placeMatch[1]));
    }
  } catch {
    // Short links (g.co/kgs/...) don't parse — fall through to name search
  }

  return embed(`${name} ${city}`.trim());
};

export default MapHandler;
