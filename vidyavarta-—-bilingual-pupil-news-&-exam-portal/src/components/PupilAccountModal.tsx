import React, { useState } from 'react';
import { Cloud, LogOut, ShieldCheck, X } from 'lucide-react';
import { EDUCATION_LEVEL_LABELS } from '../data/bilingualContent';
import type { EducationLevel, LanguageMode, PupilSession } from '../types/portal';

interface PupilAccountModalProps {
  pupil: PupilSession;
  lang: LanguageMode;
  cloudUserEmail: string | null;
  bookmarkCount: number;
  attemptCount: number;
  onClose: () => void;
  onUpdateEducationLevel: (level: EducationLevel) => Promise<void>;
  onSetPassword: (password: string) => Promise<void>;
  onConnectCloud: () => Promise<void>;
  onLogout: (forgetDevice: boolean) => Promise<void>;
}

export function PupilAccountModal({
  pupil,
  lang,
  cloudUserEmail,
  bookmarkCount,
  attemptCount,
  onClose,
  onUpdateEducationLevel,
  onSetPassword,
  onConnectCloud,
  onLogout,
}: PupilAccountModalProps) {
  const isTe = lang === 'te';
  const [busy, setBusy] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [pwdBusy, setPwdBusy] = useState(false);
  const [pwdMsg, setPwdMsg] = useState<string | null>(null);

  async function handleCloudLink() {
    setBusy(true);
    setStatusMsg(null);
    try {
      await onConnectCloud();
      setStatusMsg(isTe ? 'క్లౌడ్ సింక్ విజయవంతమైంది.' : 'Cloud Firestore profile synchronized.');
    } catch (err) {
      const msg = err instanceof Error ? err.message : '';
      if (msg.includes('auth/unauthorized-domain')) {
        const host = typeof window !== 'undefined' ? window.location.hostname : 'this domain';
        setStatusMsg(
          isTe
            ? `ఈ డొమైన్ (${host}) Firebase Auth అనుమతించిన జాబితాలో లేదు.`
            : `Domain "${host}" is not authorized in Firebase Auth settings.`
        );
      } else {
        setStatusMsg(msg || 'Cloud sync cancelled or failed.');
      }
    } finally {
      setBusy(false);
    }
  }

  async function handlePasswordSave(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword.length < 8) {
      setPwdMsg(isTe ? 'పాస్‌వర్డ్ కనీసం 8 అక్షరాలు ఉండాలి.' : 'Password must be at least 8 characters.');
      return;
    }
    setPwdBusy(true);
    setPwdMsg(null);
    try {
      await onSetPassword(newPassword);
      setNewPassword('');
      setPwdMsg(isTe ? 'పాస్‌వర్డ్ సురక్షితంగా సేవ్ చేయబడింది.' : 'Password saved for future sign-ins.');
    } catch (err) {
      setPwdMsg(err instanceof Error ? err.message : 'Could not update password.');
    } finally {
      setPwdBusy(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Pupil Account"
    >
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white dark:bg-[#161B22] border border-stone-200 dark:border-slate-800 rounded-xl p-6 lg:p-8 text-[#171513] dark:text-[#F1F5F9]">
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-stone-200 dark:border-slate-800">
          <div>
            <p className="text-xs uppercase tracking-wider text-[#1D4ED8] dark:text-[#60A5FA] font-semibold">
              {isTe ? 'విద్యార్థి ప్రొఫైల్ & భద్రత' : 'Pupil Profile & Session Security'}
            </p>
            <h2 className="font-display text-2xl font-semibold mt-1">{pupil.pupilName}</h2>
            <p className="text-xs text-stone-500 dark:text-slate-400 mt-0.5">{pupil.email}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close account dialog"
            className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-slate-800 text-stone-500 dark:text-slate-400"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-5 space-y-5">
          <div className="grid grid-cols-3 gap-3 py-3 border-y border-stone-200 dark:border-slate-800 text-center">
            <div>
              <p className="font-mono-num text-lg font-semibold">{attemptCount}</p>
              <p className="text-xs text-stone-500 dark:text-slate-400">
                {isTe ? 'మాక్ టెస్టులు' : 'Mock Tests'}
              </p>
            </div>
            <div>
              <p className="font-mono-num text-lg font-semibold">{bookmarkCount}</p>
              <p className="text-xs text-stone-500 dark:text-slate-400">
                {isTe ? 'సేవ్ వార్తలు' : 'Saved Reads'}
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 flex items-center justify-center gap-1">
                <ShieldCheck className="w-4 h-4" />
                <span>{isTe ? 'ధృవీకరించబడింది' : 'Verified'}</span>
              </p>
              <p className="text-xs text-stone-500 dark:text-slate-400">
                {isTe ? 'సురక్షిత సెషన్' : 'Active Session'}
              </p>
            </div>
          </div>

          <div>
            <label
              htmlFor="account-edu-level"
              className="block text-xs font-semibold text-stone-700 dark:text-slate-300 mb-1.5"
            >
              {isTe ? 'విద్యార్హత స్థాయి' : 'Active Education Level'}
            </label>
            <select
              id="account-edu-level"
              value={pupil.educationLevel}
              onChange={(e) => onUpdateEducationLevel(e.target.value as EducationLevel)}
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-stone-300 dark:border-slate-700 bg-[#FAF8F3] dark:bg-[#0E1116]"
            >
              {(Object.keys(EDUCATION_LEVEL_LABELS) as EducationLevel[]).map((lvl) => (
                <option key={lvl} value={lvl}>
                  {isTe ? EDUCATION_LEVEL_LABELS[lvl].te : EDUCATION_LEVEL_LABELS[lvl].en}
                </option>
              ))}
            </select>
          </div>

          {!pupil.hasPassword && (
            <form
              onSubmit={handlePasswordSave}
              className="p-4 rounded-lg border border-stone-200 dark:border-slate-800 bg-[#FAF8F3] dark:bg-[#0E1116] space-y-2.5"
            >
              <label
                htmlFor="account-set-password"
                className="block text-xs font-semibold text-stone-700 dark:text-slate-200"
              >
                {isTe
                  ? 'ఇమెయిల్ లాగిన్ కోసం పాస్‌వర్డ్ సెట్ చేయండి'
                  : 'Set Password for Email Sign-In'}
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="account-set-password"
                  type="password"
                  minLength={8}
                  maxLength={128}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder={isTe ? 'కనీసం 8 అక్షరాలు' : 'Min 8 characters'}
                  className="flex-1 px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-slate-700 bg-white dark:bg-[#161B22]"
                />
                <button
                  type="submit"
                  disabled={pwdBusy || newPassword.length < 8}
                  className="px-3 py-2 text-xs font-semibold rounded-lg bg-[#1D4ED8] hover:bg-[#1E40AF] disabled:opacity-50 text-white whitespace-nowrap shrink-0"
                >
                  {pwdBusy ? '...' : isTe ? 'సేవ్ చేయండి' : 'Save Password'}
                </button>
              </div>
              {pwdMsg && <p className="text-xs text-stone-600 dark:text-slate-300">{pwdMsg}</p>}
            </form>
          )}

          <div className="p-4 rounded-lg border border-stone-200 dark:border-slate-800 bg-[#FAF8F3] dark:bg-[#0E1116]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold flex items-center gap-1.5">
                  <Cloud className="w-4 h-4 text-[#1D4ED8] dark:text-[#60A5FA]" />
                  <span>
                    {isTe ? 'Firebase క్లౌడ్ సమకాలీకరణ' : 'Cloud Firestore Backup'}
                  </span>
                </p>
                <p className="text-xs text-stone-500 dark:text-slate-400 mt-1">
                  {cloudUserEmail
                    ? `${isTe ? 'అనుసంధానించబడింది:' : 'Synced to'} ${cloudUserEmail}`
                    : isTe
                      ? 'మీ స్కోర్లు మరియు బుక్‌మార్క్‌లను క్లౌడ్‌లో భద్రపరచడానికి Google ఖాతాను లింక్ చేయండి.'
                      : 'Link Google Cloud Auth to persist mock test scores and bookmarks across devices.'}
                </p>
              </div>
              {!cloudUserEmail && (
                <button
                  type="button"
                  disabled={busy}
                  onClick={handleCloudLink}
                  className="px-3 py-2 text-xs font-semibold rounded-lg bg-[#1D4ED8] text-white hover:bg-[#1E40AF] whitespace-nowrap shrink-0"
                >
                  {busy ? '...' : isTe ? 'లింక్ చేయండి' : 'Sync Cloud'}
                </button>
              )}
            </div>
            {statusMsg && (
              <p className="mt-2 text-xs text-stone-600 dark:text-slate-300">{statusMsg}</p>
            )}
          </div>

          <div className="pt-2 flex items-center justify-end">
            <button
              type="button"
              onClick={() => onLogout(true)}
              className="px-4 py-2 text-xs font-semibold rounded-lg border border-red-300 dark:border-red-900/70 text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{isTe ? 'లాగ్ అవుట్' : 'Log Out'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
