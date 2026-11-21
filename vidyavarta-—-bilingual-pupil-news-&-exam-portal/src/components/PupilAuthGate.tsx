import React, { useState } from 'react';
import {
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  LogIn,
  Mail,
  Moon,
  ShieldCheck,
  Sun,
  UserPlus,
} from 'lucide-react';
import { EDUCATION_LEVEL_LABELS, IMAGE_ASSETS } from '../data/bilingualContent';
import { signInWithGoogleCloud, syncPupilToFirestore } from '../lib/firebase';
import { apiJsonRequest } from '../lib/http';
import {
  isBackendMissingStatus,
  localLoginWithPassword,
  localRegisterWithPassword,
  localRequestOtp,
  localVerifyOtp,
} from '../lib/portalLocalAuth';
import type { EducationLevel, LanguageMode, PupilSession, ThemeMode } from '../types/portal';

interface PupilAuthGateProps {
  lang: LanguageMode;
  theme: ThemeMode;
  onLangChange: (lang: LanguageMode) => void;
  onThemeToggle: () => void;
  onAuthenticated: (pupil: PupilSession) => void;
}

type AuthTab = 'signin' | 'register' | 'otp';

export function PupilAuthGate({
  lang,
  theme,
  onLangChange,
  onThemeToggle,
  onAuthenticated,
}: PupilAuthGateProps) {
  const [authTab, setAuthTab] = useState<AuthTab>('signin');
  const [pupilName, setPupilName] = useState('');
  const [educationLevel, setEducationLevel] = useState<EducationLevel>('competitive_aspirant');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [otpStep, setOtpStep] = useState<'details' | 'otp'>('details');
  const [challengeId, setChallengeId] = useState('');
  const [dispatchPreviewOtp, setDispatchPreviewOtp] = useState('');
  const [otpInput, setOtpInput] = useState('');

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imgFailed, setImgFailed] = useState(false);

  const isTe = lang === 'te';

  function switchTab(next: AuthTab) {
    setAuthTab(next);
    setOtpStep('details');
    setError(null);
  }

  async function handleGoogleSignIn() {
    setError(null);
    setGoogleLoading(true);
    try {
      const user = await signInWithGoogleCloud();
      if (!user.emailVerified || !user.email) {
        throw new Error(
          isTe
            ? 'ధృవీకరించబడిన Google ఇమెయిల్ ఖాతా అవసరం.'
            : 'A verified Google email address is required.'
        );
      }

      const idToken = await user.getIdToken();
      const result = await apiJsonRequest<{
        error?: string;
        authenticated?: boolean;
        pupil?: PupilSession;
      }>('/api/auth/google', {
        method: 'POST',
        body: {
          idToken,
          educationLevel,
        },
      });

      const resolvedPupil: PupilSession =
        !isBackendMissingStatus(result.status) && result.ok && result.data?.pupil
          ? result.data.pupil
          : {
              pupilName: (user.displayName || user.email.split('@')[0]).slice(0, 80),
              email: user.email,
              educationLevel,
              preferredLang: lang,
              preferredTheme: theme,
              refreshIntervalSec: 120,
              otpVerified: true,
              verifiedAt: new Date().toISOString(),
              sessionStable: true,
              cloudUid: user.uid,
              hasPassword: false,
            };

      if (!isBackendMissingStatus(result.status) && (!result.ok || !result.data?.authenticated)) {
        throw new Error(result.errorMessage || 'Google authentication failed.');
      }

      try {
        await syncPupilToFirestore({
          uid: user.uid,
          pupilName: resolvedPupil.pupilName,
          email: resolvedPupil.email,
          educationLevel: resolvedPupil.educationLevel,
          preferredLang: resolvedPupil.preferredLang,
          preferredTheme: resolvedPupil.preferredTheme,
          refreshIntervalSec: resolvedPupil.refreshIntervalSec,
          otpVerified: true,
        });
      } catch (cloudErr) {
        console.error('Firestore profile sync warning:', cloudErr);
      }

      onAuthenticated(resolvedPupil);
    } catch (err) {
      const code =
        typeof err === 'object' && err !== null && 'code' in err
          ? String((err as { code?: unknown }).code || '')
          : '';
      const rawMsg = err instanceof Error ? err.message : '';
      if (code === 'auth/unauthorized-domain' || rawMsg.includes('auth/unauthorized-domain')) {
        const host = typeof window !== 'undefined' ? window.location.hostname : 'this domain';
        setError(
          isTe
            ? `ఈ డొమైన్ (${host}) Firebase Auth అనుమతించిన డొమైన్‌ల జాబితాలో లేదు. దయచేసి దిగువ ఇమెయిల్ & పాస్‌వర్డ్ లేదా OTP తో సైన్ ఇన్ చేయండి.`
            : `Domain "${host}" is not listed in Firebase Auth Authorized Domains. Add it in Firebase Console → Authentication → Settings → Authorized domains, or sign in below using Email & Password.`
        );
      } else if (code === 'auth/popup-blocked' || rawMsg.includes('auth/popup-blocked')) {
        setError(
          isTe
            ? 'బ్రౌజర్ Google సైన్-ఇన్ పాప్-అప్‌ను బ్లాక్ చేసింది. పాప్-అప్‌లను అనుమతించండి లేదా దిగువ ఇమెయిల్ & పాస్‌వర్డ్ ఉపయోగించండి.'
            : 'Pop-up was blocked by your browser. Allow pop-ups for this site or sign in below using Email & Password.'
        );
      } else if (
        code === 'auth/popup-closed-by-user' ||
        code === 'auth/cancelled-popup-request' ||
        rawMsg.includes('popup-closed-by-user')
      ) {
        setError(
          isTe
            ? 'Google సైన్-ఇన్ విండో మూసివేయబడింది. మళ్లీ ప్రయత్నించండి.'
            : 'Google sign-in window was closed before completing login. Please try again.'
        );
      } else {
        setError(
          err instanceof Error
            ? err.message
            : isTe
              ? 'Google లాగిన్ విఫలమైంది.'
              : 'Google sign-in could not be completed.'
        );
      }
    } finally {
      setGoogleLoading(false);
    }
  }

  async function handlePasswordSignIn(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const cleanEmail = email.trim();
      const result = await apiJsonRequest<{
        error?: string;
        authenticated?: boolean;
        pupil?: PupilSession;
      }>('/api/auth/login', {
        method: 'POST',
        body: {
          email: cleanEmail,
          password,
        },
      });

      const data = isBackendMissingStatus(result.status)
        ? await localLoginWithPassword({ email: cleanEmail, password })
        : result.ok && result.data
          ? { ok: true, ...result.data }
          : { ok: false, error: result.errorMessage || 'Sign-in failed.' };

      if (!data.ok || !data.authenticated || !data.pupil) {
        throw new Error(data.error || 'Invalid email or password.');
      }
      onAuthenticated(data.pupil);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateAccount(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError(
        isTe
          ? 'పాస్‌వర్డ్ కనీసం 8 అక్షరాలు ఉండాలి.'
          : 'Password must be at least 8 characters.'
      );
      return;
    }
    if (password !== confirmPassword) {
      setError(
        isTe
          ? 'రెండు పాస్‌వర్డ్‌లు సరిపోలడం లేదు.'
          : 'Passwords do not match.'
      );
      return;
    }

    setLoading(true);
    try {
      const cleanName = pupilName.trim();
      const cleanEmail = email.trim();
      const result = await apiJsonRequest<{
        error?: string;
        authenticated?: boolean;
        pupil?: PupilSession;
      }>('/api/auth/register', {
        method: 'POST',
        body: {
          pupilName: cleanName,
          educationLevel,
          email: cleanEmail,
          password,
        },
      });

      const data = isBackendMissingStatus(result.status)
        ? await localRegisterWithPassword({
            pupilName: cleanName,
            educationLevel,
            email: cleanEmail,
            password,
          })
        : result.ok && result.data
          ? { ok: true, ...result.data }
          : { ok: false, error: result.errorMessage || 'Account creation failed.' };

      if (!data.ok || !data.authenticated || !data.pupil) {
        throw new Error(data.error || 'Account creation failed.');
      }
      onAuthenticated(data.pupil);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Account creation failed.');
    } finally {
      setLoading(false);
    }
  }

  async function handleRequestOtp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = await apiJsonRequest<{
        error?: string;
        status?: string;
        pupil?: PupilSession;
        challengeId?: string;
        dispatchPreviewOtp?: string;
      }>('/api/auth/request-otp', {
        method: 'POST',
        body: {
          pupilName: pupilName.trim(),
          educationLevel,
          email: email.trim(),
        },
      });
      const data = isBackendMissingStatus(result.status)
        ? await localRequestOtp({
            pupilName: pupilName.trim(),
            educationLevel,
            email: email.trim(),
          })
        : result.ok && result.data
          ? { ok: true, ...result.data }
          : { ok: false, error: result.errorMessage || 'Verification request failed.' };
      if (!data.ok) {
        throw new Error(data.error || 'Verification request failed.');
      }
      setChallengeId(data.challengeId || '');
      setDispatchPreviewOtp(data.dispatchPreviewOtp || '');
      setOtpInput('');
      setOtpStep('otp');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to request passcode.');
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = await apiJsonRequest<{
        error?: string;
        authenticated?: boolean;
        pupil?: PupilSession;
      }>('/api/auth/verify-otp', {
        method: 'POST',
        body: {
          challengeId,
          email: email.trim(),
          otp: otpInput.trim(),
        },
      });
      const data = isBackendMissingStatus(result.status)
        ? await localVerifyOtp({
            challengeId,
            email: email.trim(),
            otp: otpInput.trim(),
          })
        : result.ok && result.data
          ? { ok: true, ...result.data }
          : { ok: false, error: result.errorMessage || 'OTP verification failed.' };
      if (!data.ok) {
        throw new Error(data.error || 'OTP verification failed.');
      }
      if (data.authenticated && data.pupil) {
        onAuthenticated(data.pupil);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid passcode.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF8F3] dark:bg-[#0E1116] text-[#171513] dark:text-[#F1F5F9] flex flex-col">
      {/* Compact top utility strip */}
      <header className="w-full max-w-[1360px] mx-auto px-6 py-5 flex items-center justify-between gap-8 border-b border-stone-200 dark:border-slate-800">
        <span className="font-display text-xl font-bold tracking-tight whitespace-nowrap shrink-0">
          {isTe ? 'BCR కరెంట్ అఫైర్స్' : 'BCR Current Affairs'}
        </span>

        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1 p-1 bg-stone-200/70 dark:bg-slate-800/80 rounded-lg">
            {(['en', 'te', 'bilingual'] as LanguageMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => onLangChange(mode)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  lang === mode
                    ? 'bg-white dark:bg-slate-900 text-[#171513] dark:text-white shadow-sm'
                    : 'text-stone-600 dark:text-slate-300 hover:text-[#171513] dark:hover:text-white'
                }`}
              >
                {mode === 'en' ? 'English' : mode === 'te' ? 'తెలుగు' : 'Dual EN/తె'}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={onThemeToggle}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="p-2 rounded-lg border border-stone-200 dark:border-slate-800 bg-white dark:bg-[#161B22] text-stone-700 dark:text-slate-200 hover:bg-stone-100 dark:hover:bg-slate-800 transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Main split editorial portal */}
      <main className="flex-1 w-full max-w-[1360px] mx-auto px-6 py-10 lg:py-14 grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
        {/* Editorial Left Panel */}
        <section className="lg:col-span-6 flex flex-col justify-between bg-white dark:bg-[#161B22] border border-stone-200 dark:border-slate-800 rounded-xl overflow-hidden">
          <div className="p-8 lg:p-10">
            <p className="text-xs uppercase tracking-widest text-[#1D4ED8] dark:text-[#60A5FA] font-semibold">
              {isTe
                ? 'ద్విభాషా విద్యార్థి వార్తలు & పోటీ పరీక్షల వేదిక'
                : 'Bilingual Current Affairs & Competitive Exam Desk'}
            </p>
            <h1 className="font-display text-3xl lg:text-4xl font-semibold tracking-tight mt-3 text-balance leading-tight">
              {isTe
                ? 'తెలుగు, ఇంగ్లీష్ భాషల్లో రోజువారీ వార్తలు మరియు పరీక్షల సన్నద్ధత'
                : 'Verified bilingual news, regional intelligence, and mock exams in one scholar portal.'}
            </h1>
            <p className="mt-4 text-sm lg:text-base text-stone-600 dark:text-slate-300 leading-relaxed max-w-xl">
              {isTe
                ? 'మీ స్వంత ఖాతా వివరాలు లేదా Google ఖాతాతో సురక్షితంగా లాగిన్ అవ్వండి. మీ అధ్యయన సెషన్ సమాచారం మాత్రమే ప్రాసెస్ చేయబడుతుంది.'
                : 'Sign in with your own email & password, Google credentials, or a single-use passcode. Your study tools process only information relevant to your active session.'}
            </p>

            <div className="mt-6 pt-6 border-t border-stone-200 dark:border-slate-800 grid grid-cols-3 gap-4 text-xs">
              <div>
                <p className="font-semibold text-[#171513] dark:text-slate-100">
                  {isTe ? 'వార్తా విభాగాలు' : 'Regional to Global'}
                </p>
                <p className="text-stone-500 dark:text-slate-400 mt-1">
                  {isTe ? 'AP & TS, జాతీయ, అంతర్జాతీయ' : 'AP & TS · National · World'}
                </p>
              </div>
              <div>
                <p className="font-semibold text-[#171513] dark:text-slate-100">
                  {isTe ? 'పోటీ పరీక్షలు' : 'Exam Tracks'}
                </p>
                <p className="text-stone-500 dark:text-slate-400 mt-1">
                  UPSC · APPSC · TSPSC · SSC
                </p>
              </div>
              <div>
                <p className="font-semibold text-[#171513] dark:text-slate-100">
                  {isTe ? 'అధ్యయన సాధనాలు' : 'AI & Visual Aids'}
                </p>
                <p className="text-stone-500 dark:text-slate-400 mt-1">
                  {isTe ? 'AI ట్యూటర్ · పదకోశం · క్విజ్' : 'Tutor · Infographics · Glossary'}
                </p>
              </div>
            </div>
          </div>

          <div className="relative h-60 lg:h-72 w-full bg-stone-100 dark:bg-slate-900 border-t border-stone-200 dark:border-slate-800">
            {!imgFailed ? (
              <img
                src={IMAGE_ASSETS.examAtlas}
                alt="Scholar desk with geographical atlas and competitive exam study notes"
                referrerPolicy="no-referrer"
                onError={() => setImgFailed(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-sm text-stone-500 dark:text-slate-400">
                BCR Current Affairs Editorial Desk
              </div>
            )}
          </div>
        </section>

        {/* Authentication Right Panel */}
        <section className="lg:col-span-6 bg-white dark:bg-[#161B22] border border-stone-200 dark:border-slate-800 rounded-xl p-8 lg:p-10 flex flex-col justify-center">
          <div className="mb-6">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-slate-400">
              <ShieldCheck className="w-4 h-4 text-[#1D4ED8] dark:text-[#60A5FA]" />
              <span>
                {isTe ? 'విద్యార్థి ఖాతా ప్రవేశం' : 'Personal Credential Access'}
              </span>
            </div>
            <h2 className="font-display text-2xl font-semibold mt-1">
              {authTab === 'register'
                ? isTe
                  ? 'కొత్త ఖాతాను సృష్టించండి'
                  : 'Create Your Account'
                : authTab === 'otp'
                  ? isTe
                    ? 'ఒకేసారి OTP ద్వారా ప్రవేశం'
                    : 'Verify With One-Time Code'
                  : isTe
                    ? 'మీ ఖాతాలోకి సైన్ ఇన్ చేయండి'
                    : 'Sign In With Your Credentials'}
            </h2>
          </div>

          {/* Primary Google Sign-In Button */}
          <button
            type="button"
            disabled={googleLoading || loading}
            onClick={() => void handleGoogleSignIn()}
            className="w-full py-2.5 px-4 rounded-lg border border-stone-300 dark:border-slate-700 bg-[#FAF8F3] dark:bg-[#0E1116] hover:border-[#1D4ED8] dark:hover:border-[#60A5FA] text-sm font-semibold flex items-center justify-center gap-2.5 transition-colors disabled:opacity-60"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span>
              {googleLoading
                ? isTe
                  ? 'Google తో కనెక్ట్ అవుతోంది...'
                  : 'Connecting Google Account...'
                : isTe
                  ? 'Google తో కొనసాగండి'
                  : 'Continue with Google'}
            </span>
          </button>

          <div className="my-5 flex items-center gap-3 text-xs text-stone-400 dark:text-slate-500">
            <div className="flex-1 h-px bg-stone-200 dark:bg-slate-800" />
            <span>{isTe ? 'లేదా ఇమెయిల్‌తో' : 'OR USE YOUR EMAIL'}</span>
            <div className="flex-1 h-px bg-stone-200 dark:bg-slate-800" />
          </div>

          {/* Auth Mode Tabs */}
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-stone-100 dark:bg-[#0E1116] border border-stone-200 dark:border-slate-800 rounded-lg mb-5">
            {(
              [
                { id: 'signin', en: 'Sign In', te: 'సైన్ ఇన్' },
                { id: 'register', en: 'Create Account', te: 'కొత్త ఖాతా' },
                { id: 'otp', en: 'One-Time Code', te: 'OTP కోడ్' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => switchTab(tab.id)}
                className={`py-2 px-2 text-xs font-semibold rounded-md transition-colors ${
                  authTab === tab.id
                    ? 'bg-white dark:bg-[#161B22] text-[#1D4ED8] dark:text-[#60A5FA] shadow-sm'
                    : 'text-stone-600 dark:text-slate-400 hover:text-[#171513] dark:hover:text-white'
                }`}
              >
                {isTe ? tab.te : tab.en}
              </button>
            ))}
          </div>

          {/* Tab 1: Sign In with Email + Password */}
          {authTab === 'signin' && (
            <form onSubmit={handlePasswordSignIn} className="space-y-4">
              <div>
                <label
                  htmlFor="signin-email"
                  className="block text-xs font-semibold text-stone-700 dark:text-slate-200 mb-1.5"
                >
                  {isTe ? 'ఇమెయిల్ చిరునామా' : 'Email Address'}
                </label>
                <input
                  id="signin-email"
                  type="email"
                  required
                  autoComplete="email"
                  maxLength={160}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-stone-300 dark:border-slate-700 bg-white dark:bg-[#0E1116] text-[#171513] dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#1D4ED8] dark:focus:ring-[#60A5FA]"
                />
              </div>

              <div>
                <label
                  htmlFor="signin-password"
                  className="block text-xs font-semibold text-stone-700 dark:text-slate-200 mb-1.5"
                >
                  {isTe ? 'పాస్‌వర్డ్' : 'Password'}
                </label>
                <div className="relative">
                  <input
                    id="signin-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={8}
                    maxLength={128}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-3.5 pr-10 py-2.5 text-sm rounded-lg border border-stone-300 dark:border-slate-700 bg-white dark:bg-[#0E1116] text-[#171513] dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#1D4ED8] dark:focus:ring-[#60A5FA]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-stone-500 hover:text-[#171513] dark:hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div
                  role="alert"
                  className="p-3 rounded-lg border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/40 text-xs text-red-800 dark:text-red-300"
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || googleLoading}
                className="w-full py-2.5 px-4 rounded-lg bg-[#1D4ED8] hover:bg-[#1E40AF] disabled:opacity-60 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span>
                  {loading
                    ? isTe
                      ? 'లాగిన్ అవుతోంది...'
                      : 'Signing In...'
                    : isTe
                      ? 'సైన్ ఇన్ చేయండి'
                      : 'Sign In'}
                </span>
              </button>
            </form>
          )}

          {/* Tab 2: Create Account (Register with Email & Password) */}
          {authTab === 'register' && (
            <form onSubmit={handleCreateAccount} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label
                    htmlFor="reg-name"
                    className="block text-xs font-semibold text-stone-700 dark:text-slate-200 mb-1.5"
                  >
                    {isTe ? 'విద్యార్థి పేరు' : 'Full Name'}
                  </label>
                  <input
                    id="reg-name"
                    type="text"
                    required
                    minLength={2}
                    maxLength={80}
                    value={pupilName}
                    onChange={(e) => setPupilName(e.target.value)}
                    placeholder={isTe ? 'ఉదా: కిరణ్ కుమార్' : 'e.g., Ananya Sharma'}
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-stone-300 dark:border-slate-700 bg-white dark:bg-[#0E1116] text-[#171513] dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#1D4ED8] dark:focus:ring-[#60A5FA]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="reg-level"
                    className="block text-xs font-semibold text-stone-700 dark:text-slate-200 mb-1.5"
                  >
                    {isTe ? 'విద్యార్హత స్థాయి' : 'Education Level'}
                  </label>
                  <select
                    id="reg-level"
                    value={educationLevel}
                    onChange={(e) => setEducationLevel(e.target.value as EducationLevel)}
                    className="w-full px-3 py-2.5 text-sm rounded-lg border border-stone-300 dark:border-slate-700 bg-white dark:bg-[#0E1116] text-[#171513] dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#1D4ED8] dark:focus:ring-[#60A5FA]"
                  >
                    {(Object.keys(EDUCATION_LEVEL_LABELS) as EducationLevel[]).map((lvl) => (
                      <option key={lvl} value={lvl}>
                        {isTe ? EDUCATION_LEVEL_LABELS[lvl].te : EDUCATION_LEVEL_LABELS[lvl].en}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="reg-email"
                  className="block text-xs font-semibold text-stone-700 dark:text-slate-200 mb-1.5"
                >
                  {isTe ? 'ఇమెయిల్ చిరునామా' : 'Email Address'}
                </label>
                <input
                  id="reg-email"
                  type="email"
                  required
                  autoComplete="email"
                  maxLength={160}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-stone-300 dark:border-slate-700 bg-white dark:bg-[#0E1116] text-[#171513] dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#1D4ED8] dark:focus:ring-[#60A5FA]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label
                    htmlFor="reg-password"
                    className="block text-xs font-semibold text-stone-700 dark:text-slate-200 mb-1.5"
                  >
                    {isTe ? 'పాస్‌వర్డ్ (కనీసం 8 అక్షరాలు)' : 'Password (min 8 chars)'}
                  </label>
                  <div className="relative">
                    <input
                      id="reg-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={8}
                      maxLength={128}
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-3.5 pr-9 py-2.5 text-sm rounded-lg border border-stone-300 dark:border-slate-700 bg-white dark:bg-[#0E1116] text-[#171513] dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#1D4ED8] dark:focus:ring-[#60A5FA]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-stone-500"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="reg-confirm"
                    className="block text-xs font-semibold text-stone-700 dark:text-slate-200 mb-1.5"
                  >
                    {isTe ? 'పాస్‌వర్డ్ నిర్ధారణ' : 'Confirm Password'}
                  </label>
                  <input
                    id="reg-confirm"
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={8}
                    maxLength={128}
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-stone-300 dark:border-slate-700 bg-white dark:bg-[#0E1116] text-[#171513] dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#1D4ED8] dark:focus:ring-[#60A5FA]"
                  />
                </div>
              </div>

              {error && (
                <div
                  role="alert"
                  className="p-3 rounded-lg border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/40 text-xs text-red-800 dark:text-red-300"
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || googleLoading}
                className="w-full py-2.5 px-4 rounded-lg bg-[#1D4ED8] hover:bg-[#1E40AF] disabled:opacity-60 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                <span>
                  {loading
                    ? isTe
                      ? 'ఖాతా సృష్టిస్తోంది...'
                      : 'Creating Account...'
                    : isTe
                      ? 'ఖాతా సృష్టించి ప్రవేశించండి'
                      : 'Create Account & Enter Portal'}
                </span>
              </button>
            </form>
          )}

          {/* Tab 3: One-Time Passcode (OTP) Sign-In */}
          {authTab === 'otp' &&
            (otpStep === 'details' ? (
              <form onSubmit={handleRequestOtp} className="space-y-4">
                <div>
                  <label
                    htmlFor="pupil-name"
                    className="block text-xs font-semibold text-stone-700 dark:text-slate-200 mb-1.5"
                  >
                    {isTe ? 'విద్యార్థి పేరు (Pupil Name)' : 'Pupil Name'}
                  </label>
                  <input
                    id="pupil-name"
                    type="text"
                    required
                    minLength={2}
                    maxLength={80}
                    value={pupilName}
                    onChange={(e) => setPupilName(e.target.value)}
                    placeholder={isTe ? 'ఉదా: కిరణ్ కుమార్' : 'e.g., Ananya Sharma'}
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-stone-300 dark:border-slate-700 bg-white dark:bg-[#0E1116] text-[#171513] dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#1D4ED8] dark:focus:ring-[#60A5FA]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="education-level"
                    className="block text-xs font-semibold text-stone-700 dark:text-slate-200 mb-1.5"
                  >
                    {isTe ? 'విద్యార్హత స్థాయి (Education Level)' : 'Education Level'}
                  </label>
                  <select
                    id="education-level"
                    value={educationLevel}
                    onChange={(e) => setEducationLevel(e.target.value as EducationLevel)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-stone-300 dark:border-slate-700 bg-white dark:bg-[#0E1116] text-[#171513] dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#1D4ED8] dark:focus:ring-[#60A5FA]"
                  >
                    {(Object.keys(EDUCATION_LEVEL_LABELS) as EducationLevel[]).map((lvl) => (
                      <option key={lvl} value={lvl}>
                        {isTe
                          ? `${EDUCATION_LEVEL_LABELS[lvl].te} — ${EDUCATION_LEVEL_LABELS[lvl].en}`
                          : `${EDUCATION_LEVEL_LABELS[lvl].en} (${EDUCATION_LEVEL_LABELS[lvl].te})`}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="pupil-email"
                    className="block text-xs font-semibold text-stone-700 dark:text-slate-200 mb-1.5"
                  >
                    {isTe ? 'ఇమెయిల్ చిరునామా (Email Address)' : 'Email Address'}
                  </label>
                  <input
                    id="pupil-email"
                    type="email"
                    required
                    maxLength={160}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="pupil@school.edu"
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-stone-300 dark:border-slate-700 bg-white dark:bg-[#0E1116] text-[#171513] dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#1D4ED8] dark:focus:ring-[#60A5FA]"
                  />
                </div>

                {error && (
                  <div
                    role="alert"
                    className="p-3 rounded-lg border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/40 text-xs text-red-800 dark:text-red-300"
                  >
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || googleLoading}
                  className="w-full py-2.5 px-4 rounded-lg bg-[#1D4ED8] hover:bg-[#1E40AF] disabled:opacity-60 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>
                    {loading
                      ? isTe
                        ? 'పరిశీలిస్తోంది...'
                        : 'Generating...'
                      : isTe
                        ? 'ఒకసారి OTP పొందండి'
                        : 'Send One-Time Passcode'}
                  </span>
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1D4ED8] dark:text-[#60A5FA]">
                  <Mail className="w-4 h-4" />
                  <span>{isTe ? '6-అంకెల OTP ధృవీకరణ' : 'Verify 6-Digit Passcode'}</span>
                </div>

                {dispatchPreviewOtp && (
                  <div className="p-4 rounded-lg border border-stone-200 dark:border-slate-700 bg-[#FAF8F3] dark:bg-[#0E1116]">
                    <p className="text-xs font-semibold text-stone-700 dark:text-slate-200">
                      {isTe ? 'ధృవీకరణ కోడ్ రసీదు' : 'Single-Use Dispatch Receipt'}
                    </p>
                    <p className="mt-1.5 font-mono-num text-2xl font-semibold tracking-[0.25em] text-[#1D4ED8] dark:text-[#60A5FA]">
                      {dispatchPreviewOtp}
                    </p>
                  </div>
                )}

                <div>
                  <label
                    htmlFor="otp-input"
                    className="block text-xs font-semibold text-stone-700 dark:text-slate-200 mb-1.5"
                  >
                    {isTe ? '6-అంకెల పాస్‌కోడ్' : '6-Digit Passcode'}
                  </label>
                  <input
                    id="otp-input"
                    type="text"
                    inputMode="numeric"
                    pattern="\d{6}"
                    maxLength={6}
                    required
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                    className="w-full px-4 py-3 font-mono-num text-lg tracking-[0.35em] rounded-lg border border-stone-300 dark:border-slate-700 bg-white dark:bg-[#0E1116] text-[#171513] dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#1D4ED8] dark:focus:ring-[#60A5FA]"
                  />
                </div>

                {error && (
                  <div
                    role="alert"
                    className="p-3 rounded-lg border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/40 text-xs text-red-800 dark:text-red-300"
                  >
                    {error}
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setOtpStep('details');
                      setError(null);
                    }}
                    className="px-4 py-2.5 rounded-lg border border-stone-300 dark:border-slate-700 text-xs font-semibold hover:bg-stone-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    {isTe ? 'వెనుకకు' : 'Back'}
                  </button>
                  <button
                    type="submit"
                    disabled={loading || otpInput.length !== 6}
                    className="flex-1 py-2.5 px-4 rounded-lg bg-[#1D4ED8] hover:bg-[#1E40AF] disabled:opacity-60 text-white text-sm font-semibold transition-colors"
                  >
                    {loading
                      ? isTe
                        ? 'ధృవీకరిస్తోంది...'
                        : 'Validating...'
                      : isTe
                        ? 'ధృవీకరించి ప్రవేశించండి'
                        : 'Verify & Enter Portal'}
                  </button>
                </div>
              </form>
            ))}

          <p className="mt-5 pt-4 border-t border-stone-200 dark:border-slate-800 text-[11px] text-stone-500 dark:text-slate-400 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 shrink-0" />
            <span>
              {isTe
                ? 'AI ట్యూటర్ మీ సెషన్‌కు సంబంధించిన అధ్యయన సమాచారాన్ని మాత్రమే ఉపయోగిస్తుంది; వ్యక్తిగత వివరాలు లేదా API కీలను ఎప్పుడూ చూపదు.'
                : 'Session-scoped privacy: AI features process only study context for your active session with no PII or secret exposure.'}
            </span>
          </p>
        </section>
      </main>
    </div>
  );
}
