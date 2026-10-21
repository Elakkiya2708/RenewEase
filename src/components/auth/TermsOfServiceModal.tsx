import React from 'react';
import { Modal } from '../common/Modal';
import { FileText, ShieldCheck, AlertCircle, Bell, HardDrive, CheckCircle2 } from 'lucide-react';

interface TermsOfServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept?: () => void;
  isAccepted?: boolean;
}

export const TermsOfServiceModal: React.FC<TermsOfServiceModalProps> = ({
  isOpen,
  onClose,
  onAccept,
  isAccepted = false,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Terms of Service"
      subtitle="RenewEase Platform Usage Guidelines & Operational Conditions"
      maxWidth="xl"
    >
      <div className="space-y-6 text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
        {/* Effective Date & Header Callout */}
        <div className="p-4 rounded-xl bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/50 flex items-start gap-3">
          <FileText className="w-5 h-5 text-blue-900 dark:text-blue-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
              Agreement Overview & Effective Date
            </h4>
            <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400">
              Last updated: October 2026. By registering for or using RenewEase, you agree to comply with the terms, operational rules, and user responsibilities outlined below.
            </p>
          </div>
        </div>

        {/* Section 1: Purpose & Scope of the Application */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-blue-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
              1
            </span>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">
              Purpose & Scope of Service
            </h4>
          </div>
          <p className="text-slate-600 dark:text-slate-300 pl-8">
            RenewEase provides an enterprise-ready personal workspace to track and manage renewal lifecycles across software subscriptions, client contracts, professional licenses, certifications, insurance policies, and hardware warranties. The system provides calendar visualizations, spend insights, document attachments, and scheduled notifications.
          </p>
        </div>

        {/* Section 2: User Responsibilities & Data Accuracy */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-blue-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
              2
            </span>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">
              User Responsibilities & Data Accuracy
            </h4>
          </div>
          <div className="space-y-2 pl-8">
            <p className="text-slate-600 dark:text-slate-300">
              To ensure effective tracking, you are responsible for:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-300">
              <li>Inputting accurate renewal deadlines, notice periods, contract amounts, and vendor details.</li>
              <li>Maintaining a secure, unique password and safeguarding your account credentials.</li>
              <li>Ensuring the email address linked to your account is active and able to receive notification dispatches.</li>
              <li>Promptly updating contract status when items are renewed, renegotiated, or terminated.</li>
            </ul>
          </div>
        </div>

        {/* Section 3: Automated Reminders & Notification Disclaimers */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-blue-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
              3
            </span>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">
              Automated Reminders & Email Notifications
            </h4>
          </div>
          <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2 pl-4 ml-8">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-semibold text-xs">
              <Bell className="w-4 h-4 text-blue-800 dark:text-blue-400" />
              <span>Reminder Delivery Notice</span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400">
              RenewEase dispatches automated alerts prior to renewal dates based on your customized lead times (e.g., 30, 14, 7, or 1 day prior). While our backend queues and transmits scheduled notices, delivery may be subject to external factors including mail server policies, spam filtering, or network connectivity. RenewEase is a management aid and does not replace your primary obligation to track contractual deadlines.
            </p>
          </div>
        </div>

        {/* Section 4: Vendor Relationships & Third-Party Actions */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-blue-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
              4
            </span>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">
              Independent Vendor Actions & Billing
            </h4>
          </div>
          <p className="text-slate-600 dark:text-slate-300 pl-8">
            RenewEase does not process payments, withdraw funds, cancel subscriptions, or negotiate agreements with your external vendors on your behalf. Any decisions to cancel, upgrade, downgrade, or renew any tracked service must be executed directly by you with the corresponding provider or vendor according to their respective contract terms.
          </p>
        </div>

        {/* Section 5: Document Uploads & Storage Usage */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-blue-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
              5
            </span>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">
              Document Attachments & Acceptable Use
            </h4>
          </div>
          <div className="space-y-1.5 pl-8">
            <p className="text-slate-600 dark:text-slate-300">
              You may upload invoices, contracts, agreements, and renewal receipts for record-keeping. You agree not to upload:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-300">
              <li>Executable files, malware, viruses, or unauthorized scripts.</li>
              <li>Documents containing unlawful or prohibited content.</li>
              <li>Materials that infringe upon intellectual property rights of third parties.</li>
            </ul>
          </div>
        </div>

        {/* Section 6: Account Management & Termination */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-blue-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
              6
            </span>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">
              Account Management, Modifications & Termination
            </h4>
          </div>
          <p className="text-slate-600 dark:text-slate-300 pl-8">
            You may modify, export, or delete your renewals, documents, or account data at any time from your settings. We reserve the right to modify these terms as new platform features are introduced. Continued use of the platform after updates indicates your acceptance of any revised conditions.
          </p>
        </div>

        {/* Bottom Actions Bar */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Accepted during registration to ensure transparent application usage.</span>
          </div>
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium text-xs transition-colors cursor-pointer"
            >
              Close
            </button>
            {onAccept && (
              <button
                type="button"
                onClick={() => {
                  onAccept();
                  onClose();
                }}
                className="px-4 py-2 rounded-lg bg-blue-900 hover:bg-blue-800 text-white font-semibold text-xs transition-colors shadow-sm cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{isAccepted ? 'Accepted' : 'Accept Terms'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
