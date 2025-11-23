import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Course, ChatMessage, Student } from '../types';
import { askAITutor } from '../services/geminiService';

interface ClassroomProps {
  courses: Course[];
  onCompleteLesson: (moduleId: string) => void;
  onUpdateStats: (seconds: number, questions: number) => void;
}

const Classroom: React.FC<ClassroomProps> = ({ courses, onCompleteLesson, onUpdateStats }) => {
  const { courseId, moduleId, lessonId } = useParams();
  
  // Derived state
  const course = courses.find(c => c.id === courseId);
  const module = course?.modules.find(m => m.id === moduleId);
  const lesson = module?.lessons.find(l => l.id === lessonId);
  
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [question, setQuestion] = useState('');
  const [isChatting, setIsChatting] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  // Stats Tracking
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [sessionQuestions, setSessionQuestions] = useState(0);

  // Timer Effect
  useEffect(() => {
    const interval = setInterval(() => {
        setSessionSeconds(prev => prev + 1);
    }, 1000);

    // Cleanup: Update parent stats when component unmounts or lesson changes
    return () => {
        clearInterval(interval);
    };
  }, []);

  // Sync stats to parent on unmount or lesson change (using a ref to capture latest state in cleanup would be ideal, 
  // but for simplicity we'll just trigger an update every X seconds or manual sync. 
  // Better approach: use a separate useEffect for unmount with refs)
  const statsRef = useRef({ seconds: 0, questions: 0 });
  
  useEffect(() => {
      statsRef.current.seconds = sessionSeconds;
      statsRef.current.questions = sessionQuestions;
  }, [sessionSeconds, sessionQuestions]);

  useEffect(() => {
      return () => {
          // On unmount, save accumulated stats
          if (statsRef.current.seconds > 0 || statsRef.current.questions > 0) {
             onUpdateStats(statsRef.current.seconds, statsRef.current.questions);
          }
      }
  }, []); // Empty dependency to run only on mount/unmount of the whole component instance effectively

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  // Reset chat when lesson changes
  useEffect(() => {
    setChatHistory([
      { role: 'model', text: "Hi! I'm your AI Tutor. I can answer any questions about this lesson.", timestamp: Date.now() }
    ]);
  }, [lessonId]);

  const handleSendMessage = async () => {
    if (!question.trim() || !lesson) return;

    const userMsg: ChatMessage = { role: 'user', text: question, timestamp: Date.now() };
    setChatHistory(prev => [...prev, userMsg]);
    setQuestion('');
    setIsChatting(true);
    
    setSessionQuestions(prev => prev + 1); // Track question

    const contextHistory = chatHistory.map(msg => ({ role: msg.role === 'model' ? 'model' : 'user', text: msg.text }));
    
    const answer = await askAITutor(lesson.content, userMsg.text, contextHistory);
    
    const modelMsg: ChatMessage = { role: 'model', text: answer, timestamp: Date.now() };
    setChatHistory(prev => [...prev, modelMsg]);
    setIsChatting(false);
  };

  if (!course || !module || !lesson) {
    return <div className="p-10 text-center">Lesson not found. <Link to="/courses" className="text-emerald-600 underline">Back to courses</Link></div>;
  }

  const handleFinish = () => {
      onCompleteLesson(module.id);
      alert(`Lesson "${lesson.title}" Completed! Your sponsor will be notified.`);
  }

  return (
    <div className="flex flex-col lg:flex-row lg:h-[calc(100vh-4rem)] gap-6">
      {/* Lesson Content */}
      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-auto lg:h-full">
        <div className="p-6 md:p-8 border-b border-slate-100">
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                <span className="uppercase tracking-wider text-xs font-bold text-emerald-600">{course.track}</span>
                <span>/</span>
                <span>{module.title}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-emerald-950 font-heading">{lesson.title}</h1>
        </div>
        
        {/* Content Area */}
        <div className="flex-1 p-6 md:p-8 lg:overflow-y-auto">
            {lesson.type === 'VIDEO' ? (
                <div className="aspect-video w-full rounded-xl overflow-hidden bg-black mb-6 shadow-lg">
                    <iframe 
                        width="100%" 
                        height="100%" 
                        src={lesson.content} 
                        title={lesson.title} 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                    ></iframe>
                </div>
            ) : (
                <div className="prose prose-emerald max-w-none">
                    <p className="whitespace-pre-wrap leading-relaxed text-slate-700">{lesson.content}</p>
                </div>
            )}
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
             <div className="text-sm text-slate-500">
                Estimated time: <span className="font-medium text-emerald-700">{lesson.durationMinutes} mins</span>
             </div>
             <button 
                onClick={handleFinish}
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-sm flex items-center justify-center gap-2"
             >
                <CheckCircleIcon />
                Mark Complete
             </button>
        </div>
      </div>

      {/* AI Tutor Sidebar */}
      <div className="w-full lg:w-96 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col h-[500px] lg:h-full">
        <div className="p-4 border-b border-slate-100 bg-gradient-to-r from-emerald-900 to-emerald-800 text-white lg:rounded-t-2xl rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="font-semibold font-heading">AI Tutor</span>
            </div>
            <span className="text-xs bg-white/20 px-2 py-1 rounded">Gemini 2.5</span>
        </div>
        
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
            {chatHistory.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-3 rounded-xl text-sm ${
                        msg.role === 'user' 
                        ? 'bg-emerald-600 text-white rounded-tr-none shadow-sm' 
                        : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none shadow-sm'
                    }`}>
                        {msg.text}
                    </div>
                </div>
            ))}
            {isChatting && (
                 <div className="flex justify-start">
                    <div className="bg-white border border-slate-200 p-3 rounded-xl rounded-tl-none shadow-sm">
                        <div className="flex gap-1">
                            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce"></span>
                            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce delay-75"></span>
                            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce delay-150"></span>
                        </div>
                    </div>
                 </div>
            )}
            <div ref={chatEndRef} />
        </div>

        <div className="p-4 bg-white border-t border-slate-100 rounded-b-2xl">
            <div className="flex gap-2">
                <input 
                    type="text" 
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask about this lesson..."
                    className="flex-1 text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-slate-900 bg-white"
                    disabled={isChatting}
                />
                <button 
                    onClick={handleSendMessage}
                    disabled={isChatting || !question.trim()}
                    className="bg-emerald-100 text-emerald-700 p-2 rounded-lg hover:bg-emerald-200 disabled:opacity-50 transition-colors"
                >
                    <ArrowUpIcon />
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

const CheckCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const ArrowUpIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
    </svg>
);

export default Classroom;