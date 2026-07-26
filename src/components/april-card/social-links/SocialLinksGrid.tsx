import React from 'react';

interface SocialLinksGridProps {
  socialLinks: React.ReactNode[];
}

// One centered row, equal gaps, wraps naturally when a place has many links.
// Six 48px buttons fit a mobile card in a single row; anything more wraps
// into a second centered row — always aligned, no special cases.
const SocialLinksGrid: React.FC<SocialLinksGridProps> = ({ socialLinks }) => {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {socialLinks.map((link, i) => (
        <div key={i}>{link}</div>
      ))}
    </div>
  );
};

export default SocialLinksGrid;
