
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface LoginProps {
  onLogin: (handle: string, pass: string) => Promise<boolean>;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [handle, setHandle] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'LOGIN' | 'RECOVERY'>('LOGIN');
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoverySent, setRecoverySent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (mode === 'LOGIN') {
      setLoading(true);
      try {
        const success = await onLogin(handle, password);
        if (!success) {
          setError("Invalid Handle or Password. Please try again.");
        }
      } catch (err) {
        setError("An error occurred during login. Please try again.");
      } finally {
        setLoading(false);
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
          <img 
            src="https://upload.wikimedia.org/wikipedia/en/thumb/8/8f/Forever_Living_Products_logo.svg/300px-Forever_Living_Products_logo.svg.png" 
            alt="Forever Living" 
            className="h-24 mx-auto mb-6 object-contain"
          />
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
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 p-1"
                >
                   {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>
            
            {error && <p className="text-red-500 text-sm font-medium text-center bg-red-50 p-2 rounded-lg border border-red-100">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl shadow-lg transform active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center"
            >
              {loading ? 'Signing in...' : 'Sign In'}
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
