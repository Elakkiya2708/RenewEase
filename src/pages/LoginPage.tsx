import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { AuthHero } from '../components/auth/AuthHero';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  ShieldCheck,
  Check
} from 'lucide-react';

interface LoginPageProps {
  onSwitchToRegister: () => void;
  onBackToPublic?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onSwitchToRegister,
  onBackToPublic
}) => {
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      await login(email, password);
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070e1b] flex flex-col justify-center py-3 sm:py-5 px-3 sm:px-4 lg:px-6 text-slate-900 dark:text-white transition-colors duration-200">
      <div className="max-w-4xl lg:max-w-[920px] mx-auto w-full">
        
        {/* Main Split-Screen Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl sm:shadow-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c1829]">
          
          {/* Left Hero Panel (Mockup with 3D Scene and Features) */}
          <div className="lg:col-span-6 hidden lg:block">
            <AuthHero compact={true} />
          </div>

          {/* Right Login Form Panel */}
          <div className="lg:col-span-6 relative p-5 sm:p-7 lg:p-8 flex flex-col justify-between bg-white dark:bg-[#0c1829] overflow-hidden">
            
            {/* Soft organic wave in bottom right */}
            <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-blue-100/50 dark:bg-blue-950/20 blur-3xl pointer-events-none" />

            <div>
              {/* Top Navigation Row: Back to Public & Switch to Register */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800 text-xs">
                {onBackToPublic ? (
                  <button
                    type="button"
                    onClick={onBackToPublic}
                    className="inline-flex items-center gap-1.5 font-bold text-slate-500 hover:text-blue-900 dark:text-slate-400 dark:hover:text-blue-400 transition-colors cursor-pointer group"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                    <span>Back to Public</span>
                  </button>
                ) : (
                  <div />
                )}

                <div className="text-slate-500 dark:text-slate-400 text-[11px] sm:text-xs">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={onSwitchToRegister}
                    className="font-bold text-blue-800 dark:text-blue-400 hover:underline cursor-pointer ml-1"
                  >
                    Register
                  </button>
                </div>
              </div>

              {/* Title & Subtitle */}
              <div className="space-y-1 mb-3 sm:mb-4">
                <h1 className="text-2xl sm:text-[26px] font-bold tracking-tight text-slate-900 dark:text-white font-serif">
                  Welcome Back
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Log in to your RenewEase account
                </p>
              </div>

              {/* Error Callout */}
              {errorMessage && (
                <div className="p-2.5 mb-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-600" />
                  <span className="font-medium">{errorMessage}</span>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleLogin} className="space-y-2.5 sm:space-y-3 text-xs">
                
                {/* Email Address */}
                <div>
                  <label className="block font-medium text-[11px] sm:text-xs text-slate-700 dark:text-slate-300 mb-1 font-serif">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      required
                      placeholder="Enter your email address"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 sm:py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#081220] text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all text-xs"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label className="block font-medium text-[11px] sm:text-xs text-slate-700 dark:text-slate-300 mb-1 font-serif">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Enter your password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full pl-9 pr-9 py-2 sm:py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#081220] text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(p => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password Row */}
                <div className="flex items-center justify-between text-[11px] sm:text-xs pt-0.5">
                  <label className="flex items-center gap-1.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={e => setRememberMe(e.target.checked)}
                      className="w-3.5 h-3.5 text-blue-900 rounded border-slate-300 focus:ring-blue-600 cursor-pointer"
                    />
                    <span className="text-slate-600 dark:text-slate-400">Remember me</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => alert('Password reset instructions will be sent to your registered email.')}
                    className="text-blue-800 dark:text-blue-400 font-medium hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Primary Login Button */}
                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 px-4 rounded-lg bg-[#17306b] hover:bg-[#1a387d] text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-950/20 hover:shadow-blue-900/30 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50"
                  >
                    <span>{isLoading ? 'Authenticating...' : 'Login'}</span>
                  </button>
                </div>

                {/* OR Separator */}
                <div className="w-full flex items-center justify-center my-2.5">
                  <div className="flex-1 border-t border-slate-200 dark:border-slate-800" />
                  <span className="px-3 text-[10px] font-semibold text-slate-400 uppercase tracking-widest text-center shrink-0">
                    OR
                  </span>
                  <div className="flex-1 border-t border-slate-200 dark:border-slate-800" />
                </div>

                {/* Continue with Google Social Button */}
                <div>
                  <button
                    type="button"
                    onClick={() => alert('Google authentication is disabled. Please sign in with your email and password.')}
                    className="w-full py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60 bg-white dark:bg-[#0c1829] text-slate-700 dark:text-slate-200 font-semibold text-xs transition-all cursor-pointer flex items-center justify-center gap-2.5 shadow-2xs active:scale-[0.99]"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    <span>Continue with Google</span>
                  </button>
                </div>

              </form>
            </div>

            {/* Bottom Security Footer */}
            <div className="pt-2.5 mt-2.5 border-t border-slate-100 dark:border-slate-800 text-center text-[11px] text-slate-400 dark:text-slate-500">
              Secure and private. Your data is always protected.
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
