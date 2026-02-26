import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Database } from '../../lib/database.types';
import { Plus, Trash2, Wrench } from 'lucide-react';

type Skill = Database['public']['Tables']['skills']['Row'];

export default function SkillsSection() {
  const { user } = useAuth();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Technical',
    proficiency: 'Intermediate',
  });

  const categories = ['Technical', 'Design', 'Management', 'Communication', 'Languages', 'Tools', 'Other'];
  const proficiencies = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

  useEffect(() => {
    loadSkills();
  }, [user]);

  const loadSkills = async () => {
    if (!user) return;

    setLoading(true);
    const { data } = await supabase
      .from('skills')
      .select('*')
      .eq('user_id', user.id)
      .order('category', { ascending: true });

    if (data) {
      setSkills(data);
    }
    setLoading(false);
  };

  const handleAdd = async () => {
    if (!user || !formData.name) return;

    await supabase.from('skills').insert({
      user_id: user.id,
      ...formData,
    });

    setFormData({ name: '', category: 'Technical', proficiency: 'Intermediate' });
    setShowForm(false);
    loadSkills();
  };

  const handleDelete = async (id: string) => {
    await supabase.from('skills').delete().eq('id', id);
    loadSkills();
  };

  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  if (loading) {
    return <div className="text-slate-600">Loading skills...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Skills</h2>
          <p className="text-slate-600 mt-1">Showcase your technical and professional skills</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition"
        >
          <Plus className="w-4 h-4" />
          Add Skill
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
          <h3 className="text-lg font-semibold text-slate-900">Add New Skill</h3>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Skill Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                placeholder="React, Python, Leadership..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Proficiency</label>
              <select
                value={formData.proficiency}
                onChange={(e) => setFormData({ ...formData, proficiency: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
              >
                {proficiencies.map((prof) => (
                  <option key={prof} value={prof}>
                    {prof}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleAdd}
              className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition"
            >
              Add
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-6 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
          <div key={category} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Wrench className="w-5 h-5 text-slate-700" />
              <h3 className="text-lg font-semibold text-slate-900">{category}</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              {categorySkills.map((skill) => (
                <div
                  key={skill.id}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg group"
                >
                  <div>
                    <p className="font-medium text-slate-900">{skill.name}</p>
                    <p className="text-sm text-slate-500">{skill.proficiency}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(skill.id)}
                    className="opacity-0 group-hover:opacity-100 p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}

        {skills.length === 0 && !showForm && (
          <div className="text-center py-12 text-slate-500">
            No skills added yet. Click "Add Skill" to get started.
          </div>
        )}
      </div>
    </div>
  );
}
