import React, { useCallback, useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { LogOut, Moon, RefreshCw, Search, Sun, User as UserIcon } from 'lucide-react';
import { AiTutorPanel } from './components/AiTutorPanel';
import { ExamPrepHub } from './components/ExamPrepHub';
import { GlossaryWorkspace, InfographicsWorkspace } from './components/InfographicsAndGlossary';
import { NewsWorkspace } from './components/NewsWorkspace';
import { PupilAccountModal } from './components/PupilAccountModal';
import { PupilAuthGate } from './components/PupilAuthGate';
import { WebSourceModal } from './components/WebSourceModal';
import { getUiCopy, NEWS_ARTICLES } from './data/bilingualContent';
import {
  auth,
  deleteBookmarkFromFirestore,
  fetchCloudPupilRecords,
  saveBookmarkToFirestore,
  saveMockAttemptToFirestore,
  saveQuizRecordToFirestore,
  signInWithGoogleCloud,
  signOutFirebaseCloud,
  syncPupilToFirestore,
  testConnection,
  updateFirestorePreferences,
} from './lib/firebase';
import { apiJsonRequest, clearPortalTokens } from './lib/http';
import { extractReadableApiError } from './lib/localAiMentor';
import {
  isBackendMissingStatus,
  localGetRecords,
  localGetSession,
  localLogout,
  localRecordAttempt,
  localSetPassword,
  localSyncVerifiedPupil,
  localToggleBookmark,
  localUpdatePreferences,
} from './lib/portalLocalAuth';
import type {
  EducationLevel,
  GroundedBriefingItem,
  GroundingSource,
  LanguageMode,
  LiveBriefingPayload,
  MockTestAttemptRecord,
  NewsArticle,
  NewsCategory,
  PupilSession,
  RefreshIntervalSec,
  ThemeMode,
} from './types/portal';

type ActiveSection = 'dispatch' | 'exams' | 'infographics' | 'glossary' | 'tutor';

export default function App() {
  const [bootLoading, setBootLoading] = useState(true);
  const [pupil, setPupil] = useState<PupilSession | null>(null);

  const [lang, setLang] = useState<LanguageMode>('bilingual');
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [refreshSec, setRefreshSec] = useState<RefreshIntervalSec>(120);
  const [countdownSec, setCountdownSec] = useState<number>(120);

  const [activeSection, setActiveSection] = useState<ActiveSection>('dispatch');
  const [selectedCategory, setSelectedCategory] = useState<'all' | NewsCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [articles, setArticles] = useState<NewsArticle[]>(NEWS_ARTICLES);
  const [breakingArticles, setBreakingArticles] = useState<NewsArticle[]>(
    NEWS_ARTICLES.filter((a) => a.isBreaking)
  );
  const [lastRefreshedAt, setLastRefreshedAt] = useState<string>(new Date().toISOString());
  const [refreshingNews, setRefreshingNews] = useState(false);

  const [liveBriefing, setLiveBriefing] = useState<LiveBriefingPayload | null>(null);
  const [liveBriefingLoading, setLiveBriefingLoading] = useState(false);
  const [liveBriefingError, setLiveBriefingError] = useState<string | null>(null);

  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [attempts, setAttempts] = useState<MockTestAttemptRecord[]>([]);
  const [accountOpen, setAccountOpen] = useState(false);
  const [sourceModalOpen, setSourceModalOpen] = useState(false);

  const [cloudUser, setCloudUser] = useState<User | null>(null);
  const [pendingAiPrompt, setPendingAiPrompt] = useState<{
    prompt: string;
    context: string;
    id: number;
  } | null>(null);

  // Sync dark mode class on <html>
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Startup connection check & Firebase auth observer
  useEffect(() => {
    void testConnection();
    const unsub = onAuthStateChanged(auth, async (user) => {
      setCloudUser(user);
      if (user && user.emailVerified) {
        try {
          const cloudData = await fetchCloudPupilRecords(user.uid);
          if (cloudData.attempts.length > 0) {
            setAttempts((prev) => {
              const map = new Map<string, MockTestAttemptRecord>();
              [...cloudData.attempts, ...prev].forEach((a) => map.set(a.id, a));
              return Array.from(map.values());
            });
          }
          if (cloudData.bookmarkedIds.length > 0) {
            setBookmarks((prev) => Array.from(new Set([...prev, ...cloudData.bookmarkedIds])));
          }
        } catch (err) {
          console.error('Cloud record read error:', err);
        }
      }
    });
    return () => unsub();
  }, []);

  // Restore verified session without repeat OTP (works across cookies, Bearer tokens, and static hosts)
  useEffect(() => {
    let active = true;
    async function initSession() {
      try {
        const result = await apiJsonRequest<{
          authenticated?: boolean;
          pupil?: PupilSession;
        }>('/api/auth/session');
        if (!active) return;

        if (isBackendMissingStatus(result.status)) {
          const localData = localGetSession();
          if (localData.authenticated && localData.pupil) {
            applyAuthenticatedPupil(localData.pupil);
          }
          return;
        }

        const data = result.data;
        if (result.ok && data?.authenticated && data.pupil) {
          applyAuthenticatedPupil(data.pupil);
          return;
        }

        // Backend is reachable and reports no authenticated session: clear stale local active marker
        // so users sign in explicitly with their own credentials.
        localLogout(false);
      } catch (err) {
        console.error('Failed to check session:', err);
      } finally {
        if (active) setBootLoading(false);
      }
    }
    void initSession();
    return () => {
      active = false;
    };
  }, []);

  function applyAuthenticatedPupil(nextPupil: PupilSession) {
    localSyncVerifiedPupil(nextPupil);
    setPupil(nextPupil);
    setLang(nextPupil.preferredLang || 'bilingual');
    setTheme(nextPupil.preferredTheme || 'light');
    setRefreshSec(nextPupil.refreshIntervalSec ?? 120);
    setCountdownSec(nextPupil.refreshIntervalSec ?? 120);
    void loadPupilRecords();
  }

  async function loadPupilRecords() {
    try {
      const result = await apiJsonRequest<{
        bookmarks?: string[];
        attempts?: MockTestAttemptRecord[];
      }>('/api/pupil/records');
      if (isBackendMissingStatus(result.status) || result.status === 401) {
        const localRec = localGetRecords();
        setBookmarks(localRec.bookmarks);
        setAttempts(localRec.attempts);
        return;
      }
      if (!result.ok || !result.data) return;
      if (Array.isArray(result.data.bookmarks)) setBookmarks(result.data.bookmarks);
      if (Array.isArray(result.data.attempts)) setAttempts(result.data.attempts);
    } catch (err) {
      console.error('Failed to load pupil records:', err);
    }
  }

  const refreshNewsFeed = useCallback(
    async (category = selectedCategory, q = searchQuery, force = false) => {
      setRefreshingNews(true);
      try {
        const params = new URLSearchParams();
        params.set('category', category);
        if (q.trim()) params.set('q', q.trim());
        if (force) params.set('refresh', '1');
        const result = await apiJsonRequest<{
          articles?: NewsArticle[];
          breaking?: NewsArticle[];
          refreshedAt?: string;
        }>(`/api/news?${params.toString()}`);
        if (isBackendMissingStatus(result.status)) {
          const cleanQ = q.trim().toLowerCase();
          const filtered = NEWS_ARTICLES.filter((a) => {
            if (category !== 'all' && a.category !== category) return false;
            if (!cleanQ) return true;
            return (
              a.titleEn.toLowerCase().includes(cleanQ) ||
              a.titleTe.toLowerCase().includes(cleanQ) ||
              a.deckEn.toLowerCase().includes(cleanQ) ||
              a.deckTe.toLowerCase().includes(cleanQ)
            );
          });
          setArticles(filtered);
          setBreakingArticles(NEWS_ARTICLES.filter((a) => a.isBreaking));
          setLastRefreshedAt(new Date().toISOString());
          return;
        }
        if (!result.ok || !result.data) return;
        if (Array.isArray(result.data.articles)) setArticles(result.data.articles);
        if (Array.isArray(result.data.breaking)) setBreakingArticles(result.data.breaking);
        if (result.data.refreshedAt) setLastRefreshedAt(result.data.refreshedAt);
      } catch (err) {
        console.error('News refresh failed:', err);
      } finally {
        setRefreshingNews(false);
      }
    },
    [selectedCategory, searchQuery]
  );

  useEffect(() => {
    if (!pupil) return;
    const timer = window.setTimeout(() => {
      void refreshNewsFeed(selectedCategory, searchQuery);
    }, 150);
    return () => window.clearTimeout(timer);
  }, [pupil, selectedCategory, searchQuery, refreshNewsFeed]);

  // Auto-refresh interval timer
  useEffect(() => {
    if (!pupil || refreshSec === 0) return;
    setCountdownSec(refreshSec);
    const interval = window.setInterval(() => {
      setCountdownSec((prev) => {
        if (prev <= 1) {
          void refreshNewsFeed(selectedCategory, searchQuery, true);
          return refreshSec;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [pupil, refreshSec, selectedCategory, searchQuery, refreshNewsFeed]);

  async function persistPreferences(updates: {
    preferredLang?: LanguageMode;
    preferredTheme?: ThemeMode;
    refreshIntervalSec?: RefreshIntervalSec;
    educationLevel?: EducationLevel;
  }) {
    const nextLang = updates.preferredLang ?? lang;
    const nextTheme = updates.preferredTheme ?? theme;
    const nextRefresh = updates.refreshIntervalSec ?? refreshSec;

    if (updates.preferredLang) setLang(updates.preferredLang);
    if (updates.preferredTheme) setTheme(updates.preferredTheme);
    if (updates.refreshIntervalSec !== undefined) {
      setRefreshSec(updates.refreshIntervalSec);
      setCountdownSec(updates.refreshIntervalSec);
    }

    if (!pupil) return;

    try {
      const result = await apiJsonRequest<{ pupil?: PupilSession }>('/api/auth/preferences', {
        method: 'PATCH',
        body: updates,
      });
      if (isBackendMissingStatus(result.status) || result.status === 401) {
        const updated = localUpdatePreferences(updates);
        if (updated) setPupil(updated);
      } else if (result.ok && result.data?.pupil) {
        localSyncVerifiedPupil(result.data.pupil);
        setPupil(result.data.pupil);
      }
    } catch (err) {
      console.error('Failed to persist preferences:', err);
    }

    if (cloudUser && cloudUser.emailVerified) {
      try {
        await updateFirestorePreferences({
          uid: cloudUser.uid,
          preferredLang: nextLang,
          preferredTheme: nextTheme,
          refreshIntervalSec: nextRefresh,
        });
      } catch (err) {
        console.error('Firestore preference update error:', err);
      }
    }
  }

  function buildClientBriefingFallback(): LiveBriefingPayload {
    const pool = articles.length > 0 ? articles : NEWS_ARTICLES;
    const regional = pool.find((a) => a.category === 'regional') || pool[0];
    const nationals = pool.filter((a) => a.category === 'national' || a.category === 'economy').slice(0, 2);
    const intl = pool.find((a) => a.category === 'international') || pool[1];
    const picked = [regional, ...nationals, intl].filter(Boolean).slice(0, 4);

    const items: GroundedBriefingItem[] = picked.map((a) => ({
      headlineEn: a.titleEn,
      headlineTe: a.titleTe,
      summaryEn: a.deckEn,
      summaryTe: a.deckTe,
      scope:
        a.category === 'regional'
          ? 'Regional'
          : a.category === 'international'
            ? 'International'
            : 'National',
      examTipEn: a.examRelevanceEn,
      examTipTe: a.examRelevanceTe,
    }));

    const sources: GroundingSource[] = picked
      .filter((a) => Boolean(a.externalUrl))
      .map((a) => ({
        title: `${a.sourceName}: ${a.titleEn.slice(0, 55)}`,
        uri: a.externalUrl as string,
      }));

    return {
      generatedAt: new Date().toISOString(),
      items,
      sources,
      cached: false,
    };
  }

  async function handleFetchLiveBriefing(force = false) {
    setLiveBriefingLoading(true);
    setLiveBriefingError(null);
    try {
      const result = await apiJsonRequest<LiveBriefingPayload & { error?: string }>(
        `/api/news/live-briefing${force ? '?force=1' : ''}`
      );
      if (!result.ok || !result.data) {
        if (
          isBackendMissingStatus(result.status) ||
          result.status === 401 ||
          result.status === 429 ||
          result.status === 502 ||
          result.status === 503 ||
          result.status === 0
        ) {
          setLiveBriefing(buildClientBriefingFallback());
          return;
        }
        throw new Error(
          extractReadableApiError(result.errorMessage, 'Could not load live briefing.')
        );
      }
      setLiveBriefing(result.data);
    } catch (err) {
      setLiveBriefingError(
        extractReadableApiError(
          err instanceof Error ? err.message : undefined,
          'Live briefing unavailable.'
        )
      );
    } finally {
      setLiveBriefingLoading(false);
    }
  }

  async function handleToggleBookmark(article: NewsArticle) {
    const currentlySaved = bookmarks.includes(article.id);
    try {
      const result = await apiJsonRequest<{ bookmarks?: string[] }>('/api/bookmarks/toggle', {
        method: 'POST',
        body: { articleId: article.id },
      });
      if (isBackendMissingStatus(result.status) || result.status === 401) {
        setBookmarks(localToggleBookmark(article.id));
      } else if (result.ok && Array.isArray(result.data?.bookmarks)) {
        setBookmarks(result.data.bookmarks);
      }
    } catch (err) {
      console.error('Bookmark toggle error:', err);
    }

    if (cloudUser && cloudUser.emailVerified) {
      try {
        if (currentlySaved) {
          await deleteBookmarkFromFirestore(cloudUser.uid, article.id);
        } else {
          await saveBookmarkToFirestore({
            uid: cloudUser.uid,
            articleId: article.id,
            titleEn: article.titleEn,
            titleTe: article.titleTe,
            category: article.category,
          });
        }
      } catch (err) {
        console.error('Firestore bookmark sync error:', err);
      }
    }
  }

  async function handleRecordAttempt(attempt: Omit<MockTestAttemptRecord, 'id' | 'createdAt'>) {
    let savedId = `att_${Date.now()}`;
    try {
      const result = await apiJsonRequest<{
        attempt?: { id?: string };
        attempts?: MockTestAttemptRecord[];
      }>('/api/exams/attempt', {
        method: 'POST',
        body: attempt,
      });
      if (isBackendMissingStatus(result.status) || result.status === 401) {
        const localSaved = localRecordAttempt(attempt);
        savedId = localSaved.id;
        setAttempts(localSaved.attempts);
      } else if (result.ok && result.data) {
        if (result.data.attempt?.id) savedId = result.data.attempt.id;
        if (Array.isArray(result.data.attempts)) setAttempts(result.data.attempts);
      }
    } catch (err) {
      console.error('Mock attempt save error:', err);
    }

    if (cloudUser && cloudUser.emailVerified) {
      try {
        await saveMockAttemptToFirestore({
          uid: cloudUser.uid,
          attemptId: savedId,
          ...attempt,
        });
      } catch (err) {
        console.error('Firestore attempt sync error:', err);
      }
    }
  }

  async function handleRecordQuickQuiz(score: number, total: number) {
    if (cloudUser && cloudUser.emailVerified) {
      try {
        await saveQuizRecordToFirestore({
          uid: cloudUser.uid,
          quizId: `daily_${new Date().toISOString().slice(0, 10)}`,
          score,
          total,
        });
      } catch (err) {
        console.error('Firestore quiz sync error:', err);
      }
    }
  }

  async function handleConnectCloud() {
    if (!pupil) return;
    const user = await signInWithGoogleCloud();
    if (!user.emailVerified) {
      throw new Error('Google account email must be verified for cloud storage.');
    }
    await syncPupilToFirestore({
      uid: user.uid,
      pupilName: pupil.pupilName,
      email: pupil.email,
      educationLevel: pupil.educationLevel,
      preferredLang: lang,
      preferredTheme: theme,
      refreshIntervalSec: refreshSec,
      otpVerified: pupil.otpVerified,
    });
    await apiJsonRequest('/api/auth/preferences', {
      method: 'PATCH',
      body: { cloudUid: user.uid },
    });
  }

  async function handleSetPassword(newPassword: string) {
    const result = await apiJsonRequest<{ ok?: boolean; pupil?: PupilSession; error?: string }>(
      '/api/auth/set-password',
      {
        method: 'POST',
        body: { password: newPassword },
      }
    );
    if (isBackendMissingStatus(result.status)) {
      const updated = await localSetPassword(newPassword);
      if (updated) setPupil(updated);
      return;
    }
    if (!result.ok || !result.data?.pupil) {
      throw new Error(result.errorMessage || 'Could not save password.');
    }
    localSyncVerifiedPupil(result.data.pupil);
    setPupil(result.data.pupil);
  }

  async function handleLogout(forgetDevice = true) {
    try {
      await apiJsonRequest('/api/auth/logout', {
        method: 'POST',
        body: { forgetDevice },
      });
      clearPortalTokens(forgetDevice);
      localLogout(forgetDevice);
      if (cloudUser) {
        await signOutFirebaseCloud();
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setPupil(null);
      setCloudUser(null);
      setBookmarks([]);
      setAttempts([]);
      setLiveBriefing(null);
      setLiveBriefingError(null);
      setPendingAiPrompt(null);
      setSearchQuery('');
      setSelectedCategory('all');
      setAccountOpen(false);
    }
  }

  function handleAskAiFromAnywhere(prompt: string, context: string) {
    setPendingAiPrompt({ prompt, context, id: Date.now() });
    setActiveSection('tutor');
  }

  if (bootLoading) {
    return (
      <div className="min-h-screen bg-[#FAF8F3] dark:bg-[#0E1116] text-[#171513] dark:text-[#F1F5F9] flex items-center justify-center">
        <p className="text-sm font-medium text-stone-500 dark:text-slate-400">
          Verifying session...
        </p>
      </div>
    );
  }

  if (!pupil) {
    return (
      <PupilAuthGate
        lang={lang}
        theme={theme}
        onLangChange={(next) => setLang(next)}
        onThemeToggle={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
        onAuthenticated={(verifiedPupil) => applyAuthenticatedPupil(verifiedPupil)}
      />
    );
  }

  const copy = getUiCopy(lang);
  const isTe = lang === 'te';

  const navItems: { id: ActiveSection; label: string }[] = [
    { id: 'dispatch', label: copy.navDispatch },
    { id: 'exams', label: copy.navExams },
    { id: 'infographics', label: copy.navInfographics },
    { id: 'glossary', label: copy.navGlossary },
    { id: 'tutor', label: copy.navAiTutor },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F3] dark:bg-[#0E1116] text-[#171513] dark:text-[#F1F5F9] flex flex-col">
      {/* Strict 3-Zone Top Bar Contract */}
      <header className="w-full border-b border-stone-200 dark:border-slate-800 bg-white dark:bg-[#161B22]">
        <div className="max-w-[1360px] mx-auto px-6 py-4 flex items-center justify-between gap-8">
          {/* Zone 1: Single-element Brand Wordmark */}
          <button
            type="button"
            onClick={() => setActiveSection('dispatch')}
            className="font-display text-xl font-bold tracking-tight whitespace-nowrap shrink-0 text-left"
          >
            {copy.brandName}
          </button>

          {/* Zone 2: 5 concise single-line nav links */}
          <nav
            aria-label="Primary sections"
            className="hidden md:flex items-center gap-6 text-sm font-medium"
          >
            {navItems.map((item) => {
              const active = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveSection(item.id)}
                  className={`py-1 whitespace-nowrap shrink-0 transition-colors border-b-2 ${
                    active
                      ? 'border-[#1D4ED8] dark:border-[#60A5FA] text-[#171513] dark:text-white font-semibold'
                      : 'border-transparent text-stone-600 dark:text-slate-300 hover:text-[#171513] dark:hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Single Primary Action */}
          <button
            type="button"
            onClick={() => setAccountOpen(true)}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#171513] dark:bg-slate-100 text-white dark:text-[#0E1116] hover:opacity-90 transition-opacity flex items-center gap-2 whitespace-nowrap shrink-0"
          >
            <UserIcon className="w-3.5 h-3.5" />
            <span className="max-w-[130px] truncate">{pupil.pupilName}</span>
          </button>
        </div>

        {/* Mobile Nav Strip */}
        <nav
          aria-label="Mobile sections"
          className="md:hidden px-6 pb-3 flex items-center gap-4 overflow-x-auto border-t border-stone-100 dark:border-slate-800/70 pt-2"
        >
          {navItems.map((item) => {
            const active = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveSection(item.id)}
                className={`text-xs font-medium whitespace-nowrap shrink-0 pb-1 border-b-2 ${
                  active
                    ? 'border-[#1D4ED8] dark:border-[#60A5FA] text-[#171513] dark:text-white font-semibold'
                    : 'border-transparent text-stone-600 dark:text-slate-300'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      </header>

      {/* Workspace Control Bar: Search, Bilingual Switch, Dark Mode, Refresh Rate Controls */}
      <div className="w-full border-b border-stone-200 dark:border-slate-800 bg-[#FAF8F3] dark:bg-[#0E1116]">
        <div className="max-w-[1360px] mx-auto px-6 py-3 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={copy.searchPlaceholder}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-lg border border-stone-300 dark:border-slate-700 bg-white dark:bg-[#161B22] text-[#171513] dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#1D4ED8] dark:focus:ring-[#60A5FA]"
            />
          </div>

          {/* Language, Refresh Rate, Theme Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Bilingual Switch */}
            <div className="flex items-center gap-1 p-1 bg-stone-200/70 dark:bg-slate-800 rounded-lg">
              {(['en', 'te', 'bilingual'] as LanguageMode[]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => void persistPreferences({ preferredLang: mode })}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                    lang === mode
                      ? 'bg-white dark:bg-slate-900 text-[#171513] dark:text-white shadow-sm'
                      : 'text-stone-600 dark:text-slate-300 hover:text-[#171513] dark:hover:text-white'
                  }`}
                >
                  {mode === 'en' ? 'EN' : mode === 'te' ? 'తెలుగు' : 'Dual'}
                </button>
              ))}
            </div>

            {/* Refresh Rate Controls */}
            <div className="flex items-center gap-1.5 bg-white dark:bg-[#161B22] border border-stone-200 dark:border-slate-800 rounded-lg px-2.5 py-1">
              <label htmlFor="refresh-rate" className="sr-only">
                Refresh rate
              </label>
              <select
                id="refresh-rate"
                value={refreshSec}
                onChange={(e) =>
                  void persistPreferences({
                    refreshIntervalSec: Number(e.target.value) as RefreshIntervalSec,
                  })
                }
                className="text-xs font-medium bg-transparent focus:outline-none text-stone-700 dark:text-slate-200"
              >
                <option value={30}>{isTe ? 'ప్రతి 30 సె.' : 'Auto 30s'}</option>
                <option value={120}>{isTe ? 'ప్రతి 2 ని.' : 'Auto 2m'}</option>
                <option value={300}>{isTe ? 'ప్రతి 5 ని.' : 'Auto 5m'}</option>
                <option value={0}>{isTe ? 'మాన్యువల్' : 'Manual'}</option>
              </select>

              {refreshSec > 0 && (
                <span className="font-mono-num text-[11px] text-stone-400 dark:text-slate-500">
                  {countdownSec}s
                </span>
              )}

              <button
                type="button"
                disabled={refreshingNews}
                onClick={() => {
                  setCountdownSec(refreshSec);
                  void refreshNewsFeed(selectedCategory, searchQuery, true);
                }}
                aria-label="Refresh feed now"
                className="p-1 text-stone-600 dark:text-slate-300 hover:text-[#1D4ED8] dark:hover:text-[#60A5FA] transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${refreshingNews ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {/* Dark Mode Toggle */}
            <button
              type="button"
              onClick={() =>
                void persistPreferences({
                  preferredTheme: theme === 'dark' ? 'light' : 'dark',
                })
              }
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="p-2 rounded-lg border border-stone-200 dark:border-slate-800 bg-white dark:bg-[#161B22] text-stone-700 dark:text-slate-200 hover:bg-stone-100 dark:hover:bg-slate-800 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Direct Log Out Button */}
            <button
              type="button"
              onClick={() => void handleLogout(true)}
              className="px-3 py-2 rounded-lg border border-red-200 dark:border-red-900/70 bg-white dark:bg-[#161B22] text-xs font-semibold text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{isTe ? 'లాగ్ అవుట్' : 'Log Out'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <main key={pupil.email} className="flex-1 w-full max-w-[1360px] mx-auto px-6 py-8">
        {activeSection === 'dispatch' && (
          <NewsWorkspace
            articles={articles}
            breakingArticles={breakingArticles}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            lang={lang}
            bookmarks={bookmarks}
            onToggleBookmark={handleToggleBookmark}
            onAskAi={handleAskAiFromAnywhere}
            liveBriefing={liveBriefing}
            liveBriefingLoading={liveBriefingLoading}
            liveBriefingError={liveBriefingError}
            onFetchLiveBriefing={handleFetchLiveBriefing}
          />
        )}

        {activeSection === 'exams' && (
          <ExamPrepHub
            lang={lang}
            educationLevel={pupil.educationLevel}
            attempts={attempts}
            searchQuery={searchQuery}
            onRecordAttempt={handleRecordAttempt}
            onRecordQuickQuiz={handleRecordQuickQuiz}
            onAskAi={handleAskAiFromAnywhere}
          />
        )}

        {activeSection === 'infographics' && (
          <InfographicsWorkspace lang={lang} onAskAi={handleAskAiFromAnywhere} />
        )}

        {activeSection === 'glossary' && (
          <GlossaryWorkspace lang={lang} globalSearch={searchQuery} />
        )}

        <div className={activeSection === 'tutor' ? '' : 'hidden'}>
          <AiTutorPanel
            key={pupil.email}
            lang={lang}
            educationLevel={pupil.educationLevel}
            pendingPrompt={pendingAiPrompt}
            onClearPending={() => setPendingAiPrompt(null)}
          />
        </div>
      </main>

      {/* Clean Editorial Footer */}
      <footer className="w-full border-t border-stone-200 dark:border-slate-800 bg-white dark:bg-[#161B22]">
        <div className="max-w-[1360px] mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500 dark:text-slate-400">
          <p>
            {isTe
              ? 'BCR కరెంట్ అఫైర్స్ · ద్విభాషా విద్యార్థి వార్తలు & పోటీ పరీక్షల వేదిక'
              : 'BCR Current Affairs · Bilingual English & Telugu Pupil Portal'}
          </p>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setSourceModalOpen(true)}
              className="hover:text-[#1D4ED8] dark:hover:text-[#60A5FA] underline underline-offset-4 transition-colors"
            >
              {isTe ? 'HTML · CSS · JS కోడ్' : 'HTML · CSS · JS Edition'}
            </button>
            <p className="font-mono-num">
              {isTe ? 'చివరి తాజాకరణ:' : 'Updated:'} {new Date(lastRefreshedAt).toLocaleTimeString()}
            </p>
          </div>
        </div>
      </footer>

      {accountOpen && (
        <PupilAccountModal
          pupil={pupil}
          lang={lang}
          cloudUserEmail={cloudUser?.email ?? null}
          bookmarkCount={bookmarks.length}
          attemptCount={attempts.length}
          onClose={() => setAccountOpen(false)}
          onUpdateEducationLevel={async (lvl) => {
            await persistPreferences({ educationLevel: lvl });
          }}
          onSetPassword={handleSetPassword}
          onConnectCloud={handleConnectCloud}
          onLogout={handleLogout}
        />
      )}

      {sourceModalOpen && (
        <WebSourceModal lang={lang} onClose={() => setSourceModalOpen(false)} />
      )}
    </div>
  );
}
