'use client';

import { useState } from 'react';

export default function ResumePage() {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzed, setIsAnalyzed] = useState(false);

  // Dummy data for AI Analysis
  const aiScore = 85;
  const extractedSkills = ['React', 'Next.js', 'Tailwind CSS', 'Node.js', 'MongoDB', 'Python'];

  const handleFileUpload = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setIsUploading(true);

    // Simulate API upload and AI processing time
    setTimeout(() => {
      setIsUploading(false);
      setIsAnalyzed(true);
    }, 2000);
  };

  const handleDelete = () => {
    setFile(null);
    setIsAnalyzed(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Resume AI</h1>
        <p className="mt-1 text-sm text-slate-500">Upload your resume to let our AI analyze your skills and match you with the best jobs.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Upload & Actions */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Upload Area */}
          {!isAnalyzed ? (
            <div className="bg-white p-8 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-center transition-all hover:border-blue-500 hover:bg-slate-50">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4 text-3xl">
                📄
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Upload your resume</h3>
              <p className="text-sm text-slate-500 mb-6 max-w-sm">
                PDF, DOCX, or TXT up to 5MB. We will parse your data automatically.
              </p>
              
              <label className="relative cursor-pointer bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm">
                <span>{isUploading ? 'Analyzing AI...' : 'Select File'}</span>
                <input 
                  type="file" 
                  className="hidden" 
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                />
              </label>
            </div>
          ) : (
            /* Uploaded File Card */
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-50 text-red-600 rounded-lg flex items-center justify-center text-2xl">
                  📄
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{file?.name || 'Kundan_Gupta_Resume.pdf'}</h3>
                  <p className="text-sm text-slate-500">{(file?.size / 1024 / 1024).toFixed(2) || '1.2'} MB • Uploaded just now</p>
                </div>
              </div>
              <div className="flex gap-3">
                <label className="cursor-pointer px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200">
                  Replace
                  <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleFileUpload} />
                </label>
                <button 
                  onClick={handleDelete}
                  className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-100"
                >
                  Delete
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Right Column: AI Analysis */}
        <div className="space-y-6">
          
          {/* Score Card */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Resume Score</h2>
            
            {isAnalyzed ? (
              <div className="flex flex-col items-center justify-center py-4">
                <div className="relative w-32 h-32 flex items-center justify-center rounded-full bg-emerald-50 border-4 border-emerald-500 mb-4">
                  <span className="text-3xl font-extrabold text-emerald-700">{aiScore}</span>
                  <span className="absolute bottom-6 text-xs text-emerald-600 font-medium">/100</span>
                </div>
                <p className="text-center text-sm text-slate-600 font-medium">
                  Great job! Your resume is highly optimized for software engineering roles.
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-slate-400 text-center">
                <span className="text-4xl mb-3">🤖</span>
                <p className="text-sm">Upload a resume to see your AI score.</p>
              </div>
            )}
          </div>

          {/* Extracted Skills */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Extracted Skills</h2>
            
            {isAnalyzed ? (
              <div className="flex flex-wrap gap-2">
                {extractedSkills.map(skill => (
                  <span key={skill} className="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full border border-blue-100">
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-slate-400 text-sm">
                Waiting for document parsing...
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}