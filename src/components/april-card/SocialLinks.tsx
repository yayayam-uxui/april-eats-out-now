
import React from 'react';
import { Instagram, MapPin, Share2, Globe, Package, ShoppingCart } from "lucide-react";
import { Restaurant } from '@/types/restaurant';

interface SocialLinksProps {
  restaurant: Restaurant;
  onShare: () => void;
}

const SocialLinks: React.FC<SocialLinksProps> = ({ restaurant, onShare }) => {
  // Create an array of all possible social links
  const socialLinks = [];

  // Add Instagram if available
  if (restaurant.instagram) {
    socialLinks.push(
      <a 
        key="instagram"
        href={restaurant.instagram.startsWith('http') ? restaurant.instagram : `https://www.instagram.com/${restaurant.instagram}`} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="april-social-button w-12 h-12 flex items-center justify-center"
        aria-label="אינסטגרם"
      >
        <Instagram size={20} />
      </a>
    );
  }
  
  // Add Website if available
  if (restaurant.website) {
    socialLinks.push(
      <a 
        key="website"
        href={restaurant.website.startsWith('http') ? restaurant.website : `https://${restaurant.website}`}
        target="_blank" 
        rel="noopener noreferrer"
        className="april-social-button w-12 h-12 flex items-center justify-center"
        aria-label="אתר"
      >
        <Globe size={20} />
      </a>
    );
  }
  
  // Add Google Maps if available
  if (restaurant.maps) {
    socialLinks.push(
      <a 
        key="maps"
        href={restaurant.maps} 
        target="_blank" 
        rel="noopener noreferrer"
        className="april-social-button w-12 h-12 flex items-center justify-center"
        aria-label="גוגל מפות"
      >
        <MapPin size={20} />
      </a>
    );
  }

  // Add Wolt link only if it exists
  if (restaurant.wolt && restaurant.wolt !== 'אין') {
    socialLinks.push(
      <a 
        key="wolt"
        href={restaurant.wolt} 
        target="_blank" 
        rel="noopener noreferrer"
        className="april-social-button w-12 h-12 flex items-center justify-center"
        aria-label="וולט"
      >
        <img 
          src="/lovable-uploads/0420bfa1-b2a7-4774-b93b-bb0eb577d4db.png" 
          alt="W" 
          className="w-5 h-5 object-contain"
        />
      </a>
    );
  } 
  // Add Wolt button only if delivery column says "יש"
  else if (restaurant.delivery && restaurant.delivery === 'יש') {
    socialLinks.push(
      <a 
        key="wolt"
        href="https://wolt.com" 
        target="_blank" 
        rel="noopener noreferrer"
        className="april-social-button w-12 h-12 flex items-center justify-center"
        aria-label="וולט"
      >
        <img 
          src="/lovable-uploads/0420bfa1-b2a7-4774-b93b-bb0eb577d4db.png" 
          alt="W" 
          className="w-5 h-5 object-contain"
        />
      </a>
    );
  }

  // Add Order Link if available and not "אין"
  if (restaurant.orderLink && restaurant.orderLink !== 'אין') {
    socialLinks.push(
      <a 
        key="orderLink"
        href={restaurant.orderLink.startsWith('http') ? restaurant.orderLink : `https://${restaurant.orderLink}`} 
        target="_blank" 
        rel="noopener noreferrer"
        className="april-social-button w-12 h-12 flex items-center justify-center"
        aria-label="הזמנות"
      >
        <ShoppingCart size={20} />
      </a>
    );
  }

  // Always add Share button
  socialLinks.push(
    <button 
      key="share"
      onClick={onShare}
      className="april-social-button w-12 h-12 flex items-center justify-center"
      aria-label="שתף"
    >
      <Share2 size={20} />
    </button>
  );

  // Split links into two rows if there are more than 3 (maximum 3 per row)
  const shouldSplitRows = socialLinks.length > 3;
  
  // Calculate how many links to show in each row (max 3 per row)
  const firstRowCount = shouldSplitRows ? Math.min(3, socialLinks.length) : socialLinks.length;
  
  const firstRowLinks = socialLinks.slice(0, firstRowCount);
  const secondRowLinks = shouldSplitRows ? socialLinks.slice(firstRowCount) : [];

  return (
    <div className="flex flex-col gap-3 mb-6">
      {/* First row of social links */}
      <div className="flex justify-start gap-3 flex-wrap">
        {firstRowLinks}
      </div>
      
      {/* Second row of social links (only if needed) */}
      {shouldSplitRows && (
        <div className="flex justify-start gap-3 flex-wrap">
          {secondRowLinks}
        </div>
      )}
    </div>
  );
};

export default SocialLinks;
