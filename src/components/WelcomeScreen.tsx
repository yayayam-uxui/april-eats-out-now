
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
    <div className="flex flex-col items-center justify-between min-h-screen overflow-hidden bg-april-background px-4 py-4" dir="rtl">
      <div className="april-header mb-4">
        {/* Logo with link to Apricot Labs website */}
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
      </div>
      
      {/* April Kot Image - with reduced spacing */}
      <div className="april-image-container animate-bounce-slight mb-4">
        <img 
          src="/lovable-uploads/618e3371-cde8-4060-ba50-51efc3c4d6ba.png" 
          alt="April Kot" 
          className="w-full h-full object-contain scale-150"
        />
      </div>

      <div className="april-container flex flex-col justify-center mb-6">
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
  );
};

export default WelcomeScreen;
