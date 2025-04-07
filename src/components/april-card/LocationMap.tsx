
import React, { useEffect, useState } from 'react';
import { MapIcon } from "lucide-react";

interface LocationMapProps {
  mapUrl: string;
  name: string;
  city: string;
}

const LocationMap: React.FC<LocationMapProps> = ({ mapUrl, name, city }) => {
  // State for map URL
  const [mapEmbedUrl, setMapEmbedUrl] = useState<string | null>(null);
  
  // Extract and construct Google Maps embed URL
  useEffect(() => {
    if (mapUrl) {
      try {
        // Attempt to extract location data from Google Maps URL
        const url = new URL(mapUrl);
        const params = new URLSearchParams(url.search);
        
        // For URLs with query parameters (most common format)
        if (params.has('q') || params.has('query')) {
          const query = params.get('q') || params.get('query') || '';
          setMapEmbedUrl(`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(query)}`);
        }
        // For URLs with place IDs
        else if (mapUrl.includes('/place/')) {
          const placeMatch = mapUrl.match(/\/place\/([^\/]+)/);
          if (placeMatch && placeMatch[1]) {
            setMapEmbedUrl(`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(placeMatch[1])}`);
          } else {
            // If we can't extract place ID, use restaurant name and city as fallback
            const searchQuery = `${name} ${city}`.trim();
            setMapEmbedUrl(`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(searchQuery)}`);
          }
        }
        // Fallback to restaurant name and address
        else {
          const searchQuery = `${name} ${city}`.trim();
          setMapEmbedUrl(`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(searchQuery)}`);
        }
      } catch (err) {
        console.error('Error parsing maps URL:', err);
        // Fallback to restaurant name and city
        const searchQuery = `${name} ${city}`.trim();
        setMapEmbedUrl(`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(searchQuery)}`);
      }
    }
  }, [mapUrl, name, city]);

  return (
    <div className="april-map-container relative">
      {mapEmbedUrl ? (
        <div className="relative w-full h-full">
          <iframe
            title={`מפה ל${name}`}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            src={mapEmbedUrl}
            className="relative z-10"
          ></iframe>
          <div className="absolute inset-0 bg-april-fuchsia opacity-20 pointer-events-none z-20"></div>
        </div>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center text-april-fuchsia">
          <MapIcon size={32} />
          <span className="mt-2">טוען מפה...</span>
        </div>
      )}
    </div>
  );
};

export default LocationMap;
