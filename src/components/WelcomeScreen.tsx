
import React from 'react';
import { Button } from "@/components/ui/button";

interface WelcomeScreenProps {
  onGenerateClick: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onGenerateClick }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center gap-8 w-full max-w-md mx-auto pt-6">
      <div className="flex flex-col items-center">
        <img 
          src="/lovable-uploads/d7405f47-bd45-4033-9f24-0c66db6ebeb9.png" 
          alt="Apricot Labs" 
          className="h-16 mb-4"
        />
        <h1 className="text-3xl font-bold mb-2">Apricot Labs</h1>
        <div className="w-60 h-60 relative">
          <img 
            src="/lovable-uploads/704febbb-e3b1-404e-9a4d-0ba66ffbc511.png" 
            alt="April Kot" 
            className="w-full h-full object-contain animate-bounce-slight"
          />
        </div>
      </div>

      <div className="space-y-6 w-full">
        <div className="p-6 bg-white rounded-xl shadow-md">
          <h2 className="text-xl font-medium mb-4">היי, אני אפריל קוט 🍑</h2>
          <p className="text-lg">מאיפה את או איפה בא לך לאכול היום?</p>
        </div>
        
        <Button 
          onClick={onGenerateClick}
          className="april-button w-full text-lg"
        >
          💖 תגרילי לי מקום
        </Button>
      </div>
    </div>
  );
};

export default WelcomeScreen;
