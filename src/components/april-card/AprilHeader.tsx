
import React from 'react';
import { ChevronLeft } from "lucide-react";

interface AprilHeaderProps {
  onBack: () => void;
}

const AprilHeader: React.FC<AprilHeaderProps> = ({ onBack }) => {
  return (
    <div className="flex items-center justify-between pt-6">
      <a 
        href="https://www.theapricotlabs.com/" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="transition-transform hover:scale-105"
      >
        <img 
          src="/lovable-uploads/1d24a55a-4f8d-44f4-91a0-0cf3d0681371.png" 
          alt="Apricot Labs" 
          className="h-10" 
        />
      </a>
      <button 
        onClick={onBack}
        className="april-social-button w-12 h-12 flex items-center justify-center"
        aria-label="חזרה"
      >
        <ChevronLeft size={24} />
      </button>
    </div>
  );
};

export default AprilHeader;
