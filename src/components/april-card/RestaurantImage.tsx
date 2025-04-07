
import React, { useState } from 'react';

interface RestaurantImageProps {
  image?: string;
  name: string;
}

const RestaurantImage: React.FC<RestaurantImageProps> = ({ image, name }) => {
  const [imageError, setImageError] = useState(false);
  
  // If no image is provided, don't render anything
  if (!image) {
    console.log(`No image provided for restaurant: ${name}`);
    return null;
  }
  
  // Don't try to load "default.png" or empty strings
  if (image === 'default.png' || image === '') {
    console.log(`Default or empty image for restaurant: ${name}, not displaying`);
    return null;
  }
  
  // Fallback image path in case the main image fails to load
  const fallbackImage = "/placeholder.svg";
  
  console.log(`Displaying image for ${name}:`, image);
  
  return (
    <div className="restaurant-image flex justify-center items-center py-4">
      <div className="april-image-container animate-bounce-slight">
        <img
          src={imageError ? fallbackImage : image}
          alt={`${name} - תמונה`}
          className="w-full h-full object-contain scale-150"
          onError={(e) => {
            console.log('Failed to load restaurant image:', image, 'for restaurant:', name);
            setImageError(true);
          }}
        />
      </div>
    </div>
  );
};

export default RestaurantImage;
