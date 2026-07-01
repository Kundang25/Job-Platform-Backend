'use client';

import { useForm } from 'react-hook-form';
import { useState } from 'react';

export default function ProfilePage() {
  const [isSaving, setIsSaving] = useState(false);
  
  // Initialize form with some default data
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      fullName: 'Kundan Gupta',
      title: 'Full-Stack Developer',
      email: 'kundan@example.com',
      phone: '+91 98765 43210',
      university: 'Netaji Subhas University of Technology (NSUT)',
      degree: 'B.Tech in Computer Science',
      gradYear: '2027',
      github: 'github.com/kundangupta',
      linkedin: 'linkedin.com/in/kundangupta'
    }
  });

  // Local state for skills (easier to manage as an array for chips)
  const [skills, setSkills] = useState(['C++', 'Python', 'SQL', 'HTML', 'CSS', 'JavaScript', 'React', 'Next.js']);
  const [newSkill, setNewSkill] = useState('');

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const onSubmit = async (data) => {
    setIsSaving(true);
    const finalProfileData = { ...data, skills };
    
    console.log('Saving Profile:', finalProfileData);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setIsSaving(false);
    
    // In a real app, fire a toast notification here
    alert('Profile updated successfully!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Your Profile</h1>
        <p className="mt-1 text-sm text-slate-500">Update your details to get better AI job matches.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        {/* Basic Details Section */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Basic Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input 
                {...register('fullName', { required: 'Name is required' })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Professional Title</label>
              <input 
                {...register('title')}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input 
                type="email"
                {...register('email')}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-500 outline-none"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
              <input 
                {...register('phone')}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Education Section */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Education</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">University / College</label>
              <input 
                {...register('university')}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Degree</label>
              <input 
                {...register('degree')}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Graduation Year</label>
              <input 
                {...register('gradYear')}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Technical Skills</h2>
          
          <div className="flex gap-2 mb-4">
            <input 
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddSkill(e)}
              placeholder="e.g. Docker, AWS, React"
              className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
            <button 
              type="button"
              onClick={handleAddSkill}
              className="px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors border border-slate-200"
            >
              Add Skill
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span 
                key={skill} 
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-100"
              >
                {skill}
                <button 
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="ml-2 text-blue-400 hover:text-blue-600 focus:outline-none"
                >
                  &times;
                </button>
              </span>
            ))}
            {skills.length === 0 && (
              <span className="text-sm text-slate-400 italic">No skills added yet.</span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <button 
            type="button"
            className="px-6 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit"
            disabled={isSaving}
            className="px-6 py-2 bg-blue-600 rounded-lg text-white font-medium hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-70 flex items-center"
          >
            {isSaving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>

      </form>
    </div>
  );
}