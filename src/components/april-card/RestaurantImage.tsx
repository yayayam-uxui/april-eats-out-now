
import React, { useState } from 'react';

interface RestaurantImageProps {
  image?: string;
  name: string;
}

const RestaurantImage: React.FC<RestaurantImageProps> = ({ image, name }) => {
  // Return null to remove the image completely
  return null;
};

export default RestaurantImage;
