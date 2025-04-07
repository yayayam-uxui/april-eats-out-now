import React, { useEffect, useState } from 'react';
import { Restaurant } from '@/types/restaurant';
import { Button } from "@/components/ui/button";
import { ChevronLeft, Clock, Truck, MapPin, MapIcon } from "lucide-react";
import { getCharacterImage } from '@/utils/getRandomFromSheet';
import { Card } from "@/components/ui/card";
import SocialLinks from './april-card/social-links';

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
    <div className="flex flex-col gap-6 min-h-screen py-6 px-4 pb-10" dir="rtl">
      {/* Logo and header - adjusted positioning */}
      <div className="flex items-center justify-between pt-6">
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
        <button 
          onClick={onBack}
          className="april-social-button"
          aria-label="חזרה"
        >
          <ChevronLeft size={20} />
        </button>
      </div>

      {/* April's avatar - made bigger */}
      <div className="flex justify-center relative">
        <div className="april-image-container animate-bounce-slight">
          <img 
            src={characterImage} 
            alt="April Kot" 
            className="w-full h-full object-contain scale-125"
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
        <div className="p-6 text-right">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">{restaurant.name}</h2>
            
            {/* Address and city */}
            <div className="flex flex-col gap-1">
              {restaurant.address && (
                <p className="text-sm text-muted-foreground flex items-center">
                  <MapPin size={14} className="ml-1" />
                  {restaurant.address}
                </p>
              )}
              
              {restaurant.city && !restaurant.address && (
                <p className="text-sm text-muted-foreground flex items-center">
                  <MapPin size={14} className="ml-1" />
                  {restaurant.city}
                </p>
              )}
              
              {/* Delivery status */}
              {restaurant.delivery && restaurant.delivery.toLowerCase() !== "אין" && restaurant.delivery.toLowerCase() !== "לא" && (
                <p className="text-sm text-green-600 flex items-center">
                  <Truck size={14} className="ml-1" />
                  יש משלוחים
                </p>
              )}

              {/* When to go */}
              {restaurant.whenToGo && (
                <div className="mt-2 flex items-start">
                  <Clock size={14} className="ml-1 mt-1 flex-shrink-0 text-april-fuchsia" />
                  <p className="text-sm">{restaurant.whenToGo}</p>
                </div>
              )}
            </div>

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

          {/* Social links - using the updated SocialLinks component */}
          <SocialLinks restaurant={restaurant} onShare={handleShare} />

          {/* Google Maps embed with pink tint */}
          {restaurant.maps && (
            <div className="april-map-container relative">
              {mapEmbedUrl ? (
                <div className="relative w-full h-full">
                  <iframe
                    title={`מפה ל${restaurant.name}`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    src={mapEmbedUrl}
                    className="relative z-10"
                  ></iframe>
                  <div className="absolute inset-0 bg-april-fuchsia opacity-20 pointer-events-none z-20"></div>
                </div>
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
