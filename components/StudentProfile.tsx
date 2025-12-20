
import React, { useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Student, Course, UserRole } from '../types';
import { 
    Camera, Check, Edit2, Shield, Award, 
    Calendar, Video, Play, Search, MoreHorizontal,
    Settings, Eye, EyeOff, Moon, Sun, Key, LogOut,
    Zap
} from 'lucide-react';

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
  
  const [activeTab, setActiveTab] = useState('Overview');
  const [showPassword, setShowPassword] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  if (!student) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-10 text-slate-500 dark:text-slate-400">
        <p className="text-xl font-bold mb-4">Channel not found</p>
        <Link to="/students" className="bg-slate-900 text-white px-6 py-2 rounded-full font-bold dark:bg-emerald-600">Explore Channels</Link>
      </div>
    );
  }

  const isOwnProfile = currentUser.id === student.id;
  const isSuperAdmin = currentUser.role === UserRole.SUPER_ADMIN;
  const canViewCredentials = isOwnProfile || isSuperAdmin;
  const myCourses = courses.filter(c => student.enrolledCourses.includes(c.id));

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'AVATAR' | 'BANNER') => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updated = type === 'AVATAR' 
            ? { ...student, avatarUrl: reader.result as string }
            : { ...student, bannerUrl: reader.result as string };
        onUpdateStudent(updated);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePasswordChange = () => {
    if (newPassword.trim().length < 4) return;
    onUpdateStudent({ ...student, password: newPassword });
    setIsEditingPassword(false);
    setNewPassword('');
  };

  const TABS = ['Overview', 'Courses', 'Progress', 'Settings'];

  return (
    <div className="h-full flex flex-col bg-white dark:bg-[#0f0f0f] overflow-y-auto no-scrollbar animate-fade-in">
      
      {/* 1. CHANNEL BANNER */}
      <div className="relative w-full h-[160px] md:h-[240px] bg-slate-200 dark:bg-[#272727] shrink-0 group overflow-hidden">
          {student.bannerUrl ? (
              <img src={student.bannerUrl} className="w-full h-full object-cover" alt="Banner" />
          ) : (
              <div className="w-full h-full flex items-center justify-center opacity-30">
                  <LogoPlaceholder />
              </div>
          )}
          {isOwnProfile && (
              <button 
                  onClick={() => bannerInputRef.current?.click()}
                  className="absolute bottom-4 right-4 p-2.5 bg-black/40 text-white rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all hover:bg-black/60"
              >
                  <Camera size={20} />
              </button>
          )}
          <input type="file" ref={bannerInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'BANNER')} />
      </div>

      {/* 2. CHANNEL INFO */}
      <div className="max-w-[1284px] mx-auto w-full px-4 md:px-6 py-6 md:py-8 flex flex-col md:flex-row gap-4 md:gap-6 items-start">
          {/* Profile Picture */}
          <div className="relative shrink-0 group">
              <div 
                  className={`w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white dark:border-[#0f0f0f] bg-emerald-100 dark:bg-[#272727] shadow-sm overflow-hidden flex items-center justify-center transition-transform ${isOwnProfile ? 'cursor-pointer hover:brightness-90' : ''}`}
                  onClick={() => isOwnProfile && avatarInputRef.current?.click()}
              >
                  {student.avatarUrl ? (
                      <img src={student.avatarUrl} className="w-full h-full object-cover" alt={student.name} />
                  ) : (
                      <span className="text-5xl font-bold text-emerald-800 dark:text-emerald-400 font-heading">{student.name.charAt(0)}</span>
                  )}
                  {isOwnProfile && (
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Camera size={24} className="text-white" />
                      </div>
                  )}
              </div>
              <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'AVATAR')} />
          </div>

          {/* Details */}
          <div className="flex-1 space-y-4">
              <div>
                  <h1 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white font-heading tracking-tight mb-1">{student.name}</h1>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm md:text-base font-medium text-slate-500 dark:text-[#aaaaaa]">
                      <span className="font-bold text-slate-800 dark:text-[#f1f1f1]">{student.handle}</span>
                      <span>·</span>
                      <span>{myCourses.length} courses</span>
                      <span>·</span>
                      <span>{student.caseCredits.toFixed(2)} CC</span>
                  </div>
              </div>

              {student.bio && (
                  <div className="max-w-2xl">
                      <p className="text-sm md:text-base text-slate-600 dark:text-[#aaaaaa] line-clamp-2 leading-relaxed">
                          {student.bio}
                      </p>
                      <button className="text-slate-900 dark:text-white font-bold text-sm mt-1 hover:opacity-70">...more</button>
                  </div>
              )}

              {/* Action Buttons (YouTube Style) */}
              <div className="flex flex-wrap gap-2 pt-2">
                  {isOwnProfile ? (
                      <>
                        <button onClick={() => setActiveTab('Settings')} className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-5 py-2 rounded-full font-bold text-sm transition-colors dark:bg-[#272727] dark:hover:bg-[#3f3f3f] dark:text-[#f1f1f1]">
                            Customize channel
                        </button>
                        <button onClick={() => setActiveTab('Courses')} className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-5 py-2 rounded-full font-bold text-sm transition-colors dark:bg-[#272727] dark:hover:bg-[#3f3f3f] dark:text-[#f1f1f1]">
                            Manage courses
                        </button>
                      </>
                  ) : (
                      <button className="bg-slate-900 text-white px-6 py-2.5 rounded-full font-bold text-sm hover:opacity-90 transition-opacity dark:bg-[#f1f1f1] dark:text-[#0f0f0f]">
                          Connect
                      </button>
                  )}
              </div>
          </div>
      </div>

      {/* 3. CHANNEL TABS */}
      <div className="max-w-[1284px] mx-auto w-full border-b border-slate-100 dark:border-white/10 shrink-0">
          <div className="flex items-center gap-1 md:gap-4 px-4 overflow-x-auto no-scrollbar">
              {TABS.map(tab => (
                  <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`
                          px-4 py-4 text-sm md:text-base font-bold whitespace-nowrap relative transition-colors
                          ${activeTab === tab 
                              ? 'text-slate-900 dark:text-white' 
                              : 'text-slate-500 hover:text-slate-800 dark:text-[#aaaaaa] dark:hover:text-[#f1f1f1]'}
                      `}
                  >
                      {tab}
                      {activeTab === tab && (
                          <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-slate-900 dark:bg-white rounded-full"></div>
                      )}
                  </button>
              ))}
              <div className="ml-auto flex items-center px-4">
                  <button className="p-2 text-slate-500 dark:text-[#f1f1f1]"><Search size={20}/></button>
              </div>
          </div>
      </div>

      {/* 4. TAB CONTENT */}
      <div className="max-w-[1284px] mx-auto w-full flex-1 p-6 md:p-8">
          
          {activeTab === 'Overview' && (
              <div className="space-y-12 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* Fix: Added missing Zap import from lucide-react */}
                      <StatCard title="Learning Streak" value={`${student.learningStats.learningStreak} Days`} icon={<Zap size={20} className="text-yellow-500"/>} />
                      <StatCard title="Global Rank" value={student.rankProgress?.currentRankId || 'NOVUS'} icon={<Award size={20} className="text-emerald-500"/>} />
                      <StatCard title="Team Volume" value={`${student.caseCredits.toFixed(2)} CC`} icon={<Shield size={20} className="text-blue-500"/>} />
                  </div>

                  <div>
                      <h3 className="font-black text-xl mb-6 dark:text-white">Recent Activity</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {myCourses.slice(0, 3).map(course => (
                              <Link key={course.id} to={`/training/course/${course.id}`} className="group">
                                  <div className="aspect-video rounded-xl overflow-hidden bg-slate-100 dark:bg-[#272727] mb-3 relative shadow-md group-hover:scale-[1.02] transition-transform">
                                      <img src={course.thumbnailUrl} className="w-full h-full object-cover" />
                                      <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">12:30</div>
                                  </div>
                                  <h4 className="font-bold text-slate-800 dark:text-[#f1f1f1] line-clamp-2 leading-snug">{course.title}</h4>
                                  <p className="text-xs text-slate-500 dark:text-[#aaaaaa] mt-1">{course.modules.length} modules • Last seen 2d ago</p>
                              </Link>
                          ))}
                      </div>
                  </div>
              </div>
          )}

          {activeTab === 'Courses' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
                  {myCourses.map(course => (
                      <div key={course.id} className="group cursor-pointer">
                          <div className="aspect-video rounded-xl overflow-hidden bg-slate-100 dark:bg-[#272727] mb-3 relative shadow-sm border border-slate-100 dark:border-[#333]">
                              <img src={course.thumbnailUrl} className="w-full h-full object-cover" />
                          </div>
                          <h4 className="font-bold text-sm text-slate-900 dark:text-[#f1f1f1] line-clamp-2 leading-tight">{course.title}</h4>
                          <p className="text-[10px] text-slate-500 dark:text-[#aaaaaa] mt-1 uppercase font-bold tracking-wider">{course.track}</p>
                      </div>
                  ))}
                  {myCourses.length === 0 && (
                      <div className="col-span-full py-20 text-center text-slate-400">
                          <Play size={48} className="mx-auto mb-4 opacity-20" />
                          <p className="font-bold">No courses yet.</p>
                      </div>
                  )}
              </div>
          )}

          {activeTab === 'Progress' && (
              <div className="max-w-3xl space-y-8 animate-fade-in">
                  <div className="bg-slate-50 dark:bg-[#1f1f1f] p-6 rounded-2xl border border-slate-100 dark:border-white/5">
                      <div className="flex justify-between items-end mb-4">
                        <h3 className="font-black text-slate-800 dark:text-[#f1f1f1]">Core Progress</h3>
                        <span className="text-2xl font-black text-emerald-600">{student.progress}%</span>
                      </div>
                      <div className="w-full h-3 bg-slate-200 dark:bg-[#333] rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${student.progress}%` }} />
                      </div>
                  </div>
                  
                  <div className="space-y-4">
                      <h4 className="font-bold text-slate-400 uppercase text-xs tracking-widest">Achievements</h4>
                      <div className="flex flex-wrap gap-4">
                          {[1,2,3].map(i => (
                              <div key={i} className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-[#272727] border-2 border-emerald-500 flex items-center justify-center text-emerald-600 shadow-lg shadow-emerald-500/10">
                                  <Award size={32} />
                              </div>
                          ))}
                      </div>
                  </div>
              </div>
          )}

          {activeTab === 'Settings' && (
              <div className="max-w-2xl space-y-10 animate-fade-in">
                  {canViewCredentials && (
                      <section className="space-y-6">
                          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-white/10 pb-2">
                              <Shield size={18} className="text-emerald-500" />
                              <h3 className="font-black dark:text-white uppercase text-sm tracking-widest">Security</h3>
                          </div>
                          
                          <div className="space-y-4">
                              {isEditingPassword ? (
                                  <div className="flex gap-2">
                                      <input 
                                          type="password" 
                                          value={newPassword}
                                          onChange={(e) => setNewPassword(e.target.value)}
                                          placeholder="New Password"
                                          className="flex-1 bg-slate-100 dark:bg-[#272727] border-none rounded-lg px-4 py-2 text-white outline-none focus:ring-2 focus:ring-emerald-500"
                                      />
                                      <button onClick={handlePasswordChange} className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold">Save</button>
                                      <button onClick={() => setIsEditingPassword(false)} className="px-4 py-2 text-slate-500">Cancel</button>
                                  </div>
                              ) : (
                                  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-[#1f1f1f] rounded-xl border border-slate-100 dark:border-white/5">
                                      <div>
                                          <p className="text-xs text-slate-500 dark:text-[#aaaaaa] uppercase font-bold">Account Password</p>
                                          <p className="font-mono mt-1 dark:text-white">{showPassword ? student.password : '••••••••'}</p>
                                      </div>
                                      <div className="flex gap-2">
                                          <button onClick={() => setShowPassword(!showPassword)} className="p-2 hover:bg-white dark:hover:bg-[#333] rounded-full transition-colors dark:text-[#f1f1f1]">{showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}</button>
                                          {isOwnProfile && <button onClick={() => setIsEditingPassword(true)} className="p-2 hover:bg-white dark:hover:bg-[#333] rounded-full transition-colors dark:text-[#f1f1f1]"><Edit2 size={18}/></button>}
                                      </div>
                                  </div>
                              )}
                          </div>
                      </section>
                  )}

                  {isOwnProfile && (
                      <section className="space-y-6">
                           <div className="flex items-center gap-2 border-b border-slate-100 dark:border-white/10 pb-2">
                              <Settings size={18} className="text-blue-500" />
                              <h3 className="font-black dark:text-white uppercase text-sm tracking-widest">Interface</h3>
                          </div>
                          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-[#1f1f1f] rounded-xl border border-slate-100 dark:border-white/5">
                              <div>
                                  <p className="text-sm font-bold dark:text-white">Visual Appearance</p>
                                  <p className="text-xs text-slate-500 dark:text-[#aaaaaa]">{theme === 'dark' ? 'Dark theme is active' : 'Light theme is active'}</p>
                              </div>
                              <button 
                                  onClick={onToggleTheme}
                                  className="flex items-center gap-2 px-4 py-2 bg-slate-200 dark:bg-[#3f3f3f] rounded-full text-sm font-bold dark:text-[#f1f1f1]"
                              >
                                  {theme === 'dark' ? <Moon size={16}/> : <Sun size={16}/>}
                                  Switch
                              </button>
                          </div>
                      </section>
                  )}
              </div>
          )}

      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) => (
    <div className="bg-slate-50 dark:bg-[#1f1f1f] p-5 rounded-2xl border border-slate-100 dark:border-white/5 flex items-center gap-4 transition-all hover:bg-white dark:hover:bg-[#252525] hover:shadow-xl dark:hover:shadow-none hover:border-emerald-500/20 group">
        <div className="w-12 h-12 bg-white dark:bg-[#272727] rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
            {icon}
        </div>
        <div>
            <p className="text-[10px] font-black text-slate-400 dark:text-[#aaaaaa] uppercase tracking-widest">{title}</p>
            <p className="text-lg font-black text-slate-900 dark:text-[#f1f1f1]">{value}</p>
        </div>
    </div>
);

const LogoPlaceholder = () => (
    <svg viewBox="0 0 100 100" width="100" height="100" className="text-slate-400">
        <rect x="20" y="20" width="60" height="60" rx="12" fill="none" stroke="currentColor" strokeWidth="4" />
        <path d="M40 40 L60 50 L40 60 Z" fill="currentColor" />
    </svg>
);

export default StudentProfile;
