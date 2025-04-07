
import React, { useState } from 'react';

interface RestaurantImageProps {
  image?: string;
  name: string;
}

const RestaurantImage: React.FC<RestaurantImageProps> = ({ image, name }) => {
  const [imageError, setImageError] = useState(false);
  
  // If no image is provided, don't render anything
  if (!image) {
    return null;
  }
  
  // Don't try to load "default.png" or empty strings
  if (image === 'default.png' || image === '') {
    return null;
  }
  
  // Check if the image is a newly uploaded image or a URL
  const imageUrl = image.startsWith('/lovable-uploads/') || image.startsWith('http')
    ? image 
    : `/lovable-uploads/${image}`;

  // Fallback image path in case the main image fails to load
  const fallbackImage = "/placeholder.svg";
  
  console.log('Trying to load restaurant image:', imageUrl);
  
  return (
    <div className="restaurant-image">
      <img
        src={imageError ? fallbackImage : imageUrl}
        alt={`${name} - תמונה`}
        className="w-full h-48 object-cover rounded-t-2xl"
        onError={(e) => {
          console.log('Failed to load restaurant image:', imageUrl);
          setImageError(true);
        }}
      />
    </div>
  );
};

export default RestaurantImage;
