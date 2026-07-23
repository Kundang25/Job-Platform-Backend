'use client';

import { useState, useEffect, useMemo, startTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { adminService } from '@/services/adminService';

export default function AdminPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  // Tab State
  const [activeTab, setActiveTab] = useState('overview');

  // Live Data States
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalJobs: 0,
    totalApplications: 0,
    totalResumes: 0,
  });
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  
  // Loading & Error States
  const [dataLoading, setDataLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [systemStatus, setSystemStatus] = useState('checking'); // checking, operational, offline

  // Search States
  const [userSearch, setUserSearch] = useState('');
  const [jobSearch, setJobSearch] = useState('');

  // Modals & Actions States
  const [showAddJobModal, setShowAddJobModal] = useState(false);
  const [jobForm, setJobForm] = useState({
    title: '',
    company: '',
    location: '',
    description: '',
    requirements: '',
  });

  const [deleteTarget, setDeleteTarget] = useState(null); // { type: 'user' | 'job', id: string, name: string }

  // Toast Notification State
  const [toasts, setToasts] = useState([]);

  // Toast Helper
  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 4000);
  };

  // Fetch all administration data
  const loadAdminData = async () => {
    setDataLoading(true);
    try {
      // 1. Fetch System Health
      try {
        const healthRes = await adminService.checkHealth();
        if (healthRes && healthRes.success) {
          setSystemStatus('operational');
        } else {
          setSystemStatus('offline');
        }
      } catch (err) {
        setSystemStatus('offline');
      }

      // 2. Fetch Stats, Users, Jobs
      const [statsRes, usersRes, jobsRes] = await Promise.all([
        adminService.getAnalytics(),
        adminService.getUsers(),
        adminService.getJobs(),
      ]);

      if (statsRes.success) {
        setStats(statsRes.analytics);
      }
      if (usersRes.success) {
        setUsers(usersRes.users);
      }
      if (jobsRes.success) {
        setJobs(jobsRes.jobs);
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
      showToast('Failed to sync live data from the backend server.', 'error');
    } finally {
      setDataLoading(false);
    }
  };

  // Trigger data load when authorized
  useEffect(() => {
    if (!authLoading && user && user.role === 'admin') {
      loadAdminData();
    }
  }, [authLoading, user]);

  // Filter Users
  const filteredUsers = useMemo(() => {
    return users.filter(
      (u) =>
        u.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.email?.toLowerCase().includes(userSearch.toLowerCase())
    );
  }, [users, userSearch]);

  // Filter Jobs
  const filteredJobs = useMemo(() => {
    return jobs.filter(
      (j) =>
        j.title?.toLowerCase().includes(jobSearch.toLowerCase()) ||
        j.company?.toLowerCase().includes(jobSearch.toLowerCase()) ||
        j.location?.toLowerCase().includes(jobSearch.toLowerCase())
    );
  }, [jobs, jobSearch]);

  // Delete Handlers
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    const { type, id } = deleteTarget;
    try {
      if (type === 'user') {
        await adminService.deleteUser(id);
        setUsers((prev) => prev.filter((u) => u.id !== id));
        setStats((prev) => ({ ...prev, totalUsers: Math.max(0, prev.totalUsers - 1) }));
        showToast('User account successfully removed.');
      } else if (type === 'job') {
        await adminService.deleteJob(id);
        setJobs((prev) => prev.filter((j) => j.id !== id));
        setStats((prev) => ({ ...prev, totalJobs: Math.max(0, prev.totalJobs - 1) }));
        showToast('Job posting successfully removed.');
      }
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
      showToast(`Failed to delete ${type}. Please try again.`, 'error');
    } finally {
      setDeleteTarget(null);
    }
  };

  // Job Submission Handler
  const handleAddJob = async (e) => {
    e.preventDefault();
    if (!jobForm.title || !jobForm.company || !jobForm.location) {
      showToast('Please fill out all required fields.', 'error');
      return;
    }
    setSubmitLoading(true);
    try {
      const res = await adminService.createJob(jobForm);
      if (res.success) {
        setJobs((prev) => [res.job, ...prev]);
        setStats((prev) => ({ ...prev, totalJobs: prev.totalJobs + 1 }));
        showToast('New job posting created successfully!');
        setShowAddJobModal(false);
        setJobForm({
          title: '',
          company: '',
          location: '',
          description: '',
          requirements: '',
        });
      } else {
        showToast(res.message || 'Failed to create job.', 'error');
      }
    } catch (error) {
      console.error('Job creation error:', error);
      showToast('Error publishing job posting to backend.', 'error');
    } finally {
      setSubmitLoading(false);
    }
  };

  // Render Auth Verification Screen
  if (authLoading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium animate-pulse">Verifying administrative access...</p>
      </div>
    );
  }

  // Route protection UX
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-rose-50 border border-rose-100 p-6 rounded-2xl max-w-md shadow-sm">
          <span className="text-5xl">🔒</span>
          <h2 className="text-xl font-bold text-rose-800 mt-4 mb-2">Administrative Access Required</h2>
          <p className="text-sm text-rose-600 mb-6">
            This workspace contains restricted configuration controls. Please log in using an administrator account.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => router.push('/dashboard')}
              className="px-5 py-2 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition shadow-sm"
            >
              Go to Dashboard
            </button>
            <button
              onClick={() => router.push('/login')}
              className="px-5 py-2 border border-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 transition"
            >
              Log In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 relative">
      
      {/* Toast Alert System */}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`p-4 rounded-xl shadow-xl border flex items-start gap-3 backdrop-blur-md animate-slide-in transition-all duration-300 ${
              toast.type === 'success'
                ? 'bg-emerald-50/95 border-emerald-200 text-emerald-900'
                : 'bg-rose-50/95 border-rose-200 text-rose-900'
            }`}
          >
            <span className="text-lg">{toast.type === 'success' ? '✨' : '⚠️'}</span>
            <div className="flex-1 text-sm font-medium">{toast.message}</div>
          </div>
        ))}
      </div>

      {/* Header Banner with Premium Gradients */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 shadow-xl text-white">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold tracking-wide uppercase text-indigo-300">
              Platform Admin Console
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">Platform Operations & Controls</h1>
            <p className="text-slate-300 text-sm max-w-xl">
              Real-time synchronization with production servers. Monitor ecosystem analytics, adjust registered accounts, and post jobs.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={loadAdminData}
              disabled={dataLoading}
              className="p-2.5 bg-white/10 hover:bg-white/15 active:scale-95 text-white rounded-xl transition border border-white/10 shadow-sm"
              title="Sync Platform Data"
            >
              <svg className={`w-5 h-5 ${dataLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.213 15m-1.213-4h-5.21" />
              </svg>
            </button>
            <div className="flex items-center gap-2">
              {systemStatus === 'checking' && (
                <span className="flex items-center gap-1.5 text-amber-300 font-semibold bg-amber-500/10 px-3.5 py-2 rounded-xl border border-amber-500/20 text-xs backdrop-blur-sm">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                  Checking Sync
                </span>
              )}
              {systemStatus === 'operational' && (
                <span className="flex items-center gap-1.5 text-emerald-300 font-semibold bg-emerald-500/10 px-3.5 py-2 rounded-xl border border-emerald-500/20 text-xs backdrop-blur-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Live System Connected
                </span>
              )}
              {systemStatus === 'offline' && (
                <span className="flex items-center gap-1.5 text-rose-300 font-semibold bg-rose-500/10 px-3.5 py-2 rounded-xl border border-rose-500/20 text-xs backdrop-blur-sm">
                  <span className="w-2 h-2 bg-rose-500 rounded-full"></span>
                  Server Offline
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Glassmorphic Tabs Navigation */}
      <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-sm p-1.5 flex gap-1.5 w-full md:w-max">
        {['overview', 'users', 'jobs'].map((tab) => (
          <button
            key={tab}
            onClick={() => startTransition(() => setActiveTab(tab))}
            className={`flex-1 md:flex-none px-6 py-2.5 text-sm font-semibold rounded-xl capitalize transition-all duration-200 ${
              activeTab === tab
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      {dataLoading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center space-y-3">
          <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 text-sm font-medium animate-pulse">Synchronizing database tables...</p>
        </div>
      ) : (
        <div className="transition-all duration-300">
          
          {/* TAB: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-fade-in">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Total Users', value: stats.totalUsers, desc: 'Registered accounts', color: 'from-blue-600 to-indigo-600', emoji: '👥' },
                  { label: 'Active Jobs', value: stats.totalJobs, desc: 'Live job listings', color: 'from-indigo-600 to-violet-600', emoji: '💼' },
                  { label: 'Applications Sent', value: stats.totalApplications, desc: 'Submitted applications', color: 'from-violet-600 to-purple-600', emoji: '📩' },
                  { label: 'Resumes Parsed', value: stats.totalResumes, desc: 'Processed PDF files', color: 'from-emerald-600 to-teal-600', emoji: '📝' },
                ].map((stat, idx) => (
                  <div
                    key={idx}
                    className="relative overflow-hidden bg-white hover:bg-slate-50/50 p-6 rounded-2xl border border-slate-200 shadow-sm transition-all duration-300 hover:shadow-md group"
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                        <p className="text-3xl font-extrabold text-slate-900 group-hover:scale-105 transition-transform duration-200 origin-left">
                          {stat.value.toLocaleString()}
                        </p>
                      </div>
                      <span className="text-2xl p-2 bg-slate-100 rounded-xl group-hover:bg-indigo-50 group-hover:rotate-6 transition-all duration-200">{stat.emoji}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-4 flex items-center gap-1 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      {stat.desc}
                    </p>
                  </div>
                ))}
              </div>

              {/* Data Visualization / SVG Chart */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">System Metrics & Scale</h3>
                    <p className="text-xs text-slate-500 font-medium">Interactive comparison of system resources and growth.</p>
                  </div>
                  <div className="flex gap-4 text-xs font-semibold">
                    <span className="flex items-center gap-1.5 text-indigo-600">
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span> Users
                    </span>
                    <span className="flex items-center gap-1.5 text-emerald-600">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span> Jobs
                    </span>
                  </div>
                </div>
                
                {/* SVG Graph */}
                <div className="h-72 w-full flex items-center justify-center">
                  <svg viewBox="0 0 800 240" className="w-full h-full text-slate-300">
                    <defs>
                      <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.2"/>
                        <stop offset="100%" stopColor="#4f46e5" stopOpacity="0"/>
                      </linearGradient>
                      <linearGradient id="jobGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.2"/>
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0"/>
                      </linearGradient>
                    </defs>

                    {/* Grids */}
                    <line x1="50" y1="20" x2="750" y2="20" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="50" y1="70" x2="750" y2="70" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="50" y1="120" x2="750" y2="120" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="50" y1="170" x2="750" y2="170" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="50" y1="220" x2="750" y2="220" stroke="#e2e8f0" strokeWidth="1.5" />

                    {/* Dynamic curves based on actual stats */}
                    {/* Curve 1: Users */}
                    <path
                      d={`M 50 170 C 150 180, 250 ${Math.max(40, 220 - stats.totalUsers * 0.1)}, 450 ${Math.max(30, 220 - stats.totalUsers * 0.15)}, 600 50, 750 ${Math.max(20, 220 - stats.totalUsers * 0.18)}`}
                      fill="none"
                      stroke="#4f46e5"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                    <path
                      d={`M 50 170 C 150 180, 250 ${Math.max(40, 220 - stats.totalUsers * 0.1)}, 450 ${Math.max(30, 220 - stats.totalUsers * 0.15)}, 600 50, 750 ${Math.max(20, 220 - stats.totalUsers * 0.18)} L 750 220 L 50 220 Z`}
                      fill="url(#userGrad)"
                    />

                    {/* Curve 2: Jobs */}
                    <path
                      d={`M 50 210 C 150 200, 250 ${Math.max(100, 220 - stats.totalJobs * 0.25)}, 450 ${Math.max(90, 220 - stats.totalJobs * 0.35)}, 600 130, 750 ${Math.max(60, 220 - stats.totalJobs * 0.4)}`}
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeDasharray="4 2"
                    />
                    <path
                      d={`M 50 210 C 150 200, 250 ${Math.max(100, 220 - stats.totalJobs * 0.25)}, 450 ${Math.max(90, 220 - stats.totalJobs * 0.35)}, 600 130, 750 ${Math.max(60, 220 - stats.totalJobs * 0.4)} L 750 220 L 50 220 Z`}
                      fill="url(#jobGrad)"
                    />

                    {/* Data Points */}
                    <circle cx="750" cy={Math.max(20, 220 - stats.totalUsers * 0.18)} r="5" fill="#4f46e5" stroke="#ffffff" strokeWidth="2" />
                    <circle cx="750" cy={Math.max(60, 220 - stats.totalJobs * 0.4)} r="5" fill="#10b981" stroke="#ffffff" strokeWidth="2" />

                    {/* Labels */}
                    <text x="45" y="22" textAnchor="end" fontSize="10" fontWeight="bold" className="fill-slate-400">{(stats.totalUsers * 1.2).toFixed(0)}</text>
                    <text x="45" y="122" textAnchor="end" fontSize="10" fontWeight="bold" className="fill-slate-400">{(stats.totalUsers * 0.6).toFixed(0)}</text>
                    <text x="45" y="222" textAnchor="end" fontSize="10" fontWeight="bold" className="fill-slate-400">0</text>

                    <text x="50" y="235" textAnchor="middle" fontSize="10" className="fill-slate-400 font-semibold">Q1</text>
                    <text x="225" y="235" textAnchor="middle" fontSize="10" className="fill-slate-400 font-semibold">Q2</text>
                    <text x="400" y="235" textAnchor="middle" fontSize="10" className="fill-slate-400 font-semibold">Q3</text>
                    <text x="575" y="235" textAnchor="middle" fontSize="10" className="fill-slate-400 font-semibold">Q4</text>
                    <text x="750" y="235" textAnchor="middle" fontSize="10" className="fill-slate-400 font-semibold">Live</text>
                  </svg>
                </div>
              </div>
            </div>
          )}

          {/* TAB: USERS */}
          {activeTab === 'users' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-fade-in">
              <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center bg-slate-50/75">
                <div>
                  <h2 className="font-bold text-slate-800 text-lg">User Registry</h2>
                  <p className="text-xs text-slate-500 font-medium">Browse, filter, and manage registered candidate accounts.</p>
                </div>
                <div className="relative min-w-[260px]">
                  <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Filter by name or email..."
                    className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/20 border-b border-slate-200 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <th className="p-5 font-semibold">Candidate Info</th>
                      <th className="p-5 font-semibold">Contact Email</th>
                      <th className="p-5 font-semibold">User Role</th>
                      <th className="p-5 font-semibold">Registration Date</th>
                      <th className="p-5 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-5">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-sm">
                                {item.name ? item.name.charAt(0).toUpperCase() : '?'}
                              </div>
                              <span className="font-semibold text-slate-900">{item.name || 'Anonymous User'}</span>
                            </div>
                          </td>
                          <td className="p-5 text-slate-600">{item.email}</td>
                          <td className="p-5">
                            <span
                              className={`px-3 py-1 rounded-lg text-xs font-bold tracking-wide uppercase ${
                                item.role === 'admin'
                                  ? 'bg-purple-100 text-purple-700 border border-purple-200'
                                  : 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                              }`}
                            >
                              {item.role || 'student'}
                            </span>
                          </td>
                          <td className="p-5 text-slate-500">
                            {item.created_at ? new Date(item.created_at).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            }) : 'N/A'}
                          </td>
                          <td className="p-5 text-right">
                            {user.id !== item.id ? (
                              <button
                                onClick={() =>
                                  setDeleteTarget({
                                    type: 'user',
                                    id: item.id,
                                    name: `${item.name || 'User'} (${item.email})`,
                                  })
                                }
                                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs font-semibold transition border border-rose-200/50"
                              >
                                Delete
                              </button>
                            ) : (
                              <span className="text-xs text-slate-400 italic font-medium px-3 py-1">Current User</span>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="p-12 text-center text-slate-400 font-medium">
                          No registered candidates match your filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: JOBS */}
          {activeTab === 'jobs' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-fade-in">
              <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center bg-slate-50/75">
                <div>
                  <h2 className="font-bold text-slate-800 text-lg">Job Listing Index</h2>
                  <p className="text-xs text-slate-500 font-medium">Manage, add, or archive available job postings.</p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative min-w-[200px]">
                    <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </span>
                    <input
                      type="text"
                      value={jobSearch}
                      onChange={(e) => setJobSearch(e.target.value)}
                      placeholder="Search jobs, companies..."
                      className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                    />
                  </div>

                  <button
                    onClick={() => setShowAddJobModal(true)}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl transition shadow-sm active:scale-98 flex items-center justify-center gap-1.5"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                    </svg>
                    Add Posting
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/20 border-b border-slate-200 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <th className="p-5 font-semibold">Job Title</th>
                      <th className="p-5 font-semibold">Company Name</th>
                      <th className="p-5 font-semibold">Job Location</th>
                      <th className="p-5 font-semibold">Posted Date</th>
                      <th className="p-5 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {filteredJobs.length > 0 ? (
                      filteredJobs.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-5 font-semibold text-slate-900">{item.title}</td>
                          <td className="p-5 text-slate-600">{item.company}</td>
                          <td className="p-5">
                            <span className="inline-flex items-center gap-1 text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg text-xs font-semibold border border-slate-200/50">
                              📍 {item.location || 'Remote'}
                            </span>
                          </td>
                          <td className="p-5 text-slate-500">
                            {item.created_at ? new Date(item.created_at).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            }) : 'N/A'}
                          </td>
                          <td className="p-5 text-right">
                            <button
                              onClick={() =>
                                setDeleteTarget({
                                  type: 'job',
                                  id: item.id,
                                  name: `Job posting for ${item.title} at ${item.company}`,
                                })
                              }
                              className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs font-semibold transition border border-rose-200/50"
                            >
                              Archive
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="p-12 text-center text-slate-400 font-medium">
                          No jobs listings found matching your search.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      )}

      {/* Add Job Modal Dialog */}
      {showAddJobModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-xl bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden animate-scale-up">
            <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold">Post New Job Listing</h3>
                <p className="text-xs text-slate-300 mt-1">Publish a job opportunity to the platform candidate pool.</p>
              </div>
              <button
                onClick={() => setShowAddJobModal(false)}
                className="text-slate-300 hover:text-white transition p-1 hover:bg-white/10 rounded-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleAddJob} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Job Title *</label>
                  <input
                    type="text"
                    required
                    value={jobForm.title}
                    onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                    placeholder="e.g. Staff Full Stack Engineer"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Company Name *</label>
                  <input
                    type="text"
                    required
                    value={jobForm.company}
                    onChange={(e) => setJobForm({ ...jobForm, company: e.target.value })}
                    placeholder="e.g. Stripe"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Location *</label>
                <input
                  type="text"
                  required
                  value={jobForm.location}
                  onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                  placeholder="e.g. San Francisco, CA / Remote"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Description</label>
                <textarea
                  rows="3"
                  value={jobForm.description}
                  onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                  placeholder="Summarize key details about this team role..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Requirements</label>
                <textarea
                  rows="3"
                  value={jobForm.requirements}
                  onChange={(e) => setJobForm({ ...jobForm, requirements: e.target.value })}
                  placeholder="Enter required experience, stack, and skills..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddJobModal(false)}
                  className="px-5 py-2 border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold transition flex items-center gap-1.5 shadow-md disabled:opacity-50"
                >
                  {submitLoading && <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
                  Publish Posting
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Dialog Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 text-center animate-scale-up">
            <span className="text-4xl text-rose-500 block mb-2">🚨</span>
            <h3 className="text-lg font-bold text-slate-900">Are you sure?</h3>
            <p className="text-sm text-slate-500 mt-2 mb-4">
              You are about to delete <strong className="text-slate-850 font-bold">{deleteTarget.name}</strong>.
            </p>
            <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-800 text-xs font-semibold text-left mb-6">
              ⚠️ Critical: This deletion is permanent. All related relational data within the database will be deleted.
            </div>
            
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 transition"
              >
                No, Keep It
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-semibold transition shadow-md"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Extra CSS Styles injected */}
      <style jsx global>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(1rem) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleUp {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-slide-in {
          animation: slideIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .animate-scale-up {
          animation: scaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

    </div>
  );
}