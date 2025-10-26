import React from 'react';

export const JapanFlag: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <rect fill="#f0f0f0" width="512" height="512"/>
    <circle fill="#d80027" cx="256" cy="256" r="111.304"/>
  </svg>
);

export const SriLankaFlag: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <rect fill="#ffda44" width="512" height="512"/>
    <rect fill="#6da544" x="25.6" y="114.8" width="76.8" height="282.4"/>
    <rect fill="#ff9811" x="102.4" y="114.8" width="76.8" height="282.4"/>
    <path fill="#a2001d" d="M179.2,397.2V114.8h307.2v282.4H179.2z"/>
    <path fill="#ffda44" d="M304.7,178.1c-8.3-4.2-18.2-2.1-24,5.1l-14.8,18.5c-1.9,2.3-5.3,2.7-7.6,0.8c-2.3-1.9-2.7-5.3-0.8-7.6l14.8-18.5c9.5-11.9,26.2-15.5,39.5-8.5c13.3,7,18.9,22.5,13.2,36.7l-14.5,36.2c-1.3,3.3-5.1,4.9-8.4,3.5c-3.3-1.3-4.9-5.1-3.5-8.4l14.5-36.2C315.9,192.2,313,182.3,304.7,178.1z"/>
  </svg>
);
