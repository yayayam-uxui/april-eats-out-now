
import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { Sparkles } from 'lucide-react';
import { WELCOME_CHARACTER } from '@/lib/characters';

interface WelcomeScreenProps {
  onGenerateClick: (city?: string) => void;
  cities: string[];
  selectedCity: string;
  onCityChange: (city: string) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ 
  onGenerateClick, 
  cities, 
  selectedCity, 
  onCityChange 
}) => {
  return (
    <div className="flex flex-col items-center min-h-screen overflow-hidden bg-april-background px-4 pb-6" dir="rtl">
      <div className="april-header mb-2">
        {/* Logo with link to Apricot Labs website */}
        <a 
          href="https://www.theapricotlabs.com/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="transition-transform hover:scale-105"
        >
          <img
            src="/brand/apricot-labs-logo.png"
            alt="Apricot Labs"
            className="h-10"
          />
        </a>
      </div>
      
      {/* Everything below the logo is centered as one block, so nothing sinks
          to the bottom of tall screens */}
      <div className="flex-1 w-full flex flex-col items-center justify-center">
      <div className="w-72 h-72 sm:w-80 sm:h-80 mx-auto animate-bounce-slight mb-2">
        <img
          src={WELCOME_CHARACTER.src}
          alt={WELCOME_CHARACTER.alt}
          className="w-full h-full object-contain"
        />
      </div>

      <div className="april-container flex flex-col justify-center">
        <div className="p-6 bg-card text-card-foreground rounded-lg shadow-sm mb-5 transition-all duration-300 hover:shadow-md text-right">
          <h2 className="text-xl font-bold mb-4 text-center">
            <span className="mr-2">היי, אני אפריל קוט</span>
            <span role="img" aria-label="peach">🍑</span>
          </h2>
          <p className="text-lg text-center mb-6">מאיפה את או איפה בא לך לאכול היום?</p>
        
          {/* City dropdown - improved RTL support */}
          <div className="mt-4" dir="rtl">
            <Select value={selectedCity} onValueChange={onCityChange} dir="rtl">
              <SelectTrigger 
                className="w-full text-right border-2 rounded-lg py-6 flex flex-row-reverse justify-between"
                dir="rtl"
              >
                <SelectValue placeholder="כל הערים" className="text-right flex justify-end" />
              </SelectTrigger>
              <SelectContent align="end" className="bg-white text-right" dir="rtl" sideOffset={8}>
                {cities.length > 0 ? (
                  <>
                    <SelectItem value="all" className="text-right flex justify-end">כל הערים</SelectItem>
                    {cities.map((city) => (
                      <SelectItem key={city} value={city} className="text-right flex justify-end">{city}</SelectItem>
                    ))}
                  </>
                ) : (
                  <SelectItem value="all" className="text-right flex justify-end">טוען ערים...</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Button 
          onClick={() => onGenerateClick(selectedCity !== 'all' ? selectedCity : undefined)}
          className="w-full text-lg py-6 bg-april-fuchsia hover:bg-opacity-90 rounded-full flex items-center justify-center transition-all duration-300"
        >
          <Sparkles className="h-5 w-5 ml-2" />
          <span>תגרילי לי מקום</span>
        </Button>
      </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
