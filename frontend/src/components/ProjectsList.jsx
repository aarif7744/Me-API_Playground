import React, { useEffect, useState } from "react";
import { fetchAllProjects, searchProjectsBySkill } from "../api";

export default function ProjectsList({ skill }) {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError("");
    const fetchData = async () => {
      try {
        let data;
        if (skill && skill.trim() !== "") {
          data = await searchProjectsBySkill(skill);
        } else {
          data = await fetchAllProjects();
        }
        setProjects(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [skill]);

  if (loading) return <p className="text-gray-600">⏳ Loading projects...</p>;
  if (error) return <p className="text-red-600 font-medium">❌ {error}</p>;
  if (!projects.length) return <p className="text-gray-500">No projects found.</p>;

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-800">
        {skill ? `Projects related to "${skill}"` : "All Projects"}
      </h3>
      <ul className="grid md:grid-cols-2 gap-4">
        {projects.map((p, idx) => (
          <li
            key={idx}
            className="border p-4 rounded-lg shadow-sm hover:shadow-md transition bg-white"
          >
            <h4 className="text-lg font-bold text-gray-900">{p.title}</h4>
            <p className="text-gray-700 mt-1">{p.description}</p>
            {p.skills && p.skills.length > 0 && (
              <p className="text-sm text-gray-600 mt-2">
                <b>Skills:</b> {p.skills.join(", ")}
              </p>
            )}
            {p.links && p.links.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {p.links.map((link, i) => (
                  <a
                    key={i}
                    href={link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline text-sm"
                  >
                    🔗 Project Link
                  </a>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
