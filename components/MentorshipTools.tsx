
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, LayoutTemplate, ClipboardCheck, Megaphone } from 'lucide-react';
import { Student } from '../types';

interface MentorshipToolsProps {
  currentUser: Student;
}

const MentorshipTools: React.FC<MentorshipToolsProps> = ({ currentUser }) => {
  const navigate = useNavigate();

  const tools = [
    {
      id: 'templates',
      title: 'Templates',
      description: 'Create and manage reusable message templates for quick replies.',
      icon: LayoutTemplate,
      color: 'bg-indigo-500',
      action: () => alert('Templates feature coming soon!')
    },
    {
      id: 'assignments',
      title: 'Assignments',
      description: 'Assign tasks and track progress for your downline team members.',
      icon: ClipboardCheck,
      color: 'bg-orange-500',
      action: () => alert('Assignments feature coming soon!')
    },
    {
      id: 'announcements',
      title: 'Announcements',
      description: 'Send broadcast messages to multiple team members at once.',
      icon: Megaphone,
      color: 'bg-red-500',
      action: () => alert('Broadcast feature coming soon!')
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 animate-fade-in p-4 md:p-8">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <button 
          onClick={() => navigate('/chat')}
          className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 mb-4 transition-colors font-medium text-sm dark:text-slate-400 dark:hover:text-emerald-400"
        >
          <ArrowLeft size={16} /> Back to Chat
        </button>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-heading">Mentorship Tools</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Empower your team with advanced management features.</p>
      </div>

      {/* Grid */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {tools.map((tool) => (
          <button 
            key={tool.id}
            onClick={tool.action}
            className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all text-left group flex items-start gap-5 relative overflow-hidden"
          >
            <div className={`p-4 rounded-2xl text-white shadow-lg ${tool.color} group-hover:scale-110 transition-transform duration-300 relative z-10`}>
              <tool.icon size={28} />
            </div>
            <div className="relative z-10">
              <h3 className="font-bold text-xl text-slate-800 dark:text-white mb-2">{tool.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{tool.description}</p>
            </div>
            {/* Hover Effect Background */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 dark:bg-slate-700/50 rounded-full blur-3xl -mr-10 -mt-10 transition-opacity opacity-0 group-hover:opacity-100"></div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MentorshipTools;
