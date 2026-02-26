import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Database } from '../../lib/database.types';
import { Mail, Phone, MapPin, Globe, Linkedin, Github, Briefcase, GraduationCap, Wrench, FolderGit2 } from 'lucide-react';

type Profile = Database['public']['Tables']['profiles']['Row'];
type WorkExperience = Database['public']['Tables']['work_experience']['Row'];
type Education = Database['public']['Tables']['education']['Row'];
type Skill = Database['public']['Tables']['skills']['Row'];
type Project = Database['public']['Tables']['projects']['Row'];

interface PreviewSectionProps {
  profile: Profile | null;
}

export default function PreviewSection({ profile }: PreviewSectionProps) {
  const { user } = useAuth();
  const [experiences, setExperiences] = useState<WorkExperience[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    const [expData, eduData, skillData, projData] = await Promise.all([
      supabase.from('work_experience').select('*').eq('user_id', user.id).order('display_order'),
      supabase.from('education').select('*').eq('user_id', user.id).order('display_order'),
      supabase.from('skills').select('*').eq('user_id', user.id).order('category'),
      supabase.from('projects').select('*').eq('user_id', user.id).order('display_order'),
    ]);

    if (expData.data) setExperiences(expData.data);
    if (eduData.data) setEducations(eduData.data);
    if (skillData.data) setSkills(skillData.data);
    if (projData.data) setProjects(projData.data);
  };

  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Resume Preview</h2>
          <p className="text-slate-600 mt-1">See how your resume looks</p>
        </div>
        <button
          onClick={() => window.print()}
          className="px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition"
        >
          Export PDF
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-12 print:shadow-none print:border-0">
        {profile && (
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">{profile.full_name}</h1>
            <p className="text-xl text-slate-700 mb-4">{profile.title}</p>

            <div className="flex flex-wrap gap-4 text-sm text-slate-600 mb-4">
              {profile.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>{profile.email}</span>
                </div>
              )}
              {profile.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>{profile.phone}</span>
                </div>
              )}
              {profile.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{profile.location}</span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-slate-600">
              {profile.website && (
                <a href={profile.website} className="flex items-center gap-2 hover:text-slate-900">
                  <Globe className="w-4 h-4" />
                  <span>Website</span>
                </a>
              )}
              {profile.linkedin && (
                <a href={profile.linkedin} className="flex items-center gap-2 hover:text-slate-900">
                  <Linkedin className="w-4 h-4" />
                  <span>LinkedIn</span>
                </a>
              )}
              {profile.github && (
                <a href={profile.github} className="flex items-center gap-2 hover:text-slate-900">
                  <Github className="w-4 h-4" />
                  <span>GitHub</span>
                </a>
              )}
            </div>

            {profile.bio && (
              <p className="mt-6 text-slate-700 leading-relaxed">{profile.bio}</p>
            )}
          </div>
        )}

        {experiences.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-slate-900">
              <Briefcase className="w-5 h-5" />
              <h2 className="text-2xl font-bold text-slate-900">Experience</h2>
            </div>
            <div className="space-y-6">
              {experiences.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{exp.position}</h3>
                      <p className="text-slate-700">{exp.company}</p>
                    </div>
                    <p className="text-sm text-slate-600">
                      {exp.start_date} - {exp.is_current ? 'Present' : exp.end_date}
                    </p>
                  </div>
                  <p className="text-sm text-slate-600 mb-2">{exp.location}</p>
                  {exp.description && (
                    <p className="text-slate-700">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {educations.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-slate-900">
              <GraduationCap className="w-5 h-5" />
              <h2 className="text-2xl font-bold text-slate-900">Education</h2>
            </div>
            <div className="space-y-4">
              {educations.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">
                        {edu.degree} in {edu.field_of_study}
                      </h3>
                      <p className="text-slate-700">{edu.institution}</p>
                    </div>
                    <p className="text-sm text-slate-600">
                      {edu.start_date} - {edu.end_date}
                    </p>
                  </div>
                  {edu.gpa && <p className="text-sm text-slate-600">GPA: {edu.gpa}</p>}
                  {edu.description && (
                    <p className="text-slate-700 mt-2">{edu.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {Object.keys(skillsByCategory).length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-slate-900">
              <Wrench className="w-5 h-5" />
              <h2 className="text-2xl font-bold text-slate-900">Skills</h2>
            </div>
            <div className="space-y-3">
              {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
                <div key={category}>
                  <h3 className="font-semibold text-slate-900 mb-2">{category}</h3>
                  <p className="text-slate-700">
                    {categorySkills.map((s) => s.name).join(' • ')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {projects.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-slate-900">
              <FolderGit2 className="w-5 h-5" />
              <h2 className="text-2xl font-bold text-slate-900">Projects</h2>
            </div>
            <div className="space-y-4">
              {projects.filter(p => p.is_featured).map((proj) => (
                <div key={proj.id}>
                  <h3 className="text-lg font-semibold text-slate-900">{proj.title}</h3>
                  <p className="text-slate-700 mb-2">{proj.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {proj.technologies.map((tech, idx) => (
                      <span key={idx} className="text-sm text-slate-600">
                        {tech}
                        {idx < proj.technologies.length - 1 && ' •'}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!profile && (
          <div className="text-center py-12 text-slate-500">
            Start by filling out your profile information
          </div>
        )}
      </div>
    </div>
  );
}
