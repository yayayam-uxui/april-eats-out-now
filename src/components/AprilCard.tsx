
import React from 'react';
import { Restaurant } from '@/types/restaurant';
import { Button } from "@/components/ui/button";
import { Instagram, MapPin, Heart, Share2 } from "lucide-react";
import { getCharacterImage } from '@/utils/getRandomFromSheet';
import { Card } from "@/components/ui/card";

interface AprilCardProps {
  restaurant: Restaurant;
  onTryAgain: () => void;
}

const AprilCard: React.FC<AprilCardProps> = ({ restaurant, onTryAgain }) => {
  // Use the character field from the restaurant data to get the appropriate image
  const characterImage = getCharacterImage(restaurant.character);

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* April's avatar and card header */}
      <div className="flex justify-center relative mb-8">
        <div className="w-28 h-28 absolute -top-14 animate-bounce-slight z-10">
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
      </div>

      <Card className="mt-12 overflow-hidden border-0 rounded-2xl shadow-lg">
        {/* Restaurant hero image */}
        <div className="w-full h-48 bg-muted overflow-hidden">
          {restaurant.image ? (
            <img 
              src={restaurant.image} 
              alt={restaurant.name} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-april-fuchsia/20 to-april-fuchsia/10">
              <span className="text-april-fuchsia font-semibold text-lg">
                {restaurant.name} 🍑
              </span>
            </div>
          )}
        </div>

        {/* Card content */}
        <div className="p-6" dir="rtl">
          <div className="mb-6">
            <div className="flex items-start justify-between mb-3">
              <h2 className="text-2xl font-bold">{restaurant.name}</h2>
              <div className="flex gap-2">
                <button className="p-2 rounded-full bg-april-fuchsia/10 text-april-fuchsia transition-all hover:bg-april-fuchsia/20">
                  <Heart size={20} />
                </button>
                <button className="p-2 rounded-full bg-april-fuchsia/10 text-april-fuchsia transition-all hover:bg-april-fuchsia/20">
                  <Share2 size={20} />
                </button>
              </div>
            </div>

            {restaurant.city && (
              <p className="text-sm text-muted-foreground mb-4 flex items-center">
                <MapPin size={14} className="mr-1" />
                {restaurant.city}
              </p>
            )}

            <blockquote className="italic border-r-4 border-april-fuchsia pr-4 my-4">
              "{restaurant.aprilQuote}"
            </blockquote>
          </div>

          {/* Social links */}
          <div className="flex justify-start gap-3 mb-6">
            {restaurant.instagram && (
              <a 
                href={restaurant.instagram} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-3 rounded-full bg-april-fuchsia text-white transition-all hover:bg-opacity-90"
              >
                <Instagram size={20} />
              </a>
            )}
            
            {restaurant.maps && (
              <a 
                href={restaurant.maps} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-april-fuchsia text-white transition-all hover:bg-opacity-90"
              >
                <MapPin size={20} />
              </a>
            )}
          </div>

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
