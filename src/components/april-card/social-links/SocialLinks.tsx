
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

  // Fixed Wolt button logic with debuggin
  console.log("Wolt link check:", {
    link: restaurant.wolt,
    type: typeof restaurant.wolt,
    isEmpty: !restaurant.wolt,
    isAin: restaurant.wolt === 'אין',
    isTrimEmpty: restaurant.wolt?.trim() === ''
  });
  
  // Make sure wolt exists, isn't "אין", and isn't empty before adding the button
  if (restaurant.wolt && restaurant.wolt !== 'אין' && restaurant.wolt.trim() !== '') {
    console.log("Adding Wolt button with link:", restaurant.wolt);
    
    // Ensure the link has proper protocol
    const formattedWoltLink = restaurant.wolt.startsWith('http') ? restaurant.wolt : `https://${restaurant.wolt}`;
    
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
  } else {
    console.log("Not adding Wolt button because conditions not met:", { 
      hasWolt: !!restaurant.wolt,
      isNotAin: restaurant.wolt !== 'אין',
      isNotEmpty: restaurant.wolt?.trim() !== ''
    });
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
