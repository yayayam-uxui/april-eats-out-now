
import React from 'react';
import { Instagram, MapPin, Share2, Globe, Package } from "lucide-react";
import { Restaurant } from '@/types/restaurant';

interface SocialLinksProps {
  restaurant: Restaurant;
  onShare: () => void;
}

const SocialLinks: React.FC<SocialLinksProps> = ({ restaurant, onShare }) => {
  return (
    <div className="flex justify-start gap-3 mb-6 flex-wrap">
      {restaurant.instagram && (
        <a 
          href={restaurant.instagram.startsWith('http') ? restaurant.instagram : `https://www.instagram.com/${restaurant.instagram}`} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="april-social-button w-12 h-12 flex items-center justify-center"
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
          className="april-social-button w-12 h-12 flex items-center justify-center"
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
          className="april-social-button w-12 h-12 flex items-center justify-center"
          aria-label="גוגל מפות"
        >
          <MapPin size={20} />
        </a>
      )}

      {/* Wolt delivery link with custom W image */}
      {(restaurant.wolt || (restaurant.delivery && 
         restaurant.delivery.toLowerCase() !== "אין" && 
         restaurant.delivery.toLowerCase() !== "לא")) && (
        <a 
          href={restaurant.wolt || "https://wolt.com"} 
          target="_blank" 
          rel="noopener noreferrer"
          className="april-social-button w-12 h-12 flex items-center justify-center"
          aria-label="וולט"
        >
          {/* Custom Wolt "W" image */}
          <img 
            src="/lovable-uploads/0420bfa1-b2a7-4774-b93b-bb0eb577d4db.png" 
            alt="W" 
            className="w-5 h-5 object-contain"
          />
        </a>
      )}

      {/* Button for other order links */}
      {restaurant.orderLink && (
        <a 
          href={restaurant.orderLink.startsWith('http') ? restaurant.orderLink : `https://${restaurant.orderLink}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="april-social-button w-12 h-12 flex items-center justify-center"
          aria-label="הזמנות"
        >
          <Package size={20} />
        </a>
      )}

      <button 
        onClick={onShare}
        className="april-social-button w-12 h-12 flex items-center justify-center"
        aria-label="שתף"
      >
        <Share2 size={20} />
      </button>
    </div>
  );
};

export default SocialLinks;
