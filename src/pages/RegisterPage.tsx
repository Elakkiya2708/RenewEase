import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  ShieldCheck,
  Lock,
  Mail,
  User,
  Building,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Sparkles,
  Phone,
  Briefcase,
  Zap,
  FileText,
  Check,
  Loader2,
  XCircle
} from 'lucide-react';

interface RegisterPageProps {
  onSwitchToLogin: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onSwitchToLogin }) => {
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [company, setCompany] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [phone, setPhone] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Password strength calculation
  const passwordStrength = useMemo(() => {
    if (!password) return { score: 0, label: '', color: 'bg-slate-200 dark:bg-slate-700', text: '' };
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 10) score += 1;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) score += 1;

    switch (score) {
      case 1:
        return { score: 25, label: 'Weak', color: 'bg-rose-500', text: 'text-rose-500' };
      case 2:
        return { score: 50, label: 'Fair', color: 'bg-amber-500', text: 'text-amber-500' };
      case 3:
        return { score: 75, label: 'Good', color: 'bg-blue-600', text: 'text-blue-600' };
      case 4:
        return { score: 100, label: 'Strong', color: 'bg-emerald-500', text: 'text-emerald-500' };
      default:
        return { score: 0, label: '', color: 'bg-slate-200 dark:bg-slate-700', text: '' };
    }
  }, [password]);

  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
  const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify your entry.');
      return;
    }

    if (!acceptTerms) {
      setErrorMessage('Please accept the Workspace Terms of Service to proceed.');
      return;
    }

    setIsLoading(true);
    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        password,
        company: company.trim() || 'Private Workspace',
        jobTitle: jobTitle.trim() || 'Asset Manager',
        phone: phone.trim()
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed. Email may already be in use.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAutoFillEvaluator = () => {
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    setName('Dr. Elena Rostova');
    setEmail(`elena.evaluator${randomSuffix}@apexoperations.io`);
    setCompany('Apex Global Technology Group');
    setJobTitle('VP of Enterprise Operations');
    setPhone('+1 (555) 782-9014');
    setPassword('RenewEase@2026!');
    setConfirmPassword('RenewEase@2026!');
    setAcceptTerms(true);
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070e1b] flex flex-col justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8 text-slate-900 dark:text-white transition-colors duration-200">
      <div className="max-w-5xl mx-auto w-full">
        {/* Main Card Container with Two-Column Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0c1829]">
          
          {/* Left Hero / Brand Showcase Panel */}
          <div className="lg:col-span-5 relative bg-gradient-to-br from-[#0a192f] via-[#0f2240] to-[#070e1b] text-white p-8 sm:p-10 flex flex-col justify-between overflow-hidden">
            {/* Ambient Background Glow Effect */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-6">
              {/* Header with App Logo */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-700 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-900/40">
                  <ShieldCheck className="w-7 h-7 text-indigo-200" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold tracking-tight text-white">RenewEase</span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                      SaaS
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">Smart Renewal Management System</p>
                </div>
              </div>

              {/* Value Proposition */}
              <div className="space-y-2 pt-2">
                <h2 className="text-xl sm:text-2xl font-bold leading-snug text-white">
                  Autonomous Renewal Intelligence for Enterprise Teams
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Never miss another contract expiration, warranty claim, software license, or commercial policy renewal.
                </p>
              </div>

              {/* Feature Highlights with Glassmorphism */}
              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
                  <div className="p-2 rounded-lg bg-blue-500/20 text-blue-300 mt-0.5 shrink-0">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Multi-Tier Automated Alerts</h4>
                    <p className="text-[11px] text-slate-300 leading-relaxed mt-0.5">
                      Configurable 60, 30, 15, and 1-day lead alerts with simulated SMTP delivery previews.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
                  <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-300 mt-0.5 shrink-0">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Isolated Private Workspace</h4>
                    <p className="text-[11px] text-slate-300 leading-relaxed mt-0.5">
                      Zero-cross-tenant leakage with cryptographic session tokens and instant offline fallback.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
                  <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-300 mt-0.5 shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Audit Trails & Document Vault</h4>
                    <p className="text-[11px] text-slate-300 leading-relaxed mt-0.5">
                      Attach PDFs, track historical cost variances, and export compliance-ready CSV reports.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Key Metrics Badges */}
            <div className="relative z-10 pt-8 mt-6 border-t border-white/10">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-base font-bold text-white">100%</div>
                  <div className="text-[10px] text-slate-400">On-Time Renewal</div>
                </div>
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-base font-bold text-emerald-400">0</div>
                  <div className="text-[10px] text-slate-400">Lapse Penalties</div>
                </div>
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-base font-bold text-indigo-300">Instant</div>
                  <div className="text-[10px] text-slate-400">Sample Records</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form Panel */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between bg-white dark:bg-[#0c1829]">
            <div>
              {/* Form Header with Quick Auto-Fill Action */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100 dark:border-slate-800/80 mb-6">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Create Private Workspace
                  </h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Set up your isolated compliance environment in seconds.
                  </p>
                </div>

                {/* Auto-fill button for fast evaluation */}
                <button
                  type="button"
                  onClick={handleAutoFillEvaluator}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-900 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 transition-all cursor-pointer shadow-xs shrink-0 self-start sm:self-auto"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>Auto-Fill Evaluator</span>
                </button>
              </div>

              {/* Error Callout */}
              {errorMessage && (
                <div className="p-3.5 mb-5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
                  <span className="font-medium">{errorMessage}</span>
                </div>
              )}

              {/* Instant Sandbox Notification */}
              <div className="p-3 mb-6 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-900 dark:text-emerald-300 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  <strong>Automatic Workspace Seeding:</strong> Your new account is automatically initialized with realistic contract, software, insurance, and license records for instant exploration.
                </span>
              </div>

              {/* Registration Form */}
              <form onSubmit={handleRegister} className="space-y-4 text-sm">
                {/* Full Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-xs text-slate-700 dark:text-slate-300 mb-1.5">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        required
                        placeholder="Dr. Sarah Jenkins"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#081220] text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 text-xs transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-xs text-slate-700 dark:text-slate-300 mb-1.5">
                      Work Email <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="email"
                        required
                        placeholder="name@organization.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#081220] text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 text-xs transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Company, Job Role & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-xs text-slate-700 dark:text-slate-300 mb-1.5">
                      Company
                    </label>
                    <div className="relative">
                      <Building className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        placeholder="Apex Innovations"
                        value={company}
                        onChange={e => setCompany(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#081220] text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 text-xs transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-xs text-slate-700 dark:text-slate-300 mb-1.5">
                      Role / Title
                    </label>
                    <div className="relative">
                      <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        placeholder="Operations Director"
                        value={jobTitle}
                        onChange={e => setJobTitle(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#081220] text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 text-xs transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-xs text-slate-700 dark:text-slate-300 mb-1.5">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#081220] text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 text-xs transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Password & Confirm Password */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-xs text-slate-700 dark:text-slate-300 mb-1.5">
                      Password <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="Min. 6 characters"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="w-full pl-9 pr-10 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#081220] text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 text-xs transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(p => !p)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Dynamic Password Strength Bar */}
                    {password && (
                      <div className="mt-2 space-y-1">
                        <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                            style={{ width: `${passwordStrength.score}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-400">Strength:</span>
                          <span className={`font-bold ${passwordStrength.text}`}>
                            {passwordStrength.label}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block font-bold text-xs text-slate-700 dark:text-slate-300 mb-1.5">
                      Confirm Password <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        placeholder="Re-enter password"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        className={`w-full pl-9 pr-10 py-2 rounded-lg border bg-white dark:bg-[#081220] text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 text-xs transition-colors ${
                          passwordsMismatch
                            ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500'
                            : passwordsMatch
                            ? 'border-emerald-400 focus:border-emerald-500 focus:ring-emerald-500'
                            : 'border-slate-300 dark:border-slate-700 focus:border-indigo-600 focus:ring-indigo-600'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(p => !p)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
                        aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Password Match Status */}
                    {confirmPassword.length > 0 && (
                      <div className="mt-1.5 flex items-center gap-1.5 text-[11px]">
                        {passwordsMatch ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                            <span className="text-emerald-600 dark:text-emerald-400 font-medium">Passwords match</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5 text-rose-500" />
                            <span className="text-rose-600 dark:text-rose-400 font-medium">Passwords do not match</span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Terms of Service Acceptance */}
                <div className="pt-2">
                  <label className="flex items-start gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={acceptTerms}
                      onChange={e => setAcceptTerms(e.target.checked)}
                      className="mt-0.5 w-4 h-4 text-blue-900 rounded border-slate-300 dark:border-slate-700 focus:ring-indigo-500 cursor-pointer"
                    />
                    <span className="text-xs text-slate-600 dark:text-slate-400 leading-normal">
                      I accept the <strong className="text-slate-800 dark:text-slate-200">Workspace Terms of Service</strong> and consent to local & simulated email reminder notifications for active assets.
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-800 hover:from-blue-800 hover:to-indigo-700 text-white font-bold text-sm shadow-lg shadow-blue-950/20 hover:shadow-indigo-950/30 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.99]"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-indigo-300" />
                        <span>Initializing Isolated Vault...</span>
                      </>
                    ) : (
                      <>
                        <span>Launch My Private Workspace</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Footer with Login Redirection */}
            <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800/80 text-center text-xs text-slate-600 dark:text-slate-400">
              Already registered or exploring with an existing workspace?{' '}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="font-bold text-blue-900 dark:text-indigo-400 hover:underline cursor-pointer ml-1 inline-flex items-center gap-1"
              >
                <span>Sign In to Existing Account</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>

        {/* Academic Capstone Demonstration Footer Badge */}
        <div className="text-center text-xs text-slate-400 dark:text-slate-500 mt-6 space-y-1">
          <p>RenewEase — Smart Renewal Management System • Academic Capstone Demonstration</p>
          <p className="text-[11px] text-slate-400/80">Enterprise Compliance, Contract & License Lifecycle Automation</p>
        </div>
      </div>
    </div>
  );
};
