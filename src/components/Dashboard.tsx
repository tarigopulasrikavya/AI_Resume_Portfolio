import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Navigation from './Navigation';
import ProfileSection from './sections/ProfileSection';
import ExperienceSection from './sections/ExperienceSection';
import EducationSection from './sections/EducationSection';
import SkillsSection from './sections/SkillsSection';
import ProjectsSection from './sections/ProjectsSection';
import PreviewSection from './sections/PreviewSection';
import { Database } from '../lib/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];

type Section = 'profile' | 'experience' | 'education' | 'skills' | 'projects' | 'preview';

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState<Section>('profile');
  const [profile, setProfile] = useState<Profile | null>(null);

  return (
    <div className="flex h-screen bg-slate-50">
      <Navigation activeSection={activeSection} onSectionChange={setActiveSection} />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto p-8">
          {activeSection === 'profile' && <ProfileSection profile={profile} setProfile={setProfile} />}
          {activeSection === 'experience' && <ExperienceSection />}
          {activeSection === 'education' && <EducationSection />}
          {activeSection === 'skills' && <SkillsSection />}
          {activeSection === 'projects' && <ProjectsSection />}
          {activeSection === 'preview' && <PreviewSection profile={profile} />}
        </div>
      </main>
    </div>
  );
}
