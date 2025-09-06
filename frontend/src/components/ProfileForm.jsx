import React, { useState } from 'react';
import { createOrUpsertProfile, updateProfile } from '../api';

export default function ProfileForm() {
  const [form, setForm] = useState({
    name: '', email: '', education: '', skills: '', work: '', github: '', linkedin: '', portfolio: '',
    projects: []
  });
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  // Handle project changes
  const handleProjectChange = (index, field, value) => {
    const newProjects = [...form.projects];
    newProjects[index][field] = value;
    setForm({ ...form, projects: newProjects });
  };

  const addProject = () => {
    setForm({ ...form, projects: [...form.projects, { title: '', description: '', skills: '', links: '' }] });
  };

  const removeProject = index => {
    const newProjects = form.projects.filter((_, i) => i !== index);
    setForm({ ...form, projects: newProjects });
  };

  const submit = async (method = 'post') => {
    setMsg(''); setError('');
    try {
      const payload = {
        name: form.name,
        email: form.email,
        education: form.education,
        skills: form.skills ? form.skills.split(',').map(s => s.trim()).filter(Boolean) : [],
        work: form.work ? form.work.split(',').map(s => s.trim()).filter(Boolean) : [],
        links: { github: form.github, linkedin: form.linkedin, portfolio: form.portfolio },
        projects: form.projects.map(p => ({
          title: p.title,
          description: p.description,
          skills: p.skills ? p.skills.split(',').map(s => s.trim()).filter(Boolean) : [],
          links: p.links ? p.links.split(',').map(l => l.trim()).filter(Boolean) : []
        }))
      };
      const res = method === 'post' ? await createOrUpsertProfile(payload) : await updateProfile(payload);
      setMsg('Saved successfully');
      console.log('Saved profile:', res);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Profile Form</h2>

      {/* Basic info */}
      {['name', 'email', 'education', 'skills', 'work', 'github', 'linkedin', 'portfolio'].map(field => (
        <div key={field} className="space-y-2">
          <label className="block font-medium text-gray-700">{field.charAt(0).toUpperCase() + field.slice(1).replace('_', ' ')}</label>
          <input
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            name={field}
            value={form[field]}
            onChange={handleChange}
            placeholder={field === 'skills' || field === 'work' ? 'Comma separated' : ''}
          />
        </div>
      ))}

      {/* Projects Section */}
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Projects</h3>
        {form.projects.map((p, idx) => (
          <div key={idx} className="border p-3 rounded-md mb-3 space-y-2 relative">
            <button
              onClick={() => removeProject(idx)}
              className="absolute top-2 right-2 text-red-500 font-bold hover:text-red-700"
            >
              ✕
            </button>
            <input
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Project Title"
              value={p.title}
              onChange={e => handleProjectChange(idx, 'title', e.target.value)}
            />
            <input
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Description"
              value={p.description}
              onChange={e => handleProjectChange(idx, 'description', e.target.value)}
            />
            <input
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Skills (comma separated)"
              value={p.skills}
              onChange={e => handleProjectChange(idx, 'skills', e.target.value)}
            />
            <input
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Links (comma separated)"
              value={p.links}
              onChange={e => handleProjectChange(idx, 'links', e.target.value)}
            />
          </div>
        ))}
        <button
          onClick={addProject}
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
        >
          + Add Project
        </button>
      </div>

      {/* Submit buttons */}
      <div className="flex space-x-4 mt-4">
        <button onClick={() => submit('post')} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
          Create 
        </button>
        <button onClick={() => submit('put')} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition">
          Update
        </button>
      </div>

      {msg && <div className="mt-4 text-green-600 font-semibold">{msg}</div>}
      {error && <div className="mt-4 text-red-600 font-semibold">{error}</div>}
    </div>
  );
}
