
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
  const characterImage = restaurant.character ? 
    getCharacterImage(restaurant.category) : 
    getCharacterImage('default');

  return (
    <div className="april-card flex flex-col gap-6 mx-auto">
      <div className="flex items-center justify-between">
        <div className="w-28 h-28 relative">
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
            <p className="text-sm text-gray-600 mt-1 text-center">{restaurant.city}</p>
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
        <Button onClick={onTryAgain} className="april-button w-full" dir="rtl">
          מקום אחר בבקשה ✨
        </Button>
      </div>
    </div>
  );
};

export default AprilCard;
