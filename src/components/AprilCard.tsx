
import React, { useEffect, useState } from 'react';
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
  
  // State for map URL
  const [mapEmbedUrl, setMapEmbedUrl] = useState<string | null>(null);
  
  // Extract and construct Google Maps embed URL
  useEffect(() => {
    if (restaurant.maps) {
      try {
        // Attempt to extract location data from Google Maps URL
        const url = new URL(restaurant.maps);
        const params = new URLSearchParams(url.search);
        
        // For URLs with query parameters (most common format)
        if (params.has('q') || params.has('query')) {
          const query = params.get('q') || params.get('query') || '';
          setMapEmbedUrl(`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(query)}`);
        }
        // For URLs with place IDs
        else if (restaurant.maps.includes('/place/')) {
          const placeMatch = restaurant.maps.match(/\/place\/([^\/]+)/);
          if (placeMatch && placeMatch[1]) {
            setMapEmbedUrl(`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(placeMatch[1])}`);
          } else {
            // If we can't extract place ID, use restaurant name and city as fallback
            const searchQuery = `${restaurant.name} ${restaurant.city}`.trim();
            setMapEmbedUrl(`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(searchQuery)}`);
          }
        }
        // Fallback to restaurant name and address
        else {
          const searchQuery = `${restaurant.name} ${restaurant.city}`.trim();
          setMapEmbedUrl(`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(searchQuery)}`);
        }
      } catch (err) {
        console.error('Error parsing maps URL:', err);
        // Fallback to restaurant name and city
        const searchQuery = `${restaurant.name} ${restaurant.city}`.trim();
        setMapEmbedUrl(`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(searchQuery)}`);
      }
    }
  }, [restaurant.maps, restaurant.name, restaurant.city]);

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
    <div className="flex flex-col gap-6 min-h-screen py-6 px-4 pb-10">
      {/* Logo and header */}
      <div className="flex items-center justify-between pt-6">
        <button 
          onClick={onBack}
          className="april-social-button"
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
        <div className="april-image-container animate-bounce-slight">
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
                    className="april-tag"
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
                className="april-social-button"
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
                className="april-social-button"
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
                className="april-social-button"
                aria-label="וולט"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19.59 12.87c.02-.11.04-.21.05-.32.05-.53-.07-1.04-.35-1.49-.22-.37-.53-.64-.9-.86-.26-.16-.55-.26-.86-.33-.22-.05-.45-.07-.68-.07h-5.49v1.55h5.49c.28 0 .54.08.77.24.22.15.36.36.42.62.05.27-.01.51-.16.73-.15.22-.36.36-.62.43-.1.02-.2.03-.3.03H13.5c-.37 0-.71.11-1 .32-.3.22-.49.51-.59.87-.09.37-.05.72.11 1.06.16.33.42.58.75.74.2.09.4.14.62.14h4.07c.35 0 .69-.06 1.02-.19.34-.13.62-.31.85-.57.26-.27.45-.59.55-.96.09-.31.12-.64.07-.97-.04-.31-.14-.6-.28-.87m-1.09.95c-.1.11-.22.18-.36.2-.02 0-.03 0-.05 0h-3.19c-.13 0-.22-.05-.29-.13-.08-.09-.09-.19-.07-.31.03-.11.09-.2.19-.25.09-.05.18-.07.27-.07h3.19c.13 0 .24.05.32.14.08.09.1.2.07.32-.02.04-.04.07-.08.1" fill="currentColor"/>
                  <path d="M21.96 12c0 5.51-4.45 9.96-9.96 9.96S2.04 17.51 2.04 12 6.49 2.04 12 2.04 21.96 6.49 21.96 12M23 12c0-6.07-4.93-11-11-11S1 5.93 1 12s4.93 11 11 11 11-4.93 11-11" fill="currentColor"/>
                  <path d="M8 9.62c0 .86-.7 1.56-1.56 1.56S4.88 10.48 4.88 9.62c0-.86.7-1.56 1.56-1.56S8 8.76 8 9.62M12.03 8.06c0 .86-.7 1.56-1.56 1.56s-1.56-.7-1.56-1.56.7-1.56 1.56-1.56 1.56.7 1.56 1.56M6.44 14.19c0 .86-.7 1.56-1.56 1.56s-1.56-.7-1.56-1.56.7-1.56 1.56-1.56 1.56.7 1.56 1.56" fill="currentColor"/>
                </svg>
              </a>
            )}

            <button 
              onClick={handleShare}
              className="april-social-button"
              aria-label="שתף"
            >
              <Share2 size={20} />
            </button>
          </div>

          {/* Google Maps embed */}
          {restaurant.maps && (
            <div className="april-map-container">
              {mapEmbedUrl ? (
                <iframe
                  title={`מפה ל${restaurant.name}`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  src={mapEmbedUrl}
                ></iframe>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-april-fuchsia">
                  <MapIcon size={32} />
                  <span className="mt-2">טוען מפה...</span>
                </div>
              )}
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
