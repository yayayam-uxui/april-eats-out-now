
import React from 'react';

interface CharacterImageProps {
  imageSrc: string;
}

const CharacterImage: React.FC<CharacterImageProps> = ({ imageSrc }) => {
  if (!imageSrc) {
    return null;
  }

  return (
    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
      <img 
        src={imageSrc} 
        alt="April Character" 
        className="w-full h-full object-contain scale-150" 
      />
    </div>
  );
};

export default CharacterImage;
