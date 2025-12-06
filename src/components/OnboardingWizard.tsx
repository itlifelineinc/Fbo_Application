
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Student, QuizResult, UserRole } from '../types';
import { generateOnboardingPlan } from '../services/geminiService';
import { Loader2, Sparkles, User, Users, Shield, Camera, QrCode, CheckCircle, XCircle, Smartphone, Globe, Mail, UserCheck, Eye, EyeOff, Lock, Hash } from 'lucide-react';
import { Logo } from './Logo';

interface OnboardingWizardProps {
  onEnroll: (student: Student) => void;
  existingStudents: Student[];
}

const COUNTRY_CONFIG: Record<string, { code: string, len: number, placeholder: string }> = {
  'USA': { code: '+1', len: 10, placeholder: '202 555 0123' },
  'UK': { code: '+44', len: 10, placeholder: '7700 900077' },
  'Ghana': { code: '+233', len: 9, placeholder: '54 123 4567' },
  'Nigeria': { code: '+234', len: 10, placeholder: '803 123 4567' },
  'South Africa': { code: '+27', len: 9, placeholder: '72 123 4567' },
  'Kenya': { code: '+254', len: 9, placeholder: '712 123 456' },
  'UAE': { code: '+971', len: 9, placeholder: '50 123 4567' },
  'India': { code: '+91', len: 10, placeholder: '98123 12345' },
  'Canada': { code: '+1', len: 10, placeholder: '416 555 0123' },
  'Australia': { code: '+61', len: 9, placeholder: '412 345 678' }
};

const COUNTRIES = Object.keys(COUNTRY_CONFIG);

