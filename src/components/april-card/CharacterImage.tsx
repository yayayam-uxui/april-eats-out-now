
import React, { useState } from 'react';

interface CharacterImageProps {
  imageSrc: string;
}

const CharacterImage: React.FC<CharacterImageProps> = ({ imageSrc }) => {
  const [imageError, setImageError] = useState(false);
  const [attemptedImage, setAttemptedImage] = useState<string | null>(null);

  // Default image to use if the provided one fails
  const defaultImage = "/lovable-uploads/bdcca772-60da-46da-8de8-2b388085ef94.png";
  
  // If we've already had an error and the new image is the same as the one that failed,
  // use the default image right away to avoid flashing
  const displayImage = (imageError && imageSrc === attemptedImage) ? defaultImage : imageSrc;

  return (
    <div className="flex justify-center relative mb-10">
      <div className="absolute -bottom-5">
        <img 
          src={displayImage} 
          alt="April Kot" 
          className="w-36 h-36 object-contain"
          onError={(e) => {
            console.log("Image failed to load:", imageSrc);
            setAttemptedImage(imageSrc);
            setImageError(true);
            
            // Set fallback image
            const target = e.target as HTMLImageElement;
            target.src = defaultImage;
            target.onerror = null; // Prevent infinite error loop
          }}
        />
      </div>
    </div>
  );
};

export default CharacterImage;
