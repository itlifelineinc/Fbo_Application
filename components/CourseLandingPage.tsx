
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Course, CourseStatus, Student } from '../types';
import { CheckCircle, PlayCircle, Clock, BookOpen, User, Lock, ArrowLeft, Star, Quote, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';

interface CourseLandingPageProps {
  courses: Course[];
  currentUser: Student;
  onEnrollCourse: (courseId: string) => void;
  students?: Student[]; // Optional for backward compat, but needed for creator lookup
}

const CourseLandingPage: React.FC<CourseLandingPageProps> = ({ courses, currentUser, onEnrollCourse, students }) => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const course = courses.find(c => c.id === courseId);
  
  // Testimonial Carousel State
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Auto-slide effect
  useEffect(() => {
    if (!course?.testimonials || course.testimonials.length <= 1) return;
    
    const interval = setInterval(() => {
        setActiveTestimonial(prev => (prev + 1) % course.testimonials!.length);
    }, 5000); // 5 seconds
    
    return () => clearInterval(interval);
  }, [course?.testimonials]);

  if (!course) return <div className="p-10 text-center dark:text-white">Course not found</div>;

  const isEnrolled = currentUser.enrolledCourses?.includes(course.id);

  // --- LOGIC: Access & Pricing ---
  const isTeamMember = currentUser.sponsorId === course.authorHandle; // Direct Downline
  const isAuthor = currentUser.handle === course.authorHandle; // Self
  const isGlobalFree = !course.settings.price || course.settings.price === 0;
  
  // You have access if: You own it OR You are in the team OR It's globally free
  const hasFreeAccess = isAuthor || isTeamMember || isGlobalFree;
  
  // "Purchase" simulation
  const handlePurchase = () => {
      // In a real app, integrate Stripe/PayPal here.
      if(window.confirm(`Confirm purchase for $${course.settings.price}?`)) {
          alert("Purchase Successful! Welcome to the course.");
          onEnrollCourse(course.id);
          navigate(`/training/course/${course.id}`);
      }
  };

  const handleEnroll = () => {
      onEnrollCourse(course.id);
      navigate(`/training/course/${course.id}`);
  };

  const nextTestimonial = () => {
      if (!course.testimonials) return;
      setActiveTestimonial(prev => (prev + 1) % course.testimonials!.length);
  };

  const prevTestimonial = () => {
      if (!course.testimonials) return;
      setActiveTestimonial(prev => (prev - 1 + course.testimonials!.length) % course.testimonials!.length);
  };

  // --- LOGIC: Creator Lookup ---
  // Try to find the author in the student list to get real name/role. Fallback to handle.
  const authorProfile = students?.find(s => s.handle === course.authorHandle);
  const authorName = authorProfile ? authorProfile.name : course.authorHandle;
  const authorRole = authorProfile ? authorProfile.role : 'Instructor';
  const authorInitial = authorName.charAt(0).toUpperCase();

  // Calculate stats
  const totalDuration = course.modules.reduce((acc, m) => acc + m.chapters.reduce((cAcc, c) => cAcc + c.durationMinutes, 0), 0);
  const durationStr = totalDuration > 60 ? `${Math.floor(totalDuration / 60)} Hrs ${totalDuration % 60} Mins` : `${totalDuration} Mins`;
  const totalLessons = course.modules.reduce((acc, m) => acc + m.chapters.length, 0);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 animate-fade-in pb-20">
      
      {/* 1. Hero Section */}
      <div className="relative h-[60vh] min-h-[500px] w-full overflow-hidden">
          <div className="absolute inset-0">
              <img 
                src={course.bannerImageUrl || course.thumbnailUrl} 
                alt={course.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-slate-900/40" />
          </div>

          <div className="absolute inset-0 flex flex-col justify-end pb-16 px-6 md:px-12 max-w-7xl mx-auto">
              <button 
                onClick={() => navigate(-1)} 
                className="absolute top-8 left-6 md:left-12 flex items-center gap-2 text-white/70 hover:text-white transition-colors bg-black/20 hover:bg-black/40 px-4 py-2 rounded-full backdrop-blur-sm"
              >
                  <ArrowLeft size={18} /> Back to Library
              </button>

              <div className="space-y-6 max-w-4xl">
                  <div className="flex flex-wrap gap-3">
                      <span className="px-3 py-1 bg-emerald-500/90 backdrop-blur-md text-white text-xs font-bold rounded-full uppercase tracking-wider shadow-lg shadow-emerald-900/20">
                          {course.track}
                      </span>
                      <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-bold rounded-full uppercase tracking-wider border border-white/10">
                          {course.level} Level
                      </span>
                      {isTeamMember && (
                          <span className="px-3 py-1 bg-yellow-500/90 backdrop-blur-md text-white text-xs font-bold rounded-full uppercase tracking-wider shadow-lg">
                              Team Exclusive: Free
                          </span>
                      )}
                  </div>
                  
                  <h1 className="text-4xl md:text-6xl font-bold text-white font-heading leading-tight drop-shadow-lg">
                      {course.title}
                  </h1>
                  
                  <p className="text-lg md:text-xl text-slate-200 leading-relaxed max-w-2xl drop-shadow-md">
                      {course.subtitle}
                  </p>

                  <div className="flex flex-wrap items-center gap-8 text-slate-300 text-sm font-bold uppercase tracking-widest pt-4">
                      <div className="flex items-center gap-2">
                          <Clock size={18} className="text-emerald-400" />
                          <span>{durationStr}</span>
                      </div>
                      <div className="flex items-center gap-2">
                          <BookOpen size={18} className="text-emerald-400" />
                          <span>{course.modules.length} Modules</span>
                      </div>
                      <div className="flex items-center gap-2">
                          <PlayCircle size={18} className="text-emerald-400" />
                          <span>{totalLessons} Lessons</span>
                      </div>
                  </div>

                  <div className="pt-6">
                      {isEnrolled ? (
                          <button 
                            onClick={() => navigate(`/training/course/${course.id}`)}
                            className="bg-white text-emerald-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-100 transition-all shadow-xl shadow-black/20 flex items-center gap-3"
                          >
                              <PlayCircle size={22} fill="currentColor" />
                              Go to Classroom
                          </button>
                      ) : hasFreeAccess ? (
                          <button 
                            onClick={handleEnroll}
                            className="bg-emerald-600 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-900/30 flex items-center gap-3 hover:scale-105"
                          >
                              <span className="text-xl">+</span> Add to Classroom (Free)
                          </button>
                      ) : (
                          <button 
                            onClick={handlePurchase}
                            className="bg-blue-600 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-blue-500 transition-all shadow-xl shadow-blue-900/30 flex items-center gap-3 hover:scale-105"
                          >
                              <ShoppingCart size={22} /> Buy Course for ${course.settings.price}
                          </button>
                      )}
                  </div>
              </div>
          </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* LEFT COLUMN: Details */}
          <div className="lg:col-span-2 space-y-12">
              
              {/* About */}
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 dark:bg-slate-800 dark:border-slate-700">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6 font-heading dark:text-white">About This Course</h2>
                  <p className="text-slate-600 leading-relaxed text-lg whitespace-pre-wrap dark:text-slate-300">
                      {course.description}
                  </p>
              </div>

              {/* What you'll learn */}
              <div className="bg-emerald-50/50 p-8 rounded-3xl border border-emerald-100 dark:bg-emerald-900/10 dark:border-emerald-800/30">
                  <h2 className="text-2xl font-bold text-emerald-900 mb-6 font-heading dark:text-emerald-400">What You'll Learn</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {course.learningOutcomes.map((outcome, idx) => (
                          <div key={idx} className="flex gap-4 items-start">
                              <div className="mt-1 bg-emerald-200 text-emerald-800 rounded-full p-1 dark:bg-emerald-800 dark:text-emerald-200">
                                  <CheckCircle size={14} />
                              </div>
                              <span className="text-slate-700 font-medium dark:text-slate-300">{outcome}</span>
                          </div>
                      ))}
                  </div>
              </div>

              {/* Curriculum Preview */}
              <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-6 font-heading dark:text-white">Course Curriculum</h2>
                  <div className="space-y-4">
                      {course.modules.map((module, idx) => (
                          <div key={module.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden dark:bg-slate-800 dark:border-slate-700">
                              <div className="p-5 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800">
                                  <div className="flex items-center gap-4">
                                      <span className="w-8 h-8 rounded-lg bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm dark:bg-slate-700 dark:text-slate-300">
                                          {idx + 1}
                                      </span>
                                      <h3 className="font-bold text-slate-800 dark:text-slate-100">{module.title}</h3>
                                  </div>
                                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">{module.chapters.length} Lessons</span>
                              </div>
                              <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
                                  {module.chapters.map((chap) => (
                                      <div key={chap.id} className="p-4 flex items-center justify-between text-sm text-slate-600 pl-16 hover:bg-slate-50 transition-colors dark:text-slate-400 dark:hover:bg-slate-700/30">
                                          <div className="flex items-center gap-3">
                                              {chap.type === 'VIDEO' ? <PlayCircle size={16} /> : <BookOpen size={16} />}
                                              <span>{chap.title}</span>
                                          </div>
                                          {isEnrolled || hasFreeAccess ? (
                                              <span className="text-emerald-600 font-bold text-xs">Available</span>
                                          ) : (
                                              <Lock size={14} className="text-slate-300" />
                                          )}
                                      </div>
                                  ))}
                              </div>
                          </div>
                      ))}
                  </div>
              </div>

              {/* Testimonials - Modern Sliding Carousel */}
              {course.testimonials && course.testimonials.length > 0 && (
                  <div className="relative">
                      <h2 className="text-2xl font-bold text-slate-900 mb-6 font-heading dark:text-white">Success Stories</h2>
                      
                      <div className="relative bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-lg border border-slate-100 dark:border-slate-700 overflow-hidden">
                          {/* Background decoration */}
                          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-emerald-100 dark:bg-emerald-900/30 rounded-full blur-2xl opacity-50 pointer-events-none"></div>
                          <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 bg-yellow-50 dark:bg-yellow-900/10 rounded-full blur-2xl opacity-50 pointer-events-none"></div>
                          
                          {/* Content Container with Animation Key */}
                          <div className="relative z-10 transition-opacity duration-300 ease-in-out" key={activeTestimonial}>
                              <div className="min-h-[200px] flex flex-col justify-center">
                                  <div className="flex gap-1 text-yellow-400 mb-6 justify-center">
                                      {[1,2,3,4,5].map(i => <Star key={i} size={20} fill="currentColor" />)}
                                  </div>
                                  
                                  <div className="relative mb-8 px-4 md:px-12">
                                      <Quote size={40} className="absolute -top-4 -left-2 text-emerald-100 dark:text-emerald-900/30 -z-10" />
                                      <p className="text-xl md:text-2xl text-slate-700 dark:text-slate-200 text-center font-heading leading-relaxed italic">
                                          "{course.testimonials[activeTestimonial].quote}"
                                      </p>
                                      <Quote size={40} className="absolute -bottom-4 -right-2 text-emerald-100 dark:text-emerald-900/30 -z-10 transform rotate-180" />
                                  </div>
                                  
                                  <div className="flex items-center justify-center gap-4 mt-auto">
                                      <div className="w-14 h-14 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-500 overflow-hidden dark:bg-slate-700 dark:text-slate-300 shadow-inner border-2 border-white dark:border-slate-600">
                                          {course.testimonials[activeTestimonial].avatarUrl ? 
                                              <img src={course.testimonials[activeTestimonial].avatarUrl} className="w-full h-full object-cover" /> : 
                                              course.testimonials[activeTestimonial].name.charAt(0)
                                          }
                                      </div>
                                      <div className="text-left">
                                          <p className="font-bold text-slate-900 dark:text-white text-lg">{course.testimonials[activeTestimonial].name}</p>
                                          <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium tracking-wide uppercase text-xs">{course.testimonials[activeTestimonial].role}</p>
                                      </div>
                                  </div>
                              </div>
                          </div>

                          {/* Navigation Buttons */}
                          {course.testimonials.length > 1 && (
                              <>
                                  <button 
                                      onClick={(e) => { e.stopPropagation(); prevTestimonial(); }}
                                      className="absolute top-1/2 left-2 md:left-4 -translate-y-1/2 p-3 rounded-full bg-white/80 dark:bg-slate-700/80 text-slate-600 dark:text-slate-200 shadow-lg hover:bg-emerald-50 dark:hover:bg-slate-600 hover:text-emerald-600 transition-all hover:scale-110 z-20 backdrop-blur-sm"
                                      aria-label="Previous testimonial"
                                  >
                                      <ChevronLeft size={24} />
                                  </button>
                                  <button 
                                      onClick={(e) => { e.stopPropagation(); nextTestimonial(); }}
                                      className="absolute top-1/2 right-2 md:right-4 -translate-y-1/2 p-3 rounded-full bg-white/80 dark:bg-slate-700/80 text-slate-600 dark:text-slate-200 shadow-lg hover:bg-emerald-50 dark:hover:bg-slate-600 hover:text-emerald-600 transition-all hover:scale-110 z-20 backdrop-blur-sm"
                                      aria-label="Next testimonial"
                                  >
                                      <ChevronRight size={24} />
                                  </button>
                              </>
                          )}
                      </div>

                      {/* Indicators */}
                      {course.testimonials.length > 1 && (
                          <div className="flex justify-center gap-2 mt-6">
                              {course.testimonials.map((_, idx) => (
                                  <button 
                                      key={idx}
                                      onClick={() => setActiveTestimonial(idx)}
                                      className={`transition-all duration-300 rounded-full h-2 ${idx === activeTestimonial ? 'w-8 bg-emerald-500' : 'w-2 bg-slate-300 dark:bg-slate-600 hover:bg-emerald-300'}`}
                                      aria-label={`Go to testimonial ${idx + 1}`}
                                  />
                              ))}
                          </div>
                      )}
                  </div>
              )}

          </div>

          {/* RIGHT COLUMN: Sticky Sidebar */}
          <div className="relative">
              <div className="sticky top-24 space-y-6">
                  
                  {/* Instructor Card (Dynamic) */}
                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Course Creator</h3>
                      <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-800 font-bold text-lg dark:bg-emerald-900 dark:text-emerald-200 overflow-hidden">
                              {authorProfile?.avatarUrl ? <img src={authorProfile.avatarUrl} className="w-full h-full object-cover"/> : authorInitial}
                          </div>
                          <div>
                              <p className="font-bold text-slate-900 text-lg dark:text-white">{authorName}</p>
                              <p className="text-sm text-slate-500 dark:text-slate-400">{authorRole}</p>
                          </div>
                      </div>
                  </div>

                  {/* Target Audience */}
                  <div className="bg-slate-900 p-6 rounded-3xl text-white shadow-xl">
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Who is this for?</h3>
                      <ul className="space-y-3">
                          {course.targetAudience.map((aud, i) => (
                              <li key={i} className="flex gap-3 items-start text-sm text-slate-300">
                                  <User size={16} className="text-emerald-400 mt-0.5 shrink-0" />
                                  {aud}
                              </li>
                          ))}
                      </ul>
                  </div>

                  {/* Pricing/Value Proposition - DYNAMIC TEXT */}
                  <div className={`p-6 rounded-3xl border text-center ${isTeamMember ? 'bg-emerald-50 border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-800' : 'bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-700'}`}>
                      <p className={`font-bold mb-2 ${isTeamMember ? 'text-emerald-800 dark:text-emerald-300' : 'text-slate-800 dark:text-slate-200'}`}>
                          {isTeamMember ? "100% Free for Team Members" : isGlobalFree ? "Free Course" : `Premium Access: $${course.settings.price}`}
                      </p>
                      <p className="text-xs opacity-80 leading-relaxed">
                          {isTeamMember 
                            ? "This training is exclusive to the FBO Growth Academy. Since you are in the creator's team, you have full access for free." 
                            : isGlobalFree 
                            ? "This course is made available for free to the global community."
                            : "Invest in your growth. Purchase this course to unlock all modules and materials."}
                      </p>
                  </div>

              </div>
          </div>

      </div>
    </div>
  );
};

export default CourseLandingPage;
