import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Renewal } from '../../types';
import { useRenewal } from '../../context/RenewalContext';
import confetti from 'canvas-confetti';
import { RotateCw, CheckCircle2, DollarSign, Calendar, FileText } from 'lucide-react';

interface RenewActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  renewal: Renewal | null;
}

export const RenewActionModal: React.FC<RenewActionModalProps> = ({
  isOpen,
  onClose,
  renewal
}) => {
  const { renewRecord, formatCurrency, formatDate } = useRenewal();

  const [newExpiryDate, setNewExpiryDate] = useState('');
  const [newCost, setNewCost] = useState<number | ''>(0);
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [renewalTerms, setRenewalTerms] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (renewal) {
      // Default new expiry to +1 year from current expiry date
      try {
        const currentExp = new Date(renewal.expiryDate);
        if (!isNaN(currentExp.getTime())) {
          currentExp.setFullYear(currentExp.getFullYear() + 1);
          setNewExpiryDate(currentExp.toISOString().split('T')[0]);
        } else {
          setNewExpiryDate(new Date().toISOString().split('T')[0]);
        }
      } catch {
        setNewExpiryDate(new Date().toISOString().split('T')[0]);
      }

      setNewCost(renewal.cost);
      setInvoiceNumber(`INV-REN-${Date.now().toString().slice(-6)}`);
      setRenewalTerms('Annual renewal terms verified with vendor SLA maintainability.');
      setNotes(`Renewed contract term successfully for cycle ${new Date().getFullYear()}.`);
    }
  }, [renewal, isOpen]);

  if (!renewal) return null;

  const costDifference = Number(newCost || 0) - renewal.cost;

  const handleRenew = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpiryDate) return;

    setIsSubmitting(true);
    try {
      await renewRecord(renewal.id, {
        newExpiryDate,
        newCost: Number(newCost) || 0,
        invoiceNumber,
        renewalTerms,
        notes
      });

      // Fire celebratory confetti!
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });

      onClose();
    } catch (err) {
      console.error('Failed to renew record:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Execute Renewal Cycle"
      subtitle="Extend contract lifespan and preserve previous cycle terms in the audit history."
      maxWidth="lg"
    >
      <form onSubmit={handleRenew} className="space-y-4 text-sm">
        {/* Current State Summary Card */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#081220] border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-bold text-slate-900 dark:text-white truncate max-w-sm">
              {renewal.title}
            </h4>
            <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-300 font-semibold">
              {renewal.category}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-slate-600 dark:text-slate-300">
            <div>
              <span className="block text-slate-400">Current Expiry:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{formatDate(renewal.expiryDate)}</span>
            </div>
            <div>
              <span className="block text-slate-400">Current Cost:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{formatCurrency(renewal.cost)}</span>
            </div>
            <div>
              <span className="block text-slate-400">Vendor:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 truncate block">{renewal.vendor}</span>
            </div>
          </div>
        </div>

        {/* New Renewal Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
              New Expiry Date <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="date"
                required
                value={newExpiryDate}
                onChange={e => setNewExpiryDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#081220] text-slate-900 dark:text-white font-bold focus:outline-none focus:border-indigo-600"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
              New Cycle Cost / Fee
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
              <input
                type="number"
                min="0"
                step="any"
                required
                value={newCost}
                onChange={e => setNewCost(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full pl-7 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#081220] text-slate-900 dark:text-white font-bold focus:outline-none focus:border-indigo-600"
              />
            </div>
            {costDifference !== 0 && (
              <p className={`text-[11px] mt-1 font-semibold ${costDifference > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                {costDifference > 0 ? `+${formatCurrency(costDifference)} increase` : `${formatCurrency(costDifference)} reduction`}
              </p>
            )}
          </div>

          <div>
            <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
              Invoice / PO / Reference #
            </label>
            <input
              type="text"
              value={invoiceNumber}
              onChange={e => setInvoiceNumber(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#081220] text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
              Negotiated Renewal Terms
            </label>
            <input
              type="text"
              value={renewalTerms}
              onChange={e => setRenewalTerms(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#081220] text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600"
            />
          </div>
        </div>

        <div>
          <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
            Renewal Audit Notes & Justification
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={e => setNotes(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#081220] text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600"
          />
        </div>

        <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-900 dark:text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>Executing this renewal automatically updates expiry status to <strong>Active</strong> and archives prior terms into <strong>Renewal History</strong>.</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold shadow-md shadow-emerald-950/20 transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
          >
            <RotateCw className={`w-4 h-4 ${isSubmitting ? 'animate-spin' : ''}`} />
            <span>{isSubmitting ? 'Processing Renewal...' : 'Confirm & Renew Record'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
