import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Student, QuizResult, UserRole } from '../types';

interface OnboardingWizardProps {
  onEnroll: (student: Student) => void;
  existingStudents: Student[];
}

const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onEnroll, existingStudents }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  
  // Form Data
  const [quizAnswers, setQuizAnswers] = useState<QuizResult[]>([]);
  const [sponsorHandle, setSponsorHandle] = useState('');
  const [sponsorError, setSponsorError] = useState('');
  const [verifiedSponsor, setVerifiedSponsor] = useState<Student | null>(null);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [generatedHandle, setGeneratedHandle] = useState('');

  const handleQuizAnswer = (question: string, answer: string) => {
    setQuizAnswers(prev => {
      const filtered = prev.filter(a => a.question !== question);
      return [...filtered, { question, answer }];
    });
  };

  const handleVerifySponsor = () => {
    setSponsorError('');
    if (!sponsorHandle) return;

    // Ensure handle starts with @
    const formattedHandle = sponsorHandle.startsWith('@') ? sponsorHandle : `@${sponsorHandle}`;

    // Find sponsor in list
    const sponsor = existingStudents.find(s => s.handle.toLowerCase() === formattedHandle.toLowerCase());

    if (!sponsor) {
        setSponsorError('Sponsor handle not found. Please check spelling or use @forever_system.');
        setVerifiedSponsor(null);
        return;
    }

    // Check if they are qualified (>= 2CC)
    if (sponsor.caseCredits < 2 && sponsor.role !== UserRole.SUPER_ADMIN && sponsor.role !== UserRole.ADMIN) {
        setSponsorError(`This user (@${sponsor.name}) is not yet a qualified Sponsor (Must be 2CC+).`);
        setVerifiedSponsor(null);
        return;
    }

    setVerifiedSponsor(sponsor);
    setSponsorHandle(formattedHandle); // Correct format in input
    nextStep();
  };

  const generateHandle = (fullName: string) => {
    const base = fullName.toLowerCase().replace(/\s+/g, '.').replace(/[^a-z0-9.]/g, '');
    const random = Math.floor(Math.random() * 1000);
    return `@${base}${random}`;
  };

  const handleFinish = () => {
    if (!name || !email || !password || !verifiedSponsor) return;

    const newHandle = generateHandle(name);
    setGeneratedHandle(newHandle);

    const newStudent: Student = {
      id: Date.now().toString(),
      handle: newHandle,
      password: password,
      role: UserRole.STUDENT,
      name,
      email,
      enrolledDate: new Date().toISOString().split('T')[0],
      progress: 0,
      completedModules: [],
      sponsorId: verifiedSponsor.handle,
      caseCredits: 0, // Starts at 0, needs 2 to become sponsor
      quizResults: quizAnswers
    };

    onEnroll(newStudent);
    setStep(4); // Go to success screen
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => Math.max(0, s - 1));

  const getAnswer = (q: string) => quizAnswers.find(a => a.question === q)?.answer;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 to-emerald-950 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden relative">
        
        {/* Progress Bar */}
        {step > 0 && step < 4 && (
          <div className="h-1.5 bg-slate-100 w-full">
            <div 
              className="h-full bg-yellow-400 transition-all duration-500" 
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>
        )}

        <div className="p-8 md:p-12">
          
          {/* Step 0: Landing */}
          {step === 0 && (
            <div className="text-center space-y-6 animate-fade-in">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-800 mb-6">
                <LeafIcon />
              </div>
              <h1 className="text-4xl font-bold text-emerald-950 font-heading">Start Your Forever Journey</h1>
              <p className="text-lg text-slate-600">
                Welcome to the FBO Growth Academy. Let's personalize your path to success.
              </p>
              <div className="pt-6">
                <button 
                  onClick={nextStep}
                  className="bg-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-emerald-900/20 hover:bg-emerald-700 hover:scale-105 transition-all"
                >
                  Become an FBO
                </button>
              </div>
              <p className="text-sm text-slate-400 mt-4">Already a member? <Link to="/" className="text-emerald-600 underline">Login here</Link></p>
            </div>
          )}

          {/* Step 1: Goals Quiz */}
          {step === 1 && (
            <div className="space-y-8 animate-fade-in">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-emerald-950 font-heading">Your Goals</h2>
                <p className="text-slate-500">Tell us what you want to achieve so we can guide you.</p>
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
                    onClick={nextStep}
                    disabled={quizAnswers.length < 2}
                    className="bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-semibold shadow-md hover:bg-emerald-700 transition-all"
                 >
                    Continue
                 </button>
              </div>
            </div>
          )}

          {/* Step 2: Sponsor */}
          {step === 2 && (
            <div className="space-y-8 animate-fade-in text-center">
              <div>
                <h2 className="text-2xl font-bold text-emerald-950 font-heading">Sponsor Verification</h2>
                <p className="text-slate-500">Enter the <strong>Handle</strong> of the Sponsor who invited you.</p>
                <p className="text-xs text-slate-400 mt-2">Only FBOs with 2CC+ can be sponsors.</p>
              </div>

              <div className="max-w-sm mx-auto space-y-4">
                 <div>
                    <label className="block text-left text-sm font-bold text-slate-700 mb-2">Sponsor Handle</label>
                    <input 
                        type="text" 
                        value={sponsorHandle}
                        onChange={(e) => setSponsorHandle(e.target.value)}
                        placeholder="@alice_success"
                        className={`w-full text-center text-xl font-bold font-mono border-2 rounded-xl py-4 focus:ring-4 outline-none transition-all ${
                            sponsorError ? 'border-red-200 focus:border-red-500 focus:ring-red-100' : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-100'
                        }`}
                    />
                    {sponsorError && <p className="text-red-500 text-sm mt-2 font-medium">{sponsorError}</p>}
                 </div>

                 <div className="text-xs text-slate-400 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    Don't have a sponsor? Use <span className="font-mono text-emerald-600 cursor-pointer" onClick={() => setSponsorHandle('@forever_system')}>@forever_system</span>
                 </div>
              </div>

              <div className="flex justify-between pt-8">
                 <button onClick={prevStep} className="text-slate-400 hover:text-slate-600 font-medium px-4 py-2">Back</button>
                 <button 
                    onClick={handleVerifySponsor}
                    disabled={!sponsorHandle.trim()}
                    className="bg-emerald-600 disabled:opacity-50 text-white px-8 py-3 rounded-xl font-semibold shadow-md hover:bg-emerald-700 transition-all"
                 >
                    Verify Sponsor
                 </button>
              </div>
            </div>
          )}

          {/* Step 3: Registration */}
          {step === 3 && (
            <div className="space-y-8 animate-fade-in">
               <div className="text-center">
                <h2 className="text-2xl font-bold text-emerald-950 font-heading">Create Profile</h2>
                <p className="text-slate-500">Finalize your account to get your own FBO Handle.</p>
              </div>

              <div className="space-y-4">
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
                    <input 
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)} 
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none"
                        placeholder="Jane Doe"
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Email Address</label>
                    <input 
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} 
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none"
                        placeholder="jane@example.com"
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Create Password</label>
                    <input 
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} 
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none"
                        placeholder="••••••••"
                    />
                </div>
              </div>

              {verifiedSponsor && (
                  <div className="bg-emerald-50 p-4 rounded-xl flex items-start gap-3 border border-emerald-100">
                      <div className="mt-1 text-emerald-600"><CheckBadgeIcon /></div>
                      <div>
                        <p className="text-sm font-bold text-emerald-900">Sponsor Verified</p>
                        <p className="text-xs text-emerald-800">
                            You are joining the team of <strong>{verifiedSponsor.name}</strong> ({verifiedSponsor.handle}).
                        </p>
                      </div>
                  </div>
              )}

              <div className="flex justify-between pt-4">
                 <button onClick={prevStep} className="text-slate-400 hover:text-slate-600 font-medium px-4 py-2">Back</button>
                 <button 
                    onClick={handleFinish}
                    disabled={!name || !email || !password}
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white w-full ml-4 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
                 >
                    Complete Enrollment
                 </button>
              </div>
            </div>
          )}

          {/* Step 4: Success */}
          {step === 4 && (
             <div className="text-center space-y-6 animate-fade-in py-8">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600 mb-6 animate-bounce">
                    <CheckBadgeIcon />
                </div>
                <h1 className="text-3xl font-bold text-emerald-950 font-heading">Welcome, {name.split(' ')[0]}!</h1>
                <div className="bg-slate-50 border-2 border-slate-100 p-6 rounded-2xl max-w-sm mx-auto">
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2">Your New FBO Handle</p>
                    <p className="text-2xl font-mono font-bold text-emerald-600">{generatedHandle}</p>
                </div>
                <p className="text-slate-600 max-w-md mx-auto text-sm">
                    You are currently a <strong>Student (0 CC)</strong>. 
                    Complete your training and achieve <strong>2 Case Credits (CC)</strong> to become a Sponsor and start building your own team!
                </p>
                
                <div className="pt-8">
                    <button 
                        onClick={() => navigate('/')}
                        className="bg-emerald-900 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-emerald-800 transition-all"
                    >
                        Go to Sign In
                    </button>
                </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

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

// Icons
const LeafIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S12 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S12 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
    </svg>
);

const CheckBadgeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
    </svg>
);

export default OnboardingWizard;