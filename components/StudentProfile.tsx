import React, { useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Student, Course, UserRole } from '../types';

interface StudentProfileProps {
  students: Student[];
  courses: Course[];
  currentUser: Student;
  onUpdateStudent: (student: Student) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

const StudentProfile: React.FC<StudentProfileProps> = ({ students, courses, currentUser, onUpdateStudent, theme, onToggleTheme }) => {
  const { studentId } = useParams();
  const student = students.find(s => s.id === studentId);
  
  const [showPassword, setShowPassword] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!student) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-500 dark:text-slate-400">
        <p className="text-lg mb-4">Student not found.</p>
        <Link to="/students" className="text-emerald-600 hover:underline dark:text-emerald-400">Back to Students List</Link>
      </div>
    );
  }

  // Demo function to simulate buying products (increasing CC)
  const handleAddCC = () => {
    const updated = {...student, caseCredits: student.caseCredits + 0.5};
    onUpdateStudent(updated);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updated = { ...student, avatarUrl: reader.result as string };
        onUpdateStudent(updated);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePasswordChange = () => {
    if (newPassword.trim().length < 4) {
        alert("Password must be at least 4 characters");
        return;
    }
    const updated = { ...student, password: newPassword };
    onUpdateStudent(updated);
    setIsEditingPassword(false);
    setNewPassword('');
    alert("Password updated successfully!");
  };

  const isSponsor = student.caseCredits >= 2;
  const isOwnProfile = currentUser.id === student.id;
  const isSuperAdmin = currentUser.role === UserRole.SUPER_ADMIN;
  // Access control: Super Admin can see all, User can see own. Regular Admin cannot see passwords anymore.
  const canViewCredentials = isOwnProfile || isSuperAdmin;

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
        <Link to="/students" className="hover:text-emerald-600 transition-colors dark:hover:text-emerald-400">Students</Link>
        <span>/</span>
        <span className="text-emerald-900 font-medium truncate dark:text-emerald-200">{student.name}</span>
      </div>

      {/* Header Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8 relative overflow-hidden dark:bg-slate-800 dark:border-slate-700">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-50 to-transparent rounded-bl-full -mr-16 -mt-16 pointer-events-none opacity-50 md:opacity-100 dark:from-emerald-900/30"></div>
        
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start relative z-10">
          {/* Avatar */}
          <div className="relative group">
            <div 
                className={`w-24 h-24 md:w-32 md:h-32 rounded-full bg-slate-100 border-4 border-white shadow-lg overflow-hidden flex items-center justify-center dark:bg-slate-700 dark:border-slate-600 ${isOwnProfile ? 'cursor-pointer' : ''}`}
                onClick={() => isOwnProfile && fileInputRef.current?.click()}
            >
                {student.avatarUrl ? (
                    <img src={student.avatarUrl} alt={student.name} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-emerald-200 text-emerald-800 flex items-center justify-center text-3xl md:text-4xl font-bold font-heading dark:from-emerald-800 dark:to-emerald-900 dark:text-emerald-200">
                        {student.name.charAt(0)}
                    </div>
                )}
                {/* Edit Overlay */}
                {isOwnProfile && (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                        <CameraIcon />
                    </div>
                )}
            </div>
            <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={handleFileChange}
            />
          </div>
          
          {/* User Info */}
          <div className="flex-1 space-y-3 text-center md:text-left w-full pt-2">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-3">
              <h1 className="text-2xl md:text-3xl font-bold text-emerald-950 font-heading dark:text-white">{student.name}</h1>
              {isSponsor ? (
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded-full border border-yellow-200 uppercase tracking-wider flex items-center gap-1 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800">
                   <span className="text-base">⭐</span> Sponsor
                </span>
              ) : (
                <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full border border-slate-200 uppercase tracking-wider dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600">
                  Student
                </span>
              )}
            </div>
            <p className="font-mono text-emerald-600 font-medium text-base md:text-lg bg-emerald-50/50 inline-block px-2 rounded md:bg-transparent md:px-0 dark:text-emerald-400 dark:bg-emerald-900/30">
              {student.handle}
            </p>
            
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6 text-slate-500 text-sm dark:text-slate-400">
              <div className="flex items-center gap-1.5 break-all justify-center md:justify-start">
                <EnvelopeIcon />
                {student.email}
              </div>
              <div className="hidden md:block w-1 h-1 bg-slate-300 rounded-full dark:bg-slate-600"></div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Invited by:</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400">{student.sponsorId || 'N/A'}</span>
              </div>
            </div>

            {/* CC Progress for Students */}
            <div className="mt-4 w-full md:max-w-md mx-auto md:mx-0">
                <div className="flex justify-between text-xs mb-1 font-semibold">
                    <span className="dark:text-slate-300">Case Credits (CC)</span>
                    <span className={student.caseCredits >= 2 ? 'text-green-600 dark:text-green-400' : 'text-slate-500 dark:text-slate-400'}>{student.caseCredits.toFixed(1)} / 2.0 CC</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 dark:bg-slate-700">
                    <div className={`h-2 rounded-full transition-all duration-500 ${isSponsor ? 'bg-yellow-400' : 'bg-emerald-500'}`} style={{ width: `${Math.min(100, (student.caseCredits / 2) * 100)}%` }}></div>
                </div>
                {!isSponsor && isOwnProfile && (
                    <button onClick={handleAddCC} className="mt-2 text-xs text-emerald-600 hover:underline w-full md:w-auto text-center md:text-left dark:text-emerald-400">
                        + Simulate 0.5CC Order
                    </button>
                )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        <div className="space-y-6">
          
          {/* Credentials Card */}
          {canViewCredentials && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 md:p-6 dark:bg-slate-800 dark:border-slate-700">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                    <div>
                        <h3 className="font-bold text-slate-800 mb-1 dark:text-slate-100">Security Credentials</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Manage your password securely.</p>
                    </div>
                    
                    {isOwnProfile && !isEditingPassword && (
                        <button 
                            onClick={() => setIsEditingPassword(true)}
                            className="text-sm text-emerald-600 font-medium hover:text-emerald-700 underline dark:text-emerald-400"
                        >
                            Change Password
                        </button>
                    )}
                </div>

                {isEditingPassword ? (
                    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center bg-slate-50 p-4 rounded-lg border border-slate-200 transition-all dark:bg-slate-700/50 dark:border-slate-600">
                        <input 
                            type="password" 
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter new password"
                            className="px-4 py-2 rounded-lg border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-sm w-full sm:w-auto flex-1 bg-white text-slate-900 dark:bg-slate-700 dark:text-white dark:border-slate-500"
                        />
                        <div className="flex gap-2 w-full sm:w-auto">
                            <button 
                                onClick={() => setIsEditingPassword(false)}
                                className="flex-1 sm:flex-none px-3 py-2 text-sm text-slate-600 hover:bg-slate-200 rounded-lg dark:text-slate-300 dark:hover:bg-slate-600"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handlePasswordChange}
                                className="flex-1 sm:flex-none px-4 py-2 text-sm bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg shadow-sm"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex w-full sm:w-auto items-center justify-between gap-4 bg-slate-50 px-4 py-3 rounded-lg border border-slate-200 dark:bg-slate-700/50 dark:border-slate-600">
                        <div className="text-left flex-1">
                            <p className="text-[10px] text-slate-400 font-bold uppercase dark:text-slate-400">Password</p>
                            <p className="font-mono text-slate-800 font-medium text-sm sm:text-base dark:text-slate-200">
                                {showPassword ? student.password : '••••••••'}
                            </p>
                        </div>
                        <button 
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-emerald-600 hover:bg-emerald-100 p-2 rounded-full transition-colors dark:text-emerald-400 dark:hover:bg-emerald-900/30"
                        >
                            {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                        </button>
                    </div>
                )}
            </div>
          )}

          {/* App Settings Card */}
          {isOwnProfile && (
             <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 md:p-6 dark:bg-slate-800 dark:border-slate-700">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-bold text-slate-800 mb-1 dark:text-slate-100">App Settings</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Customize your viewing experience.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{theme === 'light' ? 'Light Mode' : 'Dark Mode'}</span>
                        <button 
                            onClick={onToggleTheme}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${theme === 'dark' ? 'bg-emerald-600' : 'bg-slate-200'}`}
                        >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                    </div>
                </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

const EnvelopeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
    <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
    <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
  </svg>
);

const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const EyeSlashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
  </svg>
);

const CameraIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-white">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
    </svg>
);

export default StudentProfile;