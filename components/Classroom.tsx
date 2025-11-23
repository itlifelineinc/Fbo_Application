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
  
  const course = courses.find(c => c.id === courseId);
  const module = course?.modules.find(m => m.id === moduleId);
  const lesson = module?.lessons.find(l => l.id === lessonId);
  
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [question, setQuestion] = useState('');
  const [isChatting, setIsChatting] = useState(false);
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [sessionQuestions, setSessionQuestions] = useState(0);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);

  // Timer
  useEffect(() => {
    const interval = setInterval(() => {
        setSessionSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Stats Sync
  const statsRef = useRef({ seconds: 0, questions: 0 });
  useEffect(() => {
      statsRef.current.seconds = sessionSeconds;
      statsRef.current.questions = sessionQuestions;
  }, [sessionSeconds, sessionQuestions]);

  useEffect(() => {
      return () => {
          if (statsRef.current.seconds > 0 || statsRef.current.questions > 0) {
             onUpdateStats(statsRef.current.seconds, statsRef.current.questions);
          }
      }
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

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
    setSessionQuestions(prev => prev + 1);
    const contextHistory = chatHistory.map(msg => ({ role: msg.role === 'model' ? 'model' : 'user', text: msg.text }));
    const answer = await askAITutor(lesson.content, userMsg.text, contextHistory);
    const modelMsg: ChatMessage = { role: 'model', text: answer, timestamp: Date.now() };
    setChatHistory(prev => [...prev, modelMsg]);
    setIsChatting(false);
  };

  const handleQuizSelect = (qIndex: number, optionIndex: number) => {
      const newAnswers = [...quizAnswers];
      newAnswers[qIndex] = optionIndex;
      setQuizAnswers(newAnswers);
  };

  if (!course || !module || !lesson) {
    return <div className="p-10 text-center">Lesson not found. <Link to="/courses" className="text-emerald-600 underline">Back to courses</Link></div>;
  }

  const handleFinish = () => {
      onCompleteLesson(module.id);
      alert(`Lesson "${lesson.title}" Completed! Great job!`);
  };

  return (
    <div className="flex flex-col lg:flex-row lg:h-[calc(100vh-4rem)] gap-6">
      {/* Lesson Content Area */}
      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-auto lg:h-full animate-fade-in">
        
        {/* (A) Header Image (if exists) or Default Banner */}
        <div className="h-48 w-full relative bg-slate-200">
            <img 
                src={lesson.headerImageUrl || course.thumbnailUrl} 
                alt={lesson.title} 
                className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <div className="absolute bottom-6 left-6 md:left-8 text-white">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-2 opacity-80">
                    <span>{course.track}</span>
                    <span>•</span>
                    <span>{module.title}</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold font-heading">{lesson.title}</h1>
            </div>
        </div>
        
        {/* Scrollable Content */}
        <div className="flex-1 p-6 md:p-8 lg:overflow-y-auto space-y-8">
            
            {/* (B) Summary Box */}
            {lesson.summary && (
                <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-r-lg italic text-emerald-800 text-sm md:text-base">
                    "{lesson.summary}"
                </div>
            )}

            {/* (C) Learning Objectives */}
            {lesson.objectives && lesson.objectives.length > 0 && (
                <div className="bg-white border border-slate-200 rounded-xl p-5">
                    <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2 font-heading">
                        <TargetIcon /> What You Will Learn
                    </h3>
                    <ul className="space-y-2">
                        {lesson.objectives.map((obj, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-sm text-slate-600">
                                <span className="mt-1.5 w-1.5 h-1.5 bg-emerald-500 rounded-full shrink-0"></span>
                                {obj}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            
            {/* (D) Core Content */}
            <div className="prose prose-emerald max-w-none text-slate-700">
                {lesson.type === 'VIDEO' ? (
                     <div className="aspect-video w-full rounded-xl overflow-hidden bg-black shadow-lg mb-4">
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
                    <p className="whitespace-pre-wrap leading-relaxed text-lg">{lesson.content}</p>
                )}
            </div>

            {/* (F) Action Steps */}
            {lesson.actionSteps && lesson.actionSteps.length > 0 && (
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
                    <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2 font-heading">
                        <BoltIcon /> Action Steps
                    </h3>
                    <div className="space-y-3">
                        {lesson.actionSteps.map((step, idx) => (
                            <label key={idx} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-blue-100 cursor-pointer hover:shadow-sm transition-shadow">
                                <input type="checkbox" className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500" />
                                <span className="text-sm font-medium text-slate-700">{step}</span>
                            </label>
                        ))}
                    </div>
                </div>
            )}

            {/* (H) Knowledge Check (Mini Quiz) */}
            {lesson.quizQuestions && lesson.quizQuestions.length > 0 && (
                <div className="mt-8 pt-8 border-t border-slate-200">
                    <h3 className="font-bold text-slate-800 mb-4 text-lg font-heading">Knowledge Check</h3>
                    <div className="space-y-6">
                        {lesson.quizQuestions.map((q, qIdx) => (
                            <div key={qIdx} className="bg-slate-50 p-5 rounded-xl">
                                <p className="font-medium text-slate-800 mb-3">{qIdx + 1}. {q.question}</p>
                                <div className="space-y-2">
                                    {q.options.map((opt, oIdx) => (
                                        <button 
                                            key={oIdx}
                                            onClick={() => handleQuizSelect(qIdx, oIdx)}
                                            className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-all border ${
                                                quizAnswers[qIdx] === oIdx 
                                                ? (oIdx === q.correctAnswer ? 'bg-green-100 border-green-300 text-green-800' : 'bg-red-100 border-red-300 text-red-800')
                                                : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-600'
                                            }`}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* (G) Downloads */}
            {lesson.pdfUrl && (
                <div className="flex justify-center py-4">
                    <button className="flex items-center gap-2 text-emerald-600 font-bold hover:text-emerald-700 transition-colors border-b-2 border-transparent hover:border-emerald-600 pb-1">
                        <DocumentIcon /> Download Chapter Summary (PDF)
                    </button>
                </div>
            )}

        </div>

        {/* (I) Next Step Footer */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
             <div className="text-sm text-slate-500">
                Estimated time: <span className="font-medium text-emerald-700">{lesson.durationMinutes} mins</span>
             </div>
             <button 
                onClick={handleFinish}
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center gap-2"
             >
                Complete & Continue <ArrowRightIcon />
             </button>
        </div>
      </div>

      {/* AI Tutor Sidebar (Unchanged logic, just fits new layout) */}
      <div className="w-full lg:w-96 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col h-[500px] lg:h-full">
        <div className="p-4 border-b border-slate-100 bg-gradient-to-r from-emerald-900 to-emerald-800 text-white lg:rounded-t-2xl rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="font-semibold font-heading">AI Mentor</span>
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
                    placeholder="Ask a question..."
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

const ArrowRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
    </svg>
);

const TargetIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-emerald-600">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59" />
    </svg>
);

const BoltIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-blue-600">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    </svg>
);

const DocumentIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
);

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