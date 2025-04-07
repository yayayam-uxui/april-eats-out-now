
import React, { useState } from 'react';

interface RestaurantImageProps {
  image?: string;
  name: string;
}

const RestaurantImage: React.FC<RestaurantImageProps> = ({ image, name }) => {
  const [imageError, setImageError] = useState(false);
  
  // If no image is provided, don't render anything
  if (!image) return null;
  
  // Default fallback image to use if the provided one fails
  const defaultImage = "/lovable-uploads/43877453-7d1d-4a27-9c68-857d2a48b56e.png";
  
  // Use the default image if there was an error loading the provided image
  const displayImage = imageError ? defaultImage : image;
  
  return (
    <div className="w-full h-48 bg-muted overflow-hidden">
      <img 
        src={displayImage} 
        alt={name} 
        className="w-full h-full object-cover"
        onError={(e) => {
          console.log("Restaurant image failed to load:", image);
          setImageError(true);
          
          // Set fallback image
          const target = e.target as HTMLImageElement;
          target.src = defaultImage;
          target.onerror = null; // Prevent infinite error loop
        }}
      />
    </div>
  );
};

export default RestaurantImage;
