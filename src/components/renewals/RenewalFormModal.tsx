import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Renewal, RenewalCategory, RenewalPriority, BillingCycle } from '../../types';
import { useRenewal } from '../../context/RenewalContext';
import { Plus, Trash2, UploadCloud, CheckCircle2, Shield, AlertCircle } from 'lucide-react';

interface RenewalFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  renewalToEdit?: Renewal | null;
}

export const RenewalFormModal: React.FC<RenewalFormModalProps> = ({
  isOpen,
  onClose,
  renewalToEdit
}) => {
  const { addRenewal, updateRenewal, uploadDocument } = useRenewal();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<RenewalCategory>('Contracts');
  const [vendor, setVendor] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [cost, setCost] = useState<number | ''>(1000);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('Annual');
  const [autoRenew, setAutoRenew] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [priority, setPriority] = useState<RenewalPriority>('Medium');
  const [reminders, setReminders] = useState<number[]>([30, 15, 7]);
  const [notes, setNotes] = useState('');
  const [terms, setTerms] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [attachedFileName, setAttachedFileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const reminderOptions = [90, 60, 45, 30, 15, 7, 3, 1];

  useEffect(() => {
    if (renewalToEdit) {
      setTitle(renewalToEdit.title);
      setCategory(renewalToEdit.category);
      setVendor(renewalToEdit.vendor);
      setAccountNumber(renewalToEdit.accountNumber || '');
      setCost(renewalToEdit.cost);
      setBillingCycle(renewalToEdit.billingCycle);
      setAutoRenew(renewalToEdit.autoRenew);
      setStartDate(renewalToEdit.startDate);
      setExpiryDate(renewalToEdit.expiryDate);
      setPriority(renewalToEdit.priority);
      setReminders(renewalToEdit.reminders || [30, 15, 7]);
      setNotes(renewalToEdit.notes || '');
      setTerms(renewalToEdit.terms || '');
      setWebsiteUrl(renewalToEdit.websiteUrl || '');
    } else {
      const today = new Date();
      const nextYear = new Date();
      nextYear.setFullYear(today.getFullYear() + 1);

      setTitle('');
      setCategory('Contracts');
      setVendor('');
      setAccountNumber('');
      setCost(2500);
      setBillingCycle('Annual');
      setAutoRenew(false);
      setStartDate(today.toISOString().split('T')[0]);
      setExpiryDate(nextYear.toISOString().split('T')[0]);
      setPriority('Medium');
      setReminders([30, 15, 7]);
      setNotes('');
      setTerms('');
      setWebsiteUrl('');
      setAttachedFileName('');
    }
    setErrorMessage('');
  }, [renewalToEdit, isOpen]);

  const toggleReminder = (days: number) => {
    if (reminders.includes(days)) {
      setReminders(reminders.filter(d => d !== days));
    } else {
      setReminders([...reminders, days].sort((a, b) => b - a));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!title.trim() || !vendor.trim() || !expiryDate) {
      setErrorMessage('Please fill in the record title, vendor name, and expiry date.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (renewalToEdit) {
        await updateRenewal(renewalToEdit.id, {
          title: title.trim(),
          category,
          vendor: vendor.trim(),
          accountNumber: accountNumber.trim(),
          cost: Number(cost) || 0,
          billingCycle,
          autoRenew,
          startDate,
          expiryDate,
          priority,
          reminders,
          notes: notes.trim(),
          terms: terms.trim(),
          websiteUrl: websiteUrl.trim()
        });

        if (attachedFileName) {
          await uploadDocument({
            renewalId: renewalToEdit.id,
            fileName: attachedFileName,
            fileSize: '2.1 MB',
            fileType: 'application/pdf',
            customTitle: `${title} - Contract Schedule.pdf`
          });
        }
      } else {
        const created = await addRenewal({
          title: title.trim(),
          category,
          vendor: vendor.trim(),
          accountNumber: accountNumber.trim() || 'N/A',
          cost: Number(cost) || 0,
          billingCycle,
          autoRenew,
          startDate: startDate || new Date().toISOString().split('T')[0],
          expiryDate,
          priority,
          reminders,
          notes: notes.trim(),
          terms: terms.trim(),
          websiteUrl: websiteUrl.trim()
        });

        if (attachedFileName && created) {
          await uploadDocument({
            renewalId: created.id,
            fileName: attachedFileName,
            fileSize: '1.9 MB',
            fileType: 'application/pdf',
            customTitle: `${title} - Master Agreement.pdf`
          });
        }
      }
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save renewal record.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={renewalToEdit ? 'Edit Renewal Record' : 'Register New Renewal Record'}
      subtitle={renewalToEdit ? `Updating: ${renewalToEdit.title}` : 'Add a contract, license, warranty, insurance policy, or permit to your private vault.'}
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5 text-sm">
        {errorMessage && (
          <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/50 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Section 1: Core Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
              Record Title / Description <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. AWS Enterprise Cloud Infrastructure, Salesforce CRM, Commercial Liability"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#081220] text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-400"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
              Category <span className="text-rose-500">*</span>
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as RenewalCategory)}
              className="w-full px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#081220] text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-400"
            >
              <option value="Contracts">Contracts</option>
              <option value="Licenses">Licenses</option>
              <option value="Certifications">Certifications</option>
              <option value="Warranties">Warranties</option>
              <option value="Insurance">Insurance</option>
              <option value="Subscriptions">Subscriptions</option>
              <option value="Permits">Permits</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
              Vendor / Provider / Issuing Body <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Amazon Web Services, Dell, Travelers Insurance"
              value={vendor}
              onChange={e => setVendor(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#081220] text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-400"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
              Account / Policy / License #
            </label>
            <input
              type="text"
              placeholder="e.g. POL-88921-X, AWS-CORP-01"
              value={accountNumber}
              onChange={e => setAccountNumber(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#081220] text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-400"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
              Priority Level
            </label>
            <select
              value={priority}
              onChange={e => setPriority(e.target.value as RenewalPriority)}
              className="w-full px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#081220] text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-400"
            >
              <option value="Low">Low Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="High">High Priority</option>
              <option value="Critical">Critical Priority</option>
            </select>
          </div>
        </div>

        {/* Section 2: Financial & Dates */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#081220] border border-slate-200 dark:border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
              Cost / Fee
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
              <input
                type="number"
                min="0"
                step="any"
                value={cost}
                onChange={e => setCost(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full pl-7 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0c1829] text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
              Billing Frequency
            </label>
            <select
              value={billingCycle}
              onChange={e => setBillingCycle(e.target.value as BillingCycle)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0c1829] text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600"
            >
              <option value="Annual">Annual</option>
              <option value="Monthly">Monthly</option>
              <option value="Quarterly">Quarterly</option>
              <option value="Bi-Annual">Bi-Annual</option>
              <option value="One-Time">One-Time</option>
            </select>
          </div>

          <div className="flex items-center pt-6">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={autoRenew}
                onChange={e => setAutoRenew(e.target.checked)}
                className="w-4 h-4 text-blue-900 rounded border-slate-300 focus:ring-blue-900"
              />
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                Auto-Renew Enabled
              </span>
            </label>
          </div>

          <div>
            <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
              Effective Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0c1829] text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
              Expiry / Renewal Due Date <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              required
              value={expiryDate}
              onChange={e => setExpiryDate(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0c1829] text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600 font-bold"
            />
          </div>
        </div>

        {/* Section 3: Reminder Trigger Schedules */}
        <div>
          <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1.5">
            Reminder Lead Times (Alert days prior to expiry)
          </label>
          <div className="flex flex-wrap gap-2">
            {reminderOptions.map(days => {
              const isSelected = reminders.includes(days);
              return (
                <button
                  key={days}
                  type="button"
                  onClick={() => toggleReminder(days)}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-900 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {days} days before
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 4: Document Attachment Simulation */}
        <div>
          <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
            Attach Contract / Document Agreement
          </label>
          <div className="p-3.5 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-[#081220]/50 text-center">
            {attachedFileName ? (
              <div className="flex items-center justify-between px-3 py-2 bg-blue-50 dark:bg-blue-950/40 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-2 text-xs font-semibold text-blue-900 dark:text-blue-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>{attachedFileName}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setAttachedFileName('')}
                  className="text-slate-400 hover:text-rose-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div>
                <UploadCloud className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Select a document to store in your encrypted vault (PDF, Word, Images up to 25MB)
                </p>
                <div className="mt-2 flex justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setAttachedFileName(`${title ? title.replace(/\s+/g, '_') : 'Agreement'}_Schedule_2026.pdf`)}
                    className="px-3 py-1 rounded bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold hover:bg-slate-300 cursor-pointer"
                  >
                    Attach Sample PDF Contract
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 5: Terms, Notes, Website URL */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
              Vendor Portal / Website URL
            </label>
            <input
              type="url"
              placeholder="https://vendor.com/login"
              value={websiteUrl}
              onChange={e => setWebsiteUrl(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#081220] text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
              Key Renewal Terms & SLA
            </label>
            <input
              type="text"
              placeholder="e.g. 14-day notice required, 12% loyalty discount applies"
              value={terms}
              onChange={e => setTerms(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#081220] text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
              Internal Notes & Instructions
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Requires approval from Dr. Julian Vance before PO release. Verify usage statistics prior to renewal."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#081220] text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600"
            />
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
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
            className="px-6 py-2 rounded-lg bg-blue-900 hover:bg-blue-800 text-white font-bold shadow-md shadow-blue-950/20 transition-all cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? 'Saving to Vault...' : renewalToEdit ? 'Save Changes' : 'Register Renewal'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
