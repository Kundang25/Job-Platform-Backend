'use client';

import { useState } from 'react';

export default function AIPage() {
  const [activeTab, setActiveTab] = useState('cover-letter');
  
  // States for Cover Letter Generator
  const [jobDescription, setJobDescription] = useState('');
  const [isGeneratingCL, setIsGeneratingCL] = useState(false);
  const [coverLetterOutput, setCoverLetterOutput] = useState('');

  // States for Interview Prep
  const [jobTitle, setJobTitle] = useState('');
  const [isGeneratingInterview, setIsGeneratingInterview] = useState(false);
  const [interviewOutput, setInterviewOutput] = useState([]);

  const handleGenerateCoverLetter = async () => {
    if (!jobDescription) return;
    setIsGeneratingCL(true);
    
    // Simulate API call to your AI Service
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setCoverLetterOutput(
      "Dear Hiring Manager,\n\nI am writing to express my strong interest in the open position at your company. With a robust background in full-stack development, specifically utilizing React, Next.js, and Node.js, I am confident in my ability to contribute effectively to your engineering team...\n\n[This is a simulated AI-generated cover letter based on your profile and the provided job description.]\n\nSincerely,\nKundan Gupta"
    );
    setIsGeneratingCL(false);
  };

  const handleGenerateInterview = async () => {
    if (!jobTitle) return;
    setIsGeneratingInterview(true);
    
    // Simulate API call to your AI Service
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setInterviewOutput([
      { q: "Can you explain the virtual DOM in React and how it improves performance?", hint: "Focus on reconciliation and batching updates." },
      { q: "How do you manage global state in a Next.js application?", hint: "Mention Context API, Zustand, or Redux." },
      { q: "Describe a time you had to optimize a slow-performing web application.", hint: "Use the STAR method: Situation, Task, Action, Result." }
    ]);
    setIsGeneratingInterview(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">AI Career Tools</h1>
        <p className="mt-1 text-sm text-slate-500">Generate tailored cover letters and prepare for interviews with our AI.</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('cover-letter')}
          className={`py-3 px-6 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'cover-letter' 
              ? 'border-blue-600 text-blue-600' 
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
          }`}
        >
          📝 Cover Letter Generator
        </button>
        <button
          onClick={() => setActiveTab('interview')}
          className={`py-3 px-6 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'interview' 
              ? 'border-blue-600 text-blue-600' 
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
          }`}
        >
          🎯 Interview Prep
        </button>
      </div>

      {/* Tab Content: Cover Letter */}
      {activeTab === 'cover-letter' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Input Section */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col h-[500px]">
            <h2 className="text-lg font-bold text-slate-900 mb-2">Job Description</h2>
            <p className="text-xs text-slate-500 mb-4">Paste the job description here. Our AI will align your profile skills with the requirements.</p>
            
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="e.g., We are looking for a Senior Frontend Engineer with 5+ years of experience in React..."
              className="flex-1 w-full p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none transition-all text-sm text-slate-700"
            />
            
            <button
              onClick={handleGenerateCoverLetter}
              disabled={isGeneratingCL || !jobDescription}
              className="mt-4 w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-70 flex justify-center items-center gap-2"
            >
              {isGeneratingCL ? '✨ Generating Magic...' : '✨ Generate Cover Letter'}
            </button>
          </div>

          {/* Output Section */}
          <div className="bg-slate-900 p-6 rounded-xl shadow-sm flex flex-col h-[500px]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-white">Generated Output</h2>
              {coverLetterOutput && (
                <button className="text-xs px-3 py-1 bg-slate-800 text-slate-300 rounded hover:bg-slate-700 transition-colors">
                  Copy to Clipboard
                </button>
              )}
            </div>
            
            <div className="flex-1 bg-slate-800 rounded-lg p-4 overflow-y-auto border border-slate-700">
              {coverLetterOutput ? (
                <p className="text-sm text-slate-300 whitespace-pre-wrap font-mono leading-relaxed">
                  {coverLetterOutput}
                </p>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-500 text-sm italic">
                  Your generated cover letter will appear here.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab Content: Interview Prep */}
      {activeTab === 'interview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Input Section */}
          <div className="lg:col-span-1 bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-fit">
            <h2 className="text-lg font-bold text-slate-900 mb-2">Target Role</h2>
            <p className="text-xs text-slate-500 mb-4">Enter the job title you are interviewing for to get tailored questions.</p>
            
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g., Senior React Developer"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm mb-4"
            />
            
            <button
              onClick={handleGenerateInterview}
              disabled={isGeneratingInterview || !jobTitle}
              className="w-full py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-70 flex justify-center items-center gap-2"
            >
              {isGeneratingInterview ? 'Generating...' : 'Generate Questions'}
            </button>
          </div>

          {/* Output Section */}
          <div className="lg:col-span-2 space-y-4">
            {interviewOutput.length > 0 ? (
              interviewOutput.map((item, index) => (
                <div key={index} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex items-start gap-3">
                    <span className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold flex-shrink-0">
                      {index + 1}
                    </span>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 mb-2">{item.q}</h3>
                      <div className="bg-amber-50 border border-amber-100 rounded-md p-3 text-sm text-amber-800">
                        <span className="font-bold">💡 AI Hint:</span> {item.hint}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white p-10 rounded-xl border border-dashed border-slate-300 flex flex-col items-center justify-center text-center">
                <span className="text-4xl mb-3">🎙️</span>
                <p className="text-slate-500 text-sm">Generate questions to practice your interview skills.</p>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}