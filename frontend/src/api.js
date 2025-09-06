const API_BASE = import.meta.env.VITE_API_BASE;

export async function fetchProfile() {
  const res = await fetch(API_BASE);
  if (!res.ok) throw new Error(`Failed to fetch profile: ${res.status}`);
  return res.json();
}

export async function createOrUpsertProfile(data) {
  // POST will upsert by email
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error(`Failed to save profile: ${res.status}`);
  return res.json();
}

export async function updateProfile(data) {
  const res = await fetch(API_BASE, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error(`Failed to update profile: ${res.status}`);
  return res.json();
}

export async function searchProjectsBySkill(skill) {
  const res = await fetch(`${API_BASE}/projects?skill=${encodeURIComponent(skill)}`);
  if (!res.ok) throw new Error(`Failed to search projects: ${res.status}`);
  return res.json();
}

export async function fetchAllProjects(skill) {
  const url = skill ? `${API_BASE}/projects?skill=${encodeURIComponent(skill)}` : `${API_BASE}/projects`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch projects: ${res.status}`);
  return res.json();
}

export async function search(q) {
  const res = await fetch(`${API_BASE}/search?q=${encodeURIComponent(q)}`);
  if (!res.ok) throw new Error(`Search failed: ${res.status}`);
  return res.json();
}
