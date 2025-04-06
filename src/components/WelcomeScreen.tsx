
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
    <div className="flex flex-col items-center justify-center text-center gap-8 w-full max-w-md mx-auto pt-6 pb-24">
      <div className="flex flex-col items-center">
        {/* Logo with link to Apricot Labs website */}
        <a 
          href="https://www.theapricotlabs.com/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="inline-block"
        >
          <img 
            src="/lovable-uploads/d7405f47-bd45-4033-9f24-0c66db6ebeb9.png" 
            alt="Apricot Labs" 
            className="h-16 mb-4"
          />
        </a>
        <div className="w-80 h-80 relative">
          {/* Using the new uploaded image */}
          <img 
            src="/lovable-uploads/618e3371-cde8-4060-ba50-51efc3c4d6ba.png" 
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
          <div className="mt-4 mb-2">
            <Select value={selectedCity} onValueChange={onCityChange}>
              <SelectTrigger dir="rtl" className="w-full text-right">
                <SelectValue placeholder="בחרי עיר" />
              </SelectTrigger>
              <SelectContent dir="rtl" position="item-aligned" className="bg-white">
                {cities.length > 0 ? (
                  <>
                    <SelectItem value="all">כל הערים</SelectItem>
                    {cities.map((city) => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </>
                ) : (
                  <SelectItem value="all">טוען ערים...</SelectItem>
                )}
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
