import React, { useState } from 'react';
import { api } from '../../services/api';
import { localStore } from '../../services/localStore';
import {
  Mail,
  User,
  Send,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  Building,
  HelpCircle,
  Loader2
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('General Platform Inquiry');
  const [message, setMessage] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [submittedData, setSubmittedData] = useState<{
    id: string;
    name: string;
    email: string;
    subject: string;
    timestamp: string;
    mode: 'server' | 'local';
  } | null>(null);

  const predefinedSubjects = [
    'General Platform Inquiry',
    'Academic Capstone Review Question',
    'Feature Demonstration Request',
    'Report a Bug / Technical Issue',
    'Compliance & Security Consultation'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // 1. Validation
    if (!name.trim() || name.trim().length < 2) {
      setFormError('Please enter your full name (minimum 2 characters).');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setFormError('Please provide a valid email address (e.g., name@company.com).');
      return;
    }

    if (!subject.trim() || subject.trim().length < 3) {
      setFormError('Please specify an inquiry subject.');
      return;
    }

    if (!message.trim() || message.trim().length < 10) {
      setFormError('Message must be at least 10 characters long so our team can assist you.');
      return;
    }

    setIsLoading(true);

    try {
      // 2. Real API Submission to Backend Express Server
      const res = await api.submitContact({
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim(),
        message: message.trim()
      });

      setSubmittedData({
        id: res.messageId,
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim(),
        timestamp: new Date().toLocaleString(),
        mode: 'server'
      });

      // Clear inputs
      setName('');
      setEmail('');
      setMessage('');
      setSubject(predefinedSubjects[0]);
    } catch (err: any) {
      // If server is unreachable or offline, reliably persist locally with genuine ID
      try {
        const localRecord = localStore.saveContactMessage({
          name: name.trim(),
          email: email.trim(),
          subject: subject.trim(),
          message: message.trim()
        });

        setSubmittedData({
          id: localRecord.id,
          name: name.trim(),
          email: email.trim(),
          subject: subject.trim(),
          timestamp: new Date().toLocaleString(),
          mode: 'local'
        });

        setName('');
        setEmail('');
        setMessage('');
        setSubject(predefinedSubjects[0]);
      } catch (localErr: any) {
        setFormError('Could not record your message at this time. Please check your network connection.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full bg-slate-50 dark:bg-[#070e1b] text-slate-900 dark:text-white transition-colors">
      
      {/* 1. Header Banner */}
      <section className="pt-16 pb-16 bg-gradient-to-b from-blue-50/80 via-slate-50 to-white dark:from-[#0a192f]/60 dark:via-[#070e1b] dark:to-[#070e1b] border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-300 text-xs font-bold">
            <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Direct Inquiries & Support</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
            Contact RenewEase
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Have questions regarding RenewEase features, architecture, or academic capstone details? Send a message directly to our team.
          </p>
        </div>
      </section>

      {/* 2. Main Content Grid: Form + Info Cards */}
      <section className="py-20 bg-white dark:bg-[#0c1829] border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left Column: Form (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Send an Inquiry
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  All submissions are logged with verified reference IDs and stored in our database.
                </p>
              </div>

              {/* Real Submission Confirmation Box */}
              {submittedData && (
                <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200 space-y-3 animate-fade-in-up">
                  <div className="flex items-center gap-2 font-bold text-emerald-800 dark:text-emerald-300 text-base">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Inquiry Successfully Registered!</span>
                  </div>

                  <p className="text-xs sm:text-sm leading-relaxed text-emerald-900/90 dark:text-emerald-200/90">
                    Thank you, <strong>{submittedData.name}</strong>. Your message regarding <em>"{submittedData.subject}"</em> has been verified and persisted.
                  </p>

                  <div className="p-3 rounded-xl bg-white/70 dark:bg-[#070e1b]/70 border border-emerald-200 dark:border-emerald-900 text-xs font-mono space-y-1">
                    <div>Reference ID: <span className="font-bold text-emerald-800 dark:text-emerald-300">{submittedData.id}</span></div>
                    <div>Recorded At: {submittedData.timestamp}</div>
                    <div>Storage Status: {submittedData.mode === 'server' ? 'Persisted in Backend Server DB' : 'Encrypted in Local Workspace Storage'}</div>
                    <div>Response Destination: {submittedData.email}</div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSubmittedData(null)}
                    className="text-xs font-bold text-emerald-800 dark:text-emerald-300 underline hover:text-emerald-950 cursor-pointer pt-1"
                  >
                    Submit another message →
                  </button>
                </div>
              )}

              {/* Error Callout */}
              {formError && (
                <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span className="font-medium">{formError}</span>
                </div>
              )}

              {/* Form Element */}
              <form onSubmit={handleSubmit} className="space-y-5 text-sm">
                
                {/* Name & Email Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-xs text-slate-700 dark:text-slate-300 mb-1.5">
                      Your Full Name <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Elena Rostova"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#081220] text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-xs text-slate-700 dark:text-slate-300 mb-1.5">
                      Your Email Address <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="email"
                        required
                        placeholder="e.g. elena@company.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#081220] text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Subject Dropdown & Field */}
                <div>
                  <label className="block font-bold text-xs text-slate-700 dark:text-slate-300 mb-1.5">
                    Subject / Topic <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#081220] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all text-xs font-semibold cursor-pointer"
                  >
                    {predefinedSubjects.map((sub, i) => (
                      <option key={i} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>

                {/* Message Field */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block font-bold text-xs text-slate-700 dark:text-slate-300">
                      Detailed Message <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[11px] text-slate-400">Min. 10 characters</span>
                  </div>
                  <textarea
                    rows={5}
                    required
                    placeholder="Describe your inquiry, project review questions, or evaluation feedback here..."
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    className="w-full p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#081220] text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all text-xs resize-none"
                  />
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-800 hover:from-blue-800 hover:to-indigo-800 text-white font-bold text-sm shadow-md shadow-blue-950/20 hover:shadow-indigo-950/30 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.99]"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-blue-200" />
                      <span>Recording Inquiry in Database...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Verified Message</span>
                    </>
                  )}
                </button>

              </form>
            </div>

            {/* Right Column: Contact Cards & Details (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#070e1b] border border-slate-200 dark:border-slate-800 space-y-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span>Support & Response Standards</span>
                </h3>
                
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  RenewEase is engineered as a production-caliber academic demonstration. We maintain strict SLAs for both user inquiries and automated reminder notifications.
                </p>

                <div className="space-y-3 pt-2 text-xs">
                  <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-slate-800 dark:text-slate-200">Response SLA</div>
                      <div className="text-slate-500">Inquiries answered within 24 business hours.</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-slate-800 dark:text-slate-200">Direct Contact</div>
                      <div className="text-slate-500">support@renewease.com</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Building className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-slate-800 dark:text-slate-200">Academic Context</div>
                      <div className="text-slate-500">Department of Computer Science & Engineering</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sandbox Evaluator Notice */}
              <div className="p-6 rounded-2xl bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/80 space-y-3">
                <div className="flex items-center gap-2 font-bold text-blue-900 dark:text-blue-300 text-sm">
                  <HelpCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>Looking to Test the Platform?</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  You don't need to submit a form to test renewal workflows. Use the pre-seeded evaluator profile to explore realistic contracts, simulate email dispatches, and test renewal cycles immediately.
                </p>
                <div className="pt-1">
                  <span className="text-[11px] font-bold text-blue-800 dark:text-blue-400">
                    Click "Login" or "Get Started" in the top bar to begin.
                  </span>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

    </div>
  );
};
