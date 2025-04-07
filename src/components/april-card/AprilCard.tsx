
import React from 'react';
import { Restaurant } from '@/types/restaurant';
import { Card } from "@/components/ui/card";
import { getCharacterImage } from '@/utils/getRandomFromSheet';
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
  // Get character image
  const characterImage = getCharacterImage(restaurant.character);
  
  // Get map embed URL
  const mapEmbedUrl = MapHandler({
    mapUrl: restaurant.maps,
    name: restaurant.name,
    city: restaurant.city
  });
  
  // Get share handler function
  const handleShare = ShareHandler({ restaurant });

  return (
    <div className="flex flex-col min-h-screen py-6 px-4" dir="rtl">
      {/* Logo header with updated positioning */}
      <div className="mb-8">
        <AprilHeader onBack={onBack} />
      </div>

      <div className="flex flex-col items-center">
        {/* Character image with proper spacing */}
        <div className="mb-8">
          <CharacterImage imageSrc={characterImage} />
        </div>
        
        <Card className="overflow-hidden border-0 rounded-2xl shadow-lg mx-auto bg-white fade-in animate-enter w-full mb-10">
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
