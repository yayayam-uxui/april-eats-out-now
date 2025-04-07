
import React from 'react';
import { Instagram, MapPin, Share2, Globe, ShoppingCart } from "lucide-react";
import { Restaurant } from '@/types/restaurant';

interface SocialLinksProps {
  restaurant: Restaurant;
  onShare: () => void;
}

const SocialLinks: React.FC<SocialLinksProps> = ({ restaurant, onShare }) => {
  // Create an array of all possible social links
  const socialLinks = [];

  // Add Instagram if available
  if (restaurant.instagram && restaurant.instagram !== 'אין') {
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
  if (restaurant.website && restaurant.website !== 'אין') {
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
  if (restaurant.maps && restaurant.maps !== 'אין') {
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

  // Add Wolt link only if it exists and isn't "אין"
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
  // Add delivery button only if delivery column says "יש" but no direct Wolt link exists
  else if (restaurant.delivery && restaurant.delivery === 'יש' && (!restaurant.wolt || restaurant.wolt === 'אין')) {
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

  // Use the triangle layout logic
  const renderTriangleLayout = () => {
    // If we have 5 or 6 icons, use triangle layout
    if (socialLinks.length === 5 || socialLinks.length === 6) {
      // For 5 links: Top row has 3, bottom row has 2
      // For 6 links: Top row has 3, bottom row has 3
      const topRowCount = 3;
      const bottomRowCount = socialLinks.length - topRowCount;

      return (
        <>
          {/* Top row - always 3 items */}
          <div className="grid grid-cols-3 gap-3 w-full">
            {socialLinks.slice(0, topRowCount).map((link, i) => (
              <div key={i} className="flex justify-center">{link}</div>
            ))}
          </div>
          
          {/* Bottom row - with special positioning */}
          <div className={`grid grid-cols-3 gap-3 w-full mt-3 ${bottomRowCount === 2 ? 'px-12' : ''}`}>
            {bottomRowCount === 2 ? (
              // For 2 items in bottom row, position them in columns 1 and 3
              <>
                <div className="flex justify-center">{socialLinks[3]}</div>
                <div className="flex justify-center"></div> {/* Empty center */}
                <div className="flex justify-center">{socialLinks[4]}</div>
              </>
            ) : (
              // For 3 items in bottom row, position normally
              socialLinks.slice(3).map((link, i) => (
                <div key={i} className="flex justify-center">{link}</div>
              ))
            )}
          </div>
        </>
      );
    }
    
    // For 4 or fewer links, use a single row
    else if (socialLinks.length <= 4) {
      return (
        <div className="flex justify-between gap-3">
          {socialLinks.map((link, i) => (
            <div key={i}>{link}</div>
          ))}
        </div>
      );
    }
    
    // For more than 6 links, use standard grid layout
    else {
      // Split into rows of 3
      const rows = [];
      for (let i = 0; i < socialLinks.length; i += 3) {
        rows.push(socialLinks.slice(i, i + 3));
      }
      
      return (
        <>
          {rows.map((row, rowIndex) => (
            <div key={rowIndex} className={`grid grid-cols-3 gap-3 w-full ${rowIndex > 0 ? 'mt-3' : ''}`}>
              {row.map((link, i) => (
                <div key={i} className="flex justify-center">{link}</div>
              ))}
              
              {/* Fill remaining slots with empty divs if needed */}
              {[...Array(3 - row.length)].map((_, i) => (
                <div key={`empty-${i}`} className="flex justify-center"></div>
              ))}
            </div>
          ))}
        </>
      );
    }
  };

  return (
    <div className="flex flex-col mb-6">
      {renderTriangleLayout()}
    </div>
  );
};

export default SocialLinks;
