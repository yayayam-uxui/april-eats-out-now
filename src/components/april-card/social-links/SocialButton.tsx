
import React from 'react';

interface SocialButtonProps {
  href?: string;
  onClick?: () => void;
  ariaLabel: string;
  children: React.ReactNode;
}

const SocialButton: React.FC<SocialButtonProps> = ({ 
  href, 
  onClick, 
  ariaLabel, 
  children 
}) => {
  if (href) {
    return (
      <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="april-social-button w-12 h-12 flex items-center justify-center"
        aria-label={ariaLabel}
      >
        {children}
      </a>
    );
  }
  
  return (
    <button 
      onClick={onClick}
      className="april-social-button w-12 h-12 flex items-center justify-center"
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
};

export default SocialButton;
