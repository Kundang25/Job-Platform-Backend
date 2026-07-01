'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function JobsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  // Dummy Job Data
  const jobs = [
    {
      id: '1',
      title: 'Senior Frontend Engineer',
      company: 'TechCorp',
      location: 'San Francisco, CA',
      type: 'Full-time',
      remote: true,
      salary: '$140k - $170k',
      matchScore: 94,
      postedAt: '2 days ago',
    },
    {
      id: '2',
      title: 'Full Stack Developer',
      company: 'StartupX',
      location: 'New York, NY',
      type: 'Full-time',
      remote: true,
      salary: '$120k - $150k',
      matchScore: 88,
      postedAt: '5 hours ago',
    },
    {
      id: '3',
      title: 'React Native Developer',
      company: 'AppWorks',
      location: 'Austin, TX',
      type: 'Contract',
      remote: false,
      salary: '$90 - $110/hr',
      matchScore: 76,
      postedAt: '1 week ago',
    },
    {
      id: '4',
      title: 'UI/UX Designer',
      company: 'Creative Studio',
      location: 'Remote',
      type: 'Part-time',
      remote: true,
      salary: '$60k - $80k',
      matchScore: 45,
      postedAt: '3 days ago',
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Find Jobs</h1>
          <p className="mt-1 text-sm text-slate-500">Discover roles optimized for your profile.</p>
        </div>
        <div className="w-full md:w-96 relative">
          <input
            type="text"
            placeholder="Search by job title, company, or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-4 pr-10 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <span>🔍</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Sidebar: Filters */}
        <aside className="w-full lg:w-64 flex-shrink-0 space-y-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-6">
            
            {/* Filter: Job Type */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-3">Job Type</h3>
              <div className="space-y-2">
                {['Full-time', 'Part-time', 'Contract', 'Freelance'].map(type => (
                  <label key={type} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500 border-slate-300" />
                    <span className="text-sm text-slate-700">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Filter: Location */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-3">Location</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded text-blue-600 focus:ring-blue-500 border-slate-300" />
                  <span className="text-sm text-slate-700">Remote Only</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500 border-slate-300" />
                  <span className="text-sm text-slate-700">US Only</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500 border-slate-300" />
                  <span className="text-sm text-slate-700">Worldwide</span>
                </label>
              </div>
            </div>

            {/* Filter: Salary */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-3">Salary Minimum</h3>
              <input type="range" min="50" max="200" step="10" className="w-full accent-blue-600" />
              <div className="flex justify-between text-xs text-slate-500 mt-2">
                <span>$50k</span>
                <span>$200k+</span>
              </div>
            </div>

          </div>
        </aside>

        {/* Right Main Content: Job Listings */}
        <main className="flex-1 space-y-4">
          {jobs.map((job) => (
            <Link href={`/jobs/${job.id}`} key={job.id} className="block group">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-blue-300 hover:shadow-md transition-all flex flex-col sm:flex-row justify-between gap-4">
                
                {/* Job Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {job.title}
                    </h2>
                    {job.remote && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                        Remote
                      </span>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mb-4">
                    <span className="flex items-center gap-1">🏢 {job.company}</span>
                    <span className="flex items-center gap-1">📍 {job.location}</span>
                    <span className="flex items-center gap-1">💰 {job.salary}</span>
                    <span className="flex items-center gap-1">⏱️ {job.postedAt}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2 py-1 rounded">
                      {job.type}
                    </span>
                  </div>
                </div>

                {/* Match Score & Action */}
                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-4 border-t sm:border-t-0 sm:border-l border-slate-100 pt-4 sm:pt-0 sm:pl-6 min-w-[120px]">
                  <div className="flex flex-col items-center sm:items-end">
                    <span className="text-xs text-slate-500 font-medium mb-1">AI Match</span>
                    <div className={`text-xl font-bold flex items-center gap-1 ${
                      job.matchScore >= 90 ? 'text-emerald-600' : 
                      job.matchScore >= 75 ? 'text-amber-500' : 'text-red-500'
                    }`}>
                      {job.matchScore}%
                    </div>
                  </div>
                  
                  <button className="px-4 py-2 bg-blue-50 text-blue-700 font-medium rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors border border-blue-100 group-hover:border-blue-600">
                    View Job
                  </button>
                </div>

              </div>
            </Link>
          ))}
        </main>
        
      </div>
    </div>
  );
}