
import React from 'react';

interface CharacterImageProps {
  imageSrc: string;
}

const CharacterImage: React.FC<CharacterImageProps> = ({ imageSrc }) => {
  return (
    <div className="flex justify-center relative">
      <div className="april-image-container animate-bounce-slight">
        <img 
          src={imageSrc} 
          alt="April Kot" 
          className="w-full h-full object-contain scale-150" // Increased from scale-125 to scale-150
          onError={(e) => {
            // Fallback if image doesn't exist
            const target = e.target as HTMLImageElement;
            target.src = "/lovable-uploads/704febbb-e3b1-404e-9a4d-0ba66ffbc511.png";
            target.onerror = null;
          }}
        />
      </div>
    </div>
  );
};

export default CharacterImage;
