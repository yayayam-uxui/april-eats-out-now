
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
  
  // Create the correct image URL based on the image value
  // First check if it already includes the path or is a full URL
  let imageUrl;
  
  if (image.startsWith('/lovable-uploads/') || image.startsWith('http')) {
    imageUrl = image;
  } else {
    // Check if the image is one of our mapped images or just a filename
    const mappedImagePath = `/lovable-uploads/${image}`;
    imageUrl = mappedImagePath;
  }

  // Fallback image path in case the main image fails to load
  const fallbackImage = "/placeholder.svg";
  
  console.log('Trying to load restaurant image:', imageUrl, 'for restaurant:', name);
  
  return (
    <div className="restaurant-image">
      <img
        src={imageError ? fallbackImage : imageUrl}
        alt={`${name} - תמונה`}
        className="w-full h-48 object-cover rounded-t-2xl"
        onError={(e) => {
          console.log('Failed to load restaurant image:', imageUrl, 'for restaurant:', name);
          setImageError(true);
        }}
      />
    </div>
  );
};

export default RestaurantImage;
