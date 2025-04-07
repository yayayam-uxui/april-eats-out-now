
import React from 'react';
import { Instagram, MapPin, Share2, Globe } from "lucide-react";
import { Restaurant } from '@/types/restaurant';

interface SocialLinksProps {
  restaurant: Restaurant;
  onShare: () => void;
}

const SocialLinks: React.FC<SocialLinksProps> = ({ restaurant, onShare }) => {
  return (
    <div className="flex justify-start gap-3 mb-6">
      {restaurant.instagram && (
        <a 
          href={restaurant.instagram.startsWith('http') ? restaurant.instagram : `https://www.instagram.com/${restaurant.instagram}`} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="april-social-button"
          aria-label="אינסטגרם"
        >
          <Instagram size={20} />
        </a>
      )}
      
      {restaurant.website && (
        <a 
          href={restaurant.website.startsWith('http') ? restaurant.website : `https://${restaurant.website}`}
          target="_blank" 
          rel="noopener noreferrer"
          className="april-social-button"
          aria-label="אתר"
        >
          <Globe size={20} />
        </a>
      )}
      
      {restaurant.maps && (
        <a 
          href={restaurant.maps} 
          target="_blank" 
          rel="noopener noreferrer"
          className="april-social-button"
          aria-label="גוגל מפות"
        >
          <MapPin size={20} />
        </a>
      )}

      {/* Make sure Wolt link appears even if the string is just "יש" or other positive values */}
      {(restaurant.wolt || (restaurant.delivery && 
         restaurant.delivery.toLowerCase() !== "אין" && 
         restaurant.delivery.toLowerCase() !== "לא")) && (
        <a 
          href={restaurant.wolt || "https://wolt.com"} 
          target="_blank" 
          rel="noopener noreferrer"
          className="april-social-button"
          aria-label="וולט"
        >
          <img 
            src="/lovable-uploads/43877453-7d1d-4a27-9c68-857d2a48b56e.png" 
            alt="Wolt" 
            className="w-5 h-5"
          />
        </a>
      )}

      <button 
        onClick={onShare}
        className="april-social-button"
        aria-label="שתף"
      >
        <Share2 size={20} />
      </button>
    </div>
  );
};

export default SocialLinks;
