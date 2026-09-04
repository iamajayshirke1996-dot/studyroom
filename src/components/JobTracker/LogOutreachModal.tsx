import React, { useState, useEffect } from 'react';
import { X, Building2, Briefcase, Globe, Mail, UserCheck, Link, DollarSign, FileText, Send, CheckCircle2 } from 'lucide-react';
import { useStudy } from '../../context/StudyContext';
import { useTheme } from '../../context/ThemeContext';
import { OutreachPlatform, OutreachType, OutreachStatus, JobOutreach } from '../../types';
import { getLocalDateString } from '../../utils/storage';

export const LogOutreachModal: React.FC = () => {
  const {
    isLogOutreachOpen,
    setIsLogOutreachOpen,
    editingOutreach,
    setEditingOutreach,
    addJobOutreach,
    updateJobOutreach,
  } = useStudy();

  const { currentTheme } = useTheme();

  const [companyName, setCompanyName] = useState('');
  const [role, setRole] = useState('');
  const [platform, setPlatform] = useState<OutreachPlatform>('linkedin');
  const [type, setType] = useState<OutreachType>('job_application');
  const [status, setStatus] = useState<OutreachStatus>('applied');
  const [appliedDate, setAppliedDate] = useState(() => getLocalDateString());
  const [contactName, setContactName] = useState('');
  const [contactHandle, setContactHandle] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [salary, setSalary] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (editingOutreach) {
      setCompanyName(editingOutreach.companyName);
      setRole(editingOutreach.role);
      setPlatform(editingOutreach.platform);
      setType(editingOutreach.type);
      setStatus(editingOutreach.status);
      setAppliedDate(editingOutreach.appliedDate || getLocalDateString());
      setContactName(editingOutreach.contactName || '');
      setContactHandle(editingOutreach.contactHandle || '');
      setJobUrl(editingOutreach.jobUrl || '');
      setSalary(editingOutreach.salary || '');
      setNotes(editingOutreach.notes || '');
    } else {
      setCompanyName('');
      setRole('');
      setPlatform('linkedin');
      setType('job_application');
      setStatus('applied');
      setAppliedDate(getLocalDateString());
      setContactName('');
      setContactHandle('');
      setJobUrl('');
      setSalary('');
      setNotes('');
    }
  }, [editingOutreach, isLogOutreachOpen]);

  if (!isLogOutreachOpen) return null;

  const handleClose = () => {
    setIsLogOutreachOpen(false);
    setEditingOutreach(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !role.trim()) return;

    if (editingOutreach) {
      updateJobOutreach(editingOutreach.id, {
        companyName: companyName.trim(),
        role: role.trim(),
        platform,
        type,
        status,
        appliedDate,
        contactName: contactName.trim() || undefined,
        contactHandle: contactHandle.trim() || undefined,
        jobUrl: jobUrl.trim() || undefined,
        salary: salary.trim() || undefined,
        notes: notes.trim() || undefined,
      });
    } else {
      addJobOutreach({
        companyName: companyName.trim(),
        role: role.trim(),
        platform,
        type,
        status,
        appliedDate,
        contactName: contactName.trim() || undefined,
        contactHandle: contactHandle.trim() || undefined,
        jobUrl: jobUrl.trim() || undefined,
        salary: salary.trim() || undefined,
        notes: notes.trim() || undefined,
      });
    }

    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-800 dark:text-slate-100">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div
              className="p-3 rounded-2xl text-white shadow-md"
              style={{ backgroundColor: currentTheme.primary }}
            >
              <Send className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {editingOutreach ? 'Edit Application / Outreach' : 'Log Job Application or Outreach'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Track your job search, cold emails, DMs, and daily application streak
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* Row 1: Company & Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-indigo-500" />
                <span>Company Name *</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Stripe, Google, Vercel"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 shadow-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Briefcase className="h-3.5 w-3.5 text-purple-500" />
                <span>Job Title / Role *</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Senior Frontend Engineer"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 shadow-xs"
              />
            </div>
          </div>

          {/* Row 2: Platform & Outreach Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5 text-blue-500" />
                <span>Platform / Source</span>
              </label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value as OutreachPlatform)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 shadow-xs"
              >
                <option value="linkedin">LinkedIn</option>
                <option value="cold_email">Cold Email</option>
                <option value="twitter">Twitter / X (Cold DM)</option>
                <option value="wellfound">Wellfound (AngelList)</option>
                <option value="yc">YC WorkAtAStartUp</option>
                <option value="referral">Internal Referral</option>
                <option value="careers_portal">Company Careers Site</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-emerald-500" />
                <span>Outreach Type</span>
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as OutreachType)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 shadow-xs"
              >
                <option value="job_application">Direct Job Application</option>
                <option value="cold_email">Cold Email to Lead/Recruiter</option>
                <option value="cold_dm">Cold DM / Social Message</option>
                <option value="referral_request">Referral Request</option>
              </select>
            </div>
          </div>

          {/* Row 3: Status & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <UserCheck className="h-3.5 w-3.5 text-amber-500" />
                <span>Current Status</span>
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as OutreachStatus)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 shadow-xs"
              >
                <option value="applied">Applied / Sent</option>
                <option value="replied">Replied / Connected 💬</option>
                <option value="interviewing">Interview Scheduled 🎯</option>
                <option value="offer">Offer Received 🎉</option>
                <option value="rejected">Rejected / Closed</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Application Date
              </label>
              <input
                type="date"
                value={appliedDate}
                onChange={(e) => setAppliedDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 shadow-xs"
              />
            </div>
          </div>

          {/* Contact Details (Optional) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Contact Name (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Alex Rivera (Eng Lead)"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Email / Social Handle (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. alex@stripe.com or @alex_r"
                value={contactHandle}
                onChange={(e) => setContactHandle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Job URL & Salary Range */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
                <Link className="h-3 w-3 text-slate-400" />
                <span>Job Posting URL (Optional)</span>
              </label>
              <input
                type="url"
                placeholder="https://..."
                value={jobUrl}
                onChange={(e) => setJobUrl(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
                <DollarSign className="h-3 w-3 text-emerald-500" />
                <span>Salary Target (Optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. $140k - $170k"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
              <FileText className="h-3 w-3 text-slate-400" />
              <span>Notes & Follow-up Details</span>
            </label>
            <textarea
              rows={3}
              placeholder="e.g. DMed engineering manager about React SSR performance project. Follow up in 3 days."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 shadow-xs"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-white shadow-md transition-transform hover:scale-105 flex items-center gap-1.5"
              style={{ backgroundColor: currentTheme.primary }}
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>{editingOutreach ? 'Save Changes' : 'Log Application'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
