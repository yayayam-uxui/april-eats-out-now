
import React, { useState, useEffect } from 'react';
import { Restaurant } from '@/types/restaurant';
import { getAllRestaurants, getRandomRestaurant, getAllCities } from '@/utils/getRandomFromSheet';
import WelcomeScreen from '@/components/WelcomeScreen';
import AprilCard from '@/components/april-card';
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(false);
  const [cities, setCities] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [lastSelectedRestaurantId, setLastSelectedRestaurantId] = useState<string | null>(null);
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
      // Filter restaurants by city if needed
      const filteredRestaurants = city 
        ? restaurants.filter(restaurant => restaurant.city === city)
        : restaurants;
      
      if (filteredRestaurants.length === 0) {
        toast({
          title: "אופס!",
          description: city 
            ? `לא הצלחתי למצוא מסעדה ב${city}. נסי עיר אחרת.` 
            : "לא הצלחתי למצוא מסעדה. נסי שוב מאוחר יותר.",
        });
        setLoading(false);
        return;
      }
      
      // If there's only one restaurant in the city and it's the same as last time
      if (filteredRestaurants.length === 1 && 
          lastSelectedRestaurantId === filteredRestaurants[0].name + filteredRestaurants[0].city) {
        // Get random restaurant from any city
        const randomRestaurant = getRandomRestaurant(restaurants);
        
        if (randomRestaurant) {
          toast({
            title: "רק מקום אחד זמין",
            description: `אין עוד מקומות ב${city}. מה דעתך על מקום מ${randomRestaurant.city}?`,
          });
          setSelectedRestaurant(randomRestaurant);
          setLastSelectedRestaurantId(randomRestaurant.name + randomRestaurant.city);
        }
      } else {
        // Normal flow - get a random restaurant from filtered list
        const restaurant = getRandomRestaurant(restaurants, city);
        
        if (restaurant) {
          setSelectedRestaurant(restaurant);
          setLastSelectedRestaurantId(restaurant.name + restaurant.city);
        } else {
          toast({
            title: "אופס!",
            description: city 
              ? `לא הצלחתי למצוא מסעדה ב${city}. נסי עיר אחרת.` 
              : "לא הצלחתי למצוא מסעדה. נסי שוב מאוחר יותר.",
          });
        }
      }
      
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
