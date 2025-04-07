
import React, { useEffect, useState } from 'react';

interface MapHandlerProps {
  mapUrl: string;
  name: string;
  city: string;
}

// Changed to return string | null instead of being a React component
const MapHandler = ({ mapUrl, name, city }: MapHandlerProps): string | null => {
  // Instead of using useState and useEffect, we'll use a more direct approach since this isn't a React component
  if (!mapUrl) return null;
  
  try {
    // Attempt to extract location data from Google Maps URL
    const url = new URL(mapUrl);
    const params = new URLSearchParams(url.search);
    
    // For URLs with query parameters (most common format)
    if (params.has('q') || params.get('query')) {
      const query = params.get('q') || params.get('query') || '';
      return `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(query)}`;
    }
    // For URLs with place IDs
    else if (mapUrl.includes('/place/')) {
      const placeMatch = mapUrl.match(/\/place\/([^\/]+)/);
      if (placeMatch && placeMatch[1]) {
        return `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(placeMatch[1])}`;
      } else {
        // If we can't extract place ID, use restaurant name and city as fallback
        const searchQuery = `${name} ${city}`.trim();
        return `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(searchQuery)}`;
      }
    }
    // Fallback to restaurant name and address
    else {
      const searchQuery = `${name} ${city}`.trim();
      return `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(searchQuery)}`;
    }
  } catch (err) {
    console.error('Error parsing maps URL:', err);
    // Fallback to restaurant name and city
    const searchQuery = `${name} ${city}`.trim();
    return `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(searchQuery)}`;
  }
};

export default MapHandler;