const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onEnroll, existingStudents }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Steps: 0=Role, 1=Account, 2=OTP, 3=Profile/Handle, 4=Sponsor, 5=Goals, 6=Success
  const [step, setStep] = useState(0);
  
  // -- Form Data --
  
  // 0. Role
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.STUDENT);

  // 1. Account
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [localPhone, setLocalPhone] = useState(''); // Store only local digits
  const [country, setCountry] = useState('Ghana');
  const [foreverId, setForeverId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [adminCode, setAdminCode] = useState('');
  
  // UI States for Step 1
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 2. OTP
  const [otp, setOtp] = useState(['', '', '', '']);
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  // 3. Profile
  const [avatarUrl, setAvatarUrl] = useState('');
  
  // WhatsApp State (Smart handling)
  const [whatsappCountry, setWhatsappCountry] = useState(country);
  const [localWhatsapp, setLocalWhatsapp] = useState('');
  
  const [bio, setBio] = useState('');
  const [customHandle, setCustomHandle] = useState('');
  const [handleStatus, setHandleStatus] = useState<'IDLE' | 'CHECKING' | 'AVAILABLE' | 'TAKEN' | 'INVALID'>('IDLE');

  // 4. Sponsor
  const [sponsorMethod, setSponsorMethod] = useState<'ID' | 'QR'>('ID');
  const [sponsorHandle, setSponsorHandle] = useState('');
  const [sponsorError, setSponsorError] = useState('');
  const [verifiedSponsor, setVerifiedSponsor] = useState<Student | null>(null);
  const [isScanning, setIsScanning] = useState(false); // Mock scanning state

  // 5. Goals
  const [quizAnswers, setQuizAnswers] = useState<QuizResult[]>([]);

  // 6. AI Plan
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [welcomePlan, setWelcomePlan] = useState('');

  // --- Effects ---

  // Sync WhatsApp country default when Step 1 country changes
  useEffect(() => {
      setWhatsappCountry(country);
  }, [country]);

  // Auto-fill sponsor from URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const sponsorParam = searchParams.get('sponsor');
    if (sponsorParam) {
        setSponsorHandle(sponsorParam.startsWith('@') ? sponsorParam : `@${sponsorParam}`);
    }
  }, [location]);

  // Handle Logic
  useEffect(() => {
      // Validate length: 3-30 chars
      if (customHandle.length >= 3 && customHandle.length <= 30) {
          const timeout = setTimeout(() => checkHandleAvailability(customHandle), 500);
          return () => clearTimeout(timeout);
      } else if (customHandle.length > 0) {
          setHandleStatus('INVALID');
      } else {
          setHandleStatus('IDLE');
      }
  }, [customHandle]);

  const checkHandleAvailability = (val: string) => {
      setHandleStatus('CHECKING');
      const formatted = val.startsWith('@') ? val : `@${val}`;
      const exists = existingStudents.some(s => s.handle.toLowerCase() === formatted.toLowerCase());
      
      // Artificial delay for realism
      setTimeout(() => {
          setHandleStatus(exists ? 'TAKEN' : 'AVAILABLE');
      }, 600);
  };

  const handleHandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      // YouTube style: Alphanumeric, underscores, hyphens, periods. No spaces.
      const val = e.target.value.replace(/[^a-zA-Z0-9_.-]/g, '').toLowerCase();
      setCustomHandle(val);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => setAvatarUrl(reader.result as string);
          reader.readAsDataURL(file);
      }
  };

  // Phone Input Logic
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let val = e.target.value.replace(/\D/g, ''); // Remove non-digits
      
      // Automatically remove leading zero for international format standard
      if (val.startsWith('0')) {
          val = val.substring(1);
      }
      setLocalPhone(val);
  };

  // WhatsApp Input Logic
  const handleWhatsappChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let val = e.target.value.replace(/\D/g, ''); // Remove non-digits
      if (val.startsWith('0')) {
          val = val.substring(1);
      }
      setLocalWhatsapp(val);
  };

  // OTP Logic
  const handleOtpChange = (index: number, val: string) => {
      if (!/^\d*$/.test(val)) return; // Restrict to numbers only
      if (val.length > 1) return;
      
      const newOtp = [...otp];
      newOtp[index] = val;
      setOtp(newOtp);
      // Auto-focus next
      if (val && index < 3) {
          document.getElementById(`otp-${index + 1}`)?.focus();
      }
  };

  // Sponsor Logic
  const verifySponsor = () => {
      const formatted = sponsorHandle.startsWith('@') ? sponsorHandle : `@${sponsorHandle}`;
      const sponsor = existingStudents.find(s => s.handle.toLowerCase() === formatted.toLowerCase());
      
      if (!sponsor) {
          setSponsorError('Sponsor not found.');
          setVerifiedSponsor(null);
          return;
      }
      setVerifiedSponsor(sponsor);
      setSponsorError('');
  };

  const simulateScan = () => {
      setIsScanning(true);
      setTimeout(() => {
          setIsScanning(false);
          setSponsorHandle('@alice_success');
          // Auto verify logic duplicated
          const sponsor = existingStudents.find(s => s.handle === '@alice_success');
          if(sponsor) setVerifiedSponsor(sponsor);
      }, 2000);
  };

  // Goals Logic
  const handleQuizAnswer = (question: string, answer: string) => {
    setQuizAnswers(prev => {
      const filtered = prev.filter(a => a.question !== question);
      return [...filtered, { question, answer }];
    });
  };
  const getAnswer = (q: string) => quizAnswers.find(a => a.question === q)?.answer;

  // Final Submit
  const handleFinish = async () => {
    // Basic validation
    if (!name || !email || !password || !customHandle || handleStatus !== 'AVAILABLE') return;

    const formattedHandle = customHandle.startsWith('@') ? customHandle : `@${customHandle}`;
    const fullPhone = `${COUNTRY_CONFIG[country].code}${localPhone}`;
    const fullWhatsapp = localWhatsapp ? `${COUNTRY_CONFIG[whatsappCountry].code}${localWhatsapp}` : '';

    const newStudent: Student = {
      id: Date.now().toString(),
      handle: formattedHandle,
      password: password,
      role: selectedRole,
      name,
      email,
      phoneNumber: fullPhone,
      country,
      foreverId,
      whatsappNumber: fullWhatsapp,
      bio,
      avatarUrl,
      enrolledDate: new Date().toISOString().split('T')[0],
      progress: 0,
      completedModules: [],
      completedChapters: [],
      enrolledCourses: [],
      sponsorId: verifiedSponsor?.handle || '@forever_system',
      caseCredits: 0, 
      quizResults: quizAnswers,
      learningStats: { totalTimeSpent: 0, questionsAsked: 0, learningStreak: 0, lastLoginDate: '' }
    };

    onEnroll(newStudent);
    setStep(6); // Success

    // AI Generation
    const goal = getAnswer('Primary Goal') || 'Success';
    const availability = getAnswer('Availability') || 'Flexible';
    setIsGeneratingPlan(true);
    const plan = await generateOnboardingPlan(name.split(' ')[0], goal, availability);
    setWelcomePlan(plan);
    setIsGeneratingPlan(false);
  };

  // --- Validation Logic ---
  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    // 1. Name Validation
    if (!name.trim()) {
        newErrors.name = 'Full Name is required.';
        isValid = false;
    } else if (name.trim().split(/\s+/).length < 2) {
        newErrors.name = 'Please enter at least First and Last name.';
        isValid = false;
    }

    // 2. Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
        newErrors.email = 'Email is required.';
        isValid = false;
    } else if (!emailRegex.test(email)) {
        newErrors.email = 'Please enter a valid email address.';
        isValid = false;
    }

    // 3. Phone Validation
    const config = COUNTRY_CONFIG[country];
    if (!localPhone) {
        newErrors.phone = 'Phone number is required.';
        isValid = false;
    } else if (localPhone.length !== config.len) {
        newErrors.phone = `Invalid length for ${country}. Expected ${config.len} digits (excluding leading 0).`;
        isValid = false;
    }

    // 4. Forever ID Validation
    const fboRegex = /^\d{12}$/;
    
    // Logic: Optional for Students/Admins (if new), but Compulsory for Sponsors
    // If entered by ANYONE, it must be valid.
    if (selectedRole === UserRole.SPONSOR) {
        if (!foreverId.trim()) {
            newErrors.foreverId = 'FBO ID is required for Team Leaders.';
            isValid = false;
        } else if (!fboRegex.test(foreverId)) {
            newErrors.foreverId = 'ID must be exactly 12 digits (numeric).';
            isValid = false;
        }
    } else {
        // Optional for Students/Admins, but if provided must be valid
        if (foreverId.trim() && !fboRegex.test(foreverId)) {
            newErrors.foreverId = 'Invalid ID format. Must be 12 digits.';
            isValid = false;
        }
    }

    // 5. Admin Code Validation
    if (selectedRole === UserRole.ADMIN) {
        if (!adminCode.trim()) {
            newErrors.adminCode = 'Admin Code is required.';
            isValid = false;
        } else if (adminCode !== 'NEXU-ADMIN-2025') { // Mock validation
            newErrors.adminCode = 'Invalid Admin Code. Contact Super Admin.';
            isValid = false;
        }
    }

    // 6. Password Validation
    if (!password) {
        newErrors.password = 'Password is required.';
        isValid = false;
    } else if (password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters.';
        isValid = false;
    }

    if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match.';
        isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleStep1Next = () => {
      if (validateStep1()) {
          nextStep();
      }
  };

  // Steps Nav
  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => Math.max(0, s - 1));

  const currentCountryConfig = COUNTRY_CONFIG[country] || COUNTRY_CONFIG['Ghana'];
  const whatsappCountryConfig = COUNTRY_CONFIG[whatsappCountry] || COUNTRY_CONFIG['Ghana'];

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center p-0 md:p-6 lg:p-8 overflow-hidden bg-slate-950">
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        /* Moving Blob Animation */
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 10s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }

        /* Shining Particle Animation */
        @keyframes particle-shine {
            0% { transform: translateY(0) translateX(0) scale(0); opacity: 0; }
            20% { opacity: 0.8; transform: translateY(-20px) translateX(10px) scale(1); }
            80% { opacity: 0.8; }
            100% { transform: translateY(-100px) translateX(50px) scale(0); opacity: 0; }
        }
        .animate-particle {
            animation: particle-shine 8s infinite linear;
        }
      `}</style>

      {/* Background Effects (Desktop Only) - Complex Gradients & Particles */}
      <div className="absolute inset-0 overflow-hidden hidden md:block pointer-events-none">
         {/* Moving Gradient Orbs */}
         <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-600/20 rounded-full blur-[100px] animate-blob" />
         <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[100px] animate-blob animation-delay-2000" />
         <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[100px] animate-blob animation-delay-4000" />
         
         {/* Shining Particles */}
         <div className="absolute inset-0">
            {[...Array(25)].map((_, i) => (
                <div 
                    key={i} 
                    className="absolute bg-white rounded-full animate-particle shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                    style={{
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        width: `${Math.random() * 4 + 2}px`,
                        height: `${Math.random() * 4 + 2}px`,
                        animationDelay: `${Math.random() * 5}s`,
                        animationDuration: `${Math.random() * 10 + 10}s`,
                        opacity: Math.random() * 0.5 + 0.3
                    }}
                />
            ))}
         </div>
         
         {/* Subtle overlay to blend */}
         <div className="absolute inset-0 bg-slate-950/20"></div>
      </div>

      {/* Main Card Container */}
      <div className="w-full max-w-2xl bg-white/95 dark:bg-slate-900/80 backdrop-blur-xl rounded-none md:rounded-3xl shadow-none md:shadow-2xl flex flex-col h-full md:h-auto md:max-h-[90vh] overflow-hidden relative transition-all duration-300 md:border md:border-white/10 z-10">
        
        {/* Progress Header - Fixed */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm px-6 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0 z-10 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <Logo className="w-6 h-6" showText={false} />
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Step {step + 1} of 7</span>
            </div>
            <div className="flex gap-1.5">
                {[0,1,2,3,4,5,6].map(i => (
                    <div key={i} className={`h-1 w-4 md:w-6 rounded-full transition-all duration-300 ${i <= step ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-200 dark:bg-slate-800'}`}></div>
                ))}
            </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-6 md:p-10 scroll-smooth">
          
          {/* STEP 0: Role Selection */}
          {step === 0 && (
            <div className="space-y-6 md:space-y-8 animate-fade-in pb-4">
                <div className="text-center space-y-2">
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 font-heading dark:text-white">Choose Your Journey</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">How will you be using Nexu?</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                    <RoleCard 
                        role={UserRole.STUDENT} 
                        icon={<User size={24} className="md:w-8 md:h-8" />} 
                        label="New FBO" 
                        desc="I want to learn & grow."
                        selected={selectedRole === UserRole.STUDENT}
                        onClick={() => setSelectedRole(UserRole.STUDENT)}
                    />
                    <RoleCard 
                        role={UserRole.SPONSOR} 
                        icon={<Users size={24} className="md:w-8 md:h-8" />} 
                        label="Team Leader" 
                        desc="I mentor my downline."
                        selected={selectedRole === UserRole.SPONSOR}
                        onClick={() => setSelectedRole(UserRole.SPONSOR)}
                    />
                    <RoleCard 
                        role={UserRole.ADMIN} 
                        icon={<Shield size={24} className="md:w-8 md:h-8" />} 
                        label="Admin" 
                        desc="I manage content."
                        selected={selectedRole === UserRole.ADMIN}
                        onClick={() => setSelectedRole(UserRole.ADMIN)}
                    />
                </div>

                <div className="pt-4">
                    <button onClick={nextStep} className="w-full bg-emerald-600 text-white py-3.5 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-900/20 active:scale-95 text-sm md:text-base">
                        Continue as {selectedRole === UserRole.STUDENT ? 'New FBO' : selectedRole === UserRole.SPONSOR ? 'Sponsor' : 'Admin'}
                    </button>
                    <div className="text-center mt-4">
                        <span className="text-xs text-slate-400">Already have an account? </span>
                        <Link to="/" className="text-xs font-bold text-emerald-600 hover:underline">Login</Link>
                    </div>
                </div>
            </div>
          )}

          {/* STEP 1: Account Info */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in pb-4">
                <div className="text-center space-y-1">
                    <h2 className="text-xl md:text-2xl font-bold text-slate-900 font-heading dark:text-white">Create Account</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Enter your official details.</p>
                </div>

                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputGroup 
                            label="Full Name" 
                            value={name} 
                            onChange={setName} 
                            placeholder="Jane Doe" 
                            icon={<User size={16} />} 
                            error={errors.name}
                        />
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide dark:text-slate-400">Country</label>
                            <div className="relative">
                                <Globe size={16} className="absolute left-3 top-3.5 text-slate-400" />
                                <select 
                                    value={country} 
                                    onChange={(e) => setCountry(e.target.value)}
                                    className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 appearance-none text-sm text-slate-900 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                                >
                                    {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    <InputGroup 
                        label="Email Address" 
                        value={email} 
                        onChange={setEmail} 
                        type="email" 
                        placeholder="jane@example.com" 
                        icon={<Mail size={16} />} 
                        error={errors.email}
                    />
                    
                    {/* Phone Number Input with Auto Country Code */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide ml-1 dark:text-slate-400">Phone Number (SMS Verification)</label>
                        <div className="relative flex items-center">
                            <div className="absolute left-3 top-3.5 text-slate-400"><Smartphone size={16} /></div>
                            <div className="absolute left-10 top-3 text-sm font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded dark:bg-slate-700 dark:text-slate-300">
                                {currentCountryConfig.code}
                            </div>
                            <input 
                                type="tel"
                                value={localPhone}
                                onChange={handlePhoneChange}
                                placeholder={currentCountryConfig.placeholder}
                                className={`w-full pl-24 p-3 bg-slate-50 border rounded-xl outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm text-slate-900 dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:focus:ring-emerald-900/30 ${errors.phone ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-slate-200'}`}
                            />
                        </div>
                        {errors.phone && <span className="text-xs text-red-500 font-medium ml-1">{errors.phone}</span>}
                    </div>
                    
                    <InputGroup 
                        label={`Forever ID${selectedRole === UserRole.SPONSOR ? ' *' : ' (Optional)'}`} 
                        value={foreverId} 
                        onChange={setForeverId} 
                        placeholder="233100024741"
                        icon={<Hash size={16} />}
                        error={errors.foreverId}
                    />

                    {selectedRole === UserRole.ADMIN && (
                        <InputGroup 
                            label="Admin Access Code *" 
                            value={adminCode} 
                            onChange={setAdminCode} 
                            placeholder="Code from Super Admin"
                            icon={<Lock size={16} />}
                            error={errors.adminCode}
                        />
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide dark:text-slate-400">Password *</label>
                            <div className="relative">
                                <Lock size={16} className="absolute left-3 top-3.5 text-slate-400" />
                                <input 
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className={`w-full pl-10 pr-10 p-3 bg-slate-50 border rounded-xl outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm text-slate-900 dark:bg-slate-800 dark:text-white ${errors.password ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-slate-200 dark:border-slate-700'}`}
                                />
                                <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600">
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            {errors.password && <span className="text-xs text-red-500 font-medium">{errors.password}</span>}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide dark:text-slate-400">Confirm Password *</label>
                            <div className="relative">
                                <Lock size={16} className="absolute left-3 top-3.5 text-slate-400" />
                                <input 
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className={`w-full pl-10 pr-10 p-3 bg-slate-50 border rounded-xl outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm text-slate-900 dark:bg-slate-800 dark:text-white ${errors.confirmPassword ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-slate-200 dark:border-slate-700'}`}
                                />
                                <button onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600">
                                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            {errors.confirmPassword && <span className="text-xs text-red-500 font-medium">{errors.confirmPassword}</span>}
                        </div>
                    </div>
                </div>

                <div className="flex justify-between pt-6">
                    <button onClick={prevStep} className="text-slate-400 font-bold px-4 hover:text-slate-600 text-sm">Back</button>
                    <button 
                        onClick={handleStep1Next} 
                        className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold shadow-md hover:bg-emerald-700 disabled:opacity-50 text-sm"
                    >
                        Next Step
                    </button>
                </div>
            </div>
          )}

          {/* STEP 2: OTP Verification */}
          {step === 2 && (
            <div className="space-y-8 animate-fade-in text-center max-w-xs mx-auto py-8">
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-slate-900 font-heading dark:text-white">Verify Phone</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Code sent to <strong>{COUNTRY_CONFIG[country].code} {localPhone}</strong>
                    </p>
                </div>

                <div className="flex gap-3 justify-center">
                    {otp.map((digit, idx) => (
                        <input
                            key={idx}
                            id={`otp-${idx}`}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpChange(idx, e.target.value)}
                            className="w-12 h-14 text-center text-2xl font-bold border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all bg-white text-slate-900 dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:focus:ring-emerald-900/30"
                        />
                    ))}
                </div>

                <p className="text-xs text-slate-400">Didn't receive it? <button className="text-emerald-600 font-bold hover:underline">Resend</button></p>

                <div className="flex justify-between pt-4 w-full items-center">
                    <button onClick={prevStep} className="text-slate-400 font-bold text-sm">Back</button>
                    <button 
                        onClick={() => { setIsOtpVerified(true); nextStep(); }} 
                        disabled={otp.some(d => !d)}
                        className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold shadow-md hover:bg-emerald-700 disabled:opacity-50 text-sm"
                    >
                        Verify
                    </button>
                </div>
            </div>
          )}

          {/* STEP 3: Profile & Handle */}
          {step === 3 && (
            <div className="space-y-6 animate-fade-in pb-4">
                <div className="text-center space-y-1">
                    <h2 className="text-xl md:text-2xl font-bold text-slate-900 font-heading dark:text-white">Setup Profile</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Make it yours.</p>
                </div>

                <div className="flex flex-col items-center">
                    <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-slate-50 border-2 border-dashed border-slate-300 flex items-center justify-center cursor-pointer hover:bg-slate-100 transition-colors relative overflow-hidden dark:bg-slate-800 dark:border-slate-600 dark:hover:bg-slate-700"
                    >
                        {avatarUrl ? (
                            <img src={avatarUrl} className="w-full h-full object-cover" />
                        ) : (
                            <Camera className="text-slate-400 w-8 h-8" />
                        )}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-2">Tap to upload</p>
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5 block dark:text-slate-400">Choose Handle</label>
                        <div className="relative">
                            <span className="absolute left-3 top-3.5 text-slate-400 font-bold">@</span>
                            <input 
                                type="text" 
                                value={customHandle}
                                onChange={handleHandleChange}
                                className={`w-full pl-8 pr-10 p-3 bg-slate-50 border rounded-xl outline-none focus:ring-1 transition-all font-mono text-sm text-slate-900 dark:bg-slate-800 dark:text-white ${
                                    handleStatus === 'AVAILABLE' ? 'border-emerald-500 focus:border-emerald-500 focus:ring-emerald-500' :
                                    (handleStatus === 'TAKEN' || handleStatus === 'INVALID') ? 'border-red-500 focus:border-red-500 focus:ring-red-200' :
                                    'border-slate-200 focus:border-blue-500 dark:border-slate-700'
                                }`}
                                placeholder="username"
                            />
                            <div className="absolute right-3 top-3.5">
                                {handleStatus === 'CHECKING' && <Loader2 className="animate-spin text-slate-400" size={16} />}
                                {handleStatus === 'AVAILABLE' && <CheckCircle className="text-emerald-500" size={16} />}
                                {(handleStatus === 'TAKEN' || handleStatus === 'INVALID') && <XCircle className="text-red-500" size={16} />}
                            </div>
                        </div>
                        {handleStatus === 'TAKEN' && <p className="text-xs text-red-500 mt-1">Handle taken.</p>}
                        {handleStatus === 'INVALID' && <p className="text-xs text-red-500 mt-1">Invalid handle (3-30 chars, alphanumeric, ., -, _).</p>}
                    </div>

                    {/* WhatsApp Input with Auto Country Code */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide ml-1 dark:text-slate-400">WhatsApp Number</label>
                        <div className="relative flex items-center">
                            <div className="absolute left-0 top-0 bottom-0 flex items-center pl-3">
                                <select 
                                    value={whatsappCountry} 
                                    onChange={(e) => setWhatsappCountry(e.target.value)}
                                    className="h-full bg-transparent border-none text-xs font-bold text-slate-500 focus:ring-0 outline-none pr-6 cursor-pointer dark:text-slate-300 appearance-none py-3"
                                >
                                    {COUNTRIES.map(c => <option key={c} value={c}>{COUNTRY_CONFIG[c].code}</option>)}
                                </select>
                                <ChevronDownIcon className="absolute right-1 top-4 w-3 h-3 text-slate-400 pointer-events-none" />
                            </div>
                            <input 
                                type="tel"
                                value={localWhatsapp}
                                onChange={handleWhatsappChange}
                                placeholder={whatsappCountryConfig.placeholder}
                                className="w-full pl-20 p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm text-slate-900 dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:focus:ring-emerald-900/30"
                            />
                        </div>
                    </div>
                    
                    <div className="flex flex-col gap-1.5 relative">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide dark:text-slate-400">Short Bio</label>
                        <textarea 
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            maxLength={100}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 h-20 resize-none text-sm text-slate-900 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                            placeholder="I help people achieve financial freedom..."
                        />
                        <span className="absolute bottom-2 right-2 text-[10px] text-slate-400 dark:text-slate-500">{bio.length}/100</span>
                    </div>
                </div>

                <div className="flex justify-between pt-6">
                    <button onClick={prevStep} className="text-slate-400 font-bold px-4 text-sm">Back</button>
                    <button 
                        onClick={nextStep} 
                        disabled={!customHandle || handleStatus !== 'AVAILABLE'}
                        className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold shadow-md hover:bg-emerald-700 disabled:opacity-50 text-sm"
                    >
                        Next
                    </button>
                </div>
            </div>
          )}

          {/* STEP 4: Sponsor Connection */}
          {step === 4 && (
            <div className="space-y-6 animate-fade-in text-center pb-4">
                <div className="space-y-1">
                    <h2 className="text-xl md:text-2xl font-bold text-slate-900 font-heading dark:text-white">Connect with Team</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Who introduced you?</p>
                </div>

                <div className="flex justify-center gap-3 mb-2">
                    <button 
                        onClick={() => setSponsorMethod('ID')}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all border ${sponsorMethod === 'ID' ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-slate-50 border-slate-100 text-slate-500 dark:bg-slate-800 dark:border-slate-700'}`}
                    >
                        Use Handle
                    </button>
                    <button 
                        onClick={() => setSponsorMethod('QR')}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all border ${sponsorMethod === 'QR' ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-slate-50 border-slate-100 text-slate-500 dark:bg-slate-800 dark:border-slate-700'}`}
                    >
                        Scan QR
                    </button>
                </div>

                {sponsorMethod === 'ID' ? (
                    <div className="max-w-sm mx-auto space-y-4">
                        <div className="relative">
                            <input 
                                type="text" 
                                value={sponsorHandle}
                                onChange={(e) => setSponsorHandle(e.target.value)}
                                placeholder="@sponsor_handle"
                                className="w-full text-center text-xl font-bold font-mono border-2 border-slate-200 rounded-xl py-3 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none text-slate-900 dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:focus:ring-emerald-900/30"
                            />
                        </div>
                        <button onClick={verifySponsor} className="text-xs font-bold text-emerald-600 hover:underline dark:text-emerald-400">Verify Handle</button>
                        {sponsorError && <p className="text-red-500 text-xs font-medium bg-red-50 p-2 rounded dark:bg-red-900/20">{sponsorError}</p>}
                    </div>
                ) : (
                    <div className="max-w-xs mx-auto bg-black rounded-2xl h-56 flex flex-col items-center justify-center relative overflow-hidden ring-4 ring-slate-100 dark:ring-slate-800">
                        {isScanning ? (
                            <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center text-white/70">
                                <div className="w-40 h-40 border-2 border-emerald-500 rounded-lg animate-pulse mb-4 relative">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)] animate-scan"></div>
                                </div>
                                <p className="text-xs font-mono">Scanning...</p>
                            </div>
                        ) : (
                            <button onClick={simulateScan} className="flex flex-col items-center text-white hover:text-emerald-400 transition-colors">
                                <QrCode size={40} className="mb-2" />
                                <span className="font-bold text-sm">Tap to Scan</span>
                            </button>
                        )}
                    </div>
                )}

                {verifiedSponsor && (
                    <div className="bg-emerald-50 p-4 rounded-xl flex items-center justify-center gap-3 border border-emerald-100 animate-fade-in dark:bg-emerald-900/20 dark:border-emerald-800">
                        <CheckCircle className="text-emerald-600" size={20} />
                        <div className="text-left">
                            <p className="text-sm font-bold text-emerald-900 dark:text-emerald-300">Valid Sponsor</p>
                            <p className="text-xs text-emerald-700 dark:text-emerald-400">Joining {verifiedSponsor.name}'s Team</p>
                        </div>
                    </div>
                )}

                {!verifiedSponsor && !isScanning && (
                    <div className="text-xs text-slate-400 mt-4">
                        No sponsor? Use <span className="font-mono text-emerald-600 cursor-pointer dark:text-emerald-400" onClick={() => {setSponsorHandle('@forever_system'); verifySponsor(); }}>@forever_system</span>
                    </div>
                )}

                <div className="flex justify-between pt-8">
                    <button onClick={prevStep} className="text-slate-400 font-bold px-4 text-sm">Back</button>
                    <button 
                        onClick={nextStep} 
                        disabled={!verifiedSponsor}
                        className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold shadow-md hover:bg-emerald-700 disabled:opacity-50 text-sm"
                    >
                        Confirm Team
                    </button>
                </div>
            </div>
          )}

          {/* STEP 5: Goals */}
          {step === 5 && (
            <div className="space-y-6 animate-fade-in pb-4">
              <div className="text-center space-y-1">
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 font-heading dark:text-white">Set Your Goals</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">We'll build a custom plan for you.</p>
              </div>
              
              <div className="space-y-4">
                <QuizQuestion 
                  question="Primary Goal"
                  options={['Financial Freedom', 'Extra Monthly Income', 'Health & Wellness Products', 'Social Connection']}
                  selected={getAnswer('Primary Goal')}
                  onSelect={(ans) => handleQuizAnswer('Primary Goal', ans)}
                />
                <QuizQuestion 
                  question="Availability"
                  options={['0-5 Hours/Week', '5-10 Hours/Week', '10+ Hours/Week (Full Time)']}
                  selected={getAnswer('Availability')}
                  onSelect={(ans) => handleQuizAnswer('Availability', ans)}
                />
              </div>

              <div className="flex justify-between pt-6">
                 <button onClick={prevStep} className="text-slate-400 hover:text-slate-600 font-medium px-4 text-sm">Back</button>
                 <button 
                    onClick={handleFinish}
                    disabled={quizAnswers.length < 2}
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all text-sm"
                 >
                    Complete Setup
                 </button>
              </div>
            </div>
          )}

          {/* STEP 6: Success */}
          {step === 6 && (
             <div className="text-center space-y-6 animate-fade-in py-4">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600 mb-4 animate-bounce dark:bg-green-900/30 dark:text-green-400">
                    <UserCheck size={40} />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-emerald-950 font-heading dark:text-white">Welcome, {name.split(' ')[0]}!</h1>
                <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl max-w-sm mx-auto dark:bg-slate-800 dark:border-slate-700">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-2 dark:text-slate-400">Your FBO Handle</p>
                    <p className="text-xl font-mono font-bold text-emerald-600 dark:text-emerald-400">@{customHandle}</p>
                </div>
                
                {/* AI Plan Section */}
                <div className="mt-6 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white text-left relative overflow-hidden shadow-lg">
                    <div className="absolute top-0 right-0 p-4 opacity-20"><Sparkles size={48} /></div>
                    <h3 className="font-bold text-base mb-3 flex items-center gap-2">
                        {isGeneratingPlan ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />} 
                        Your Personalized Plan
                    </h3>
                    <div className="text-sm text-indigo-100 leading-relaxed whitespace-pre-wrap font-medium">
                        {isGeneratingPlan ? "Creating your custom success roadmap..." : welcomePlan}
                    </div>
                </div>

                <div className="pt-6">
                    <button 
                        onClick={() => navigate('/')}
                        className="bg-emerald-900 text-white px-8 py-3.5 rounded-xl font-bold shadow-lg hover:bg-emerald-800 transition-all w-full text-sm"
                    >
                        Go to Dashboard
                    </button>
                </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Sub-Components ---

const RoleCard: React.FC<{ role: UserRole, icon: any, label: string, desc: string, selected: boolean, onClick: () => void }> = ({ icon, label, desc, selected, onClick }) => (
    <div 
        onClick={onClick}
        className={`
            p-3 md:p-6 rounded-2xl border-2 cursor-pointer transition-all active:scale-95 flex md:flex-col items-center gap-3 md:gap-4
            ${selected ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 dark:border-emerald-500' : 'border-slate-100 bg-slate-50 hover:border-emerald-200 dark:bg-slate-800 dark:border-slate-700 dark:hover:border-slate-600'}
        `}
    >
        <div className={`p-2 rounded-full ${selected ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-300' : 'bg-white text-slate-400 dark:bg-slate-700 dark:text-slate-500'}`}>
            {icon}
        </div>
        <div className="text-left md:text-center flex-1">
            <h3 className={`font-bold text-sm md:text-lg ${selected ? 'text-emerald-900 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}`}>{label}</h3>
            <p className="text-[10px] md:text-xs text-slate-500 mt-0.5 dark:text-slate-400">{desc}</p>
        </div>
        {/* Mobile Checkmark */}
        {selected && <div className="md:hidden text-emerald-500"><CheckCircle size={18} /></div>}
    </div>
);

const InputGroup: React.FC<{ label: string, value: string, onChange: (v: string) => void, type?: string, placeholder?: string, icon?: any, error?: string }> = ({ label, value, onChange, type = "text", placeholder, icon, error }) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide ml-1 dark:text-slate-400">{label}</label>
        <div className="relative">
            {icon && <div className="absolute left-3 top-3.5 text-slate-400">{icon}</div>}
            <input 
                type={type} 
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className={`w-full p-3 bg-slate-50 border rounded-xl outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm text-slate-900 dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:focus:ring-emerald-900/30 ${icon ? 'pl-10' : ''} ${error ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-slate-200'}`}
            />
        </div>
        {error && <span className="text-xs text-red-500 font-medium ml-1">{error}</span>}
    </div>
);

const QuizQuestion: React.FC<{ question: string; options: string[]; selected?: string; onSelect: (val: string) => void }> = ({ question, options, selected, onSelect }) => (
    <div className="bg-slate-50 p-4 md:p-6 rounded-2xl border border-slate-100 dark:bg-slate-800 dark:border-slate-700">
        <h3 className="font-semibold text-slate-800 mb-3 text-sm md:text-base dark:text-slate-200">{question}</h3>
        <div className="grid grid-cols-1 gap-2.5">
            {options.map(opt => (
                <button
                    key={opt}
                    onClick={() => onSelect(opt)}
                    className={`p-3 text-xs md:text-sm rounded-xl border text-left transition-all font-medium flex justify-between items-center ${
                        selected === opt 
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-500' 
                        : 'border-transparent bg-white hover:border-emerald-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
                    }`}
                >
                    {opt}
                    {selected === opt && <CheckCircle size={16} className="text-emerald-500" />}
                </button>
            ))}
        </div>
    </div>
);

const ChevronDownIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className || "w-4 h-4"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
);

export default OnboardingWizard;
