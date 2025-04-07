
import React from 'react';
import { Instagram, MapPin, Share2, Globe, ShoppingCart } from "lucide-react";
import { Restaurant } from '@/types/restaurant';
import SocialButton from './SocialButton';
import SocialLinksGrid from './SocialLinksGrid';

interface SocialLinksProps {
  restaurant: Restaurant;
  onShare: () => void;
}

const SocialLinks: React.FC<SocialLinksProps> = ({ restaurant, onShare }) => {
  // Create an array of all possible social links
  const socialLinks = [];

  // Add Instagram if available
  if (restaurant.instagram && restaurant.instagram !== 'אין' && restaurant.instagram.trim() !== '') {
    socialLinks.push(
      <SocialButton 
        key="instagram"
        href={restaurant.instagram.startsWith('http') ? restaurant.instagram : `https://www.instagram.com/${restaurant.instagram}`} 
        ariaLabel="אינסטגרם"
      >
        <Instagram size={20} />
      </SocialButton>
    );
  }
  
  // Add Website if available
  if (restaurant.website && restaurant.website !== 'אין' && restaurant.website.trim() !== '') {
    socialLinks.push(
      <SocialButton 
        key="website"
        href={restaurant.website.startsWith('http') ? restaurant.website : `https://${restaurant.website}`}
        ariaLabel="אתר"
      >
        <Globe size={20} />
      </SocialButton>
    );
  }
  
  // Add Google Maps if available
  if (restaurant.maps && restaurant.maps !== 'אין' && restaurant.maps.trim() !== '') {
    socialLinks.push(
      <SocialButton 
        key="maps"
        href={restaurant.maps}
        ariaLabel="גוגל מפות"
      >
        <MapPin size={20} />
      </SocialButton>
    );
  }

  // Fixed Wolt button with more lenient URL checking
  console.log("Wolt link info:", {
    hasWoltProperty: !!restaurant.wolt,
    woltValue: restaurant.wolt,
    isEmpty: !restaurant.wolt?.trim(),
    isAin: restaurant.wolt === 'אין'
  });
  
  // Improved Wolt button logic - simplified check
  if (restaurant.wolt && restaurant.wolt !== 'אין') {
    console.log("Adding Wolt button with link:", restaurant.wolt);
    
    // Ensure the link has proper protocol
    let formattedWoltLink = restaurant.wolt.trim();
    if (!formattedWoltLink.startsWith('http')) {
      formattedWoltLink = `https://${formattedWoltLink}`;
    }
    
    socialLinks.push(
      <SocialButton 
        key="wolt"
        href={formattedWoltLink}
        ariaLabel="וולט"
      >
        <img 
          src="/lovable-uploads/0420bfa1-b2a7-4774-b93b-bb0eb577d4db.png" 
          alt="Wolt" 
          className="w-5 h-5 object-contain"
        />
      </SocialButton>
    );
  }

  // Add Order Link if available and not "אין" or empty
  if (restaurant.orderLink && restaurant.orderLink !== 'אין' && restaurant.orderLink.trim() !== '') {
    socialLinks.push(
      <SocialButton 
        key="orderLink"
        href={restaurant.orderLink.startsWith('http') ? restaurant.orderLink : `https://${restaurant.orderLink}`}
        ariaLabel="הזמנות"
      >
        <ShoppingCart size={20} />
      </SocialButton>
    );
  }

  // Always add Share button
  socialLinks.push(
    <SocialButton 
      key="share"
      onClick={onShare}
      ariaLabel="שתף"
    >
      <Share2 size={20} />
    </SocialButton>
  );

  return (
    <div className="flex flex-col mb-6">
      <SocialLinksGrid socialLinks={socialLinks} />
    </div>
  );
};

export default SocialLinks;
