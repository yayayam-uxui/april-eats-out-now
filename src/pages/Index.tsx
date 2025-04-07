
import React, { useState, useEffect } from 'react';
import { Restaurant } from '@/types/restaurant';
import { getAllRestaurants, getRandomRestaurant, getAllCities } from '@/utils/getRandomFromSheet';
import WelcomeScreen from '@/components/WelcomeScreen';
import AprilCard from '@/components/AprilCard';
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(false);
  const [cities, setCities] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const { toast } = useToast();

  useEffect(() => {
    const fetchRestaurants = async () => {
      const data = await getAllRestaurants();
      setRestaurants(data);
      
      // Extract cities from restaurant data
      const cityList = getAllCities(data);
      setCities(cityList);
    };

    fetchRestaurants();
  }, []);

  const handleGenerateClick = (city?: string) => {
    setLoading(true);
    
    // Simulate a slight delay for the "shuffle" feeling
    setTimeout(() => {
      const restaurant = getRandomRestaurant(restaurants, city);
      
      if (restaurant) {
        setSelectedRestaurant(restaurant);
      } else {
        toast({
          title: "אופס!",
          description: city 
            ? `לא הצלחתי למצוא מסעדה ב${city}. נסי עיר אחרת.` 
            : "לא הצלחתי למצוא מסעדה. נסי שוב מאוחר יותר.",
        });
      }
      
      setLoading(false);
    }, 800);
  };

  const handleBackClick = () => {
    setSelectedRestaurant(null);
  };

  return (
    <div className="min-h-screen bg-april-background flex flex-col items-center">
      <div className="w-full max-w-md relative">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 h-screen">
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
