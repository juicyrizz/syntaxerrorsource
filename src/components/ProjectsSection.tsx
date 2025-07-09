import React from 'react';
import { ExternalLink } from 'lucide-react';

interface Project {
  title: string;
  description: string;
  url: string;
  image: string;
}

const projects: Project[] = [
  {
    title: "Juicy Gaming Hub",
    description: "A website that you can play classic but featuristic theme games.",
    url: "https://juicygamehub.html-5.me/?i=1",
  image:"https://i.pinimg.com/736x/83/80/d2/8380d21b040094020ff538241a139cb5.jpg"
  },
  {
    title: "RECOMMENDATION WEBSITE", 
    description: "A recommendation website for all computer parts enthusiast.",
    url: "https://juicyrecom.html-5.me/?i=1",
    image: "https://media.istockphoto.com/id/1306281544/vector/online-computer-or-mobile-video-games-concept-banner-e-sports-desk-of-computer-gamer-monitor.jpg?s=612x612&w=0&k=20&c=REoKMDXnRk32Va8SXQpedhf4hda3LzX9cpbeMAaPuPc="
  },
  {
    title: "Coming Soon...",
    description: "Coming Soon...",
    url: "https://wallpapers.com/images/hd/coming-soon-starry-background-mr80am5zjv0g6n0l.jpg",          
    image:"https://img.freepik.com/premium-vector/modern-coming-soon-poster-with-stay-tuned-message_1213848-637.jpg?semt=ais_hybrid&w=740"
  },
  {
    title: "Coming Soon...",
    description: "Coming Soon...",
    url: "https://wallpapers.com/images/hd/coming-soon-starry-background-mr80am5zjv0g6n0l.jpg",
    image: "https://img.freepik.com/premium-vector/modern-coming-soon-poster-with-stay-tuned-message_1213848-637.jpg?semt=ais_hybrid&w=740"
  },
  {
    title: "Coming Soon...", 
    description: "Coming Soon...",
    url: "https://wallpapers.com/images/hd/coming-soon-starry-background-mr80am5zjv0g6n0l.jpg",
    image: "https://img.freepik.com/premium-vector/modern-coming-soon-poster-with-stay-tuned-message_1213848-637.jpg?semt=ais_hybrid&w=740"
  },
  {
    title: "Coming Soon...",
    description: "Coming Soon...",
    url: "https://wallpapers.com/images/hd/coming-soon-starry-background-mr80am5zjv0g6n0l.jpg",
    image: "https://img.freepik.com/premium-vector/modern-coming-soon-poster-with-stay-tuned-message_1213848-637.jpg?semt=ais_hybrid&w=740"
  }
];

export const ProjectsSection: React.FC = () => {
  return (
    <section className="relative z-10 py-15 px-5 max-w-6xl mx-auto">
      <h2 className="font-orbitron text-center mb-12 text-6xl uppercase tracking-[3px] text-cyan-300 sticky top-0 py-5 border-b-2 border-white/15 backdrop-blur-md bg-gradient-to-b from-black/90 via-black/70 to-transparent z-10"
          style={{ 
            textShadow: '0 0 20px #ADF8FF, 0 0 30px rgba(173, 216, 230, 0.4)',
            fontFamily: 'Orbitron, sans-serif'
          }}>
        Projects
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-15">
        {projects.map((project, index) => (
          <div
            key={index}
            className="bg-black/60 rounded-2xl overflow-hidden border border-white/15 shadow-[0_0_15px_rgba(0,0,0,0.7)] transition-all duration-300 hover:transform hover:-translate-y-3 hover:scale-105 hover:shadow-[0_0_35px_rgba(173,216,230,0.6)] hover:border-cyan-300 backdrop-blur-lg flex flex-col text-center group"
          >
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col text-inherit no-underline p-5 h-full"
            >
              <img
                src={project.image}
                alt={`${project.title} Thumbnail`}
                className="w-full h-56 object-cover rounded-xl mb-4 brightness-90 contrast-110 transition-all duration-300 border border-white/5 group-hover:brightness-110 group-hover:contrast-120 group-hover:scale-105"
                style={{
                  filter: 'brightness(0.9) contrast(1.1)'
                }}
              />
              <h3 className="font-orbitron text-xl mt-2 mb-2 text-cyan-300"
                  style={{ 
                    textShadow: '0 0 8px rgba(173, 248, 255, 0.5)',
                    fontFamily: 'Orbitron, sans-serif'
                  }}>
                {project.title}
              </h3>
              <p className="text-sm leading-relaxed text-gray-300 flex-grow mt-2">
                {project.description}
              </p>
              <ExternalLink className="w-5 h-5 mt-4 mx-auto text-cyan-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </a>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-15 pt-8 border-t border-white/8">
        <div className="max-w-md w-full bg-gradient-to-br from-purple-900/80 to-blue-900/80 rounded-2xl overflow-hidden border border-purple-500 shadow-[0_0_25px_rgba(160,32,240,0.7)] transition-all duration-300 hover:shadow-[0_0_50px_rgba(160,32,240,0.9),0_0_80px_rgba(0,180,255,0.7)] hover:transform hover:-translate-y-4 hover:scale-105 hover:border-fuchsia-500 backdrop-blur-lg flex flex-col text-center group">
          <a
            href="https://discord.gg/ubucVjFECb"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col text-inherit no-underline p-5 h-full"
          >
            <img
              src="https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Join Our Community"
              className="w-full h-56 object-cover rounded-xl mb-4 brightness-90 contrast-110 transition-all duration-300 border border-white/5 group-hover:brightness-110 group-hover:contrast-120 group-hover:scale-105"
            />
            <h3 className="font-orbitron text-xl mt-2 mb-2 text-yellow-400"
                style={{ 
                  textShadow: '0 0 10px #FFD700',
                  fontFamily: 'Orbitron, sans-serif'
                }}>
              Join Our Community!
            </h3>
            <p className="text-sm leading-relaxed text-gray-300 flex-grow mt-2">
              Connect with us on Discord for updates, support, and more!
            </p>
          </a>
        </div>
      </div>
    </section>
  );
};