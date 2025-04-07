
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
    <div className="flex flex-col items-center justify-between h-full min-h-screen bg-april-background px-4 py-8">
      <div className="w-full max-w-md flex flex-col items-center justify-center">
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
            className="h-10" 
          />
        </a>
        
        {/* April Kot Image */}
        <div className="w-44 h-44 mb-8">
          <img 
            src="/lovable-uploads/618e3371-cde8-4060-ba50-51efc3c4d6ba.png" 
            alt="April Kot" 
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      <div className="w-full max-w-md flex-grow flex flex-col justify-center">
        <div className="p-6 bg-white rounded-2xl shadow-sm mb-5" dir="rtl">
          <h2 className="text-xl font-bold mb-4 text-center">
            <span className="mr-2">היי, אני אפריל קוט</span>
            <span role="img" aria-label="peach">🍑</span>
          </h2>
          <p className="text-lg text-center mb-6">מאיפה את או איפה בא לך לאכול היום?</p>
        
          {/* City dropdown */}
          <div className="mt-4">
            <Select value={selectedCity} onValueChange={onCityChange}>
              <SelectTrigger 
                dir="rtl" 
                className="w-full text-right border-2 rounded-xl py-6"
              >
                <SelectValue placeholder="כל הערים" />
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
          className="w-full text-lg py-6 bg-pink-500 hover:bg-pink-600 rounded-full flex items-center justify-center"
          dir="rtl"
        >
          <Sparkles className="h-5 w-5 mr-2" />
          <span>תגרילי לי מקום</span>
        </Button>
      </div>
      
      <div className="w-full max-w-md pt-8">
        {/* Footer content if needed */}
      </div>
    </div>
  );
};

export default WelcomeScreen;
