
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Assignment, AssignmentSubmission, Student } from '../types';
import { ClipboardCheck, Clock, CheckCircle, AlertCircle, ChevronRight, User } from 'lucide-react';

interface AssignmentsListProps {
  currentUser: Student;
  assignments: Assignment[];
}

type TabType = 'PENDING' | 'COMPLETED' | 'OVERDUE' | 'ALL';

const AssignmentsList: React.FC<AssignmentsListProps> = ({ currentUser, assignments }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('PENDING');

  // Filter assignments assigned to this user
  const myAssignments = assignments.filter(a => a.assignedTo.includes(currentUser.handle));

  // Determine status for each assignment based on user submissions
  const getAssignmentStatus = (assignment: Assignment): 'COMPLETED' | 'OVERDUE' | 'PENDING' => {
      const submission = currentUser.assignmentSubmissions?.find(s => s.assignmentId === assignment.id);
      
      if (submission && (submission.status === 'SUBMITTED' || submission.status === 'APPROVED')) {
          return 'COMPLETED';
      }

      if (assignment.deadline && new Date(assignment.deadline).getTime() < Date.now()) {
          return 'OVERDUE';
      }

      return 'PENDING';
  };

  const filteredAssignments = myAssignments.filter(a => {
      const status = getAssignmentStatus(a);
      if (activeTab === 'ALL') return true;
      return status === activeTab;
  });

  const getStatusBadge = (status: 'COMPLETED' | 'OVERDUE' | 'PENDING') => {
      switch(status) {
          case 'COMPLETED': return <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold border border-emerald-200 flex items-center gap-1 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800"><CheckCircle size={10} /> Done</span>;
          case 'OVERDUE': return <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-[10px] font-bold border border-red-200 flex items-center gap-1 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800"><AlertCircle size={10} /> Overdue</span>;
          case 'PENDING': return <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-[10px] font-bold border border-blue-200 flex items-center gap-1 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800"><Clock size={10} /> Todo</span>;
      }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 animate-fade-in pb-24">
        {/* Header */}
        <div className="flex flex-col gap-2 mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-heading">My Assignments</h1>
            <p className="text-slate-500 dark:text-slate-400">Tasks assigned by your sponsor to help you grow.</p>
        </div>

        {/* Stats Row (Mini Report) */}
        <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 dark:bg-slate-800 dark:border-slate-700 text-center">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Pending</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{myAssignments.filter(a => getAssignmentStatus(a) === 'PENDING').length}</p>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 dark:bg-slate-800 dark:border-slate-700 text-center">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Completed</p>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{myAssignments.filter(a => getAssignmentStatus(a) === 'COMPLETED').length}</p>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 dark:bg-slate-800 dark:border-slate-700 text-center">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Overdue</p>
                <p className="text-2xl font-bold text-red-500 dark:text-red-400">{myAssignments.filter(a => getAssignmentStatus(a) === 'OVERDUE').length}</p>
            </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 no-scrollbar">
            {['PENDING', 'OVERDUE', 'COMPLETED', 'ALL'].map((tab) => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab as TabType)}
                    className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                        activeTab === tab 
                        ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900' 
                        : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-700'
                    }`}
                >
                    {tab.charAt(0) + tab.slice(1).toLowerCase()}
                </button>
            ))}
        </div>

        {/* List */}
        <div className="space-y-4">
            {filteredAssignments.map(assignment => {
                const status = getAssignmentStatus(assignment);
                const isUrgent = status === 'PENDING' && assignment.deadline && (new Date(assignment.deadline).getTime() - Date.now() < 86400000); // < 24h

                return (
                    <div 
                        key={assignment.id} 
                        onClick={() => navigate(`/assignments/${assignment.id}`)}
                        className={`group bg-white p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden dark:bg-slate-800 ${
                            status === 'OVERDUE' 
                            ? 'border-red-100 hover:border-red-300 dark:border-red-900/30' 
                            : 'border-slate-200 hover:border-emerald-400 hover:shadow-md dark:border-slate-700 dark:hover:border-emerald-500'
                        }`}
                    >
                        {/* Status Stripe */}
                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${status === 'COMPLETED' ? 'bg-emerald-500' : status === 'OVERDUE' ? 'bg-red-500' : 'bg-blue-500'}`}></div>

                        <div className="flex items-start justify-between pl-3">
                            <div className="flex-1 min-w-0 pr-4">
                                <div className="flex items-center gap-2 mb-1">
                                    {getStatusBadge(status)}
                                    {isUrgent && <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded text-[10px] font-bold animate-pulse dark:bg-orange-900/30 dark:text-orange-300">Expiring Soon</span>}
                                </div>
                                <h3 className="font-bold text-lg text-slate-900 truncate mb-1 dark:text-white">{assignment.title}</h3>
                                <p className="text-sm text-slate-500 line-clamp-2 dark:text-slate-400">{assignment.description}</p>
                                
                                <div className="flex items-center gap-4 mt-4 text-xs text-slate-400 dark:text-slate-500">
                                    <div className="flex items-center gap-1.5">
                                        <User size={12} />
                                        <span>{assignment.authorHandle}</span>
                                    </div>
                                    {assignment.deadline && (
                                        <div className={`flex items-center gap-1.5 ${status === 'OVERDUE' ? 'text-red-500 font-bold' : ''}`}>
                                            <Clock size={12} />
                                            <span>Due: {new Date(assignment.deadline).toLocaleDateString()}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="self-center">
                                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors dark:bg-slate-700 dark:text-slate-500 dark:group-hover:bg-emerald-900/30 dark:group-hover:text-emerald-400">
                                    <ChevronRight size={20} />
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}

            {filteredAssignments.length === 0 && (
                <div className="text-center py-12 bg-white rounded-2xl border-2 border-dashed border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                    <ClipboardCheck size={40} className="mx-auto text-slate-300 mb-3 dark:text-slate-600" />
                    <p className="text-slate-500 font-medium dark:text-slate-400">No {activeTab.toLowerCase()} assignments found.</p>
                </div>
            )}
        </div>
    </div>
  );
};

export default AssignmentsList;
