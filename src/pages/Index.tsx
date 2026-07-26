import React, { useState, useEffect, useRef } from 'react';
import { Restaurant } from '@/types/restaurant';
import { getAllRestaurants, getAllCities, pickRestaurant, restaurantKey } from '@/utils/getRandomFromSheet';
import { LOADING_CHARACTER } from '@/lib/characters';
import WelcomeScreen from '@/components/WelcomeScreen';
import AprilCard from '@/components/april-card';
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(false);
  const [cities, setCities] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>("all");
  // Everything April already suggested this session — she won't repeat
  // herself until she's run out of places for the chosen city.
  const shownRef = useRef<Set<string>>(new Set());
  const { toast } = useToast();

  useEffect(() => {
    const fetchRestaurants = async () => {
      const data = await getAllRestaurants();
      setRestaurants(data);
      setCities(getAllCities(data));
    };

    fetchRestaurants();
  }, []);

  const handleGenerateClick = (city?: string) => {
    setLoading(true);

    // Simulate a slight delay for the "shuffle" feeling
    setTimeout(() => {
      const { restaurant, poolExhausted } = pickRestaurant(restaurants, city, shownRef.current);

      if (!restaurant) {
        toast({
          title: "אופס!",
          description: city
            ? `לא הצלחתי למצוא מסעדה ב${city}. נסי עיר אחרת.`
            : "לא הצלחתי למצוא מסעדה. נסי שוב מאוחר יותר.",
        });
        setLoading(false);
        return;
      }

      if (poolExhausted) {
        shownRef.current.clear();
        toast({
          title: "סיבוב שני 🍑",
          description: city
            ? `עברנו על כל המקומות ב${city} — מתחילות מהתחלה.`
            : "עברנו על כל הרשימה — מתחילות מהתחלה.",
        });
      }

      shownRef.current.add(restaurantKey(restaurant));
      setSelectedRestaurant(restaurant);
      setLoading(false);
    }, 800);
  };

  const handleBackClick = () => {
    setSelectedRestaurant(null);
  };

  return (
    <div className="min-h-screen bg-april-background flex flex-col items-center" dir="rtl">
      <div className="w-full max-w-md relative">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 h-screen">
            <img
              src={LOADING_CHARACTER.src}
              alt={LOADING_CHARACTER.alt}
              className="w-48 h-48 object-contain animate-bounce-slight mb-4"
            />
            <div className="text-april-fuchsia text-2xl mb-4">מגרילה...</div>
            <div className="w-12 h-12 rounded-full border-4 border-april-fuchsia border-t-transparent animate-spin"></div>
          </div>
        ) : selectedRestaurant ? (
          <AprilCard
            restaurant={selectedRestaurant}
            onTryAgain={() => handleGenerateClick(selectedCity !== 'all' ? selectedCity : undefined)}
            onBack={handleBackClick}
          />
        ) : (
          <WelcomeScreen
            onGenerateClick={handleGenerateClick}
            cities={cities}
            selectedCity={selectedCity}
            onCityChange={setSelectedCity}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
