
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
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19.59 12.87c.02-.11.04-.21.05-.32.05-.53-.07-1.04-.35-1.49-.22-.37-.53-.64-.9-.86-.26-.16-.55-.26-.86-.33-.22-.05-.45-.07-.68-.07h-5.49v1.55h5.49c.28 0 .54.08.77.24.22.15.36.36.42.62.05.27-.01.51-.16.73-.15.22-.36.36-.62.43-.1.02-.2.03-.3.03H13.5c-.37 0-.71.11-1 .32-.3.22-.49.51-.59.87-.09.37-.05.72.11 1.06.16.33.42.58.75.74.2.09.4.14.62.14h4.07c.35 0 .69-.06 1.02-.19.34-.13.62-.31.85-.57.26-.27.45-.59.55-.96.09-.31.12-.64.07-.97-.04-.31-.14-.6-.28-.87m-1.09.95c-.1.11-.22.18-.36.2-.02 0-.03 0-.05 0h-3.19c-.13 0-.22-.05-.29-.13-.08-.09-.09-.19-.07-.31.03-.11.09-.2.19-.25.09-.05.18-.07.27-.07h3.19c.13 0 .24.05.32.14.08.09.1.2.07.32-.02.04-.04.07-.08.1" fill="currentColor"/>
            <path d="M21.96 12c0 5.51-4.45 9.96-9.96 9.96S2.04 17.51 2.04 12 6.49 2.04 12 2.04 21.96 6.49 21.96 12M23 12c0-6.07-4.93-11-11-11S1 5.93 1 12s4.93 11 11 11 11-4.93 11-11" fill="currentColor"/>
            <path d="M8 9.62c0 .86-.7 1.56-1.56 1.56S4.88 10.48 4.88 9.62c0-.86.7-1.56 1.56-1.56S8 8.76 8 9.62M12.03 8.06c0 .86-.7 1.56-1.56 1.56s-1.56-.7-1.56-1.56.7-1.56 1.56-1.56 1.56.7 1.56 1.56M6.44 14.19c0 .86-.7 1.56-1.56 1.56s-1.56-.7-1.56-1.56.7-1.56 1.56-1.56 1.56.7 1.56 1.56" fill="currentColor"/>
          </svg>
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
