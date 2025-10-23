import React from 'react';

// Auto-Wheel Logo Component - Uses the exact provided logo image
const AutoWheelLogo: React.FC<{ className?: string }> = ({ className = "h-8 w-8" }) => {
  return (
    <div className={`${className} flex items-center justify-center`}>
      <img 
        src="/auto-wheel-logo.jpg" 
        alt="Auto-Wheel Logo" 
        className="w-full h-full object-contain drop-shadow-lg"
        onError={(e) => {
          console.log('Logo image not found. Please add auto-wheel-logo.png to the public folder.');
          // Show placeholder text if image is not found
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          const parent = target.parentElement;
          if (parent) {
            parent.innerHTML = `
              <div class="flex items-center justify-center w-full h-full bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg text-white font-bold text-xs">
                AUTO<br/>WHEEL
              </div>
            `;
          }
        }}
      />
    </div>
  );
};

export default AutoWheelLogo;