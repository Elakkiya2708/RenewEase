import React from 'react';
import { Modal } from '../common/Modal';
import { Shield, Lock, Database, EyeOff, UserCheck, HardDrive, Mail } from 'lucide-react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Privacy Policy"
      subtitle="How RenewEase Collects, Protects, and Handles Your Personal & Renewal Data"
      maxWidth="xl"
    >
      <div className="space-y-6 text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
        {/* Header Callout */}
        <div className="p-4 rounded-xl bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/50 flex items-start gap-3">
          <Shield className="w-5 h-5 text-blue-900 dark:text-blue-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
              Our Privacy Commitment
            </h4>
            <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400">
              Last updated: October 2026. RenewEase is built for professional contract and asset management. We prioritize user privacy, data isolation, and transparent handling of your operational records.
            </p>
          </div>
        </div>

        {/* Section 1: Information We Collect */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-blue-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
              1
            </span>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">
              Information We Collect
            </h4>
          </div>
          <div className="space-y-2 pl-8">
            <p className="text-slate-600 dark:text-slate-300">
              We collect only the essential information necessary to provide renewal management services:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40">
                <div className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-white text-xs mb-1">
                  <UserCheck className="w-3.5 h-3.5 text-blue-900 dark:text-blue-400" />
                  <span>Account Credentials</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">
                  Full name, email address, password (stored strictly as salted cryptographic hashes), company name, job title, and optional contact phone number.
                </p>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40">
                <div className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-white text-xs mb-1">
                  <Database className="w-3.5 h-3.5 text-blue-900 dark:text-blue-400" />
                  <span>Renewal & Asset Data</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">
                  Contract titles, categories, vendor names, renewal/expiration dates, notice windows, cost amounts, billing frequencies, and notes you create.
                </p>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-1">
              <strong className="text-slate-700 dark:text-slate-300">Uploaded Documents:</strong> When you upload invoices, contract PDFs, or receipts, these files are saved to secure storage linked directly to your authenticated user account.
            </p>
          </div>
        </div>

        {/* Section 2: How We Use Your Data */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-blue-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
              2
            </span>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">
              How We Use Your Information
            </h4>
          </div>
          <div className="space-y-1.5 pl-8">
            <p className="text-slate-600 dark:text-slate-300">
              Your data is utilized strictly for the functional operation of your workspace:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-300">
              <li>Displaying customized dashboard metrics, timeline charts, and category breakdowns.</li>
              <li>Calculating remaining days until renewal deadlines and notice windows.</li>
              <li>Dispatching configured email notifications before contract renewal dates.</li>
              <li>Allowing search, filtering, and document retrieval for your records.</li>
            </ul>
          </div>
        </div>

        {/* Section 3: Data Protection & Security Architecture */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-blue-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
              3
            </span>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">
              Data Protection & Security Practices
            </h4>
          </div>
          <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2 pl-4 ml-8">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-semibold text-xs">
              <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Authentication & Storage Safeguards</span>
            </div>
            <ul className="list-disc pl-5 space-y-1 text-[11px] sm:text-xs text-slate-600 dark:text-slate-400">
              <li><strong>Password Protection:</strong> Passwords are protected using one-way bcrypt hashing with salt. Raw passwords are never stored or logged.</li>
              <li><strong>Session Authentication:</strong> Secured via JSON Web Tokens (JWT) ensuring only authenticated requests access your workspace data.</li>
              <li><strong>Workspace Isolation:</strong> All queries and document endpoints enforce user account boundary verification.</li>
            </ul>
          </div>
        </div>

        {/* Section 4: No Third-Party Selling or Advertising */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-blue-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
              4
            </span>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">
              Zero Advertising & No Data Selling
            </h4>
          </div>
          <div className="pl-8 space-y-1.5">
            <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-semibold text-xs">
              <EyeOff className="w-4 h-4 text-blue-900 dark:text-blue-400" />
              <span>We do not sell, rent, or trade your data.</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300">
              RenewEase does not include third-party advertising trackers, pixel beacons, or data brokers. Your contract values, vendor information, and personal details remain strictly within your account.
            </p>
          </div>
        </div>

        {/* Section 5: Data Ownership & User Rights */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-blue-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
              5
            </span>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">
              Your Rights & Data Control
            </h4>
          </div>
          <div className="pl-8 space-y-1.5">
            <p className="text-slate-600 dark:text-slate-300">
              You maintain complete control over your stored information:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-300">
              <li><strong>Access & Modify:</strong> You can edit any renewal record, vendor, or account detail at any time.</li>
              <li><strong>Deletion:</strong> Deleting a renewal item or document removes it from the active database.</li>
              <li><strong>Export:</strong> You can export and review your renewals and document history from your workspace.</li>
            </ul>
          </div>
        </div>

        {/* Section 6: Policy Inquiries */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-blue-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
              6
            </span>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">
              Policy Inquiries & Contact
            </h4>
          </div>
          <p className="text-slate-600 dark:text-slate-300 pl-8">
            If you have questions regarding this Privacy Policy or how your data is handled within RenewEase, you can contact our team through the application's Contact page or support channel.
          </p>
        </div>

        {/* Bottom Actions Bar */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
            <Lock className="w-4 h-4 text-blue-900 dark:text-blue-400 shrink-0" />
            <span>Your data is confidential, isolated, and protected.</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-blue-900 hover:bg-blue-800 text-white font-semibold text-xs transition-colors shadow-sm cursor-pointer w-full sm:w-auto"
          >
            Understood
          </button>
        </div>
      </div>
    </Modal>
  );
};
