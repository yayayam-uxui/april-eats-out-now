
import React, { useState } from 'react';

interface CharacterImageProps {
  imageSrc: string;
}

const CharacterImage: React.FC<CharacterImageProps> = ({ imageSrc }) => {
  const [imageError, setImageError] = useState(false);
  
  // If no image source or image failed to load, use default
  if (!imageSrc || imageError) {
    console.log("Using default character image due to missing src or error");
    return (
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
        <img 
          src="/lovable-uploads/bdcca772-60da-46da-8de8-2b388085ef94.png"
          alt="April Character Default" 
          className="w-36 h-36 object-contain"
        />
      </div>
    );
  }

  return (
    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
      <img 
        src={imageSrc} 
        alt="April Character" 
        className="w-36 h-36 object-contain"
        onError={() => setImageError(true)} 
      />
    </div>
  );
};

export default CharacterImage;
