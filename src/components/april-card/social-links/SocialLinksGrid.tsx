
import React from 'react';

interface SocialLinksGridProps {
  socialLinks: React.ReactNode[];
}

const SocialLinksGrid: React.FC<SocialLinksGridProps> = ({ socialLinks }) => {
  // If we have 5 or 6 icons, use triangle layout
  if (socialLinks.length === 5 || socialLinks.length === 6) {
    const topRowCount = 3;
    const bottomRowCount = socialLinks.length - topRowCount;

    return (
      <>
        {/* Top row - always 3 items */}
        <div className="grid grid-cols-3 gap-3 w-full">
          {socialLinks.slice(0, topRowCount).map((link, i) => (
            <div key={i} className="flex justify-center">{link}</div>
          ))}
        </div>
        
        {/* Bottom row - with special positioning */}
        <div className={`grid grid-cols-3 gap-3 w-full mt-3 ${bottomRowCount === 2 ? 'px-12' : ''}`}>
          {bottomRowCount === 2 ? (
            // For 2 items in bottom row, position them in columns 1 and 3
            <>
              <div className="flex justify-center">{socialLinks[3]}</div>
              <div className="flex justify-center"></div> {/* Empty center */}
              <div className="flex justify-center">{socialLinks[4]}</div>
            </>
          ) : (
            // For 3 items in bottom row, position normally
            socialLinks.slice(3).map((link, i) => (
              <div key={i} className="flex justify-center">{link}</div>
            ))
          )}
        </div>
      </>
    );
  }
  
  // For 4 or fewer links, use a single row
  else if (socialLinks.length <= 4) {
    return (
      <div className="flex justify-between gap-3">
        {socialLinks.map((link, i) => (
          <div key={i}>{link}</div>
        ))}
      </div>
    );
  }
  
  // For more than 6 links, use standard grid layout
  else {
    // Split into rows of 3
    const rows = [];
    for (let i = 0; i < socialLinks.length; i += 3) {
      rows.push(socialLinks.slice(i, i + 3));
    }
    
    return (
      <>
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className={`grid grid-cols-3 gap-3 w-full ${rowIndex > 0 ? 'mt-3' : ''}`}>
            {row.map((link, i) => (
              <div key={i} className="flex justify-center">{link}</div>
            ))}
            
            {/* Fill remaining slots with empty divs if needed */}
            {[...Array(3 - row.length)].map((_, i) => (
              <div key={`empty-${i}`} className="flex justify-center"></div>
            ))}
          </div>
        ))}
      </>
    );
  }
};

export default SocialLinksGrid;
