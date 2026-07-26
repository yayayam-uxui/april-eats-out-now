import React, { useState } from 'react';
import { DEFAULT_CHARACTER } from '@/lib/characters';

interface CharacterImageProps {
  imageSrc: string;
  alt?: string;
}

const CharacterImage: React.FC<CharacterImageProps> = ({ imageSrc, alt }) => {
  const [imageError, setImageError] = useState(false);

  const src = !imageSrc || imageError ? DEFAULT_CHARACTER.src : imageSrc;
  const altText = !imageSrc || imageError ? DEFAULT_CHARACTER.alt : (alt || "אפריל קוט");

  return (
    <div className="flex justify-center">
      <img
        src={src}
        alt={altText}
        width={320}
        height={320}
        className="w-56 h-56 sm:w-72 sm:h-72 md:w-80 md:h-80 object-contain animate-bounce-slight"
        onError={() => setImageError(true)}
      />
    </div>
  );
};

export default CharacterImage;
