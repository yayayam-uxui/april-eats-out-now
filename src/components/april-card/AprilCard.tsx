
import React from 'react';
import { Restaurant } from '@/types/restaurant';
import { Card } from "@/components/ui/card";
import AprilHeader from './AprilHeader';
import CharacterImage from './CharacterImage';
import RestaurantHeader from './RestaurantHeader';
import SocialLinks from './social-links';
import LocationMap from './LocationMap';
import RestaurantImage from './RestaurantImage';
import TryAgainButton from './TryAgainButton';
import MapHandler from './MapHandler';
import ShareHandler from './ShareHandler';

interface AprilCardProps {
  restaurant: Restaurant;
  onTryAgain: () => void;
  onBack: () => void;
}

// Stable 3-digit "lottery ticket" number per restaurant
const ticketNumber = (name: string): string => {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) | 0;
  return String(100 + (Math.abs(h) % 900));
};

const AprilCard: React.FC<AprilCardProps> = ({ restaurant, onTryAgain, onBack }) => {
  // Get map embed URL
  const mapEmbedUrl = MapHandler({
    mapUrl: restaurant.maps,
    name: restaurant.name,
    city: restaurant.city
  });
  
  // Get share handler function
  const handleShare = ShareHandler({ restaurant });

  return (
    <div className="flex flex-col min-h-screen pt-3 pb-6 px-4" dir="rtl">
      <AprilHeader onBack={onBack} />

      <div className="flex flex-col items-center">
        {/* Character image */}
        <div className="mb-2 mt-1">
          <CharacterImage imageSrc={restaurant.characterSrc} alt={restaurant.characterAlt} />
        </div>
        
        <Card className="overflow-visible border-0 rounded-2xl shadow-lg mx-auto bg-white fade-in animate-enter w-full mb-6 relative">
          {/* Lottery-ticket header */}
          <div className="relative px-6 pt-4 pb-3 april-perforation">
            <div className="flex items-center justify-between text-april-navy/60 text-xs font-mono tracking-wider">
              <span>כרטיס מזל №{ticketNumber(restaurant.name + restaurant.city)}</span>
              <span>🍑 הגרלה רשמית</span>
            </div>
            {/* perforation notches */}
            <span className="absolute -bottom-[9px] -right-[10px] w-5 h-5 rounded-full bg-april-background" aria-hidden="true"></span>
            <span className="absolute -bottom-[9px] -left-[10px] w-5 h-5 rounded-full bg-april-background" aria-hidden="true"></span>
          </div>

          {/* "April approves" stamp */}
          <div
            className="absolute top-14 left-4 w-[74px] h-[74px] rounded-full border-2 border-april-orange/70 text-april-orange/80 flex items-center justify-center text-center text-[11px] font-bold leading-tight -rotate-12 pointer-events-none select-none"
            aria-hidden="true"
          >
            אפריל<br />✓<br />מאשרת
          </div>

          {/* Restaurant image if available */}
          {restaurant.image && (
            <RestaurantImage image={restaurant.image} name={restaurant.name} />
          )}

          {/* Card content */}
          <div className="p-6 pt-4 text-right">
            {/* Restaurant header info */}
            <RestaurantHeader restaurant={restaurant} />

            {/* Social links */}
            <SocialLinks restaurant={restaurant} onShare={handleShare} />

            {/* Google Maps embed */}
            {restaurant.maps && (
              <LocationMap 
                mapUrl={restaurant.maps} 
                name={restaurant.name} 
                city={restaurant.city} 
                mapEmbedUrl={mapEmbedUrl}
              />
            )}

            {/* Try again button */}
            <TryAgainButton onClick={onTryAgain} />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AprilCard;
