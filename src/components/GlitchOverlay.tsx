import React, { useEffect, useState } from 'react';

export const GlitchOverlay: React.FC = () => {
  const [glitchActive, setGlitchActive] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.1) { // 10% chance every interval
        setGlitchActive(true);
        setTimeout(() => setGlitchActive(false), 150);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  if (!glitchActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-30">
      {/* Red glitch bars */}
      <div 
        className="absolute w-full bg-red-500 opacity-20"
        style={{
          height: '2px',
          top: `${Math.random() * 100}%`,
          animation: 'glitch 0.1s infinite'
        }}
      />
      <div 
        className="absolute w-full bg-cyan-400 opacity-20"
        style={{
          height: '1px',
          top: `${Math.random() * 100}%`,
          animation: 'glitch 0.15s infinite reverse'
        }}
      />
      
      {/* Scan lines */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="w-full h-px bg-white animate-pulse"
          style={{
            position: 'absolute',
            top: `${Math.random() * 100}%`,
            animation: 'scan-line 0.1s linear infinite'
          }}
        />
      </div>
    </div>
  );
};