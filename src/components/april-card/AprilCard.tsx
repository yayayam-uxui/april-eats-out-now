
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
    <div className="flex flex-col gap-6 min-h-screen py-6 px-4 pb-10" dir="rtl">
      {/* Logo and header with proper positioning */}
      <AprilHeader onBack={onBack} />

      {/* Put the character image back outside the card */}
      <CharacterImage imageSrc={characterImage} />

      <Card className="overflow-hidden border-0 rounded-2xl shadow-lg mx-auto mb-16 bg-white fade-in animate-enter">
        {/* Restaurant image if available */}
        {restaurant.image && (
          <RestaurantImage image={restaurant.image} name={restaurant.name} />
        )}

        {/* Card content */}
        <div className="p-6 text-right">
          {/* Restaurant header info */}
          <RestaurantHeader restaurant={restaurant} />

          {/* Social links - updated component with proper spacing */}
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
  );
};

export default AprilCard;
