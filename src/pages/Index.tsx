import React, { useState, useEffect, useRef } from 'react';
import { Restaurant } from '@/types/restaurant';
import { getAllRestaurants, getAllCities, pickRestaurant, restaurantKey } from '@/utils/getRandomFromSheet';
import WelcomeScreen from '@/components/WelcomeScreen';
import SlotMachine from '@/components/SlotMachine';
import AprilCard from '@/components/april-card';
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  // While the slot machine spins, the winner is already decided — it's here.
  const [pendingRestaurant, setPendingRestaurant] = useState<Restaurant | null>(null);
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
    const { restaurant, poolExhausted } = pickRestaurant(restaurants, city, shownRef.current);

    if (!restaurant) {
      toast({
        title: "אופס!",
        description: city
          ? `לא הצלחתי למצוא מסעדה ב${city}. נסי עיר אחרת.`
          : "לא הצלחתי למצוא מסעדה. נסי שוב מאוחר יותר.",
      });
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
    setSelectedRestaurant(null);
    setPendingRestaurant(restaurant);
  };

  const handleSpinDone = () => {
    if (pendingRestaurant) {
      setSelectedRestaurant(pendingRestaurant);
      setPendingRestaurant(null);
    }
  };

  const handleBackClick = () => {
    setSelectedRestaurant(null);
  };

  return (
    <div className="min-h-screen bg-april-background flex flex-col items-center" dir="rtl">
      <div className="w-full max-w-md relative">
        {pendingRestaurant ? (
          <SlotMachine
            targetSrc={pendingRestaurant.characterSrc}
            targetAlt={pendingRestaurant.characterAlt}
            onDone={handleSpinDone}
          />
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
