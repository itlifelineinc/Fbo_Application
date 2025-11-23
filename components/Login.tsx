import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface LoginProps {
  onLogin: (handle: string, pass: string) => boolean;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [handle, setHandle] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'LOGIN' | 'RECOVERY'>('LOGIN');
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoverySent, setRecoverySent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'LOGIN') {
      const success = onLogin(handle, password);
      if (!success) {
        setError("Invalid Handle or Password. Please try again.");
      }
    } else {
      // Simulate password recovery
      setRecoverySent(true);
    }
  };

  const fillSuperAdmin = () => {
    setHandle('@forever_system');
    setPassword('password123');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 to-emerald-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 md:p-10 animate-fade-in">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-800 mb-4">
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
               <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
             </svg>
          </div>
          <h1 className="text-3xl font-bold text-emerald-950 font-heading">FBO Academy</h1>
          <p className="text-slate-500 mt-2">
            {mode === 'LOGIN' ? 'Sign in to access your dashboard' : 'Recover your account'}
          </p>
        </div>

        {mode === 'LOGIN' ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">FBO Handle</label>
              <input
                type="text"
                required
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all bg-white text-slate-900"
                placeholder="@username"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl pl-4 pr-12 py-3 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all bg-white text-slate-900"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                   {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>
            
            {error && <p className="text-red-500 text-sm font-medium text-center">{error}</p>}

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl shadow-lg transform active:scale-95 transition-all"
            >
              Sign In
            </button>

            <div className="flex flex-col gap-3 text-center pt-2">
               <button 
                type="button"
                onClick={fillSuperAdmin}
                className="text-xs text-slate-400 hover:text-emerald-600 transition-colors"
              >
                (Demo) Auto-fill Super Admin
              </button>

              <button 
                type="button"
                onClick={() => setMode('RECOVERY')}
                className="text-sm text-emerald-600 hover:text-emerald-800 font-medium"
              >
                Forgot Password?
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
             {!recoverySent ? (
                <>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Registered Email</label>
                    <input
                      type="email"
                      required
                      value={recoveryEmail}
                      onChange={(e) => setRecoveryEmail(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:border-emerald-500 outline-none bg-white text-slate-900"
                      placeholder="you@example.com"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all"
                  >
                    Send Recovery Link
                  </button>
                </>
             ) : (
                <div className="text-center bg-emerald-50 p-6 rounded-xl border border-emerald-100">
                    <p className="text-emerald-800 font-medium">Reset link sent!</p>
                    <p className="text-sm text-emerald-600 mt-2">Check your email inbox for instructions to reset your password.</p>
                </div>
             )}

             <button 
                type="button"
                onClick={() => { setMode('LOGIN'); setRecoverySent(false); }}
                className="w-full text-slate-500 hover:text-slate-800 font-medium text-sm"
              >
                Back to Login
              </button>
          </form>
        )}

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
           <p className="text-sm text-slate-500">
             New to the team? <Link to="/join" className="text-emerald-600 font-bold hover:underline">Join Now</Link>
           </p>
        </div>
      </div>
    </div>
  );
};

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

export default Login;