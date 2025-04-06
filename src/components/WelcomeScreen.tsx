
import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";

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
    <div className="flex flex-col items-center justify-center text-center gap-8 w-full max-w-md mx-auto pt-6">
      <div className="flex flex-col items-center">
        {/* Using the logo image instead of text */}
        <img 
          src="/lovable-uploads/d7405f47-bd45-4033-9f24-0c66db6ebeb9.png" 
          alt="Apricot Labs" 
          className="h-16 mb-4"
        />
        <div className="w-60 h-60 relative">
          {/* Using the default image as the cover image */}
          <img 
            src="/lovable-uploads/704febbb-e3b1-404e-9a4d-0ba66ffbc511.png" 
            alt="April Kot" 
            className="w-full h-full object-contain animate-bounce-slight"
          />
        </div>
      </div>

      <div className="space-y-6 w-full">
        <div className="p-6 bg-white rounded-xl shadow-md" dir="rtl">
          <h2 className="text-xl font-medium mb-4 text-center">היי, אני אפריל קוט 🍑</h2>
          <p className="text-lg text-center">מאיפה את או איפה בא לך לאכול היום?</p>
        
          {/* City dropdown */}
          <div className="mt-4">
            <Select value={selectedCity} onValueChange={onCityChange}>
              <SelectTrigger dir="rtl" className="w-full text-right">
                <SelectValue placeholder="בחרי עיר" />
              </SelectTrigger>
              <SelectContent dir="rtl">
                <SelectItem value="all">כל הערים</SelectItem>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Button 
          onClick={() => onGenerateClick(selectedCity !== 'all' ? selectedCity : undefined)}
          className="april-button w-full text-lg"
          dir="rtl"
        >
          💖 תגרילי לי מקום
        </Button>
      </div>
    </div>
  );
};

export default WelcomeScreen;
