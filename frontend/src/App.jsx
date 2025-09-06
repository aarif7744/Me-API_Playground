import React from 'react';
import ProfileView from './components/ProfileView';
import ProfileForm from './components/ProfileForm';
import SearchBySkill from './components/SearchBySkill';

export default function App() {
  return (
    <div className="container">
      
      <div className="card p-2">
        <h2 className='font-bold text-4xl'>Profile</h2>
        <ProfileView />
      </div>

      <div className="card">
        {/* <h2 className=''>Update / Create Profile</h2> */}
        <ProfileForm />
      </div>

      <div className="card">
         {/* <h2>Search Projects by Skill</h2> */}
        <SearchBySkill />
      </div>
    </div>
  );
}
