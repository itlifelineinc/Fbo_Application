
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Course, ChatMessage, Chapter, QuizQuestion, ContentBlock } from '../types';
import { askAITutor } from '../services/geminiService';
import { ChevronLeft } from 'lucide-react';

interface ClassroomProps {
  courses: Course[];
  onCompleteLesson: (moduleId: string, chapterId: string) => void;
  onUpdateStats: (seconds: number, questions: number) => void;
  completedChapters: string[];
}

const Classroom: React.FC<ClassroomProps> = ({ courses, onCompleteLesson, onUpdateStats, completedChapters }) => {
  const { courseId, moduleId, lessonId } = useParams();
  const navigate = useNavigate();
  
  // -- Data Resolution --
  const course = courses.find(c => c.id === courseId);
  const module = course?.modules.find(m => m.id === moduleId);
  const chapter = module?.chapters.find(c => c.id === lessonId);
  
  // -- State --
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [question, setQuestion] = useState('');
  const [isChatting, setIsChatting] = useState(false);
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null); // For scrolling to top on change

  // Quiz State
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizPassed, setQuizPassed] = useState(false);

  // Derived State
  const hasQuiz = (chapter?.quizQuestions?.length || 0) > 0;
  const isCompleted = completedChapters.includes(chapter?.id || '');
  // Determine if next button is unlocked: 
  // 1. If already completed previously -> Unlock
  // 2. If no quiz -> Unlock immediately (read to complete)
  // 3. If quiz -> Unlock only if passed
  const isUnlocked = isCompleted || !hasQuiz || quizPassed;

  // -- Navigation Logic (Find Next/Prev) --
  const getNavigation = () => {
      if (!course || !module || !chapter) return { next: null, prev: null };

      let nextLink = null;
      let prevLink = null;

      // Flatten chapters to find index
      const allChapters: { modId: string, chap: Chapter }[] = [];
      course.modules.forEach(m => {
          m.chapters.forEach(c => allChapters.push({ modId: m.id, chap: c }));
      });

      const currentIndex = allChapters.findIndex(x => x.chap.id === chapter.id);

      if (currentIndex > 0) {
          const prev = allChapters[currentIndex - 1];
          prevLink = `/classroom/${course.id}/${prev.modId}/${prev.chap.id}`;
      }

      if (currentIndex < allChapters.length - 1) {
          const next = allChapters[currentIndex + 1];
          nextLink = `/classroom/${course.id}/${next.modId}/${next.chap.id}`;
      }

      return { next: nextLink, prev: prevLink, currentIndex, total: allChapters.length };
  };

  const navInfo = getNavigation();
  const navLinks = { next: navInfo.next, prev: navInfo.prev };
  const displayChapterNumber = `Chapter ${navInfo.currentIndex !== undefined ? navInfo.currentIndex + 1 : '?'}`;

  // -- Effects --

  // Reset state on chapter change
  useEffect(() => {
      setQuizAnswers([]);
      setQuizSubmitted(false);
      setQuizPassed(false);
      setChatHistory([
        { role: 'model', text: "Hi! I'm your AI Tutor. I can answer any questions about this lesson.", timestamp: Date.now() }
      ]);
      contentRef.current?.scrollTo(0, 0);
  }, [lessonId]);

  // Timer
  useEffect(() => {
    const interval = setInterval(() => setSessionSeconds(p => p + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  // Sync Stats on unmount
  const statsRef = useRef({ seconds: 0 });
  useEffect(() => { statsRef.current.seconds = sessionSeconds; }, [sessionSeconds]);
  useEffect(() => {
      return () => {
          if (statsRef.current.seconds > 0) onUpdateStats(statsRef.current.seconds, 0);
      }
  }, []);

  // -- Handlers --

  const handleSendMessage = async () => {
    if (!question.trim() || !chapter) return;
    const userMsg: ChatMessage = { role: 'user', text: question, timestamp: Date.now() };
    setChatHistory(prev => [...prev, userMsg]);
    setQuestion('');
    setIsChatting(true);
    const contextHistory = chatHistory.map(msg => ({ role: msg.role === 'model' ? 'model' : 'user', text: msg.text }));
    const answer = await askAITutor(chapter.content, userMsg.text, contextHistory);
    const modelMsg: ChatMessage = { role: 'model', text: answer, timestamp: Date.now() };
    setChatHistory(prev => [...prev, modelMsg]);
    setIsChatting(false);
    // Scroll to bottom of chat
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const handleQuizSelect = (qIndex: number, optionIndex: number) => {
      if (quizSubmitted && quizPassed) return; // Prevent changing if already passed
      const newAnswers = [...quizAnswers];
      newAnswers[qIndex] = optionIndex;
      setQuizAnswers(newAnswers);
      setQuizSubmitted(false); // Reset submit status if they change an answer to retry
  };

  const handleSubmitQuiz = () => {
      if (!chapter?.quizQuestions) return;
      
      let correctCount = 0;
      chapter.quizQuestions.forEach((q, idx) => {
          if (quizAnswers[idx] === q.correctAnswer) correctCount++;
      });

      const total = chapter.quizQuestions.length;
      const passed = correctCount >= 4 || (total < 5 && correctCount === total); // Rule: 4/5 or 100% if less than 5

      setQuizSubmitted(true);
      setQuizPassed(passed);

      if (passed) {
          // Trigger completion logic
          if (course && module) {
             onCompleteLesson(module.id, chapter.id);
          }
      }
  };

  const handleNextClick = (e: React.MouseEvent) => {
      if (!isUnlocked) {
          e.preventDefault();
          alert("Please complete the quiz with a score of 4/5 or better to proceed.");
          return;
      }
      // If purely reading chapter (no quiz), mark complete on next click
      if (!hasQuiz && course && module && chapter) {
          onCompleteLesson(module.id, chapter.id);
      }
      navigate(navLinks.next!);
  };

  if (!course || !module || !chapter) return <div>Loading...</div>;

  return (
    <div className="flex flex-col lg:flex-row h-full gap-0 bg-slate-50 dark:bg-slate-950">
      
      {/* LEFT: Main Content Area */}
      <div className="flex-1 flex flex-col h-full relative overflow-hidden">
         
         {/* Mobile Custom Header */}
         <div className="md:hidden shrink-0 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center gap-3 z-50">
            <button 
                onClick={() => navigate(`/training/course/${course.id}`)} 
                className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-700 dark:text-slate-200 transition-colors active:scale-95"
            >
                <ChevronLeft size={24} />
            </button>
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white font-heading">
                {displayChapterNumber}
            </h1>
         </div>

         {/* 1. Chapter Header / Hero */}
         <div className="bg-slate-900 text-white p-6 md:p-10 shrink-0 relative overflow-hidden">
             {/* Blurred Background Thumbnail */}
             <div className="absolute inset-0 z-0 opacity-30">
                 <img src={chapter.headerImageUrl || course.thumbnailUrl} className="w-full h-full object-cover blur-md scale-110" />
             </div>
             <div className="relative z-10 max-w-4xl mx-auto">
                 <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-widest mb-3">
                     <span>{module.title}</span>
                     <span>/</span>
                     <span>{displayChapterNumber}</span>
                 </div>
                 <h1 className="text-3xl md:text-4xl font-heading font-bold mb-4 leading-tight">{chapter.title}</h1>
                 <div className="flex items-center gap-4 text-sm text-slate-300">
                     <span className="flex items-center gap-1"><ClockIcon /> {chapter.durationMinutes} min read</span>
                     {hasQuiz && <span className="flex items-center gap-1 text-yellow-400"><QuizIcon /> Quiz Required</span>}
                 </div>
             </div>
         </div>

         {/* 2. Scrollable Content Body */}
         <div ref={contentRef} className="flex-1 overflow-y-auto bg-white dark:bg-slate-950 scroll-smooth">
             <div className="max-w-3xl mx-auto px-6 py-12 md:py-16 space-y-12">
                
                {/* Introduction / Summary */}
                {chapter.summary && (
                    <div className="text-xl text-slate-600 font-medium leading-relaxed border-l-4 border-emerald-500 pl-6 dark:text-slate-300">
                        {chapter.summary}
                    </div>
                )}

                {/* Video Embed (if video type) */}
                {chapter.type === 'VIDEO' && chapter.videoUrl && (
                    <div className="rounded-2xl overflow-hidden shadow-2xl aspect-video bg-black">
                        <iframe src={chapter.videoUrl} className="w-full h-full" frameBorder="0" allowFullScreen></iframe>
                    </div>
                )}

                {/* Main Text Content (Block Based or Fallback) */}
                {chapter.blocks && chapter.blocks.length > 0 ? (
                    <div className="space-y-8">
                        {chapter.blocks.map(block => (
                            <div key={block.id} className="animate-fade-in">
                                {block.type === 'heading' && (
                                    block.style === 'h2' 
                                    ? <h2 className="text-3xl font-bold font-heading text-slate-900 mt-8 mb-4 dark:text-white">{block.content}</h2>
                                    : <h3 className="text-2xl font-bold font-heading text-slate-800 mt-6 mb-3 dark:text-slate-200">{block.content}</h3>
                                )}
                                {block.type === 'paragraph' && (
                                    <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-300">{block.content}</p>
                                )}
                                {block.type === 'image' && block.content && (
                                    <img src={block.content} alt="Lesson Visual" className="w-full rounded-2xl shadow-lg my-6" />
                                )}
                                {block.type === 'quote' && (
                                    <blockquote className="border-l-4 border-emerald-500 pl-6 italic text-xl text-slate-600 my-8 dark:text-slate-400">
                                        "{block.content}"
                                    </blockquote>
                                )}
                                {block.type === 'list' && (
                                    <ul className="list-disc pl-6 space-y-2 text-lg text-slate-700 dark:text-slate-300 my-4">
                                        {block.content.split('\n').map((line, i) => <li key={i}>{line}</li>)}
                                    </ul>
                                )}
                                {block.type === 'callout' && (
                                    <div className={`p-6 rounded-xl border-l-4 my-6 ${block.style === 'warning' ? 'bg-red-50 border-red-500 text-red-900' : 'bg-blue-50 border-blue-500 text-blue-900'} dark:bg-slate-800 dark:text-slate-200`}>
                                        <p className="font-medium text-lg">{block.content}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="prose prose-slate prose-lg max-w-none dark:prose-invert prose-headings:font-heading prose-a:text-emerald-600 prose-img:rounded-xl">
                        <p className="whitespace-pre-wrap">{chapter.content}</p>
                    </div>
                )}

                {/* Action Steps */}
                {chapter.actionSteps && chapter.actionSteps.length > 0 && (
                    <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-8 dark:bg-emerald-900/20 dark:border-emerald-800">
                        <h3 className="font-bold text-emerald-900 text-lg mb-4 flex items-center gap-2 dark:text-emerald-400">
                            <BoltIcon /> Action Steps
                        </h3>
                        <ul className="space-y-3">
                            {chapter.actionSteps.map((step, idx) => (
                                <li key={idx} className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-emerald-200 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 dark:bg-emerald-800 dark:text-emerald-200">{idx+1}</div>
                                    <span className="text-slate-700 dark:text-slate-300">{step}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* 3. Quiz Section */}
                {hasQuiz && (
                    <div className="mt-16 pt-10 border-t border-slate-200 dark:border-slate-800">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Knowledge Check</h2>
                            <p className="text-slate-500 dark:text-slate-400">Score 4 out of 5 to unlock the next chapter.</p>
                        </div>

                        <div className="space-y-8">
                            {chapter.quizQuestions!.map((q, qIdx) => {
                                const isCorrect = quizSubmitted && quizAnswers[qIdx] === q.correctAnswer;
                                const isWrong = quizSubmitted && quizAnswers[qIdx] !== q.correctAnswer;
                                
                                return (
                                    <div key={q.id} className={`p-6 rounded-2xl border-2 transition-all ${isCorrect ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : isWrong ? 'border-red-300 bg-red-50 dark:bg-red-900/20' : 'border-slate-100 bg-slate-50 dark:bg-slate-900 dark:border-slate-800'}`}>
                                        <p className="font-bold text-slate-800 mb-4 dark:text-slate-200">{qIdx + 1}. {q.question}</p>
                                        <div className="space-y-2">
                                            {q.options.map((opt, oIdx) => (
                                                <button
                                                    key={oIdx}
                                                    onClick={() => handleQuizSelect(qIdx, oIdx)}
                                                    disabled={quizSubmitted && quizPassed}
                                                    className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all flex justify-between items-center ${
                                                        quizAnswers[qIdx] === oIdx 
                                                        ? 'bg-slate-800 text-white shadow-md' 
                                                        : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
                                                    }`}
                                                >
                                                    <span>{opt}</span>
                                                    {quizSubmitted && q.correctAnswer === oIdx && <CheckIcon className="text-green-500" />}
                                                    {quizSubmitted && quizAnswers[qIdx] === oIdx && q.correctAnswer !== oIdx && <XIcon className="text-red-400" />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Quiz Controls */}
                        <div className="mt-8 flex flex-col items-center gap-4">
                            {!quizPassed ? (
                                <button 
                                    onClick={handleSubmitQuiz}
                                    disabled={quizAnswers.length < chapter.quizQuestions!.length}
                                    className="px-8 py-3 bg-emerald-600 text-white font-bold rounded-xl shadow-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-95"
                                >
                                    {quizSubmitted ? 'Try Again' : 'Submit Answers'}
                                </button>
                            ) : (
                                <div className="text-center animate-bounce">
                                    <div className="inline-flex items-center gap-2 text-green-600 font-bold text-lg bg-green-100 px-6 py-2 rounded-full mb-4">
                                        <CheckIcon /> Quiz Passed!
                                    </div>
                                    <p className="text-slate-500">You can now proceed to the next lesson.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Bottom Spacer */}
                <div className="h-20"></div>
             </div>
         </div>

         {/* 4. Bottom Navigation Footer */}
         <div className="bg-white border-t border-slate-200 p-4 sticky bottom-0 z-20 flex justify-between items-center shadow-2xl dark:bg-slate-900 dark:border-slate-800">
             {navLinks.prev ? (
                 <button onClick={() => navigate(navLinks.prev!)} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-medium px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800">
                     <ArrowLeftIcon /> Previous
                 </button>
             ) : (
                 <div /> // Spacer
             )}

             {navLinks.next ? (
                 <button 
                    onClick={handleNextClick}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold shadow-md transition-all ${
                        isUnlocked 
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-lg hover:scale-105' 
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed dark:bg-slate-800 dark:text-slate-600'
                    }`}
                 >
                    Next Lesson <ArrowRightIcon />
                    {!isUnlocked && <LockIcon size={14} />}
                 </button>
             ) : (
                 <button 
                    onClick={() => { onCompleteLesson(module.id, chapter.id); navigate('/dashboard'); }}
                    className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800"
                 >
                    Finish Course <CheckIcon />
                 </button>
             )}
         </div>
      </div>

      {/* RIGHT: AI Tutor Sidebar (Collapsible on Mobile could be added, hidden for simplicity on Focus mode if requested, but keeping for utility) */}
      <div className="hidden lg:flex w-80 bg-white border-l border-slate-200 flex-col shrink-0 dark:bg-slate-900 dark:border-slate-800">
          <div className="p-4 border-b border-slate-200 bg-slate-50 dark:bg-slate-800 dark:border-slate-700">
              <h3 className="font-bold text-slate-800 flex items-center gap-2 dark:text-white">
                  <SparklesIcon /> AI Tutor
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Ask questions about this specific chapter.</p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white dark:bg-slate-900">
                {chatHistory.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[90%] p-3 rounded-2xl text-sm ${
                            msg.role === 'user' 
                            ? 'bg-blue-600 text-white rounded-tr-none' 
                            : 'bg-slate-100 text-slate-800 rounded-tl-none dark:bg-slate-800 dark:text-slate-200'
                        }`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {isChatting && <div className="text-xs text-slate-400 animate-pulse">Thinking...</div>}
                <div ref={chatEndRef} />
          </div>

          <div className="p-3 border-t border-slate-200 dark:border-slate-800">
             <div className="relative">
                 <input 
                    type="text" 
                    value={question}
                    onChange={e => setQuestion(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask a question..."
                    className="w-full pr-10 pl-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                    disabled={isChatting}
                 />
                 <button onClick={handleSendMessage} className="absolute right-2 top-2 p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg dark:text-blue-400 dark:hover:bg-slate-700">
                    <ArrowUpIcon />
                 </button>
             </div>
          </div>
      </div>

    </div>
  );
};

// Icons
const ClockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const QuizIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" /></svg>;
const BoltIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-emerald-600"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>;
const CheckIcon = ({className}:{className?:string}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={className || "w-5 h-5"}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>;
const XIcon = ({className}:{className?:string}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={className || "w-5 h-5"}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>;
const ArrowLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>;
const ArrowRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>;
const LockIcon = ({size}:{size:number}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width={size} height={size}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>;
const SparklesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-emerald-600"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.456-2.456L14.25 6l1.035-.259a3.375 3.375 0 002.456-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 00-1.423 1.423z" /></svg>;
const ArrowUpIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" /></svg>;

export default Classroom;
