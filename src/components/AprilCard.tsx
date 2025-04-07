
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

          {/* Google Maps embed */}
          {restaurant.maps && (
            <div className="mb-6 rounded-lg overflow-hidden h-48 bg-gray-100">
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
