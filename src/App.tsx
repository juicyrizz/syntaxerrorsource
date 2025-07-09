import React from 'react';
import { StarField } from './components/StarField';
import { CodeBackground } from './components/CodeBackground';
import { GlitchOverlay } from './components/GlitchOverlay';
import { Header } from './components/Header';
import { MembersSection } from './components/MembersSection';
import { ProjectsSection } from './components/ProjectsSection';
import { SkillsSection } from './components/SkillsSection';
import { Footer } from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-black text-gray-300 font-roboto overflow-x-hidden relative">
      <StarField />
      <CodeBackground />
      <GlitchOverlay />
      <Header />
      <MembersSection />
      <ProjectsSection />
      <SkillsSection />
      <Footer />
    </div>
  );
}

export default App;