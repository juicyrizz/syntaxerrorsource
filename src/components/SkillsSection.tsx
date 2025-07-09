import React from 'react';
import { 
  Code, 
  Database, 
  Globe, 
  Cpu, 
  Palette, 
  Terminal,
  Zap,
  Layers
} from 'lucide-react';

const skills = [
  { name: 'Python', icon: Code, color: 'text-yellow-400' },
  { name: 'JavaScript', icon: Globe, color: 'text-yellow-300' },
  { name: 'C++', icon: Terminal, color: 'text-blue-400' },
  { name: 'C#', icon: Zap, color: 'text-purple-400' },
  { name: 'Node.js', icon: Database, color: 'text-green-400' },
  { name: 'HTML', icon: Layers, color: 'text-orange-400' },
  { name: 'CSS', icon: Palette, color: 'text-blue-300' },
  { name: 'React', icon: Cpu, color: 'text-cyan-400' }
];

export const SkillsSection: React.FC = () => {
  return (
    <section className="relative z-10 py-15 px-5 max-w-6xl mx-auto pb-20">
      <h2 className="font-orbitron text-center mb-12 text-6xl uppercase tracking-[3px] text-cyan-300 sticky top-0 py-5 border-b-2 border-white/15 backdrop-blur-md bg-gradient-to-b from-black/90 via-black/70 to-transparent z-10"
          style={{ 
            textShadow: '0 0 20px #ADF8FF, 0 0 30px rgba(173, 216, 230, 0.4)',
            fontFamily: 'Orbitron, sans-serif'
          }}>
        Skills & Languages
      </h2>
      
      <div className="flex flex-wrap justify-center gap-10 mt-8">
        {skills.map((skill, index) => {
          const IconComponent = skill.icon;
          return (
            <div
              key={index}
              className="w-25 h-25 flex flex-col items-center justify-center p-2 opacity-70 transition-all duration-400 hover:opacity-100 hover:scale-115 cursor-pointer group"
              style={{
                filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.3)) grayscale(80%)'
              }}
            >
              <IconComponent 
                className={`w-16 h-16 ${skill.color} group-hover:drop-shadow-[0_0_25px_#ADF8FF] transition-all duration-400`}
                style={{
                  filter: 'grayscale(80%)'
                }}
              />
              <span className="text-xs mt-2 text-gray-400 group-hover:text-cyan-300 transition-colors duration-400">
                {skill.name}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
};