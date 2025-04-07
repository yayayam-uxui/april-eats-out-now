
import React from 'react';
import { Restaurant } from '@/types/restaurant';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getCharacterImage } from '@/utils/getRandomFromSheet';
import AprilHeader from './AprilHeader';
import CharacterImage from './CharacterImage';
import RestaurantHeader from './RestaurantHeader';
import SocialLinks from './social-links';
import LocationMap from './LocationMap';

interface AprilCardProps {
  restaurant: Restaurant;
  onTryAgain: () => void;
  onBack: () => void;
}

const AprilCard: React.FC<AprilCardProps> = ({ restaurant, onTryAgain, onBack }) => {
  // Get character image
  const characterImage = getCharacterImage(restaurant.character);

  // Function to handle sharing
  const handleShare = async () => {
    const shareData = {
      title: `אפריל קוט ממליצה: ${restaurant.name}`,
      text: `אפריל קוט ממליצה על ${restaurant.name}${restaurant.city ? ` ב${restaurant.city}` : ''}.`,
      url: window.location.href,
    };

    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareData.text + ' ' + shareData.url);
        alert('הקישור הועתק ללוח!');
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  return (
    <div className="flex flex-col gap-6 min-h-screen py-6 px-4 pb-10" dir="rtl">
      {/* Logo and header with proper positioning */}
      <AprilHeader onBack={onBack} />

      {/* April's avatar */}
      <CharacterImage imageSrc={characterImage} />

      <Card className="overflow-hidden border-0 rounded-2xl shadow-lg mx-auto mb-16 bg-white fade-in animate-enter">
        {/* Restaurant hero image */}
        {restaurant.image && (
          <div className="w-full h-48 bg-muted overflow-hidden">
            <img 
              src={restaurant.image} 
              alt={restaurant.name} 
              className="w-full h-full object-cover"
            />
          </div>
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
            />
          )}

          {/* Try again button */}
          <Button 
            onClick={onTryAgain} 
            className="w-full bg-april-fuchsia text-white font-medium py-6 px-6 rounded-full transition-all duration-300 hover:bg-opacity-90 hover:shadow-md" 
            dir="rtl"
          >
            מקום אחר בבקשה ✨
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AprilCard;
