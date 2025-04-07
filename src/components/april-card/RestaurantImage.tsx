
import React from 'react';

interface RestaurantImageProps {
  image?: string;
  name: string;
}

const RestaurantImage: React.FC<RestaurantImageProps> = ({ image, name }) => {
  // Always return null, effectively removing all restaurant images
  return null;
};

export default RestaurantImage;
