'use client';

import { useState } from 'react';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('overview');

  // Dummy Data for Analytics
  const stats = [
    { label: 'Total Users', value: '1,248', trend: '+12% this month' },
    { label: 'Active Jobs', value: '456', trend: '+5% this week' },
    { label: 'Resumes Parsed', value: '8,902', trend: '+24% this month' },
    { label: 'Pro Subscriptions', value: '$4,200', trend: '+8% this month' },
  ];

  // Dummy Data for Users
  const users = [
    { id: 1, name: 'Alex Johnson', email: 'alex@example.com', plan: 'Pro', status: 'Active', joined: 'Oct 24, 2025' },
    { id: 2, name: 'Sarah Smith', email: 'sarah@example.com', plan: 'Free', status: 'Active', joined: 'Oct 28, 2025' },
    { id: 3, name: 'Michael Chen', email: 'm.chen@example.com', plan: 'Free', status: 'Inactive', joined: 'Nov 02, 2025' },
    { id: 4, name: 'Jessica Davis', email: 'jess@example.com', plan: 'Pro', status: 'Active', joined: 'Nov 15, 2025' },
  ];

  // Dummy Data for Jobs
  const jobs = [
    { id: 101, title: 'Senior Frontend Engineer', company: 'TechCorp', applicants: 142, status: 'Active' },
    { id: 102, title: 'Full Stack Developer', company: 'StartupX', applicants: 89, status: 'Active' },
    { id: 103, title: 'UI/UX Designer', company: 'DesignStudio', applicants: 215, status: 'Closed' },
    { id: 104, title: 'DevOps Engineer', company: 'CloudNet', applicants: 45, status: 'Active' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            ⚙️ Platform Administration
          </h1>
          <p className="mt-1 text-sm text-slate-500">Manage users, monitor system health, and oversee job listings.</p>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="flex items-center gap-1 text-emerald-600 font-medium bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            System Operational
          </span>
        </div>
      </div>

      {/* Admin Navigation */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-1 flex space-x-1 w-fit">
        {['overview', 'users', 'jobs'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 text-sm font-medium rounded-lg capitalize transition-colors ${
              activeTab === tab 
                ? 'bg-slate-900 text-white shadow' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="mt-6">
        
        {/* TAB: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, idx) => (
                <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <p className="text-sm font-medium text-slate-500 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                  <p className="text-xs font-medium text-emerald-600 mt-2">{stat.trend}</p>
                </div>
              ))}
            </div>
            
            {/* Placeholder for Charts */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-96 flex flex-col items-center justify-center text-slate-400">
              <span className="text-4xl mb-3">📈</span>
              <p>Connect Chart.js or Recharts here for visual analytics.</p>
            </div>
          </div>
        )}

        {/* TAB: USERS */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h2 className="font-bold text-slate-800">User Management</h2>
              <input 
                type="text" 
                placeholder="Search users..." 
                className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white border-b border-slate-200 text-sm text-slate-500">
                    <th className="p-4 font-medium">Name</th>
                    <th className="p-4 font-medium">Email</th>
                    <th className="p-4 font-medium">Plan</th>
                    <th className="p-4 font-medium">Status</th>
                    <th className="p-4 font-medium">Joined</th>
                    <th className="p-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map(user => (
                    <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-medium text-slate-900">{user.name}</td>
                      <td className="p-4 text-slate-600 text-sm">{user.email}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${user.plan === 'Pro' ? 'bg-purple-50 text-purple-700 border border-purple-100' : 'bg-slate-100 text-slate-600'}`}>
                          {user.plan}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`flex items-center gap-1.5 text-sm ${user.status === 'Active' ? 'text-emerald-600' : 'text-slate-400'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                          {user.status}
                        </span>
                      </td>
                      <td className="p-4 text-slate-500 text-sm">{user.joined}</td>
                      <td className="p-4 text-right">
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Edit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: JOBS */}
        {activeTab === 'jobs' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h2 className="font-bold text-slate-800">Job Postings</h2>
              <button className="px-4 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                + Add Job
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white border-b border-slate-200 text-sm text-slate-500">
                    <th className="p-4 font-medium">Job Title</th>
                    <th className="p-4 font-medium">Company</th>
                    <th className="p-4 font-medium text-center">Applicants</th>
                    <th className="p-4 font-medium">Status</th>
                    <th className="p-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {jobs.map(job => (
                    <tr key={job.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-medium text-slate-900">{job.title}</td>
                      <td className="p-4 text-slate-600 text-sm">{job.company}</td>
                      <td className="p-4 text-center font-medium text-slate-700">{job.applicants}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${job.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                          {job.status}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-3">
                        <button className="text-slate-400 hover:text-slate-600 text-sm font-medium">Pause</button>
                        <button className="text-red-600 hover:text-red-800 text-sm font-medium">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}