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
    <div className="flex flex-col items-center min-h-screen overflow-hidden px-4 pb-6" dir="rtl">
      <div className="april-header !pt-6 mb-3">
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
            className="h-8"
          />
        </a>
      </div>

      {/* Everything below the logo is centered as one block, so nothing sinks
          to the bottom of tall screens */}
      <div className="flex-1 w-full flex flex-col items-center justify-center">
        {/* Cabaret sign */}
        <div className="w-full max-w-sm bg-april-navy rounded-2xl px-6 pt-4 pb-5 text-center shadow-xl relative">
          <div className="flex justify-center gap-2.5 mb-2.5" aria-hidden="true">
            {Array.from({ length: 9 }).map((_, i) => (
              <span
                key={i}
                className="w-2 h-2 rounded-full bg-april-gold animate-pulse"
                style={{ animationDelay: `${i * 180}ms` }}
              />
            ))}
          </div>
          <div className="text-april-gold/80 text-[10px] tracking-[0.35em] font-medium mb-1">
            THE APRICOT LABS PRESENTS
          </div>
          <h1 className="font-karantina font-bold text-6xl text-april-background leading-none">
            אפריל קוט
          </h1>
          <p className="font-karantina text-2xl text-april-gold mt-1">
            בוחרת לך איפה לאכול הערב
          </p>
        </div>

        {/* April herself, stepping out from under the sign */}
        <div className="w-60 h-60 sm:w-72 sm:h-72 mx-auto animate-bounce-slight -mt-2">
          <img
            src={WELCOME_CHARACTER.src}
            alt={WELCOME_CHARACTER.alt}
            className="w-full h-full object-contain"
          />
        </div>

        <div className="april-container flex flex-col justify-center">
          <div className="p-5 bg-white rounded-2xl shadow-sm mb-4 transition-all duration-300 hover:shadow-md text-right">
            <p className="text-lg text-center mb-4">מאיפה את, או איפה בא לך לאכול היום?</p>

            {/* City dropdown - improved RTL support */}
            <div dir="rtl">
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
            className="w-full text-lg py-6 bg-april-fuchsia hover:bg-opacity-90 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-[1.02]"
          >
            <Sparkles className="h-5 w-5 ml-2" />
            <span>תגרילי לי מקום 🎰</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
