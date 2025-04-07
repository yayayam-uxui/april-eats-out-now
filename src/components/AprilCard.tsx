
import React from 'react';
import { Restaurant } from '@/types/restaurant';
import { Button } from "@/components/ui/button";
import { Instagram, MapPin, Share2, ChevronLeft, MapIcon } from "lucide-react";
import { getCharacterImage } from '@/utils/getRandomFromSheet';
import { Card } from "@/components/ui/card";

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

  // Parse tags
  const tags = restaurant.tags ? restaurant.tags.split(',').map(tag => tag.trim()) : [];

  return (
    <div className="flex flex-col gap-6 min-h-screen py-6 px-4">
      {/* Logo and header */}
      <div className="flex items-center justify-between pt-6">
        <button 
          onClick={onBack}
          className="p-2 rounded-full bg-april-fuchsia text-white transition-all hover:bg-opacity-90"
          aria-label="חזרה"
        >
          <ChevronLeft size={20} />
        </button>
        <a 
          href="https://www.theapricotlabs.com/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="transition-transform hover:scale-105"
        >
          <img 
            src="/lovable-uploads/1d24a55a-4f8d-44f4-91a0-0cf3d0681371.png" 
            alt="Apricot Labs" 
            className="h-10" 
          />
        </a>
      </div>

      {/* April's avatar */}
      <div className="flex justify-center relative">
        <div className="w-64 h-64 animate-bounce-slight">
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
        <div className="p-6" dir="rtl">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">{restaurant.name}</h2>
            
            {restaurant.city && (
              <p className="text-sm text-muted-foreground mb-2 flex items-center">
                <MapPin size={14} className="ml-1" />
                {restaurant.city}
              </p>
            )}

            <blockquote className="italic border-r-4 border-april-fuchsia pr-4 my-4">
              "{restaurant.aprilQuote}"
            </blockquote>

            {/* Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 my-4">
                {tags.map((tag, index) => (
                  <span 
                    key={index} 
                    className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Social links */}
          <div className="flex justify-start gap-3 mb-6">
            {restaurant.instagram && (
              <a 
                href={restaurant.instagram} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-3 rounded-full bg-april-fuchsia text-white transition-all hover:bg-opacity-90"
                aria-label="אינסטגרם"
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
                aria-label="גוגל מפות"
              >
                <MapPin size={20} />
              </a>
            )}

            {restaurant.wolt && (
              <a 
                href={restaurant.wolt} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-april-fuchsia text-white transition-all hover:bg-opacity-90"
                aria-label="וולט"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" fill="white"/>
                  <path d="M15.75 10.5L13.5 14.25L10.5 12L8.25 15.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            )}

            <button 
              onClick={handleShare}
              className="p-3 rounded-full bg-april-fuchsia text-white transition-all hover:bg-opacity-90"
              aria-label="שתף"
            >
              <Share2 size={20} />
            </button>
          </div>

          {/* Map preview if coordinates are available */}
          {restaurant.maps && (
            <div className="mb-6 rounded-lg overflow-hidden h-40 bg-gray-100 flex items-center justify-center">
              <a 
                href={restaurant.maps} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full h-full flex flex-col items-center justify-center text-april-fuchsia"
              >
                <MapIcon size={32} />
                <span className="mt-2">פתח במפות</span>
              </a>
            </div>
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
