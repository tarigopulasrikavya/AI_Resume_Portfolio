import { FileText, User, Briefcase, GraduationCap, Wrench, FolderGit2, Eye, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

type Section = 'profile' | 'experience' | 'education' | 'skills' | 'projects' | 'preview';

interface NavigationProps {
  activeSection: Section;
  onSectionChange: (section: Section) => void;
}

export default function Navigation({ activeSection, onSectionChange }: NavigationProps) {
  const { signOut } = useAuth();

  const menuItems = [
    { id: 'profile' as Section, label: 'Profile', icon: User },
    { id: 'experience' as Section, label: 'Experience', icon: Briefcase },
    { id: 'education' as Section, label: 'Education', icon: GraduationCap },
    { id: 'skills' as Section, label: 'Skills', icon: Wrench },
    { id: 'projects' as Section, label: 'Projects', icon: FolderGit2 },
    { id: 'preview' as Section, label: 'Preview', icon: Eye },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-900 rounded-lg">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">ResumeAI</h1>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <li key={item.id}>
                <button
                  onClick={() => onSectionChange(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    isActive
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-slate-200">
        <button
          onClick={signOut}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-700 hover:bg-slate-100 transition"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
