import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Course, ChatMessage } from '../types';
import { askAITutor } from '../services/geminiService';

interface ClassroomProps {
  courses: Course[];
  onCompleteLesson: (moduleId: string) => void;
}

const Classroom: React.FC<ClassroomProps> = ({ courses, onCompleteLesson }) => {
  const { courseId, moduleId, lessonId } = useParams();
  
  // Derived state based on URL params
  const course = courses.find(c => c.id === courseId);
  const module = course?.modules.find(m => m.id === moduleId);
  const lesson = module?.lessons.find(l => l.id === lessonId);
  
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [question, setQuestion] = useState('');
  const [isChatting, setIsChatting] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

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

    // Convert internal chat to simpler format for service
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
      // In a real app, navigate to next lesson
      alert("Lesson Completed! Progress saved.");
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] gap-6">
      {/* Lesson Content */}
      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
        <div className="p-8 border-b border-slate-100">
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                <span>{course.title}</span>
                <span>/</span>
                <span>{module.title}</span>
            </div>
            <h1 className="text-3xl font-bold text-emerald-950">{lesson.title}</h1>
        </div>
        <div className="flex-1 p-8 overflow-y-auto prose prose-emerald max-w-none">
            <p className="whitespace-pre-wrap leading-relaxed text-slate-700">{lesson.content}</p>
        </div>
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
             <div className="text-sm text-slate-500">
                Estimated time: <span className="font-medium text-emerald-700">{lesson.durationMinutes} mins</span>
             </div>
             <button 
                onClick={handleFinish}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
             >
                Complete Lesson
             </button>
        </div>
      </div>

      {/* AI Tutor Sidebar */}
      <div className="w-96 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col">
        <div className="p-4 border-b border-slate-100 bg-gradient-to-r from-emerald-900 to-emerald-800 text-white rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="font-semibold">AI Tutor</span>
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
                    className="flex-1 text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    disabled={isChatting}
                />
                <button 
                    onClick={handleSendMessage}
                    disabled={isChatting || !question.trim()}
                    className="bg-emerald-100 text-emerald-700 p-2 rounded-lg hover:bg-emerald-200 disabled:opacity-50 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                    </svg>
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Classroom;
