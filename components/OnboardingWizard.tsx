
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Student, QuizResult, UserRole } from '../types';
import { generateOnboardingPlan } from '../services/geminiService';
import { Loader2, Sparkles, User, Users, Shield, Camera, QrCode, CheckCircle, XCircle, Smartphone, Globe, Mail, UserCheck } from 'lucide-react';

interface OnboardingWizardProps {
  onEnroll: (student: Student) => void;
  existingStudents: Student[];
}

const COUNTRIES = ['USA', 'UK', 'Ghana', 'Nigeria', 'South Africa', 'Kenya', 'UAE', 'India', 'Canada', 'Australia'];

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
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('Ghana');
  const [foreverId, setForeverId] = useState('');
  const [password, setPassword] = useState('');

  // 2. OTP
  const [otp, setOtp] = useState(['', '', '', '']);
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  // 3. Profile
  const [avatarUrl, setAvatarUrl] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [bio, setBio] = useState('');
  const [customHandle, setCustomHandle] = useState('');
  const [handleStatus, setHandleStatus] = useState<'IDLE' | 'CHECKING' | 'AVAILABLE' | 'TAKEN'>('IDLE');

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
      if (customHandle.length > 2) {
          const timeout = setTimeout(() => checkHandleAvailability(customHandle), 500);
          return () => clearTimeout(timeout);
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
      const val = e.target.value.replace(/[^a-zA-Z0-9_]/g, '').toLowerCase();
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

  // OTP Logic
  const handleOtpChange = (index: number, val: string) => {
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

    const newStudent: Student = {
      id: Date.now().toString(),
      handle: formattedHandle,
      password: password,
      role: selectedRole,
      name,
      email,
      phoneNumber: phone,
      country,
      foreverId,
      whatsappNumber,
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

  // Steps Nav
  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => Math.max(0, s - 1));

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 to-emerald-950 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden relative min-h-[600px] flex flex-col">
        
        {/* Progress Header */}
        <div className="bg-slate-50 px-8 py-4 border-b border-slate-100 flex justify-between items-center">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Step {step + 1} of 7</span>
            <div className="flex gap-1">
                {[0,1,2,3,4,5,6].map(i => (
                    <div key={i} className={`h-1.5 w-6 rounded-full transition-colors ${i <= step ? 'bg-emerald-500' : 'bg-slate-200'}`}></div>
                ))}
            </div>
        </div>

        <div className="p-8 md:p-12 flex-1 flex flex-col justify-center">
          
          {/* STEP 0: Role Selection */}
          {step === 0 && (
            <div className="space-y-8 animate-fade-in text-center">
                <h1 className="text-3xl font-bold text-emerald-950 font-heading">Choose Your Journey</h1>
                <p className="text-slate-500">How will you be using the FBO Academy?</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <RoleCard 
                        role={UserRole.STUDENT} 
                        icon={<User size={32} />} 
                        label="New FBO" 
                        desc="I want to learn and grow my business."
                        selected={selectedRole === UserRole.STUDENT}
                        onClick={() => setSelectedRole(UserRole.STUDENT)}
                    />
                    <RoleCard 
                        role={UserRole.SPONSOR} 
                        icon={<Users size={32} />} 
                        label="Team Leader" 
                        desc="I want to mentor my downline."
                        selected={selectedRole === UserRole.SPONSOR}
                        onClick={() => setSelectedRole(UserRole.SPONSOR)}
                    />
                    <RoleCard 
                        role={UserRole.ADMIN} 
                        icon={<Shield size={32} />} 
                        label="Admin" 
                        desc="I manage the platform content."
                        selected={selectedRole === UserRole.ADMIN}
                        onClick={() => setSelectedRole(UserRole.ADMIN)}
                    />
                </div>

                <button onClick={nextStep} className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg mt-4">
                    Continue as {selectedRole === UserRole.STUDENT ? 'New FBO' : selectedRole === UserRole.SPONSOR ? 'Sponsor' : 'Admin'}
                </button>
                <div className="text-sm text-slate-400">Already have an account? <Link to="/" className="text-emerald-600 underline">Login</Link></div>
            </div>
          )}

          {/* STEP 1: Account Info */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-emerald-950 font-heading">Create Account</h2>
                    <p className="text-slate-500">Enter your official details.</p>
                </div>

                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <InputGroup label="Full Name" value={name} onChange={setName} placeholder="Jane Doe" icon={<User size={16} />} />
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Country</label>
                            <div className="relative">
                                <Globe size={16} className="absolute left-3 top-3.5 text-slate-400" />
                                <select 
                                    value={country} 
                                    onChange={(e) => setCountry(e.target.value)}
                                    className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 appearance-none"
                                >
                                    {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>
                    <InputGroup label="Email Address" value={email} onChange={setEmail} type="email" placeholder="jane@example.com" icon={<Mail size={16} />} />
                    <InputGroup label="Phone Number" value={phone} onChange={setPhone} type="tel" placeholder="+233 55 123 4567" icon={<Smartphone size={16} />} />
                    <InputGroup label="Forever ID (Optional)" value={foreverId} onChange={setForeverId} placeholder="360-000-..." />
                    <InputGroup label="Create Password" value={password} onChange={setPassword} type="password" placeholder="••••••••" />
                </div>

                <div className="flex justify-between pt-4">
                    <button onClick={prevStep} className="text-slate-400 font-bold px-4">Back</button>
                    <button 
                        onClick={nextStep} 
                        disabled={!name || !email || !password}
                        className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-emerald-700 disabled:opacity-50"
                    >
                        Send Verification Code
                    </button>
                </div>
            </div>
          )}

          {/* STEP 2: OTP Verification */}
          {step === 2 && (
            <div className="space-y-8 animate-fade-in text-center max-w-sm mx-auto">
                <div>
                    <h2 className="text-2xl font-bold text-emerald-950 font-heading">Verify Phone</h2>
                    <p className="text-slate-500">We sent a 4-digit code to <strong>{phone || email}</strong></p>
                </div>

                <div className="flex gap-4 justify-center">
                    {otp.map((digit, idx) => (
                        <input
                            key={idx}
                            id={`otp-${idx}`}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpChange(idx, e.target.value)}
                            className="w-14 h-16 text-center text-2xl font-bold border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all"
                        />
                    ))}
                </div>

                <p className="text-sm text-slate-400">Didn't receive it? <button className="text-emerald-600 font-bold hover:underline">Resend</button></p>

                <div className="flex justify-between pt-4 w-full">
                    <button onClick={prevStep} className="text-slate-400 font-bold">Back</button>
                    <button 
                        onClick={() => { setIsOtpVerified(true); nextStep(); }} 
                        disabled={otp.some(d => !d)}
                        className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-emerald-700 disabled:opacity-50"
                    >
                        Verify & Continue
                    </button>
                </div>
            </div>
          )}

          {/* STEP 3: Profile & Handle */}
          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-emerald-950 font-heading">Setup Profile</h2>
                    <p className="text-slate-500">Make it yours.</p>
                </div>

                <div className="flex flex-col items-center">
                    <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="w-24 h-24 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center cursor-pointer hover:bg-slate-200 transition-colors relative overflow-hidden"
                    >
                        {avatarUrl ? (
                            <img src={avatarUrl} className="w-full h-full object-cover" />
                        ) : (
                            <Camera className="text-slate-400" />
                        )}
                    </div>
                    <p className="text-xs text-slate-400 mt-2">Tap to upload photo</p>
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Choose Unique Handle</label>
                        <div className="relative">
                            <span className="absolute left-3 top-3.5 text-slate-400 font-bold">@</span>
                            <input 
                                type="text" 
                                value={customHandle}
                                onChange={handleHandleChange}
                                className={`w-full pl-8 pr-10 p-3 bg-slate-50 border rounded-xl outline-none transition-all font-mono ${
                                    handleStatus === 'AVAILABLE' ? 'border-emerald-500 focus:ring-emerald-100' :
                                    handleStatus === 'TAKEN' ? 'border-red-500 focus:ring-red-100' :
                                    'border-slate-200 focus:border-blue-500'
                                }`}
                                placeholder="username"
                            />
                            <div className="absolute right-3 top-3.5">
                                {handleStatus === 'CHECKING' && <Loader2 className="animate-spin text-slate-400" size={18} />}
                                {handleStatus === 'AVAILABLE' && <CheckCircle className="text-emerald-500" size={18} />}
                                {handleStatus === 'TAKEN' && <XCircle className="text-red-500" size={18} />}
                            </div>
                        </div>
                        {handleStatus === 'TAKEN' && <p className="text-xs text-red-500 mt-1">Handle is already taken.</p>}
                        {handleStatus === 'AVAILABLE' && <p className="text-xs text-emerald-600 mt-1">Handle available!</p>}
                    </div>

                    <InputGroup label="WhatsApp Number" value={whatsappNumber} onChange={setWhatsappNumber} placeholder="+233..." icon={<Smartphone size={16} />} />
                    
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Short Bio</label>
                        <textarea 
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 h-20 resize-none text-sm"
                            placeholder="I help people achieve financial freedom..."
                        />
                    </div>
                </div>

                <div className="flex justify-between pt-4">
                    <button onClick={prevStep} className="text-slate-400 font-bold px-4">Back</button>
                    <button 
                        onClick={nextStep} 
                        disabled={!customHandle || handleStatus !== 'AVAILABLE'}
                        className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-emerald-700 disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
          )}

          {/* STEP 4: Sponsor Connection */}
          {step === 4 && (
            <div className="space-y-6 animate-fade-in text-center">
                <div>
                    <h2 className="text-2xl font-bold text-emerald-950 font-heading">Connect with Team</h2>
                    <p className="text-slate-500">Who introduced you to the business?</p>
                </div>

                <div className="flex justify-center gap-4 mb-4">
                    <button 
                        onClick={() => setSponsorMethod('ID')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${sponsorMethod === 'ID' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}
                    >
                        Enter ID/Handle
                    </button>
                    <button 
                        onClick={() => setSponsorMethod('QR')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${sponsorMethod === 'QR' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}
                    >
                        Scan QR Code
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
                                className="w-full text-center text-xl font-bold font-mono border-2 border-slate-200 rounded-xl py-4 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none"
                            />
                        </div>
                        <button onClick={verifySponsor} className="text-sm font-bold text-emerald-600 hover:underline">Verify</button>
                        {sponsorError && <p className="text-red-500 text-sm">{sponsorError}</p>}
                    </div>
                ) : (
                    <div className="max-w-sm mx-auto bg-black rounded-2xl h-64 flex flex-col items-center justify-center relative overflow-hidden">
                        {isScanning ? (
                            <div className="w-full h-full bg-gray-800 flex flex-col items-center justify-center text-white/70">
                                <div className="w-48 h-48 border-2 border-emerald-500 rounded-lg animate-pulse mb-4 relative">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)] animate-scan"></div>
                                </div>
                                <p className="text-xs">Scanning...</p>
                            </div>
                        ) : (
                            <button onClick={simulateScan} className="flex flex-col items-center text-white">
                                <QrCode size={48} className="mb-2" />
                                <span className="font-bold">Tap to Scan Camera</span>
                            </button>
                        )}
                    </div>
                )}

                {verifiedSponsor && (
                    <div className="bg-emerald-50 p-4 rounded-xl flex items-center justify-center gap-3 border border-emerald-100 animate-fade-in">
                        <CheckCircle className="text-emerald-600" />
                        <div className="text-left">
                            <p className="text-sm font-bold text-emerald-900">Valid Sponsor</p>
                            <p className="text-xs text-emerald-700">Joining {verifiedSponsor.name}'s Team</p>
                        </div>
                    </div>
                )}

                {!verifiedSponsor && !isScanning && (
                    <div className="text-xs text-slate-400">
                        No sponsor? Use <span className="font-mono text-emerald-600 cursor-pointer" onClick={() => {setSponsorHandle('@forever_system'); verifySponsor(); }}>@forever_system</span>
                    </div>
                )}

                <div className="flex justify-between pt-8">
                    <button onClick={prevStep} className="text-slate-400 font-bold px-4">Back</button>
                    <button 
                        onClick={nextStep} 
                        disabled={!verifiedSponsor}
                        className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-emerald-700 disabled:opacity-50"
                    >
                        Confirm Team
                    </button>
                </div>
            </div>
          )}

          {/* STEP 5: Goals */}
          {step === 5 && (
            <div className="space-y-8 animate-fade-in">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-emerald-950 font-heading">Set Your Goals</h2>
                <p className="text-slate-500">We'll build a custom plan for you.</p>
              </div>
              
              <div className="space-y-6">
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

              <div className="flex justify-between pt-4">
                 <button onClick={prevStep} className="text-slate-400 hover:text-slate-600 font-medium px-4 py-2">Back</button>
                 <button 
                    onClick={handleFinish}
                    disabled={quizAnswers.length < 2}
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
                 >
                    Complete Setup
                 </button>
              </div>
            </div>
          )}

          {/* STEP 6: Success */}
          {step === 6 && (
             <div className="text-center space-y-6 animate-fade-in py-4">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600 mb-6 animate-bounce">
                    <UserCheck size={48} />
                </div>
                <h1 className="text-3xl font-bold text-emerald-950 font-heading">Welcome, {name.split(' ')[0]}!</h1>
                <div className="bg-slate-50 border-2 border-slate-100 p-6 rounded-2xl max-w-sm mx-auto">
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2">Your FBO Handle</p>
                    <p className="text-2xl font-mono font-bold text-emerald-600">@{customHandle}</p>
                </div>
                
                {/* AI Plan Section */}
                <div className="mt-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white text-left relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-20"><Sparkles size={48} /></div>
                    <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                        {isGeneratingPlan ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />} 
                        Your Personalized Plan
                    </h3>
                    <div className="text-sm text-indigo-100 leading-relaxed whitespace-pre-wrap">
                        {isGeneratingPlan ? "Creating your custom success roadmap..." : welcomePlan}
                    </div>
                </div>

                <div className="pt-4">
                    <button 
                        onClick={() => navigate('/')}
                        className="bg-emerald-900 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-emerald-800 transition-all w-full"
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
        className={`p-6 rounded-2xl border-2 cursor-pointer transition-all hover:scale-105 ${selected ? 'border-emerald-500 bg-emerald-50' : 'border-slate-100 bg-slate-50 hover:border-emerald-200'}`}
    >
        <div className={`mb-3 ${selected ? 'text-emerald-600' : 'text-slate-400'}`}>{icon}</div>
        <h3 className={`font-bold text-lg ${selected ? 'text-emerald-900' : 'text-slate-700'}`}>{label}</h3>
        <p className="text-xs text-slate-500 mt-1">{desc}</p>
    </div>
);

const InputGroup: React.FC<{ label: string, value: string, onChange: (v: string) => void, type?: string, placeholder?: string, icon?: any }> = ({ label, value, onChange, type = "text", placeholder, icon }) => (
    <div className="flex flex-col gap-1">
        <label className="text-xs font-bold text-slate-500 uppercase">{label}</label>
        <div className="relative">
            {icon && <div className="absolute left-3 top-3.5 text-slate-400">{icon}</div>}
            <input 
                type={type} 
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className={`w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 transition-all ${icon ? 'pl-10' : ''}`}
            />
        </div>
    </div>
);

const QuizQuestion: React.FC<{ question: string; options: string[]; selected?: string; onSelect: (val: string) => void }> = ({ question, options, selected, onSelect }) => (
    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
        <h3 className="font-semibold text-slate-800 mb-4">{question}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {options.map(opt => (
                <button
                    key={opt}
                    onClick={() => onSelect(opt)}
                    className={`p-3 text-sm rounded-lg border-2 text-left transition-all ${
                        selected === opt 
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-medium' 
                        : 'border-transparent bg-white hover:border-emerald-200 text-slate-600'
                    }`}
                >
                    {opt}
                </button>
            ))}
        </div>
    </div>
);

export default OnboardingWizard;
