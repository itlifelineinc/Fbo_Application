import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Course, ChatMessage, Student } from '../types';
import { askAITutor } from '../services/geminiService';

interface ClassroomProps {
  courses: Course[];
  onCompleteLesson: (moduleId: string) => void;
  onUpdateStats: (seconds: number, questions: number) => void;
}

const Classroom: React.FC<ClassroomProps> = ({ courses, onCompleteLesson, onUpdateStats }) => {
  const { courseId, moduleId, lessonId } = useParams();
  const navigate = useNavigate();
  
  const course = courses.find(c => c.id === courseId);
  const module = course?.modules.find(m => m.id === moduleId);
  const lesson = module?.chapters.find(c => c.id === lessonId);
  
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
      navigate('/dashboard');
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)] gap-6 overflow-hidden">
      {/* Main Content - Reader Style */}
      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col relative animate-fade-in">
         {/* Header Image */}
         <div className="h-48 w-full relative bg-slate-100 shrink-0">
            <img 
                src={lesson.headerImageUrl || course.thumbnailUrl} 
                alt={lesson.title} 
                className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
            <div className="absolute bottom-6 left-6 md:left-8 text-white">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-2 opacity-90">
                    <span className="bg-white/20 px-2 py-0.5 rounded">{course.track}</span>
                    <span>•</span>
                    <span>{module.title}</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold font-heading">{lesson.title}</h1>
            </div>
         </div>

         <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-white">
             <div className="max-w-3xl mx-auto space-y-10">
                {/* Objectives */}
                {lesson.objectives && lesson.objectives.length > 0 && (
                    <div className="bg-slate-50 border-l-4 border-emerald-500 p-6 rounded-r-xl">
                        <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                            <TargetIcon /> Key Takeaways
                        </h3>
                        <ul className="space-y-2">
                            {lesson.objectives.map((obj, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                                    <CheckIcon />
                                    <span>{obj}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Core Content */}
                <div className="prose prose-slate max-w-none prose-headings:font-heading prose-a:text-emerald-600">
                    {lesson.type === 'VIDEO' ? (
                        <div className="aspect-video w-full rounded-xl overflow-hidden bg-black shadow-lg mb-6">
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
                        <p className="whitespace-pre-wrap leading-relaxed text-lg text-slate-700">{lesson.content}</p>
                    )}
                </div>

                {/* Action Steps */}
                {lesson.actionSteps && lesson.actionSteps.length > 0 && (
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
                        <h3 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
                            <BoltIcon /> Your Action Plan
                        </h3>
                        <div className="space-y-3">
                            {lesson.actionSteps.map((step, idx) => (
                                <label key={idx} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-blue-100 cursor-pointer hover:shadow-sm transition-shadow">
                                    <input type="checkbox" className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 mt-0.5" />
                                    <span className="text-sm font-medium text-slate-700">{step}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                )}

                 {/* Quiz Section */}
                {lesson.quizQuestions && lesson.quizQuestions.length > 0 && (
                    <div className="mt-12 pt-8 border-t border-slate-200">
                        <h3 className="font-bold text-slate-800 mb-6 text-xl font-heading">Knowledge Check</h3>
                        <div className="space-y-6">
                            {lesson.quizQuestions.map((q, qIdx) => (
                                <div key={qIdx} className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
                                    <p className="font-bold text-slate-800 mb-4 text-lg">{qIdx + 1}. {q.question}</p>
                                    <div className="space-y-3">
                                        {q.options.map((opt, oIdx) => (
                                            <button 
                                                key={oIdx}
                                                onClick={() => handleQuizSelect(qIdx, oIdx)}
                                                className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-all border ${
                                                    quizAnswers[qIdx] === oIdx 
                                                    ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-1 ring-emerald-500' 
                                                    : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-600'
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
                
                {/* Downloads */}
                {lesson.pdfUrl && (
                    <div className="flex justify-center py-4 mt-8">
                        <button className="flex items-center gap-2 text-emerald-600 font-bold hover:text-emerald-700 transition-colors border-b-2 border-transparent hover:border-emerald-600 pb-1">
                            <DocumentIcon /> Download Chapter Summary (PDF)
                        </button>
                    </div>
                )}

             </div>
         </div>

         {/* Bottom Action Bar */}
         <div className="p-4 border-t border-slate-200 bg-white flex justify-between items-center sticky bottom-0 z-10 shrink-0">
             <div className="text-xs text-slate-400 font-medium hidden md:block">
                {sessionSeconds > 60 ? `${Math.floor(sessionSeconds/60)}m ${sessionSeconds%60}s` : `${sessionSeconds}s`} studied
             </div>
             <div className="flex gap-3 w-full md:w-auto">
                <button onClick={() => navigate('/courses')} className="flex-1 md:flex-none px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-lg text-sm">Back</button>
                <button onClick={handleFinish} className="flex-1 md:flex-none px-6 py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 shadow-md transition-transform active:scale-95 text-sm flex items-center justify-center gap-2">
                    Complete Lesson <ArrowRightIcon />
                </button>
             </div>
         </div>
      </div>

      {/* AI Tutor Sidebar (Desktop Only) */}
      <div className="w-80 bg-white border border-slate-200 rounded-2xl shadow-sm hidden lg:flex flex-col overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200">
              <h3 className="font-bold text-slate-700 flex items-center gap-2">
                  <SparklesIcon /> AI Mentor
              </h3>
              <p className="text-xs text-slate-400 mt-1">Ask questions about this lesson.</p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatHistory.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[90%] p-3 rounded-2xl text-sm ${
                            msg.role === 'user' 
                            ? 'bg-blue-600 text-white rounded-tr-none' 
                            : 'bg-slate-100 text-slate-800 rounded-tl-none'
                        }`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {isChatting && (
                    <div className="flex justify-start"><div className="bg-slate-100 px-4 py-2 rounded-full text-xs text-slate-500">Thinking...</div></div>
                )}
                <div ref={chatEndRef} />
          </div>

          <div className="p-3 border-t border-slate-200">
             <div className="relative">
                 <input 
                    type="text" 
                    value={question}
                    onChange={e => setQuestion(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type your question..."
                    className="w-full pr-10 pl-4 py-3 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 placeholder-slate-400"
                    disabled={isChatting}
                 />
                 <button 
                    onClick={handleSendMessage}
                    disabled={!question.trim() || isChatting}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-600 hover:bg-blue-50 p-1.5 rounded-lg transition-colors disabled:opacity-50"
                 >
                    <ArrowUpIcon />
                 </button>
             </div>
          </div>
      </div>

    </div>
  );
};

// Icons
const ArrowRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>;
const TargetIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-emerald-600"><path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59" /></svg>;
const BoltIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-blue-600"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>;
const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-emerald-500"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>;
const ArrowUpIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" /></svg>;
const SparklesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-emerald-600"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.456-2.456L14.25 6l1.035-.259a3.375 3.375 0 002.456-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 00-1.423 1.423z" /></svg>;
const DocumentIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>;

export default Classroom;