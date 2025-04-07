
import React from 'react';
import { Button } from "@/components/ui/button";

interface TryAgainButtonProps {
  onClick: () => void;
}

const TryAgainButton: React.FC<TryAgainButtonProps> = ({ onClick }) => {
  return (
    <Button 
      onClick={onClick} 
      className="w-full bg-april-fuchsia text-white font-medium py-6 px-6 rounded-full transition-all duration-300 hover:bg-opacity-90 hover:shadow-md" 
      dir="rtl"
    >
      מקום אחר בבקשה ✨
    </Button>
  );
};

export default TryAgainButton;
