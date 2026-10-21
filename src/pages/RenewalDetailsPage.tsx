import React, { useState } from 'react';
import { useRenewal } from '../context/RenewalContext';
import { StatusBadge, PriorityBadge, CategoryBadge, CountdownBadge } from '../components/common/Badge';
import { Renewal } from '../types';
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  Building2,
  FileText,
  RotateCw,
  Edit2,
  Trash2,
  ExternalLink,
  ShieldAlert,
  Bell,
  Clock,
  CheckCircle2,
  Paperclip,
  Upload,
  Download,
  AlertTriangle,
  Send,
  History
} from 'lucide-react';

interface RenewalDetailsPageProps {
  onOpenEditModal: (renewal: Renewal) => void;
  onOpenRenewModal: (renewal: Renewal) => void;
  onSimulateEmail: (payload: any) => void;
}

export const RenewalDetailsPage: React.FC<RenewalDetailsPageProps> = ({
  onOpenEditModal,
  onOpenRenewModal,
  onSimulateEmail
}) => {
  const {
    selectedRenewal: renewal,
    setCurrentView,
    deleteRenewal,
    history,
    documents,
    uploadDocument,
    deleteDocument,
    simulateEmail,
    formatCurrency,
    formatDate,
    getDaysRemaining
  } = useRenewal();

  const [isUploading, setIsUploading] = useState(false);
  const [docName, setDocName] = useState('');

  if (!renewal) {
    return (
      <div className="p-12 text-center rounded-xl bg-white dark:bg-[#0c1829] border border-slate-200 dark:border-slate-800">
        <p className="text-slate-500 mb-3">No renewal record currently selected.</p>
        <button
          onClick={() => setCurrentView('renewals')}
          className="px-4 py-2 rounded-lg bg-blue-900 text-white font-bold text-xs"
        >
          Back to Renewals
        </button>
      </div>
    );
  }

  const daysRemaining = getDaysRemaining(renewal.expiryDate);
  const relatedHistory = history.filter(h => h.renewalId === renewal.id);
  const relatedDocs = documents.filter(d => d.renewalId === renewal.id);

  const handleUploadDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName.trim()) return;

    await uploadDocument({
      renewalId: renewal.id,
      fileName: docName.endsWith('.pdf') ? docName : `${docName}.pdf`,
      fileSize: '1.8 MB',
      fileType: 'application/pdf',
      customTitle: renewal.title
    });
    setDocName('');
    setIsUploading(false);
  };

  const handleTriggerSimulatedAlert = async () => {
    const res = await simulateEmail(renewal.id);
    if (res?.emailPayload) {
      onSimulateEmail(res.emailPayload);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView('renewals')}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c1829] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Back to All Renewals"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                {renewal.category}
              </span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="text-xs text-slate-500 font-medium">{renewal.accountNumber}</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
              {renewal.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            onClick={() => onOpenEditModal(renewal)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0c1829] text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5 text-slate-500" />
            <span>Edit</span>
          </button>

          <button
            onClick={() => {
              if (confirm(`Are you sure you want to delete "${renewal.title}"?`)) {
                deleteRenewal(renewal.id);
              }
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0c1829] text-rose-600 dark:text-rose-400 text-xs font-bold hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>

          <button
            onClick={() => onOpenRenewModal(renewal)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md shadow-emerald-950/20 transition-all cursor-pointer"
          >
            <RotateCw className="w-4 h-4" />
            <span>Renew Record</span>
          </button>
        </div>
      </div>

      {/* Hero Status & Financial Banner */}
      <div className="p-6 rounded-xl bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white shadow-lg border border-blue-900/50">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <StatusBadge status={renewal.status} />
              <PriorityBadge priority={renewal.priority} />
              <CountdownBadge daysRemaining={daysRemaining} />
            </div>

            <div className="pt-2">
              <span className="text-xs text-blue-200/80 font-bold uppercase tracking-wider">
                Renewal Due Date
              </span>
              <p className="text-3xl font-bold tracking-tight text-white">
                {formatDate(renewal.expiryDate)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-blue-800/60 md:pl-8 text-xs">
            <div>
              <span className="text-blue-300/80 font-semibold block mb-0.5">Recurring Cost:</span>
              <span className="text-xl font-bold text-white block">{formatCurrency(renewal.cost)}</span>
              <span className="text-slate-400">{renewal.billingCycle}</span>
            </div>

            <div>
              <span className="text-blue-300/80 font-semibold block mb-0.5">Total Renewals:</span>
              <span className="text-xl font-bold text-white block">{renewal.renewalCount || 0} Cycles</span>
              <span className="text-slate-400">Completed</span>
            </div>

            <div>
              <span className="text-blue-300/80 font-semibold block mb-0.5">Auto-Renewal:</span>
              <span className={`text-sm font-bold block ${renewal.autoRenew ? 'text-emerald-400' : 'text-amber-400'}`}>
                {renewal.autoRenew ? 'Enabled' : 'Manual Approval'}
              </span>
              <span className="text-slate-400">Policy Setting</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Details, Reminders, Documents, History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Commercial Terms & Notes */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card: Commercial Terms */}
          <div className="p-5 rounded-xl bg-white dark:bg-[#0c1829] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-600" />
                <span>Vendor & Contract Specifications</span>
              </h3>
              {renewal.websiteUrl && (
                <a
                  href={renewal.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-bold text-blue-900 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  <span>Vendor Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block mb-0.5">Primary Vendor / Issuing Organization:</span>
                <p className="font-bold text-slate-900 dark:text-white text-sm">{renewal.vendor}</p>
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">Account / Policy / License Number:</span>
                <p className="font-bold text-slate-900 dark:text-white text-sm">{renewal.accountNumber}</p>
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">Agreement Start Date:</span>
                <p className="font-bold text-slate-900 dark:text-white text-sm">{formatDate(renewal.startDate)}</p>
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">Last Renewed Date:</span>
                <p className="font-bold text-slate-900 dark:text-white text-sm">
                  {renewal.lastRenewedAt ? formatDate(renewal.lastRenewedAt) : 'Initial Term'}
                </p>
              </div>
            </div>

            {/* Terms */}
            {renewal.terms && (
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Contract Terms & Notice Window:
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-[#081220] p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                  {renewal.terms}
                </p>
              </div>
            )}

            {/* Internal Notes */}
            {renewal.notes && (
              <div className="pt-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Internal Governance Notes:
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-[#081220] p-3 rounded-lg border border-slate-100 dark:border-slate-800 whitespace-pre-line">
                  {renewal.notes}
                </p>
              </div>
            )}
          </div>

          {/* Card: Attached Compliance Documents */}
          <div className="p-5 rounded-xl bg-white dark:bg-[#0c1829] border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                  <Paperclip className="w-4 h-4 text-indigo-600" />
                  <span>Attached Compliance Documents ({relatedDocs.length})</span>
                </h3>
                <p className="text-xs text-slate-500">Agreements, SLAs, and certificates in vault</p>
              </div>

              <button
                onClick={() => setIsUploading(prev => !prev)}
                className="text-xs font-bold text-blue-900 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>+ Attach File</span>
              </button>
            </div>

            {isUploading && (
              <form onSubmit={handleUploadDoc} className="mb-4 p-3.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 flex items-center gap-2">
                <input
                  type="text"
                  required
                  placeholder="Document filename (e.g. Service_Level_Agreement.pdf)"
                  value={docName}
                  onChange={e => setDocName(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0c1829] text-slate-900 dark:text-white"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-md bg-blue-900 text-white font-bold text-xs hover:bg-blue-800 cursor-pointer"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsUploading(false)}
                  className="px-2.5 py-1.5 rounded-md text-slate-500 text-xs hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
              </form>
            )}

            {relatedDocs.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400">
                No documents attached yet. Click &apos;+ Attach File&apos; to link signed contracts or warranty certs.
              </div>
            ) : (
              <div className="space-y-2">
                {relatedDocs.map(doc => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-[#081220] border border-slate-100 dark:border-slate-800 text-xs"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <FileText className="w-4 h-4 text-blue-900 dark:text-blue-400 shrink-0" />
                      <div className="truncate">
                        <span className="font-bold text-slate-800 dark:text-slate-200 truncate block">
                          {doc.name}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {doc.fileSize} • Uploaded {formatDate(doc.uploadDate)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={doc.fileUrl}
                        download={doc.name}
                        className="p-1.5 text-blue-900 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-950 rounded transition-colors"
                        title="Download Document"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => deleteDocument(doc.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Remove Document"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Reminders & Renewal History */}
        <div className="space-y-6">
          {/* Card: Configured Reminders */}
          <div className="p-5 rounded-xl bg-white dark:bg-[#0c1829] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-500" />
                <span>Reminder Triggers</span>
              </h3>
            </div>

            <p className="text-xs text-slate-500">
              Automated notifications configured to alert before expiry:
            </p>

            <div className="flex flex-wrap gap-2">
              {renewal.reminders && renewal.reminders.length > 0 ? (
                renewal.reminders.map(days => (
                  <span
                    key={days}
                    className="px-2.5 py-1 rounded-md text-xs font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-900 dark:text-blue-300 border border-blue-200 dark:border-blue-800 flex items-center gap-1"
                  >
                    <Clock className="w-3 h-3 text-blue-600" />
                    <span>{days} days prior</span>
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400">Default schedule (30, 15, 7 days)</span>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={handleTriggerSimulatedAlert}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 text-blue-700 dark:text-blue-400" />
                <span>Simulate Dispatch Email Reminder</span>
              </button>
            </div>
          </div>

          {/* Card: Historical Cycles for this Item */}
          <div className="p-5 rounded-xl bg-white dark:bg-[#0c1829] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                <History className="w-4 h-4 text-purple-600" />
                <span>Previous Cycles Log</span>
              </h3>
            </div>

            {relatedHistory.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400">
                This record is currently in its initial cycle. When you execute a renewal, past terms and price changes will appear here.
              </div>
            ) : (
              <div className="space-y-3">
                {relatedHistory.map(h => (
                  <div
                    key={h.id}
                    className="p-3 rounded-lg bg-slate-50 dark:bg-[#081220] border border-slate-100 dark:border-slate-800 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                      <span>Renewed on {formatDate(h.renewedDate)}</span>
                      <span className="text-[11px] text-slate-400">{h.invoiceNumber}</span>
                    </div>

                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                      <span>Cost: {formatCurrency(h.previousCost)} → {formatCurrency(h.newCost)}</span>
                      <span className={`font-bold ${h.costDifference > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {h.costDifference > 0 ? `+${formatCurrency(h.costDifference)}` : h.costDifference < 0 ? `-${formatCurrency(Math.abs(h.costDifference))}` : 'Unchanged'}
                      </span>
                    </div>

                    {h.notes && (
                      <p className="text-[11px] text-slate-500 italic mt-1">
                        &quot;{h.notes}&quot;
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
