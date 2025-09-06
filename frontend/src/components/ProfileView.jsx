import React, { useEffect, useState } from 'react';
import { fetchProfile } from '../api';

export default function ProfileView() {
  const [profile, setProfile] = useState(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    fetchProfile()
      .then(setProfile)
      .catch(e => setErr(e.message));
  }, []);

  if (err) return <div className="text-red-600 font-semibold">Error fetching profile: {err}</div>;
  if (!profile) return <div className="text-gray-600">Loading profile...</div>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-800">{profile.name}</h2>
        <p><span className="font-medium">Email:</span> {profile.email}</p>
        <p><span className="font-medium">Education:</span> {profile.education || '—'}</p>
        <p><span className="font-medium">Skills:</span> {(profile?.skills || []).join(', ') || '—'}</p>
        <p><span className="font-medium">Work:</span> {(profile?.work || []).join(', ') || '—'}</p>
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Links</h3>
        <div className="flex flex-wrap gap-4">
          {profile?.links?.github && (
            <a href={profile.links.github} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">GitHub</a>
          )}
          {profile?.links?.linkedin && (
            <a href={profile.links.linkedin} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">LinkedIn</a>
          )}
          {profile?.links?.portfolio && (
            <a href={profile.links.portfolio} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">Portfolio</a>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Projects</h3>
        {(profile.projects || []).length === 0 ? (
          <div className="text-gray-500">No projects</div>
        ) : (
          <ul className="space-y-3">
            {(profile.projects || []).map((p, i) => (
              <li key={i} className="border p-4 rounded-md hover:shadow-md transition">
                <h4 className="font-bold text-gray-800">{p.title}</h4>
                <p className="text-gray-700">{p.description}</p>
                {(p.links || []).length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {p.links.map((l, j) => (
                      <a key={j} href={l} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-sm">{l}</a>
                    ))}
                  </div>
                )}
                {(p.skills || []).length > 0 && (
                  <p className="mt-2 text-gray-600 text-sm">Skills: {p.skills.join(', ')}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
