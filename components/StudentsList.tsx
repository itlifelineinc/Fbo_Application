
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Student, UserRole } from '../types';
import { Search, X } from 'lucide-react';

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
    <rect x="2" y="2" width="20" height="20" rx="6" fill="currentColor" />
    <path d="M12 8V16" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 12H16" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Standardized Input Style (Facebook-like: Flat, No Ring, Thin Border)
const INPUT_CLASS = "w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-3 text-base text-slate-900 dark:text-white placeholder-slate-400 focus:border-slate-500 dark:focus:border-slate-400 focus:outline-none transition-colors";
const LABEL_CLASS = "block text-sm font-bold text-slate-500 dark:text-slate-400 mb-1.5 ml-1";

const StudentsList: React.FC<StudentsListProps> = ({ students, onAddStudent, currentUser, onUpdateStudent, onDeleteStudent }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentEmail, setNewStudentEmail] = useState('');
  
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
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-950 animate-fade-in relative">
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
                     className={INPUT_CLASS + " pl-10 py-2 rounded-full"}
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

       <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
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

        {/* FULL PAGE DRAWER (Mobile & Desktop) */}
        {isFormOpen && (
            <div className="fixed inset-0 z-[100] flex justify-end">
                <style>{`
                  @keyframes slideInRight {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                  }
                  .animate-slide-in {
                    animation: slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                  }
                `}</style>
                
                {/* Backdrop - Covers everything */}
                <div 
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
                    onClick={() => setIsFormOpen(false)}
                ></div>

                {/* Drawer Content - Full height, slides from right */}
                <div className="relative w-full md:max-w-md h-full bg-white dark:bg-slate-900 shadow-2xl animate-slide-in flex flex-col border-l border-slate-100 dark:border-slate-800">
                    
                    {/* Header */}
                    <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-heading">Enroll New FBO</h2>
                        <button 
                            onClick={() => setIsFormOpen(false)} 
                            className="p-2 -mr-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full dark:hover:bg-slate-800 transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Form Content */}
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
                            
                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                    New user will be added to <strong>{currentUser.handle}</strong>'s downline. A temporary password <span className="font-mono bg-slate-200 dark:bg-slate-700 px-1 rounded">password123</span> will be assigned.
                                </p>
                            </div>

                            <div className="pt-4 flex flex-col gap-3">
                                <button 
                                    type="submit"
                                    className="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-900/20 active:scale-[0.98]"
                                >
                                    Confirm Enrollment
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => setIsFormOpen(false)}
                                    className="w-full py-4 text-slate-500 font-bold hover:bg-slate-50 rounded-xl transition-colors dark:text-slate-400 dark:hover:bg-slate-800"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )}

        {/* Students Table - Responsive Container */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden dark:bg-slate-800 dark:border-slate-700">
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
                            <tr key={student.id} className="hover:bg-slate-50/50 transition-colors dark:hover:bg-slate-700/50">
                                <td className="px-6 py-4">
                                    <Link to={`/students/${student.id}`} className="flex items-center gap-3 group cursor-pointer">
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
                                        {student.role} ({student.caseCredits} CC)
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
                                        <div className="flex-1 w-24 bg-slate-100 rounded-full h-1.5 dark:bg-slate-700">
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
                                        <div className="flex gap-2 items-center">
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
