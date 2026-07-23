'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getJobById, saveJob } from '@/services/jobService';
import { applyJob } from '@/services/applicationService';

export default function JobDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);

  // Toast Notification State
  const [toasts, setToasts] = useState([]);

  // Toast Helper
  const showToast = (message, type = 'success') => {
    const toastId = Date.now();
    setToasts((prev) => [...prev, { id: toastId, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== toastId));
    }, 4000);
  };

  useEffect(() => {
    if (!id) return;

    const fetchJobDetails = async () => {
      try {
        const res = await getJobById(id);
        if (res.data && res.data.success) {
          setJob(res.data.job);
        } else {
          showToast('Job listing not found.', 'error');
        }
      } catch (error) {
        console.error('Error fetching job detail:', error);
        showToast('Error syncing details from server.', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [id]);

  const handleApply = async () => {
    setActionLoading(true);
    try {
      const res = await applyJob(id);
      if (res.data && res.data.success) {
        setHasApplied(true);
        showToast('Application submitted successfully! ✨');
      } else {
        showToast(res.data.message || 'Already applied or failed to apply.', 'error');
      }
    } catch (error) {
      console.error('Error applying to job:', error);
      showToast(
        error.response?.data?.message || 'Unauthorized or application failed.',
        'error'
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleSave = async () => {
    setActionLoading(true);
    try {
      const res = await saveJob(id);
      if (res.data && res.data.success) {
        setHasSaved(true);
        showToast('Job added to your saved listings! 💾');
      } else {
        showToast(res.data.message || 'Failed to save job.', 'error');
      }
    } catch (error) {
      console.error('Error saving job:', error);
      showToast(
        error.response?.data?.message || 'Unauthorized or save failed.',
        'error'
      );
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[85vh] flex flex-col items-center justify-center space-y-3">
        <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 text-sm font-medium animate-pulse">Syncing job description details...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-xl mx-auto py-24 text-center px-4">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-lg space-y-4">
          <span className="text-5xl">🔍</span>
          <h2 className="text-2xl font-bold text-slate-900">Job Not Found</h2>
          <p className="text-sm text-slate-500">
            The job listing you are attempting to view might have been archived, deleted, or does not exist.
          </p>
          <button
            onClick={() => router.push('/jobs')}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition shadow-md"
          >
            Return to Job Search
          </button>
        </div>
      </div>
    );
  }

  const postedDate = job.created_at
    ? new Date(job.created_at).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Recently';

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20 px-4 md:px-6 relative">
      
      {/* Toast System */}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`p-4 rounded-xl shadow-xl border flex items-start gap-3 backdrop-blur-md transition-all duration-300 animate-slide-in ${
              t.type === 'success'
                ? 'bg-emerald-50/95 border-emerald-200 text-emerald-950'
                : 'bg-rose-50/95 border-rose-200 text-rose-950'
            }`}
          >
            <span className="text-lg">{t.type === 'success' ? '✨' : '⚠️'}</span>
            <div className="flex-1 text-sm font-semibold">{t.message}</div>
          </div>
        ))}
      </div>

      {/* Back Button */}
      <div className="pt-2">
        <Link
          href="/jobs"
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Listings
        </Link>
      </div>

      {/* Job Main Header Hero Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 shadow-xl text-white">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold tracking-wide uppercase text-indigo-300">
                🏢 {job.company}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 backdrop-blur-md rounded-full text-xs font-bold tracking-wide uppercase text-emerald-300">
                📍 {job.location || 'Remote'}
              </span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">{job.title}</h1>
            <p className="text-slate-300 text-xs font-semibold">Posted on {postedDate}</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex flex-col items-center md:items-end bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-3 shadow-inner">
              <span className="text-[10px] text-indigo-200 font-bold uppercase tracking-wider">AI Profile Match</span>
              <span className="text-2xl font-black text-emerald-400">92%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Details Panel (Left Column) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Job Description */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <span>📄</span> Job Description
            </h3>
            <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
              {job.description || 'No description was provided for this job.'}
            </p>
          </div>

          {/* Job Requirements */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <span>📋</span> Requirements & Skills
            </h3>
            <div className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
              {job.requirements || 'No specific requirements were provided for this job.'}
            </div>
          </div>

        </div>

        {/* Sidebar Actions Panel (Right Column) */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Actions</h4>
            
            <div className="flex flex-col gap-3">
              <button
                onClick={handleApply}
                disabled={actionLoading || hasApplied}
                className={`w-full py-3 rounded-xl font-bold text-sm shadow-md transition-all duration-200 flex items-center justify-center gap-2 ${
                  hasApplied
                    ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed shadow-none'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white active:scale-98'
                }`}
              >
                {actionLoading && <span className="w-4.5 h-4.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
                {hasApplied ? 'Applied Successfully' : 'Apply Now'}
              </button>

              <button
                onClick={handleSave}
                disabled={actionLoading || hasSaved || hasApplied}
                className={`w-full py-3 rounded-xl font-bold text-sm transition-all duration-200 border flex items-center justify-center gap-2 ${
                  hasSaved || hasApplied
                    ? 'bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700 active:scale-98'
                }`}
              >
                {hasSaved ? 'Saved to Profile' : 'Save Opportunity'}
              </button>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-3 text-xs font-semibold text-slate-500">
              <div className="flex justify-between">
                <span>Location Type</span>
                <span className="text-slate-900">Remote Compatible</span>
              </div>
              <div className="flex justify-between">
                <span>Ecosystem Status</span>
                <span className="text-emerald-600 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Active Listing
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>

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
        .animate-slide-in {
          animation: slideIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

    </div>
  );
}
