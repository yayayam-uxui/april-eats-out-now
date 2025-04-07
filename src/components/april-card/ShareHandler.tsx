
import React from 'react';

interface ShareHandlerProps {
  restaurant: {
    name: string;
    city?: string;
  };
}

const ShareHandler: React.FC<ShareHandlerProps> = ({ restaurant }) => {
  // Function to handle sharing
  const handleShare = async () => {
    const shareData = {
      title: `אפריל קוט ממליצה: ${restaurant.name}`,
      text: `אפריל קוט ממליצה על ${restaurant.name}${restaurant.city ? ` ב${restaurant.city}` : ''}.`,
      url: window.location.href,
    };

    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareData.text + ' ' + shareData.url);
        alert('הקישור הועתק ללוח!');
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };
  
  return handleShare;
};

export default ShareHandler;
