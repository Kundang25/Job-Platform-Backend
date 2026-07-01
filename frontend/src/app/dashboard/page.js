export default function DashboardPage() {
    const stats = [
      { name: 'Saved Jobs', value: '12', trend: '+2 this week', color: 'bg-blue-50 text-blue-600' },
      { name: 'Applications Sent', value: '34', trend: '+8 this week', color: 'bg-indigo-50 text-indigo-600' },
      { name: 'Interviews Scheduled', value: '3', trend: 'Next: Tomorrow', color: 'bg-emerald-50 text-emerald-600' },
      { name: 'Profile Match Score', value: '88%', trend: 'Looking strong', color: 'bg-purple-50 text-purple-600' },
    ];
  
    return (
      <div className="space-y-6">
        
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome back, Kundan 👋</h1>
          <p className="mt-1 text-sm text-slate-500">Here is what is happening with your job search today.</p>
        </div>
  
        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.name} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
              <span className="text-sm font-medium text-slate-500">{stat.name}</span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-slate-900">{stat.value}</span>
              </div>
              <div className={`mt-3 inline-flex items-center px-2 py-1 rounded-md text-xs font-medium w-max ${stat.color}`}>
                {stat.trend}
              </div>
            </div>
          ))}
        </div>
  
        {/* Bottom Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Recent Applications (Spans 2 columns) */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-slate-900">Recent Applications</h2>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
            </div>
            <div className="space-y-4">
              {/* Dummy Data Rows */}
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-900">Frontend Developer</span>
                    <span className="text-sm text-slate-500">TechCorp Inc. • Remote</span>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                    Under Review
                  </span>
                </div>
              ))}
            </div>
          </div>
  
          {/* AI Recommendations (Spans 1 column) */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">AI Recommended Roles</h2>
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="flex flex-col p-4 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="font-semibold text-slate-900">Full Stack Engineer</span>
                  <span className="text-sm text-slate-500 mb-2">StartupX • $120k-$150k</span>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded">92% Match</span>
                    <button className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 transition-colors">Apply</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </div>
    );
  }