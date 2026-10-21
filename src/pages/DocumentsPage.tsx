import React, { useState } from 'react';
import { useRenewal } from '../context/RenewalContext';
import { DocumentRecord } from '../types';
import {
  FolderArchive,
  Search,
  Upload,
  Download,
  Trash2,
  FileText,
  Paperclip,
  CheckCircle2,
  ExternalLink,
  Shield,
  FileCheck2,
  Plus
} from 'lucide-react';
import { Modal } from '../components/common/Modal';

export const DocumentsPage: React.FC = () => {
  const {
    documents,
    renewals,
    uploadDocument,
    deleteDocument,
    setCurrentView,
    setSelectedRenewalId,
    formatDate
  } = useRenewal();

  const [searchQuery, setSearchQuery] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [docName, setDocName] = useState('');
  const [linkedRenewalId, setLinkedRenewalId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter documents
  const filteredDocs = documents.filter(d => {
    if (searchQuery.trim() === '') return true;
    const q = searchQuery.toLowerCase().trim();
    return d.name.toLowerCase().includes(q) || d.renewalTitle.toLowerCase().includes(q);
  });

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName.trim()) return;

    setIsSubmitting(true);
    try {
      const renewal = renewals.find(r => r.id === linkedRenewalId);
      await uploadDocument({
        renewalId: linkedRenewalId || null,
        fileName: docName.endsWith('.pdf') ? docName : `${docName}.pdf`,
        fileSize: '2.4 MB',
        fileType: 'application/pdf',
        customTitle: renewal ? renewal.title : 'General Workspace Vault'
      });
      setDocName('');
      setLinkedRenewalId('');
      setIsUploadModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Compliance Document Vault
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Encrypted storage repository for Master Service Agreements, license keys, warranty certs, and insurance binders.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold shadow-md shadow-blue-950/20 transition-all cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Document</span>
          </button>
        </div>
      </div>

      {/* Search and Summary bar */}
      <div className="p-4 rounded-xl bg-white dark:bg-[#0c1829] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search documents by filename or linked renewal..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#081220] text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600"
          />
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-4">
          <span>Total Documents: <strong className="text-slate-900 dark:text-white">{documents.length} files</strong></span>
          <span>Security: <strong className="text-emerald-600">AES-256 Encrypted</strong></span>
        </div>
      </div>

      {/* Documents Grid */}
      {filteredDocs.length === 0 ? (
        <div className="p-12 text-center rounded-xl bg-white dark:bg-[#0c1829] border border-slate-200 dark:border-slate-800">
          <FolderArchive className="w-10 h-10 text-slate-400 mx-auto mb-2 opacity-60" />
          <h3 className="font-bold text-slate-900 dark:text-white text-base">
            No Documents Found
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            No files matched your search or your vault is currently empty.
          </p>
          <div className="mt-4">
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="px-4 py-2 rounded-lg bg-blue-900 text-white font-bold text-xs hover:bg-blue-800 cursor-pointer"
            >
              Upload First Document
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDocs.map(doc => (
            <div
              key={doc.id}
              className="navy-card p-5 rounded-xl bg-white dark:bg-[#0c1829] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-900 dark:text-blue-300">
                    <FileText className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase">
                    PDF Document
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1" title={doc.name}>
                  {doc.name}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Size: <strong>{doc.fileSize}</strong> • Uploaded: <strong>{formatDate(doc.uploadDate)}</strong>
                </p>

                {doc.renewalId && (
                  <div className="mt-3 p-2 rounded-lg bg-slate-50 dark:bg-[#081220] border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">
                      Associated Renewal Record:
                    </span>
                    <button
                      onClick={() => {
                        setSelectedRenewalId(doc.renewalId);
                        setCurrentView('renewal-details');
                      }}
                      className="text-xs font-bold text-blue-900 dark:text-blue-400 hover:underline line-clamp-1 text-left cursor-pointer mt-0.5 flex items-center gap-1"
                    >
                      <span>{doc.renewalTitle}</span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </button>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-4 flex items-center justify-between">
                <a
                  href={doc.fileUrl}
                  download={doc.name}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/40 text-blue-900 dark:text-blue-300 font-bold text-xs transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </a>

                <button
                  onClick={() => {
                    if (confirm(`Remove "${doc.name}" from your document vault?`)) {
                      deleteDocument(doc.id);
                    }
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                  title="Delete Document"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Upload Compliance Document"
        subtitle="Store verified legal agreements, purchase orders, or warranties."
        maxWidth="md"
      >
        <form onSubmit={handleUploadSubmit} className="space-y-4 text-sm">
          <div>
            <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
              Document Title / Filename <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. AWS_Enterprise_Agreement_2026.pdf"
              value={docName}
              onChange={e => setDocName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#081220] text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
              Link to Renewal Record (Optional)
            </label>
            <select
              value={linkedRenewalId}
              onChange={e => setLinkedRenewalId(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#081220] text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600"
            >
              <option value="">General Workspace Document (Unlinked)</option>
              {renewals.map(r => (
                <option key={r.id} value={r.id}>
                  {r.title} ({r.category})
                </option>
              ))}
            </select>
          </div>

          <div className="p-3.5 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#081220] text-center">
            <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
            <p className="text-xs text-slate-500">
              Drag and drop any file here or click Browse
            </p>
            <span className="text-[11px] text-slate-400">PDF, DOCX, PNG, XLSX up to 25MB</span>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsUploadModalOpen(false)}
              className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-lg bg-blue-900 text-white text-xs font-bold hover:bg-blue-800 shadow-md disabled:opacity-50"
            >
              {isSubmitting ? 'Uploading to Vault...' : 'Save to Vault'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
