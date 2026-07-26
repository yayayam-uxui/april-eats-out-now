
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
        
        <Card className="overflow-hidden border-0 rounded-2xl shadow-lg mx-auto bg-white fade-in animate-enter w-full mb-6">
          {/* Restaurant image if available */}
          {restaurant.image && (
            <RestaurantImage image={restaurant.image} name={restaurant.name} />
          )}

          {/* Card content */}
          <div className="p-6 text-right">
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
