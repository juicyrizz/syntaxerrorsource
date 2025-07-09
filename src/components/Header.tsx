import React from 'react';
import { AlertTriangle, Code, Zap } from 'lucide-react';
import { OptimizedMusicPlayer } from './OptimizedMusicPlayer';

export const Header: React.FC = () => {
  return (
    <header className="relative z-20 pt-20 pb-10 px-5 text-center bg-gradient-to-b from-black/80 to-transparent">
      <div className="logo mb-5">
        <div className="inline-block relative group">
          {/* Main syntax error symbol */}
          <div className="relative">
            <AlertTriangle 
              className="w-60 h-60 text-red-400 animate-pulse drop-shadow-[0_0_25px_#FF6B6B]" 
              style={{
                animation: 'float 4s ease-in-out infinite, pulse-glow-red 2s ease-in-out infinite alternate'
              }}
            />
            {/* Code brackets around the triangle */}
            <Code 
              className="absolute -left-16 top-1/2 transform -translate-y-1/2 w-12 h-12 text-cyan-300 opacity-80 animate-pulse"
              style={{
                animation: 'float 4s ease-in-out infinite 0.5s, pulse-glow 3s ease-in-out infinite alternate'
              }}
            />
            <Code 
              className="absolute -right-16 top-1/2 transform -translate-y-1/2 rotate-180 w-12 h-12 text-cyan-300 opacity-80 animate-pulse"
              style={{
                animation: 'float 4s ease-in-out infinite 1s, pulse-glow 3s ease-in-out infinite alternate'
              }}
            />
            {/* Lightning bolts for "error sparks" */}
            <Zap 
              className="absolute -top-8 -left-8 w-8 h-8 text-yellow-400 opacity-70"
              style={{
                animation: 'float 3s ease-in-out infinite 0.2s, pulse-glow-yellow 1.5s ease-in-out infinite alternate'
              }}
            />
            <Zap 
              className="absolute -bottom-8 -right-8 w-8 h-8 text-yellow-400 opacity-70 rotate-180"
              style={{
                animation: 'float 3s ease-in-out infinite 1.5s, pulse-glow-yellow 1.5s ease-in-out infinite alternate'
              }}
            />
          </div>
          
          {/* Glitch text overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white font-mono text-2xl font-bold opacity-90 animate-pulse"
                  style={{
                    textShadow: '0 0 10px rgba(255, 255, 255, 0.8), 2px 0 0 #ff0000, -2px 0 0 #00ffff',
                    animation: 'glitch 2s infinite'
                  }}>
              {'</>'}
            </span>
          </div>
        </div>
      </div>
      <h1 className="font-orbitron text-3xl text-red-400 tracking-[2px] mt-5" 
          style={{ 
            textShadow: '0 0 15px rgba(255, 107, 107, 0.8), 0 0 25px rgba(255, 107, 107, 0.4)',
            fontFamily: 'Orbitron, sans-serif'
          }}>
        SYNTAX ERROR CREATIONS
      </h1>
      <p className="font-mono text-sm text-cyan-300 mt-2 opacity-80"
         style={{
           textShadow: '0 0 8px rgba(173, 248, 255, 0.6)'
         }}>
        {'// Where bugs become features'}
      </p>
      <OptimizedMusicPlayer />
    </header>
  );
};