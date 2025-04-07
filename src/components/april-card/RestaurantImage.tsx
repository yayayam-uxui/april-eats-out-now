
import React from 'react';

interface RestaurantImageProps {
  image?: string;
  name: string;
}

const RestaurantImage: React.FC<RestaurantImageProps> = ({ image, name }) => {
  if (!image) {
    return null;
  }
  
  console.log("Rendering restaurant image:", image);
  
  return (
    <div className="w-full h-48 overflow-hidden">
      <img 
        src={image} 
        alt={`${name} restaurant`} 
        className="w-full h-full object-cover"
        onError={(e) => {
          console.error("Failed to load image:", image);
          e.currentTarget.style.display = 'none';
        }}
      />
    </div>
  );
};

export default RestaurantImage;
