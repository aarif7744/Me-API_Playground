import React, { useState } from "react";
import ProjectsList from "./ProjectsList";

export default function SearchBySkill() {
  const [skill, setSkill] = useState("");

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Search Projects by Skill
      </h2>

      <div className="mb-6">
        <input
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter a skill (e.g. react)"
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
        />
      </div>

      {/* ProjectsList handles fetching & showing */}
      <ProjectsList skill={skill} />
    </div>
  );
}
