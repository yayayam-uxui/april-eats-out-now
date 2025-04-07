
import React from 'react';
import { MapPin, Truck, Clock } from "lucide-react";
import { Restaurant } from '@/types/restaurant';

interface RestaurantHeaderProps {
  restaurant: Restaurant;
}

const RestaurantHeader: React.FC<RestaurantHeaderProps> = ({ restaurant }) => {
  // Parse tags
  const tags = restaurant.tags ? restaurant.tags.split(',').map(tag => tag.trim()) : [];

  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold">{restaurant.name}</h2>
      
      {/* Address and city */}
      <div className="flex flex-col gap-1">
        {restaurant.address && (
          <p className="text-sm text-muted-foreground flex items-center">
            <MapPin size={14} className="ml-1" />
            {restaurant.address}
          </p>
        )}
        
        {restaurant.city && !restaurant.address && (
          <p className="text-sm text-muted-foreground flex items-center">
            <MapPin size={14} className="ml-1" />
            {restaurant.city}
          </p>
        )}
        
        {/* Delivery status */}
        {restaurant.delivery && restaurant.delivery.toLowerCase() !== "אין" && restaurant.delivery.toLowerCase() !== "לא" && (
          <p className="text-sm text-green-600 flex items-center">
            <Truck size={14} className="ml-1" />
            יש משלוחים
          </p>
        )}

        {/* When to go */}
        {restaurant.whenToGo && (
          <div className="mt-2 flex items-start">
            <Clock size={14} className="ml-1 mt-1 flex-shrink-0 text-april-fuchsia" />
            <p className="text-sm">{restaurant.whenToGo}</p>
          </div>
        )}
      </div>

      <blockquote className="italic border-r-4 border-april-fuchsia pr-4 my-4">
        "{restaurant.aprilQuote}"
      </blockquote>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 my-4">
          {tags.map((tag, index) => (
            <span 
              key={index} 
              className="april-tag"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default RestaurantHeader;
