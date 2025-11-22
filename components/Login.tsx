import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface LoginProps {
  onLogin: (handle: string, pass: string) => boolean;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [handle, setHandle] = useState('');
  const [password, setPassword] = useState('');
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
          <h1 className="text-3xl font-bold text-emerald-950">FBO Academy</h1>
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
                className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all"
                placeholder="@username"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all"
                placeholder="••••••••"
              />
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
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:border-emerald-500 outline-none"
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

export default Login;