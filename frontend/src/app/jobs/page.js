'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getJobs } from '@/services/jobService';

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [remoteFilter, setRemoteFilter] = useState(false);
  const [usFilter, setUsFilter] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState([]);

  // Fetch jobs from backend
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await getJobs();
        if (res.data && res.data.success) {
          setJobs(res.data.jobs);
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleTypeChange = (type) => {
    setSelectedTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  // Filter logic
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = 
      job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Simulate remote check if location contains 'remote' or 'worldwide'
    const isRemote = job.location?.toLowerCase().includes('remote') || false;
    const matchesRemote = !remoteFilter || isRemote;

    const isUS = job.location?.toLowerCase().includes('us') || job.location?.toLowerCase().includes('usa') || false;
    const matchesUS = !usFilter || isUS;

    return matchesSearch && matchesRemote && matchesUS;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 px-4 md:px-6">
      
      {/* Header and Search */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 shadow-xl text-white">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold tracking-wide uppercase text-indigo-300">
              Opportunity Directory
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">Explore Open Positions</h1>
            <p className="text-slate-300 text-sm max-w-xl">
              Discover roles synced in real-time from our platform database. Find your next career leap.
            </p>
          </div>
          
          <div className="w-full md:w-96 relative">
            <span className="absolute inset-y-0 left-3.5 flex items-center text-slate-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search by job title, company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-white placeholder-slate-400 shadow-sm transition-all"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Sidebar: Filters */}
        <aside className="w-full lg:w-64 flex-shrink-0 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            
            {/* Filter: Location Preference */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Location</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-2.5 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={remoteFilter}
                    onChange={(e) => setRemoteFilter(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500/20 border-slate-300 cursor-pointer" 
                  />
                  <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">Remote Only</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={usFilter}
                    onChange={(e) => setUsFilter(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500/20 border-slate-300 cursor-pointer" 
                  />
                  <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">US Only</span>
                </label>
              </div>
            </div>

            {/* Filter: Simulation Indicator */}
            <div className="pt-4 border-t border-slate-100">
              <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl text-indigo-950 text-xs font-medium space-y-1">
                <p className="font-bold">✨ Real Data Active</p>
                <p className="text-indigo-700/80 leading-relaxed">All listings are loaded dynamically from your backend PostgreSQL database.</p>
              </div>
            </div>

          </div>
        </aside>

        {/* Right Main Content: Job Listings */}
        <main className="flex-1 space-y-4">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-3">
              <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-slate-500 text-sm font-medium animate-pulse">Syncing jobs with database...</p>
            </div>
          ) : filteredJobs.length > 0 ? (
            filteredJobs.map((job) => {
              // Simulate some UI fields that are not in basic schema
              const isRemote = job.location?.toLowerCase().includes('remote');
              const postedDate = job.created_at ? new Date(job.created_at).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric'
              }) : 'Today';

              return (
                <Link href={`/jobs/${job.id}`} key={job.id} className="block group">
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row justify-between gap-6">
                    
                    {/* Job Info */}
                    <div className="flex-1 space-y-3">
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {job.title}
                        </h2>
                        {isRemote && (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                            Remote
                          </span>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs font-semibold text-slate-500">
                        <span className="flex items-center gap-1">🏢 {job.company}</span>
                        <span className="flex items-center gap-1">📍 {job.location || 'Remote'}</span>
                        <span className="flex items-center gap-1">⏱️ Posted {postedDate}</span>
                      </div>
                      
                      {job.description && (
                        <p className="text-slate-600 text-sm line-clamp-2 leading-relaxed">
                          {job.description}
                        </p>
                      )}
                    </div>

                    {/* Action Block */}
                    <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-4 border-t sm:border-t-0 sm:border-l border-slate-100 pt-4 sm:pt-0 sm:pl-6 min-w-[130px]">
                      <div className="flex flex-col items-start sm:items-end">
                        <span className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">AI Match</span>
                        <div className="text-lg font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                          92% Match
                        </div>
                      </div>
                      
                      <button className="px-4 py-2 bg-indigo-50 text-indigo-700 font-bold rounded-xl group-hover:bg-slate-900 group-hover:text-white transition-all duration-200 border border-indigo-100 group-hover:border-slate-900 text-xs shadow-sm">
                        View Job Details
                      </button>
                    </div>

                  </div>
                </Link>
              );
            })
          ) : (
            <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 shadow-sm text-slate-400 font-medium">
              <span className="text-4xl block mb-2">💼</span>
              No job postings match your filters or search.
            </div>
          )}
        </main>
        
      </div>
    </div>
  );
}