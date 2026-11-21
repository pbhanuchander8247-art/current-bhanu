import React, { useEffect, useState } from 'react';
import { Calendar, CheckCircle2, Clock, Flag, RotateCcw, Sparkles, Trophy } from 'lucide-react';
import {
  DAILY_QUICK_QUIZ,
  EDUCATION_LEVEL_LABELS,
  EXAM_UPDATES,
  MOCK_TESTS,
  getUiCopy,
} from '../data/bilingualContent';
import type {
  EducationLevel,
  ExamTrack,
  LanguageMode,
  MockTest,
  MockTestAttemptRecord,
} from '../types/portal';

interface ExamPrepHubProps {
  lang: LanguageMode;
  educationLevel: EducationLevel;
  attempts: MockTestAttemptRecord[];
  searchQuery?: string;
  onRecordAttempt: (attempt: Omit<MockTestAttemptRecord, 'id' | 'createdAt'>) => Promise<void>;
  onRecordQuickQuiz: (score: number, total: number) => Promise<void>;
  onAskAi: (prompt: string, context: string) => void;
}

export function ExamPrepHub({
  lang,
  educationLevel,
  attempts,
  searchQuery = '',
  onRecordAttempt,
  onRecordQuickQuiz,
  onAskAi,
}: ExamPrepHubProps) {
  const isTe = lang === 'te';
  const showEn = lang === 'en' || lang === 'bilingual';
  const showTe = lang === 'te' || lang === 'bilingual';
  const copy = getUiCopy(lang);

  const [trackFilter, setTrackFilter] = useState<'ALL' | ExamTrack>('ALL');

  // Active timed mock test state
  const [activeTest, setActiveTest] = useState<MockTest | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [flagged, setFlagged] = useState<Record<number, boolean>>({});
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [submittedResult, setSubmittedResult] = useState<{
    score: number;
    total: number;
    accuracyPct: number;
    durationSec: number;
  } | null>(null);

  // Daily 5-question rapid quiz state
  const [quickIdx, setQuickIdx] = useState(0);
  const [quickAnswers, setQuickAnswers] = useState<Record<number, number>>({});
  const [quickDone, setQuickDone] = useState(false);

  useEffect(() => {
    if (!activeTest || submittedResult) return;
    if (secondsLeft <= 0) {
      handleSubmitMockTest();
      return;
    }
    const timer = window.setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [activeTest, submittedResult, secondsLeft]);

  function startMockTest(test: MockTest) {
    setActiveTest(test);
    setCurrentIdx(0);
    setAnswers({});
    setFlagged({});
    setSecondsLeft(test.durationMinutes * 60);
    setSubmittedResult(null);
  }

  async function handleSubmitMockTest() {
    if (!activeTest || submittedResult) return;
    const total = activeTest.questions.length;
    let score = 0;
    activeTest.questions.forEach((q, idx) => {
      if (answers[idx] === q.correctIndex) score += 1;
    });
    const accuracyPct = Number(((score / total) * 100).toFixed(1));
    const durationSec = Math.max(1, activeTest.durationMinutes * 60 - secondsLeft);
    setSubmittedResult({ score, total, accuracyPct, durationSec });

    await onRecordAttempt({
      testId: activeTest.id,
      testTitle: isTe ? activeTest.titleTe : activeTest.titleEn,
      examTrack: activeTest.track,
      score,
      totalQuestions: total,
      accuracyPct,
      durationSec,
    });
  }

  function formatTimer(sec: number) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  async function handleFinishQuickQuiz(nextAnswers: Record<number, number>) {
    let score = 0;
    DAILY_QUICK_QUIZ.forEach((q, i) => {
      if (nextAnswers[i] === q.correctIndex) score += 1;
    });
    setQuickDone(true);
    await onRecordQuickQuiz(score, DAILY_QUICK_QUIZ.length);
  }

  function startCombinedMasterTest() {
    const combinedQuestions = MOCK_TESTS.flatMap((t) => t.questions.slice(0, 3));
    const masterTest: MockTest = {
      id: 'mock-all-tracks-master',
      track: 'UPSC',
      titleEn: 'All-Tracks Combined Master Mock Test (UPSC, APPSC/TSPSC, SSC, STEM)',
      titleTe: 'అన్ని విభాగాల సమగ్ర మాక్ టెస్ట్ (UPSC, APPSC/TSPSC, SSC, సైన్స్)',
      subtitleEn: 'Full-syllabus marathon combining top questions from all 8 portal test modules.',
      subtitleTe: 'అన్ని 8 మాక్ టెస్ట్ మాడ్యూళ్ల నుండి ముఖ్య ప్రశ్నలతో సమగ్ర పరీక్ష.',
      durationMinutes: 25,
      questions: combinedQuestions,
    };
    startMockTest(masterTest);
  }

  const normalizedSearch = searchQuery.trim().toLowerCase();

  const filteredUpdates = EXAM_UPDATES.filter((u) => {
    if (trackFilter !== 'ALL' && u.track !== trackFilter) return false;
    if (!normalizedSearch) return true;
    return (
      u.titleEn.toLowerCase().includes(normalizedSearch) ||
      u.titleTe.toLowerCase().includes(normalizedSearch) ||
      u.summaryEn.toLowerCase().includes(normalizedSearch) ||
      u.examBody.toLowerCase().includes(normalizedSearch)
    );
  });

  const filteredTests = MOCK_TESTS.filter((t) => {
    if (trackFilter !== 'ALL' && t.track !== trackFilter) return false;
    if (!normalizedSearch) return true;
    return (
      t.titleEn.toLowerCase().includes(normalizedSearch) ||
      t.titleTe.toLowerCase().includes(normalizedSearch) ||
      t.subtitleEn.toLowerCase().includes(normalizedSearch) ||
      t.questions.some(
        (q) =>
          q.subjectEn.toLowerCase().includes(normalizedSearch) ||
          q.questionEn.toLowerCase().includes(normalizedSearch)
      )
    );
  });

  const bestAttemptByTest = new Map<string, MockTestAttemptRecord>();
  for (const att of attempts) {
    const prev = bestAttemptByTest.get(att.testId);
    if (!prev || att.accuracyPct > prev.accuracyPct) {
      bestAttemptByTest.set(att.testId, att);
    }
  }

  // Active Mock Test Runner Screen
  if (activeTest) {
    const q = activeTest.questions[currentIdx];
    const total = activeTest.questions.length;

    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-[#161B22] border border-stone-200 dark:border-slate-800 rounded-xl p-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs text-[#1D4ED8] dark:text-[#60A5FA] font-semibold">
              {activeTest.track.replace('_', ' & ')}
            </p>
            <h2 className="font-display text-xl font-semibold">
              {isTe ? activeTest.titleTe : activeTest.titleEn}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 font-mono-num text-sm font-semibold px-3 py-1.5 rounded-lg border border-stone-200 dark:border-slate-700 bg-[#FAF8F3] dark:bg-[#0E1116]">
              <Clock className="w-4 h-4 text-[#1D4ED8] dark:text-[#60A5FA]" />
              <span>{formatTimer(secondsLeft)}</span>
            </div>
            {!submittedResult ? (
              <button
                type="button"
                onClick={handleSubmitMockTest}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#1D4ED8] text-white hover:bg-[#1E40AF]"
              >
                {copy.submitMockTest}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setActiveTest(null)}
                className="px-4 py-2 text-xs font-semibold rounded-lg border border-stone-300 dark:border-slate-700 hover:bg-stone-100 dark:hover:bg-slate-800"
              >
                {isTe ? 'పరీక్షా కేంద్రానికి తిరిగి వెళ్ళండి' : 'Back to Exam Hub'}
              </button>
            )}
          </div>
        </div>

        {submittedResult ? (
          <div className="space-y-6">
            {/* Score Summary */}
            <div className="bg-white dark:bg-[#161B22] border border-stone-200 dark:border-slate-800 rounded-xl p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="text-xs text-stone-500 dark:text-slate-400">
                  {isTe ? 'స్కోర్' : 'Score'}
                </p>
                <p className="font-mono-num text-3xl font-semibold mt-1">
                  {submittedResult.score} / {submittedResult.total}
                </p>
              </div>
              <div>
                <p className="text-xs text-stone-500 dark:text-slate-400">
                  {isTe ? 'ఖచ్చితత్వం' : 'Accuracy'}
                </p>
                <p className="font-mono-num text-3xl font-semibold mt-1 text-[#1D4ED8] dark:text-[#60A5FA]">
                  {submittedResult.accuracyPct}%
                </p>
              </div>
              <div>
                <p className="text-xs text-stone-500 dark:text-slate-400">
                  {isTe ? 'సమయం' : 'Time Taken'}
                </p>
                <p className="font-mono-num text-3xl font-semibold mt-1">
                  {formatTimer(submittedResult.durationSec)}
                </p>
              </div>
              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => startMockTest(activeTest)}
                  className="px-4 py-2 text-xs font-semibold rounded-lg border border-stone-300 dark:border-slate-700 hover:bg-stone-100 dark:hover:bg-slate-800 flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{copy.retakeTest}</span>
                </button>
              </div>
            </div>

            {/* Detailed Question Review */}
            <div className="space-y-4">
              {activeTest.questions.map((item, idx) => {
                const picked = answers[idx];
                const isCorrect = picked === item.correctIndex;
                return (
                  <div
                    key={item.id}
                    className="bg-white dark:bg-[#161B22] border border-stone-200 dark:border-slate-800 rounded-xl p-6 space-y-3"
                  >
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="font-medium text-stone-500 dark:text-slate-400">
                        Q{idx + 1} · {isTe ? item.subjectTe : item.subjectEn}
                      </span>
                      <span
                        className={`font-semibold ${
                          isCorrect
                            ? 'text-emerald-700 dark:text-emerald-400'
                            : 'text-red-700 dark:text-red-400'
                        }`}
                      >
                        {isCorrect
                          ? isTe
                            ? 'సరైన సమాధానం'
                            : 'Correct'
                          : isTe
                            ? 'తప్పు / వదిలివేసినది'
                            : 'Incorrect / Unanswered'}
                      </span>
                    </div>

                    {showEn && <p className="text-sm font-semibold">{item.questionEn}</p>}
                    {showTe && (
                      <p className="text-sm font-semibold text-stone-800 dark:text-slate-200">
                        {item.questionTe}
                      </p>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
                      {(isTe ? item.optionsTe : item.optionsEn).map((opt, oIdx) => {
                        const right = oIdx === item.correctIndex;
                        const chosen = oIdx === picked;
                        return (
                          <div
                            key={oIdx}
                            className={`px-3.5 py-2 text-xs rounded-lg border ${
                              right
                                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 font-medium'
                                : chosen
                                  ? 'border-red-400 bg-red-50 dark:bg-red-950/30'
                                  : 'border-stone-200 dark:border-slate-800'
                            }`}
                          >
                            {opt}
                          </div>
                        );
                      })}
                    </div>

                    <div className="pt-3 border-t border-stone-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <p className="text-xs text-stone-600 dark:text-slate-300 leading-relaxed">
                        {isTe ? item.explanationTe : item.explanationEn}
                      </p>
                      <button
                        type="button"
                        onClick={() =>
                          onAskAi(
                            isTe
                              ? `ఈ ప్రశ్నను లోతుగా వివరించండి: "${item.questionTe}"`
                              : `Explain the concept behind this exam question in detail: "${item.questionEn}"`,
                            `${item.questionEn}\nCorrect Answer: ${item.optionsEn[item.correctIndex]}\n${item.explanationEn}`
                          )
                        }
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-[#1D4ED8]/30 text-[#1D4ED8] dark:text-[#60A5FA] whitespace-nowrap shrink-0 flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>{copy.askAiAboutStory}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Active Question Stage */}
            <div className="lg:col-span-8 bg-white dark:bg-[#161B22] border border-stone-200 dark:border-slate-800 rounded-xl p-6 lg:p-8 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-stone-500 dark:text-slate-400">
                  <span className="font-mono-num">
                    Question {currentIdx + 1} of {total} · {isTe ? q.subjectTe : q.subjectEn}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setFlagged((prev) => ({ ...prev, [currentIdx]: !prev[currentIdx] }))
                    }
                    className={`flex items-center gap-1 font-medium ${
                      flagged[currentIdx]
                        ? 'text-amber-600 dark:text-amber-400'
                        : 'hover:text-[#171513] dark:hover:text-white'
                    }`}
                  >
                    <Flag className="w-3.5 h-3.5" />
                    <span>{flagged[currentIdx] ? 'Marked' : 'Mark for Review'}</span>
                  </button>
                </div>

                {showEn && (
                  <h3 className="font-display text-xl font-semibold leading-snug">
                    {q.questionEn}
                  </h3>
                )}
                {showTe && (
                  <p className="text-base font-medium text-stone-800 dark:text-slate-200 leading-snug">
                    {q.questionTe}
                  </p>
                )}

                <div className="space-y-2.5 pt-2">
                  {q.optionsEn.map((optEn, oIdx) => {
                    const selected = answers[currentIdx] === oIdx;
                    return (
                      <button
                        key={oIdx}
                        type="button"
                        onClick={() => setAnswers((prev) => ({ ...prev, [currentIdx]: oIdx }))}
                        className={`w-full text-left p-4 rounded-lg border transition-colors ${
                          selected
                            ? 'border-[#1D4ED8] dark:border-[#60A5FA] bg-[#1D4ED8]/5 dark:bg-[#60A5FA]/10'
                            : 'border-stone-200 dark:border-slate-800 hover:border-stone-400 dark:hover:border-slate-600'
                        }`}
                      >
                        {showEn && <p className="text-sm font-medium">{optEn}</p>}
                        {showTe && (
                          <p
                            className={`text-sm ${
                              showEn ? 'text-stone-600 dark:text-slate-300 mt-1 text-xs' : 'font-medium'
                            }`}
                          >
                            {q.optionsTe[oIdx]}
                          </p>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-8 pt-5 border-t border-stone-200 dark:border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  disabled={currentIdx === 0}
                  onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
                  className="px-4 py-2 text-xs font-semibold rounded-lg border border-stone-300 dark:border-slate-700 disabled:opacity-40"
                >
                  {isTe ? 'మునుపటి ప్రశ్న' : 'Previous'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (currentIdx < total - 1) {
                      setCurrentIdx((i) => i + 1);
                    } else {
                      handleSubmitMockTest();
                    }
                  }}
                  className="px-5 py-2 text-xs font-semibold rounded-lg bg-[#1D4ED8] text-white hover:bg-[#1E40AF]"
                >
                  {currentIdx < total - 1
                    ? isTe
                      ? 'తదుపరి ప్రశ్న'
                      : 'Next Question'
                    : copy.submitMockTest}
                </button>
              </div>
            </div>

            {/* Question Palette */}
            <aside className="lg:col-span-4 bg-white dark:bg-[#161B22] border border-stone-200 dark:border-slate-800 rounded-xl p-6 space-y-4">
              <h3 className="text-sm font-semibold">
                {isTe ? 'ప్రశ్నల ప్యాలెట్' : 'Question Palette'}
              </h3>
              <div className="grid grid-cols-5 gap-2">
                {activeTest.questions.map((item, idx) => {
                  const answered = answers[idx] !== undefined;
                  const isFlag = flagged[idx];
                  const isCurr = idx === currentIdx;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setCurrentIdx(idx)}
                      className={`h-10 rounded-lg font-mono-num text-xs font-semibold border transition-colors ${
                        isCurr
                          ? 'ring-2 ring-[#1D4ED8] dark:ring-[#60A5FA] border-[#1D4ED8]'
                          : isFlag
                            ? 'bg-amber-100 dark:bg-amber-950/50 border-amber-400 text-amber-900 dark:text-amber-200'
                            : answered
                              ? 'bg-[#1D4ED8] text-white border-[#1D4ED8]'
                              : 'border-stone-200 dark:border-slate-700'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
              <div className="pt-4 border-t border-stone-200 dark:border-slate-800 text-xs text-stone-500 dark:text-slate-400 space-y-1">
                <p className="font-mono-num">
                  Answered: {Object.keys(answers).length} / {total}
                </p>
                <p className="font-mono-num">
                  Marked: {Object.values(flagged).filter(Boolean).length}
                </p>
              </div>
            </aside>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Level Banner + Track Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-slate-800">
        <div>
          <p className="text-xs font-semibold text-[#1D4ED8] dark:text-[#60A5FA]">
            {isTe ? 'మీ స్థాయి:' : 'Tailored Track:'}{' '}
            {EDUCATION_LEVEL_LABELS[educationLevel][isTe ? 'te' : 'en']}
          </p>
          <h2 className="font-display text-2xl font-semibold mt-0.5">
            {isTe
              ? 'పోటీ పరీక్షల రోజువారీ అప్‌డేట్స్ & మాక్ టెస్టులు'
              : 'Competitive Exam Updates & Timed Mock Tests'}
          </h2>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          {(['ALL', 'UPSC', 'APPSC_TSPSC', 'SSC_BANKING', 'FOUNDATION'] as const).map((trk) => {
            const count =
              trk === 'ALL'
                ? MOCK_TESTS.length
                : MOCK_TESTS.filter((t) => t.track === trk).length;
            return (
              <button
                key={trk}
                type="button"
                onClick={() => setTrackFilter(trk)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap shrink-0 transition-colors ${
                  trackFilter === trk
                    ? 'bg-[#171513] dark:bg-slate-100 text-white dark:text-[#0E1116]'
                    : 'text-stone-600 dark:text-slate-300 hover:bg-stone-200/70 dark:hover:bg-slate-800'
                }`}
              >
                {trk === 'ALL'
                  ? `${isTe ? 'అన్నీ' : 'All Tracks'} (${count})`
                  : `${trk.replace('_', ' / ')} (${count})`}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mock Tests Grid + Daily Quick Quiz */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-500 dark:text-slate-400">
              {isTe
                ? `అందుబాటులో ఉన్న మాక్ టెస్టులు (${filteredTests.length})`
                : `Available Timed Mock Tests (${filteredTests.length})`}
            </h3>
            <span className="font-mono-num text-xs text-stone-500 dark:text-slate-400">
              {filteredTests.reduce((sum, t) => sum + t.questions.length, 0)}{' '}
              {isTe ? 'ప్రశ్నలు' : 'Total Qs'}
            </span>
          </div>

          {trackFilter === 'ALL' && !normalizedSearch && (
            <article className="bg-[#FAF8F3] dark:bg-[#0E1116] border border-[#1D4ED8]/40 dark:border-[#60A5FA]/40 rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-slate-400">
                  <span className="font-semibold text-[#1D4ED8] dark:text-[#60A5FA]">
                    {isTe ? 'సమగ్ర మెగా మాక్ టెస్ట్' : 'ALL-TRACKS MASTER SERIES'}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono-num">{MOCK_TESTS.length * 3} Qs</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono-num">25 min</span>
                </div>
                {showEn && (
                  <h4 className="font-display text-lg font-semibold">
                    All-India & State Combined Mega Mock Test
                  </h4>
                )}
                {showTe && (
                  <h4 className="font-display text-base font-semibold text-stone-800 dark:text-slate-200">
                    అన్ని విభాగాల సమగ్ర మెగా మాక్ టెస్ట్ (UPSC, APPSC/TSPSC, SSC, STEM)
                  </h4>
                )}
                <p className="text-xs text-stone-600 dark:text-slate-300">
                  {isTe
                    ? 'ప్రతి విభాగం నుండి ముఖ్య ప్రశ్నలను కలిపి సమగ్ర సాధన పరీక్ష రాయండి.'
                    : 'Cross-track simulation combining 3 questions from each of the 8 bilingual test modules.'}
                </p>
              </div>
              <button
                type="button"
                onClick={startCombinedMasterTest}
                className="px-4 py-2.5 text-xs font-semibold rounded-lg bg-[#171513] dark:bg-slate-100 text-white dark:text-[#0E1116] hover:opacity-90 whitespace-nowrap shrink-0"
              >
                {isTe ? 'మెగా టెస్ట్ ప్రారంభించండి' : 'Start Mega Test'}
              </button>
            </article>
          )}

          {filteredTests.length === 0 ? (
            <div className="bg-white dark:bg-[#161B22] border border-stone-200 dark:border-slate-800 rounded-xl p-6 text-xs text-stone-500 dark:text-slate-400">
              {isTe
                ? 'మీ శోధనకు సరిపోయే మాక్ టెస్టులు లేవు.'
                : 'No mock tests match your current search filter.'}
            </div>
          ) : (
            filteredTests.map((test) => {
              const best = bestAttemptByTest.get(test.id);
              return (
                <article
                  key={test.id}
                  className="bg-white dark:bg-[#161B22] border border-stone-200 dark:border-slate-800 rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 dark:text-slate-400">
                      <span className="font-semibold text-[#1D4ED8] dark:text-[#60A5FA]">
                        {test.track.replace('_', ' & ')}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono-num">{test.questions.length} Qs</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono-num">{test.durationMinutes} min</span>
                      {best && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono-num text-emerald-700 dark:text-emerald-400 font-medium">
                            {isTe ? 'అత్యుత్తమ స్కోర్:' : 'Best:'} {best.score}/
                            {best.totalQuestions} ({best.accuracyPct}%)
                          </span>
                        </>
                      )}
                    </div>
                    {showEn && <h4 className="font-display text-lg font-semibold">{test.titleEn}</h4>}
                    {showTe && (
                      <h4 className="font-display text-base font-semibold text-stone-800 dark:text-slate-200">
                        {test.titleTe}
                      </h4>
                    )}
                    <p className="text-xs text-stone-600 dark:text-slate-300">
                      {isTe ? test.subtitleTe : test.subtitleEn}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => startMockTest(test)}
                    className="px-4 py-2.5 text-xs font-semibold rounded-lg bg-[#1D4ED8] hover:bg-[#1E40AF] text-white whitespace-nowrap shrink-0"
                  >
                    {copy.startMockTest}
                  </button>
                </article>
              );
            })
          )}
        </div>

        {/* Daily 5-Question Rapid Quiz */}
        <aside className="lg:col-span-5 bg-white dark:bg-[#161B22] border border-stone-200 dark:border-slate-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold">{copy.dailyQuizHeading}</h3>
            <span className="font-mono-num text-xs text-stone-500 dark:text-slate-400">
              {quickIdx + 1} / {DAILY_QUICK_QUIZ.length}
            </span>
          </div>

          {quickDone ? (
            <div className="py-4 space-y-4">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 text-sm font-semibold">
                <Trophy className="w-5 h-5" />
                <span>
                  {isTe ? 'రోజువారీ క్విజ్ పూర్తయింది!' : 'Daily Quick Quiz Completed'}
                </span>
              </div>
              <p className="font-mono-num text-2xl font-semibold">
                {
                  DAILY_QUICK_QUIZ.filter((q, idx) => quickAnswers[idx] === q.correctIndex).length
                }{' '}
                / {DAILY_QUICK_QUIZ.length}
              </p>
              <button
                type="button"
                onClick={() => {
                  setQuickAnswers({});
                  setQuickIdx(0);
                  setQuickDone(false);
                }}
                className="px-4 py-2 text-xs font-semibold rounded-lg border border-stone-300 dark:border-slate-700 hover:bg-stone-100 dark:hover:bg-slate-800"
              >
                {copy.retakeTest}
              </button>
            </div>
          ) : (
            (() => {
              const qq = DAILY_QUICK_QUIZ[quickIdx];
              const picked = quickAnswers[quickIdx];
              return (
                <div className="space-y-3">
                  <p className="text-xs text-[#1D4ED8] dark:text-[#60A5FA] font-medium">
                    {isTe ? qq.subjectTe : qq.subjectEn}
                  </p>
                  <p className="text-sm font-semibold leading-snug">
                    {isTe ? qq.questionTe : qq.questionEn}
                  </p>
                  <div className="space-y-2">
                    {(isTe ? qq.optionsTe : qq.optionsEn).map((opt, oIdx) => {
                      const isCorrect = oIdx === qq.correctIndex;
                      const isPicked = picked === oIdx;
                      let cls =
                        'border-stone-200 dark:border-slate-700 hover:border-[#1D4ED8]';
                      if (picked !== undefined) {
                        if (isCorrect) {
                          cls =
                            'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 font-medium';
                        } else if (isPicked) {
                          cls = 'border-red-400 bg-red-50 dark:bg-red-950/30';
                        }
                      }
                      return (
                        <button
                          key={oIdx}
                          type="button"
                          disabled={picked !== undefined}
                          onClick={() => {
                            const next = { ...quickAnswers, [quickIdx]: oIdx };
                            setQuickAnswers(next);
                          }}
                          className={`w-full text-left px-3.5 py-2.5 text-xs rounded-lg border transition-colors ${cls}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                  {picked !== undefined && (
                    <div className="pt-2 space-y-3">
                      <p className="text-xs text-stone-600 dark:text-slate-300">
                        {isTe ? qq.explanationTe : qq.explanationEn}
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          if (quickIdx < DAILY_QUICK_QUIZ.length - 1) {
                            setQuickIdx((i) => i + 1);
                          } else {
                            handleFinishQuickQuiz(quickAnswers);
                          }
                        }}
                        className="w-full py-2 text-xs font-semibold rounded-lg bg-[#1D4ED8] text-white hover:bg-[#1E40AF]"
                      >
                        {quickIdx < DAILY_QUICK_QUIZ.length - 1
                          ? isTe
                            ? 'తదుపరి ప్రశ్న'
                            : 'Next Question'
                          : isTe
                            ? 'ఫలితం చూడండి'
                            : 'Complete Quiz'}
                      </button>
                    </div>
                  )}
                </div>
              );
            })()
          )}
        </aside>
      </div>

      {/* Daily Exam Notifications & Syllabus Alerts */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-500 dark:text-slate-400">
          {isTe ? 'రోజువారీ పరీక్షల ప్రకటనలు & నోటిఫికేషన్లు' : 'Daily Exam Updates & Alerts'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredUpdates.map((upd) => {
            const matchedLevel = upd.eligibleLevels.includes(educationLevel);
            return (
              <article
                key={upd.id}
                className="bg-white dark:bg-[#161B22] border border-stone-200 dark:border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2 text-xs text-stone-500 dark:text-slate-400">
                    <span className="font-semibold text-[#1D4ED8] dark:text-[#60A5FA]">
                      {upd.examBody} · {isTe ? upd.stageTe : upd.stageEn}
                    </span>
                    {matchedLevel && (
                      <span className="text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{isTe ? 'మీ స్థాయికి తగినది' : 'Matches Level'}</span>
                      </span>
                    )}
                  </div>
                  <h4 className="font-display text-base font-semibold">
                    {isTe ? upd.titleTe : upd.titleEn}
                  </h4>
                  <p className="text-xs text-stone-600 dark:text-slate-300 leading-relaxed">
                    {isTe ? upd.summaryTe : upd.summaryEn}
                  </p>
                </div>
                <p className="text-xs text-stone-500 dark:text-slate-400 font-mono-num flex items-center gap-1.5 pt-2 border-t border-stone-200 dark:border-slate-800">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Target: {upd.deadlineDate}</span>
                </p>
              </article>
            );
          })}
        </div>
      </section>

      {/* Attempt History Table */}
      {attempts.length > 0 && (
        <section className="bg-white dark:bg-[#161B22] border border-stone-200 dark:border-slate-800 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-stone-200 dark:border-slate-800">
            <h3 className="text-sm font-semibold">
              {isTe ? 'మీ ఇటీవలి మాక్ టెస్ట్ ప్రగతి' : 'Recent Mock Test Performance'}
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-stone-200 dark:border-slate-800 text-stone-500 dark:text-slate-400">
                <tr>
                  <th className="px-6 py-3 font-medium">Test</th>
                  <th className="px-6 py-3 font-medium">Track</th>
                  <th className="px-6 py-3 font-medium">Score</th>
                  <th className="px-6 py-3 font-medium">Accuracy</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 dark:divide-slate-800">
                {attempts.slice(0, 10).map((att) => (
                  <tr key={att.id}>
                    <td className="px-6 py-3 font-medium">{att.testTitle}</td>
                    <td className="px-6 py-3 text-stone-500 dark:text-slate-400">
                      {att.examTrack.replace('_', ' & ')}
                    </td>
                    <td className="px-6 py-3 font-mono-num">
                      {att.score} / {att.totalQuestions}
                    </td>
                    <td className="px-6 py-3 font-mono-num font-semibold text-[#1D4ED8] dark:text-[#60A5FA]">
                      {att.accuracyPct}%
                    </td>
                    <td className="px-6 py-3 font-mono-num text-stone-500 dark:text-slate-400">
                      {new Date(att.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
