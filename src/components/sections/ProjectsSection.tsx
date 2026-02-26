import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Database } from '../../lib/database.types';
import { Plus, Trash2, FolderGit2, ExternalLink, Github, Star } from 'lucide-react';

type Project = Database['public']['Tables']['projects']['Row'];

export default function ProjectsSection() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technologies: '',
    url: '',
    github_url: '',
    image_url: '',
    start_date: '',
    end_date: '',
    is_featured: false,
  });

  useEffect(() => {
    loadProjects();
  }, [user]);

  const loadProjects = async () => {
    if (!user) return;

    setLoading(true);
    const { data } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', user.id)
      .order('display_order', { ascending: true });

    if (data) {
      setProjects(data);
    }
    setLoading(false);
  };

  const handleAdd = () => {
    setEditingId('new');
    setFormData({
      title: '',
      description: '',
      technologies: '',
      url: '',
      github_url: '',
      image_url: '',
      start_date: '',
      end_date: '',
      is_featured: false,
    });
  };

  const handleEdit = (project: Project) => {
    setEditingId(project.id);
    setFormData({
      title: project.title,
      description: project.description,
      technologies: project.technologies.join(', '),
      url: project.url,
      github_url: project.github_url,
      image_url: project.image_url,
      start_date: project.start_date || '',
      end_date: project.end_date || '',
      is_featured: project.is_featured,
    });
  };

  const handleSave = async () => {
    if (!user) return;

    const techArray = formData.technologies
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t);

    if (editingId === 'new') {
      await supabase.from('projects').insert({
        user_id: user.id,
        title: formData.title,
        description: formData.description,
        technologies: techArray,
        url: formData.url,
        github_url: formData.github_url,
        image_url: formData.image_url,
        start_date: formData.start_date || null,
        end_date: formData.end_date || null,
        is_featured: formData.is_featured,
      });
    } else {
      await supabase
        .from('projects')
        .update({
          title: formData.title,
          description: formData.description,
          technologies: techArray,
          url: formData.url,
          github_url: formData.github_url,
          image_url: formData.image_url,
          start_date: formData.start_date || null,
          end_date: formData.end_date || null,
          is_featured: formData.is_featured,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editingId!);
    }

    setEditingId(null);
    loadProjects();
  };

  const handleDelete = async (id: string) => {
    await supabase.from('projects').delete().eq('id', id);
    loadProjects();
  };

  if (loading) {
    return <div className="text-slate-600">Loading projects...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Projects</h2>
          <p className="text-slate-600 mt-1">Showcase your portfolio and personal projects</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition"
        >
          <Plus className="w-4 h-4" />
          Add Project
        </button>
      </div>

      {editingId && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
          <h3 className="text-lg font-semibold text-slate-900">
            {editingId === 'new' ? 'Add New Project' : 'Edit Project'}
          </h3>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">Project Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                placeholder="My Awesome Project"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                placeholder="Describe what this project does and your role in it..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Technologies (comma-separated)
              </label>
              <input
                type="text"
                value={formData.technologies}
                onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                placeholder="React, TypeScript, Node.js, PostgreSQL"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Project URL</label>
              <input
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                placeholder="https://project.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">GitHub URL</label>
              <input
                type="url"
                value={formData.github_url}
                onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                placeholder="https://github.com/username/project"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Start Date</label>
              <input
                type="month"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">End Date</label>
              <input
                type="month"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-2 focus:ring-slate-900"
                />
                <Star className="w-4 h-4 text-slate-700" />
                <span className="text-sm font-medium text-slate-700">Feature this project</span>
              </label>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition"
            >
              Save
            </button>
            <button
              onClick={() => setEditingId(null)}
              className="px-6 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {projects.map((project) => (
          <div key={project.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FolderGit2 className="w-5 h-5 text-slate-700" />
                  <h3 className="text-lg font-semibold text-slate-900">{project.title}</h3>
                  {project.is_featured && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
                </div>
              </div>
              <p className="text-slate-600 text-sm mb-4">{project.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.technologies.map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-lg"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-3">
                {project.url && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Live Demo
                  </a>
                )}
                {project.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900"
                  >
                    <Github className="w-4 h-4" />
                    Code
                  </a>
                )}
              </div>
              <div className="flex gap-2 mt-4 pt-4 border-t border-slate-200">
                <button
                  onClick={() => handleEdit(project)}
                  className="flex-1 px-4 py-2 text-sm bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {projects.length === 0 && !editingId && (
        <div className="text-center py-12 text-slate-500">
          No projects added yet. Click "Add Project" to get started.
        </div>
      )}
    </div>
  );
}
