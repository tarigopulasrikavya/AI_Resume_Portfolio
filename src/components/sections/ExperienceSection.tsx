import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Database } from '../../lib/database.types';
import { Plus, Trash2, Sparkles, Briefcase } from 'lucide-react';

type WorkExperience = Database['public']['Tables']['work_experience']['Row'];

export default function ExperienceSection() {
  const { user } = useAuth();

  const [experiences, setExperiences] = useState<WorkExperience[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    company: '',
    position: '',
    location: '',
    start_date: '',
    end_date: '',
    is_current: false,
    description: '',
  });

  useEffect(() => {
    if (user) {
      loadExperiences();
    }
  }, [user]);

  const loadExperiences = async () => {
    if (!user) return;

    setLoading(true);

    const { data, error } = await supabase
      .from('work_experience')
      .select('*')
      .eq('user_id', user.id)
      .order('display_order', { ascending: true });

    if (!error && data) {
      setExperiences(data);
    }

    setLoading(false);
  };

  const handleAdd = () => {
    setEditingId('new');
    setFormData({
      company: '',
      position: '',
      location: '',
      start_date: '',
      end_date: '',
      is_current: false,
      description: '',
    });
  };

  const handleEdit = (exp: WorkExperience) => {
    setEditingId(exp.id);
    setFormData({
      company: exp.company ?? '',
      position: exp.position ?? '',
      location: exp.location ?? '',
      start_date: exp.start_date ?? '',
      end_date: exp.end_date ?? '',
      is_current: exp.is_current ?? false,
      description: exp.description ?? '',
    });
  };

  const handleSave = async () => {
    if (!user) return;

    if (editingId === 'new') {
      await supabase.from('work_experience').insert({
        user_id: user.id,
        ...formData,
        start_date: formData.start_date || null,
        end_date: formData.is_current ? null : formData.end_date || null,
      });
    } else {
      await supabase
        .from('work_experience')
        .update({
          ...formData,
          start_date: formData.start_date || null,
          end_date: formData.is_current ? null : formData.end_date || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editingId!);
    }

    setEditingId(null);
    loadExperiences();
  };

  const handleDelete = async (id: string) => {
    await supabase.from('work_experience').delete().eq('id', id);
    loadExperiences();
  };

  const generateDescription = () => {
    if (!formData.position) {
      alert('Please enter your position first');
      return;
    }

    const samples = [
      `Led development of key features and improvements, enhancing system performance and user satisfaction.`,
      `Designed and implemented scalable solutions improving operational efficiency.`,
      `Collaborated with cross-functional teams to deliver high-quality software solutions.`,
    ];

    setFormData({
      ...formData,
      description: samples[Math.floor(Math.random() * samples.length)],
    });
  };

  if (loading) {
    return <div className="text-slate-600">Loading experiences...</div>;
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Work Experience</h2>
          <p className="text-slate-600 mt-1">
            Add your professional work history
          </p>
        </div>

        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition"
        >
          <Plus className="w-4 h-4" />
          Add Experience
        </button>
      </div>

      {/* FORM */}
      {editingId && (
        <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
          <h3 className="text-lg font-semibold">
            {editingId === 'new' ? 'Add New Experience' : 'Edit Experience'}
          </h3>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Company"
              value={formData.company}
              onChange={(e) =>
                setFormData({ ...formData, company: e.target.value })
              }
              className="input"
            />

            <input
              type="text"
              placeholder="Position"
              value={formData.position}
              onChange={(e) =>
                setFormData({ ...formData, position: e.target.value })
              }
              className="input"
            />

            <input
              type="text"
              placeholder="Location"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              className="input"
            />

            <input
              type="month"
              value={formData.start_date}
              onChange={(e) =>
                setFormData({ ...formData, start_date: e.target.value })
              }
              className="input"
            />

            <input
              type="month"
              value={formData.end_date}
              disabled={formData.is_current}
              onChange={(e) =>
                setFormData({ ...formData, end_date: e.target.value })
              }
              className="input"
            />
          </div>

          <textarea
            rows={4}
            placeholder="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="input"
          />

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-slate-900 text-white rounded-lg"
            >
              Save
            </button>
            <button
              onClick={() => setEditingId(null)}
              className="px-6 py-2 bg-slate-200 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* LIST */}
      <div className="space-y-4">
        {experiences.map((exp) => (
          <div key={exp.id} className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold">{exp.position}</h3>
            <p>{exp.company}</p>
            <p className="text-sm text-slate-500">
              {exp.start_date ?? ''} -{' '}
              {exp.is_current ? 'Present' : exp.end_date ?? ''}
            </p>
            {exp.description && (
              <p className="mt-2 text-slate-600">{exp.description}</p>
            )}

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => handleEdit(exp)}
                className="px-4 py-2 bg-slate-100 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(exp.id)}
                className="p-2 text-red-600"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}

        {experiences.length === 0 && !editingId && (
          <div className="text-center py-12 text-slate-500">
            No work experience added yet.
          </div>
        )}
      </div>
    </div>
  );
}