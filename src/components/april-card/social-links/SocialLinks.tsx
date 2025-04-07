
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
  if (restaurant.instagram && restaurant.instagram !== 'אין') {
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
  if (restaurant.website && restaurant.website !== 'אין') {
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
  if (restaurant.maps && restaurant.maps !== 'אין') {
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

  // Add Wolt link only if it exists and isn't "אין"
  if (restaurant.wolt && restaurant.wolt !== 'אין') {
    socialLinks.push(
      <SocialButton 
        key="wolt"
        href={restaurant.wolt}
        ariaLabel="וולט"
      >
        <img 
          src="/lovable-uploads/0420bfa1-b2a7-4774-b93b-bb0eb577d4db.png" 
          alt="W" 
          className="w-5 h-5 object-contain"
        />
      </SocialButton>
    );
  } 
  // Add delivery button only if delivery column says "יש" but no direct Wolt link exists
  else if (restaurant.delivery && restaurant.delivery === 'יש' && (!restaurant.wolt || restaurant.wolt === 'אין')) {
    socialLinks.push(
      <SocialButton 
        key="wolt"
        href="https://wolt.com"
        ariaLabel="וולט"
      >
        <img 
          src="/lovable-uploads/0420bfa1-b2a7-4774-b93b-bb0eb577d4db.png" 
          alt="W" 
          className="w-5 h-5 object-contain"
        />
      </SocialButton>
    );
  }

  // Add Order Link if available and not "אין"
  if (restaurant.orderLink && restaurant.orderLink !== 'אין') {
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
