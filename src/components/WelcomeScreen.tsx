
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
    <div className="flex flex-col items-center justify-between min-h-[80vh] text-center w-full max-w-md mx-auto py-10 px-4">
      <div className="flex flex-col items-center w-full">
        {/* Logo with link to Apricot Labs website */}
        <a 
          href="https://www.theapricotlabs.com/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="mb-8"
        >
          <img 
            src="/lovable-uploads/1d24a55a-4f8d-44f4-91a0-0cf3d0681371.png" 
            alt="Apricot Labs" 
            className="h-16" 
          />
        </a>
        
        {/* April Kot Image */}
        <div className="w-48 h-48 mb-10">
          <img 
            src="/lovable-uploads/618e3371-cde8-4060-ba50-51efc3c4d6ba.png" 
            alt="April Kot" 
            className="w-full h-full object-contain animate-bounce-slight"
          />
        </div>
      </div>

      <div className="space-y-6 w-full">
        <div className="p-6 bg-white rounded-3xl shadow-md" dir="rtl">
          <h2 className="text-xl font-medium mb-4 text-center">
            <span className="mr-2">היי, אני אפריל קוט</span>
            <span role="img" aria-label="peach">🍑</span>
          </h2>
          <p className="text-lg text-center mb-6">מאיפה את או איפה בא לך לאכול היום?</p>
        
          {/* City dropdown */}
          <div className="mt-4">
            <Select value={selectedCity} onValueChange={onCityChange}>
              <SelectTrigger dir="rtl" className="w-full text-right border-2 rounded-xl py-6">
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
          className="april-button w-full text-lg py-6 rounded-full"
          dir="rtl"
        >
          <span className="mr-2">תגרילי לי מקום</span>
          <span role="img" aria-label="sparkle">✨</span>
        </Button>
      </div>
    </div>
  );
};

export default WelcomeScreen;
