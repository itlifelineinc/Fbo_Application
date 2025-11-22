import React, { useState } from 'react';
import { Module, CourseTrack } from '../types';
import { generateModuleContent } from '../services/geminiService';

interface CourseBuilderProps {
  onAddModule: (module: Module, track?: CourseTrack) => void;
}

const CourseBuilder: React.FC<CourseBuilderProps> = ({ onAddModule }) => {
  const [topic, setTopic] = useState('');
  const [selectedTrack, setSelectedTrack] = useState<CourseTrack>(CourseTrack.BASICS);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const newModule = await generateModuleContent(topic);
      if (newModule) {
        newModule.id = `m-${Date.now()}`;
        onAddModule(newModule, selectedTrack);
        setTopic('');
        alert("Module generated and added to track!");
      } else {
        setError("Failed to generate content. Please check your API key or try a different topic.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-emerald-950 font-heading">AI Course Builder</h2>
        <p className="text-slate-500 mt-2">Instantly generate training modules for your FBO team using Gemini 2.5.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8 border border-emerald-100">
        
        {/* Track Selection */}
        <div className="mb-6">
            <label className="block text-sm font-medium text-emerald-900 mb-2">Select Course Track</label>
            <select 
                value={selectedTrack} 
                onChange={(e) => setSelectedTrack(e.target.value as CourseTrack)}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:border-emerald-500 outline-none bg-slate-50"
            >
                {Object.values(CourseTrack).map(track => (
                    <option key={track} value={track}>{track}</option>
                ))}
            </select>
        </div>

        <label className="block text-sm font-medium text-emerald-900 mb-2">What should this module cover?</label>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., Advanced Retailing Strategies..."
            className="flex-1 rounded-xl border-slate-200 shadow-sm focus:border-emerald-500 focus:ring focus:ring-emerald-200 transition-all px-4 py-3 outline-none border"
            disabled={isLoading}
          />
          <button
            onClick={handleGenerate}
            disabled={isLoading || !topic.trim()}
            className={`px-6 py-3 rounded-xl font-semibold text-white shadow-md transition-all flex items-center justify-center gap-2
              ${isLoading 
                ? 'bg-emerald-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 hover:shadow-lg active:scale-95'}`}
          >
            {isLoading ? (
              <>
                <Spinner />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <SparklesIcon />
                <span>Generate</span>
              </>
            )}
          </button>
        </div>
        {error && (
          <p className="text-red-500 text-sm mt-3 bg-red-50 p-3 rounded-lg">{error}</p>
        )}
      </div>
    </div>
  );
};

const SparklesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.456-2.456L14.25 6l1.035-.259a3.375 3.375 0 002.456-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 00-1.423 1.423z" />
  </svg>
);

const Spinner = () => (
  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export default CourseBuilder;