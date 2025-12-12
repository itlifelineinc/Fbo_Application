
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Student, UserRole } from '../types';
import { Search, X, ChevronRight, User, Shield, Key, Trash2, Award } from 'lucide-react';

interface StudentsListProps {
  students: Student[];
  onAddStudent: (student: Student) => void;
  currentUser: Student;
  onUpdateStudent: (student: Student) => void;
  onDeleteStudent: (studentId: string) => void;
}

// Custom Icon: Filled Square with White Plus
const FilledPlusIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="3" y="3" width="18" height="18" rx="5" fill="currentColor" />
    <path d="M12 8V16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 12H16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Standardized Input Style (Facebook-like: Flat, No Ring, Thin Border)
const INPUT_CLASS = "w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-3.5 text-base text-slate-900 dark:text-white placeholder-slate-500 focus:border-slate-500 dark:focus:border-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-0 transition-all duration-200";
const LABEL_CLASS = "block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 ml-1 uppercase tracking-wider";

const StudentsList: React.FC<StudentsListProps> = ({ students, onAddStudent, currentUser, onUpdateStudent, onDeleteStudent }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentEmail, setNewStudentEmail] = useState('');
  
  // Mobile Details Drawer State
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  
  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('ALL');
  
  // Mobile Search Toggle
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  // Permissions Logic
  const isSuperAdmin = currentUser.role === UserRole.SUPER_ADMIN;
  const isAdmin = currentUser.role === UserRole.ADMIN || isSuperAdmin;
  
  // Filter Logic
  const filteredStudents = students.filter(s => {
    // 1. Permission Filter (Sponsors only see downline, Admins see all)
    if (!isAdmin && s.sponsorId !== currentUser.handle) return false;

    // 2. Search Filter (Name or Handle)
    const matchesSearch = 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      s.handle.toLowerCase().includes(searchTerm.toLowerCase());

    // 3. Role Filter
    const matchesRole = filterRole === 'ALL' || s.role === filterRole;

    return matchesSearch && matchesRole;
  });

  const generateHandle = (name: string) => {
    return `@${name.toLowerCase().replace(/\s/g, '.')}${Math.floor(Math.random() * 999)}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName || !newStudentEmail) return;

    const newStudent: Student = {
      id: Date.now().toString(),
      handle: generateHandle(newStudentName),
      password: 'password123', // Default for manual add
      role: UserRole.STUDENT,
      name: newStudentName,
      email: newStudentEmail,
      enrolledDate: new Date().toISOString().split('T')[0],
      progress: 0,
      completedModules: [],
      completedChapters: [],
      enrolledCourses: [],
      savedCourses: [],
      caseCredits: 0,
      sponsorId: currentUser.handle, // Auto-assign to current user (Sponsor/Admin)
      learningStats: { totalTimeSpent: 0, questionsAsked: 0, learningStreak: 0, lastLoginDate: '' }
    };

    onAddStudent(newStudent);
    setNewStudentName('');
    setNewStudentEmail('');
    setIsFormOpen(false);
    alert(`User created! Default password: 'password123'. Sponsor set to: ${currentUser.handle}`);
  };

  const handleResetPassword = (student: Student) => {
    if (!window.confirm(`Reset password for ${student.name}?`)) return;
    const tempPassword = `reset${Math.floor(1000 + Math.random() * 9000)}`;
    const updatedStudent = { ...student, password: tempPassword };
    onUpdateStudent(updatedStudent);
    alert(`Password for ${student.name} reset to: ${tempPassword}`);
  };

  const handleDelete = (e: React.MouseEvent, student: Student) => {
    e.stopPropagation(); // Prevent navigation to profile
    if (window.confirm(`Are you sure you want to delete ${student.name} (${student.handle})? This action cannot be undone.`)) {
        onDeleteStudent(student.id);
        if (selectedStudent?.id === student.id) setSelectedStudent(null);
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-950 animate-fade-in relative">
       
       {/* Inject Custom Styles for Drawer/Modal Animations */}
       <style>{`
         @keyframes slideInRight {
           from { transform: translateX(100%); }
           to { transform: translateX(0); }
         }
         @keyframes fadeInModal {
           from { opacity: 0; transform: scale(0.95); }
           to { opacity: 1; transform: scale(1); }
         }
         @keyframes slideUpBottom {
           from { transform: translateY(100%); }
           to { transform: translateY(0); }
         }
         .drawer-animation {
           animation: slideInRight 0.3s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
         }
         /* Desktop overrides */
         @media (min-width: 768px) {
           .drawer-animation {
             animation: fadeInModal 0.2s ease-out forwards;
           }
         }
       `}</style>

       {/* 
          MOBILE CUSTOM HEADER 
       */}
       <div className="md:hidden shrink-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex justify-between items-center z-50 shadow-sm transition-all duration-300 sticky top-0">
          {!isMobileSearchOpen ? (
            <>
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white font-heading">
                Team
              </h1>
              <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setIsFormOpen(true)}
                    className="text-slate-900 dark:text-white active:scale-95 transition-transform"
                  >
                    <FilledPlusIcon size={28} className="text-slate-900 dark:text-white" />
                  </button>
                  <button 
                    onClick={() => setIsMobileSearchOpen(true)}
                    className="text-slate-900 dark:text-white p-1 active:scale-95 transition-transform"
                  >
                    <Search size={24} strokeWidth={2.5} />
                  </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3 w-full animate-fade-in">
               <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                  <input 
                     type="text" 
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     placeholder="Search team members..."
                     autoFocus
                     className="w-full bg-slate-100 border-none rounded-full px-10 py-2 text-slate-900 focus:ring-0 outline-none"
                  />
               </div>
               <button 
                 onClick={() => { setIsMobileSearchOpen(false); setSearchTerm(''); }}
                 className="text-slate-600 dark:text-slate-300 font-bold text-sm px-2"
               >
                 Cancel
               </button>
            </div>
          )}
       </div>

       <div className="flex-1 overflow-y-auto p-0 md:p-8 space-y-6">
        {/* Desktop Header */}
        <div className="hidden md:flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 className="text-3xl font-bold text-emerald-950 font-heading dark:text-emerald-400">
                    {isAdmin ? "User Management" : "My Downline Team"}
                </h1>
                <p className="text-emerald-700 mt-1 dark:text-emerald-300">
                    {isAdmin ? "Manage all accounts across the platform." : "Track performance of your recruited FBOs."}
                </p>
            </div>
            <button 
                onClick={() => setIsFormOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-sm transition-colors flex items-center justify-center gap-2 active:scale-95"
            >
               <FilledPlusIcon size={20} className="text-white" />
               Enroll New FBO
            </button>
        </div>

        {/* Filter Bar (Desktop) */}
        <div className="hidden md:flex bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex-col md:flex-row gap-4 dark:bg-slate-800 dark:border-slate-700">
            <div className="flex-1 relative">
                <input 
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name or handle..."
                    className={INPUT_CLASS + " pl-10"}
                />
                <Search className="absolute left-3 top-3.5 text-slate-400" size={20} />
            </div>
            
            {isAdmin && (
                <div className="w-full md:w-48">
                    <select 
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                        className={INPUT_CLASS}
                    >
                        <option value="ALL">All Roles</option>
                        <option value={UserRole.STUDENT}>Students</option>
                        <option value={UserRole.SPONSOR}>Sponsors</option>
                        <option value={UserRole.ADMIN}>Admins</option>
                        <option value={UserRole.SUPER_ADMIN}>Super Admins</option>
                    </select>
                </div>
            )}
        </div>

        {/* 
            MODAL / DRAWER SYSTEM (Enrollment)
        */}
        {isFormOpen && (
            <div className="fixed inset-0 z-[200] flex justify-end md:items-center md:justify-center">
                <div 
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
                    onClick={() => setIsFormOpen(false)}
                ></div>
                <div className="relative w-full h-full md:h-auto md:max-w-lg md:rounded-2xl bg-white dark:bg-slate-900 shadow-2xl flex flex-col drawer-animation overflow-hidden">
                    <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
                        <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white font-heading">Enroll New FBO</h2>
                        <button 
                            onClick={() => setIsFormOpen(false)} 
                            className="p-2 -mr-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full dark:hover:bg-slate-800 transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>
                    <div className="p-6 md:p-8 overflow-y-auto flex-1 bg-white dark:bg-slate-900">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className={LABEL_CLASS}>Full Name</label>
                                <input 
                                    type="text" 
                                    required
                                    value={newStudentName}
                                    onChange={(e) => setNewStudentName(e.target.value)}
                                    className={INPUT_CLASS}
                                    placeholder="Jane Doe"
                                    autoFocus
                                />
                            </div>
                            <div>
                                <label className={LABEL_CLASS}>Email Address</label>
                                <input 
                                    type="email" 
                                    required
                                    value={newStudentEmail}
                                    onChange={(e) => setNewStudentEmail(e.target.value)}
                                    className={INPUT_CLASS}
                                    placeholder="jane@example.com"
                                />
                            </div>
                            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 dark:bg-blue-900/20 dark:border-blue-800">
                                <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                                    New user will be added to <strong>{currentUser.handle}</strong>'s downline. A temporary password <span className="font-mono bg-blue-100 dark:bg-blue-800 px-1 rounded">password123</span> will be assigned.
                                </p>
                            </div>
                            <div className="pt-4 flex flex-col gap-3">
                                <button 
                                    type="submit"
                                    className="w-full py-3.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-900/20 active:scale-[0.98] text-base"
                                >
                                    Confirm Enrollment
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => setIsFormOpen(false)}
                                    className="w-full py-3.5 text-slate-500 font-bold hover:bg-slate-50 rounded-xl transition-colors dark:text-slate-400 dark:hover:bg-slate-800"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )}

        {/* 
            MOBILE LIST VIEW (Replaces Table on Mobile)
        */}
        <div className="md:hidden">
            {filteredStudents.length === 0 && (
                <div className="p-12 text-center text-slate-400">
                    <p>No team members found.</p>
                </div>
            )}
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredStudents.map(student => (
                    <div 
                        key={student.id} 
                        onClick={() => setSelectedStudent(student)}
                        className="flex items-center gap-4 p-4 bg-white active:bg-slate-50 transition-colors cursor-pointer dark:bg-slate-950 dark:active:bg-slate-900"
                    >
                        {/* Avatar */}
                        <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-lg font-bold shrink-0 overflow-hidden dark:bg-emerald-900 dark:text-emerald-300">
                            {student.avatarUrl ? (
                                <img src={student.avatarUrl} alt={student.name} className="w-full h-full object-cover" />
                            ) : (
                                student.name.charAt(0)
                            )}
                        </div>
                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-slate-900 text-base truncate dark:text-white">{student.name}</h3>
                            <p className="text-sm text-slate-500 truncate dark:text-slate-400">{student.handle}</p>
                        </div>
                        {/* Chevron */}
                        <ChevronRight className="text-slate-300" size={20} />
                    </div>
                ))}
            </div>
        </div>

        {/* 
            MOBILE STUDENT DETAIL DRAWER (Full Page Slide Up)
        */}
        <div className={`md:hidden fixed inset-0 z-[150] bg-white dark:bg-slate-950 transition-transform duration-300 ease-out flex flex-col ${selectedStudent ? 'translate-y-0' : 'translate-y-full'}`}>
            {selectedStudent && (
                <>
                    {/* Header */}
                    <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0 shadow-sm">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white truncate pr-4">{selectedStudent.name}</h2>
                        <button 
                            onClick={() => setSelectedStudent(null)} 
                            className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-5 space-y-6">
                        {/* Avatar & Handle */}
                        <div className="flex flex-col items-center pb-6 border-b border-slate-100 dark:border-slate-800">
                            <div className="w-24 h-24 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-3xl font-bold mb-3 overflow-hidden shadow-sm dark:bg-emerald-900 dark:text-emerald-300">
                                {selectedStudent.avatarUrl ? (
                                    <img src={selectedStudent.avatarUrl} alt={selectedStudent.name} className="w-full h-full object-cover" />
                                ) : (
                                    selectedStudent.name.charAt(0)
                                )}
                            </div>
                            <p className="font-mono text-slate-500 bg-slate-100 px-3 py-1 rounded-full text-sm dark:bg-slate-800 dark:text-slate-400">{selectedStudent.handle}</p>
                        </div>

                        {/* Role & CC */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 dark:bg-slate-800 dark:border-slate-700">
                                <p className="text-xs font-bold text-slate-400 uppercase mb-1">Role</p>
                                <p className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                    <User size={16} className="text-emerald-500"/> {selectedStudent.role}
                                </p>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 dark:bg-slate-800 dark:border-slate-700">
                                <p className="text-xs font-bold text-slate-400 uppercase mb-1">Volume</p>
                                <p className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                    <Award size={16} className="text-yellow-500"/> {selectedStudent.caseCredits.toFixed(2)} CC
                                </p>
                            </div>
                        </div>

                        {/* Progress */}
                        <div className="bg-white border border-slate-200 rounded-xl p-5 dark:bg-slate-800 dark:border-slate-700">
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-bold text-slate-700 dark:text-slate-200">Training Progress</span>
                                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{selectedStudent.progress}%</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2.5 dark:bg-slate-700 overflow-hidden">
                                <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: `${selectedStudent.progress}%` }}></div>
                            </div>
                        </div>

                        {/* Sponsor Info */}
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl dark:bg-slate-800">
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Sponsor</span>
                            <span className="font-mono text-sm text-emerald-600 dark:text-emerald-400 font-bold">{selectedStudent.sponsorId || 'N/A'}</span>
                        </div>

                        {/* Admin Tools */}
                        {isAdmin && (
                            <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                                <p className="text-xs font-bold text-slate-400 uppercase">Admin Controls</p>
                                
                                {isSuperAdmin && (
                                    <div className="flex items-center justify-between p-3 bg-red-50 border border-red-100 rounded-lg dark:bg-red-900/10 dark:border-red-900/30">
                                        <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
                                            <Key size={16} />
                                            <span className="text-sm font-bold">Password</span>
                                        </div>
                                        <span className="font-mono text-sm bg-white px-2 py-1 rounded text-red-600 border border-red-100 dark:bg-slate-900 dark:border-slate-700 dark:text-red-400">
                                            {selectedStudent.password}
                                        </span>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-3">
                                    <button 
                                        onClick={() => handleResetPassword(selectedStudent)}
                                        className="py-3 px-4 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors text-sm dark:bg-slate-700 dark:text-slate-300"
                                    >
                                        Reset Password
                                    </button>
                                    <button 
                                        onClick={(e) => handleDelete(e, selectedStudent)}
                                        className="py-3 px-4 bg-red-100 text-red-600 font-bold rounded-xl hover:bg-red-200 transition-colors text-sm flex items-center justify-center gap-2 dark:bg-red-900/20 dark:text-red-400"
                                    >
                                        <Trash2 size={16} /> Delete User
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* View Full Profile Link */}
                        <div className="pt-2">
                            <Link 
                                to={`/students/${selectedStudent.id}`}
                                className="block w-full bg-slate-900 text-white text-center py-4 rounded-xl font-bold hover:bg-slate-800 transition-all active:scale-[0.98] dark:bg-emerald-600 dark:hover:bg-emerald-700"
                            >
                                View Full Profile
                            </Link>
                        </div>
                    </div>
                </>
            )}
        </div>

        {/* 
            DESKTOP TABLE VIEW (Original Design)
            Hidden on Mobile (hidden md:block)
        */}
        <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden dark:bg-slate-800 dark:border-slate-700">
            <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                    <thead className="bg-slate-50 border-b border-slate-200 dark:bg-slate-900 dark:border-slate-700">
                        <tr>
                            <th className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider px-6 py-4 dark:text-slate-400">FBO Details</th>
                            <th className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider px-6 py-4 dark:text-slate-400">Role / CC</th>
                            {isSuperAdmin && <th className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider px-6 py-4 dark:text-slate-400">Password</th>}
                            <th className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider px-6 py-4 dark:text-slate-400">Sponsor</th>
                            <th className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider px-6 py-4 dark:text-slate-400">Training</th>
                            {isAdmin && <th className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider px-6 py-4 dark:text-slate-400">Actions</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                        {filteredStudents.map(student => (
                            <tr key={student.id} className="hover:bg-slate-50/50 transition-colors dark:hover:bg-slate-700/50 group">
                                <td className="px-6 py-4">
                                    <Link to={`/students/${student.id}`} className="flex items-center gap-3 cursor-pointer">
                                        <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 group-hover:bg-emerald-200 flex items-center justify-center text-sm font-bold transition-colors font-heading overflow-hidden dark:bg-emerald-900 dark:text-emerald-300">
                                            {student.avatarUrl ? (
                                                <img src={student.avatarUrl} alt={student.name} className="w-full h-full object-cover" />
                                            ) : (
                                                student.name.charAt(0)
                                            )}
                                        </div>
                                        <div>
                                            <span className="block font-bold text-slate-700 group-hover:text-emerald-700 transition-colors dark:text-slate-200 dark:group-hover:text-emerald-400">{student.name}</span>
                                            <span className="text-xs font-mono text-slate-400">{student.handle}</span>
                                        </div>
                                    </Link>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold border ${
                                        student.role === UserRole.SPONSOR ? 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800' :
                                        student.role === UserRole.ADMIN ? 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800' :
                                        student.role === UserRole.SUPER_ADMIN ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800' :
                                        'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600'
                                    }`}>
                                        {student.role} ({student.caseCredits.toFixed(2)} CC)
                                    </span>
                                </td>
                                
                                {isSuperAdmin && (
                                    <td className="px-6 py-4">
                                        <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded text-slate-600 border border-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600">
                                            {student.password}
                                        </span>
                                    </td>
                                )}

                                <td className="px-6 py-4 text-sm font-mono text-emerald-600 dark:text-emerald-400">{student.sponsorId || '-'}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1 w-24 bg-slate-100 rounded-full h-1.5 dark:bg-slate-700 overflow-hidden">
                                            <div 
                                                className="bg-emerald-500 h-1.5 rounded-full" 
                                                style={{ width: `${student.progress}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{student.progress}%</span>
                                    </div>
                                </td>
                                {isAdmin && (
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2 items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            {isSuperAdmin && (
                                                <>
                                                    <button 
                                                        onClick={() => handleResetPassword(student)}
                                                        className="text-xs font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                                                    >
                                                        Reset
                                                    </button>
                                                    <button 
                                                        onClick={(e) => handleDelete(e, student)}
                                                        className="text-xs text-white bg-red-500 hover:bg-red-600 p-2 rounded-lg transition-colors shadow-sm"
                                                        title="Delete User"
                                                    >
                                                        <TrashIcon />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {filteredStudents.length === 0 && (
                <div className="p-12 text-center text-slate-400 border-t border-slate-100 dark:border-slate-700">
                    <p>No users found matching your filters.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
);

export default StudentsList;
