import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Database } from '../../lib/database.types';
import { Plus, Trash2, GraduationCap } from 'lucide-react';

type Education = Database['public']['Tables']['education']['Row'];

export default function EducationSection() {
  const { user } = useAuth();
  const [educations, setEducations] = useState<Education[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    institution: '',
    degree: '',
    field_of_study: '',
    location: '',
    start_date: '',
    end_date: '',
    gpa: '',
    description: '',
  });

  useEffect(() => {
    loadEducations();
  }, [user]);

  const loadEducations = async () => {
    if (!user) return;

    setLoading(true);
    const { data } = await supabase
      .from('education')
      .select('*')
      .eq('user_id', user.id)
      .order('display_order', { ascending: true });

    if (data) {
      setEducations(data);
    }
    setLoading(false);
  };

  const handleAdd = () => {
    setEditingId('new');
    setFormData({
      institution: '',
      degree: '',
      field_of_study: '',
      location: '',
      start_date: '',
      end_date: '',
      gpa: '',
      description: '',
    });
  };

  const handleEdit = (edu: Education) => {
    setEditingId(edu.id);
    setFormData({
      institution: edu.institution,
      degree: edu.degree,
      field_of_study: edu.field_of_study,
      location: edu.location,
      start_date: edu.start_date || '',
      end_date: edu.end_date || '',
      gpa: edu.gpa,
      description: edu.description,
    });
  };

  const handleSave = async () => {
    if (!user) return;

    if (editingId === 'new') {
      await supabase.from('education').insert({
        user_id: user.id,
        ...formData,
        start_date: formData.start_date || null,
        end_date: formData.end_date || null,
      });
    } else {
      await supabase
        .from('education')
        .update({
          ...formData,
          start_date: formData.start_date || null,
          end_date: formData.end_date || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editingId!);
    }

    setEditingId(null);
    loadEducations();
  };

  const handleDelete = async (id: string) => {
    await supabase.from('education').delete().eq('id', id);
    loadEducations();
  };

  if (loading) {
    return <div className="text-slate-600">Loading education...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Education</h2>
          <p className="text-slate-600 mt-1">Add your educational background</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition"
        >
          <Plus className="w-4 h-4" />
          Add Education
        </button>
      </div>

      {editingId && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
          <h3 className="text-lg font-semibold text-slate-900">
            {editingId === 'new' ? 'Add New Education' : 'Edit Education'}
          </h3>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Institution</label>
              <input
                type="text"
                value={formData.institution}
                onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                placeholder="University Name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Degree</label>
              <input
                type="text"
                value={formData.degree}
                onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                placeholder="Bachelor of Science"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Field of Study</label>
              <input
                type="text"
                value={formData.field_of_study}
                onChange={(e) => setFormData({ ...formData, field_of_study: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                placeholder="Computer Science"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                placeholder="City, State"
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

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">GPA (Optional)</label>
              <input
                type="text"
                value={formData.gpa}
                onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                placeholder="3.8"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Additional Details</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
              placeholder="Honors, awards, relevant coursework..."
            />
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

      <div className="space-y-4">
        {educations.map((edu) => (
          <div key={edu.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-start justify-between">
              <div className="flex gap-4 flex-1">
                <div className="p-3 bg-slate-100 rounded-lg">
                  <GraduationCap className="w-6 h-6 text-slate-700" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900">{edu.degree}</h3>
                  <p className="text-slate-700">{edu.institution}</p>
                  <p className="text-sm text-slate-500">{edu.field_of_study}</p>
                  <p className="text-sm text-slate-500">{edu.location}</p>
                  <p className="text-sm text-slate-500 mt-1">
                    {edu.start_date} - {edu.end_date}
                  </p>
                  {edu.gpa && (
                    <p className="text-sm text-slate-600 mt-1">GPA: {edu.gpa}</p>
                  )}
                  {edu.description && (
                    <p className="text-slate-600 mt-3">{edu.description}</p>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(edu)}
                  className="px-4 py-2 text-sm bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(edu.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {educations.length === 0 && !editingId && (
          <div className="text-center py-12 text-slate-500">
            No education added yet. Click "Add Education" to get started.
          </div>
        )}
      </div>
    </div>
  );
}
