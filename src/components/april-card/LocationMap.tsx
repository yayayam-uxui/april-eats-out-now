
import React from 'react';
import { MapIcon } from "lucide-react";

interface LocationMapProps {
  mapUrl: string;
  name: string;
  city: string;
  mapEmbedUrl: string | null;
}

const LocationMap: React.FC<LocationMapProps> = ({ mapUrl, name, city, mapEmbedUrl }) => {
  return (
    <div className="april-map-container relative mb-6">
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
          
          {/* Add a larger clickable area that opens the map in a new tab */}
          <a 
            href={mapUrl} 
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`פתח מפה ל${name} בגוגל מפות`}
            className="absolute inset-0 z-30 cursor-pointer"
          >
            <span className="sr-only">פתח במפות</span>
          </a>
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
