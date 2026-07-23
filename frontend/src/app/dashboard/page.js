'use client';

import { useEffect, useState } from 'react';
import { dashboardService } from '../../services/dashboardService';

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await dashboardService.getDashboardData();
      setDashboardData(res);
    } catch (error) {
      console.error('Dashboard fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = dashboardData
    ? [
        {
          name: 'Saved Jobs',
          value: dashboardData.stats.savedJobs,
          trend: 'Live Data',
          color: 'bg-blue-50 text-blue-600'
        },
        {
          name: 'Applications Sent',
          value: dashboardData.stats.applicationsSent,
          trend: 'Live Data',
          color: 'bg-indigo-50 text-indigo-600'
        },
        {
          name: 'Interviews Scheduled',
          value: dashboardData.stats.interviewsScheduled,
          trend: 'Live Data',
          color: 'bg-emerald-50 text-emerald-600'
        },
        {
          name: 'Profile Match Score',
          value: `${dashboardData.stats.profileMatchScore}%`,
          trend: 'AI Score',
          color: 'bg-purple-50 text-purple-600'
        }
      ]
    : [];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <p className="text-lg text-slate-500">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Welcome back 👋</h1>
        <p className="mt-1 text-sm text-slate-500">
          Here is what is happening with your job search today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col"
          >
            <span className="text-sm font-medium text-slate-500">
              {stat.name}
            </span>

            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-900">
                {stat.value}
              </span>
            </div>

            <div
              className={`mt-3 inline-flex items-center px-2 py-1 rounded-md text-xs font-medium w-max ${stat.color}`}
            >
              {stat.trend}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Recent Applications */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-slate-900">
              Recent Applications
            </h2>
          </div>

          <div className="space-y-4">
            {dashboardData?.recentApplications?.length > 0 ? (
              dashboardData.recentApplications.map((app) => (
                <div
                  key={app.id}
                  className="flex items-center justify-between p-4 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-900">
                      {app.title}
                    </span>
                    <span className="text-sm text-slate-500">
                      {app.company} • {app.location}
                    </span>
                  </div>

                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                    {app.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-slate-500">No applications found.</p>
            )}
          </div>
        </div>

        {/* AI Recommended Jobs */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">
            AI Recommended Roles
          </h2>

          <div className="space-y-4">
            {dashboardData?.recommendedJobs?.length > 0 ? (
              dashboardData.recommendedJobs.map((job) => (
                <div
                  key={job.id}
                  className="flex flex-col p-4 bg-slate-50 rounded-lg border border-slate-100"
                >
                  <span className="font-semibold text-slate-900">
                    {job.title}
                  </span>

                  <span className="text-sm text-slate-500 mb-2">
                    {job.company}
                  </span>

                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded">
                      92% Match
                    </span>

                    <button className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 transition-colors">
                      Apply
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-500">No recommendations available.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}