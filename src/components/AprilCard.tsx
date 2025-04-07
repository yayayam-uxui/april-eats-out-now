
import React from 'react';
import { Restaurant } from '@/types/restaurant';
import { Button } from "@/components/ui/button";
import { Instagram, MapPin } from "lucide-react";
import { getCharacterImage } from '@/utils/getRandomFromSheet';

interface AprilCardProps {
  restaurant: Restaurant;
  onTryAgain: () => void;
}

const AprilCard: React.FC<AprilCardProps> = ({ restaurant, onTryAgain }) => {
  // Use the character field from the restaurant data to get the appropriate image
  const characterImage = getCharacterImage(restaurant.character);

  return (
    <div className="bg-card text-card-foreground rounded-lg shadow-lg flex flex-col gap-6 mx-auto p-6 transition-all duration-300 hover:shadow-xl">
      <div className="flex items-center justify-between">
        <div className="w-28 h-28 relative animate-bounce-slight">
          <img 
            src={characterImage} 
            alt="April Kot" 
            className="w-full h-full object-contain"
            onError={(e) => {
              // Fallback if image doesn't exist
              const target = e.target as HTMLImageElement;
              target.src = "/lovable-uploads/704febbb-e3b1-404e-9a4d-0ba66ffbc511.png";
              target.onerror = null;
            }}
          />
        </div>
        
        <div className="flex-1" dir="rtl">
          <p className="text-lg font-medium italic mb-2 text-center">"{restaurant.aprilQuote}"</p>
          <h2 className="text-2xl font-bold text-center">{restaurant.name}</h2>
          {restaurant.city && (
            <p className="text-sm text-muted-foreground mt-1 text-center">{restaurant.city}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3">
        {restaurant.instagram && (
          <a 
            href={restaurant.instagram} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="p-2 rounded-full bg-april-fuchsia bg-opacity-10 text-april-fuchsia transition-all hover:bg-opacity-20"
          >
            <Instagram size={24} />
          </a>
        )}
        
        {restaurant.maps && (
          <a 
            href={restaurant.maps} 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-april-fuchsia bg-opacity-10 text-april-fuchsia transition-all hover:bg-opacity-20"
          >
            <MapPin size={24} />
          </a>
        )}
      </div>

      <div className="mt-4">
        <Button 
          onClick={onTryAgain} 
          className="w-full bg-april-fuchsia text-white font-medium py-3 px-6 rounded-full transition-all duration-300 hover:bg-opacity-90 hover:shadow-md" 
          dir="rtl"
        >
          מקום אחר בבקשה ✨
        </Button>
      </div>
    </div>
  );
};

export default AprilCard;
