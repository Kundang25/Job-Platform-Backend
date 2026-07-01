'use client';

import { useState } from 'react';

export default function ApplicationsPage() {
  // Dummy data representing the Kanban state
  const [applications, setApplications] = useState([
    { id: 1, company: 'TechCorp', role: 'Senior Frontend Engineer', status: 'saved', date: '2026-06-28', logo: 'TC' },
    { id: 2, company: 'StartupX', role: 'Full Stack Developer', status: 'applied', date: '2026-06-30', logo: 'SX' },
    { id: 3, company: 'AppWorks', role: 'React Native Developer', status: 'interview', date: '2026-07-01', logo: 'AW' },
    { id: 4, company: 'FinTech Co', role: 'UI Engineer', status: 'offer', date: '2026-06-15', logo: 'FT' },
    { id: 5, company: 'Creative Studio', role: 'Frontend Developer', status: 'rejected', date: '2026-06-20', logo: 'CS' },
    { id: 6, company: 'MegaCorp', role: 'Software Engineer', status: 'applied', date: '2026-07-01', logo: 'MC' },
  ]);

  const columns = [
    { id: 'saved', title: 'Saved', color: 'bg-slate-100 text-slate-700 border-slate-200' },
    { id: 'applied', title: 'Applied', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    { id: 'interview', title: 'Interviewing', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    { id: 'offer', title: 'Offer', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { id: 'rejected', title: 'Rejected', color: 'bg-red-50 text-red-700 border-red-200' },
  ];

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      
      {/* Header */}
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Application Tracker</h1>
          <p className="mt-1 text-sm text-slate-500">Manage your job pipeline from start to finish.</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
          + Add Manual Application
        </button>
      </div>

      {/* Kanban Board Layout */}
      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex gap-6 min-w-max h-full">
          
          {columns.map(column => {
            const columnApps = applications.filter(app => app.status === column.id);
            
            return (
              <div key={column.id} className="w-80 flex flex-col bg-slate-50/50 rounded-xl border border-slate-200 h-full">
                
                {/* Column Header */}
                <div className="p-4 border-b border-slate-200 flex justify-between items-center">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    {column.title}
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${column.color}`}>
                      {columnApps.length}
                    </span>
                  </h3>
                  <button className="text-slate-400 hover:text-slate-600 transition-colors">
                    •••
                  </button>
                </div>

                {/* Column Content (Cards) */}
                <div className="flex-1 overflow-y-auto p-3 space-y-3">
                  {columnApps.map(app => (
                    <div 
                      key={app.id} 
                      className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-10 h-10 rounded bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-sm flex-shrink-0">
                          {app.logo}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors line-clamp-1">
                            {app.role}
                          </h4>
                          <p className="text-xs text-slate-500">{app.company}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          🕒 {app.date}
                        </span>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="text-blue-600 hover:underline">View</button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Empty State for Column */}
                  {columnApps.length === 0 && (
                    <div className="h-24 border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center text-sm text-slate-400">
                      Drag jobs here
                    </div>
                  )}
                </div>
                
              </div>
            );
          })}

        </div>
      </div>
    </div>
  );
}