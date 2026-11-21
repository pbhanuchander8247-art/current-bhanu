import React, { useEffect, useState } from 'react';
import { ArrowUpRight, Send, Sparkles, X } from 'lucide-react';
import { EDUCATION_LEVEL_LABELS } from '../data/bilingualContent';
import { apiJsonRequest } from '../lib/http';
import { buildGroundedMentorFallback, extractReadableApiError } from '../lib/localAiMentor';
import type { EducationLevel, GroundingSource, LanguageMode } from '../types/portal';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  sources?: GroundingSource[];
}

interface AiTutorPanelProps {
  lang: LanguageMode;
  educationLevel: EducationLevel;
  pendingPrompt?: { prompt: string; context: string; id: number } | null;
  onClearPending?: () => void;
}

export function AiTutorPanel({
  lang,
  educationLevel,
  pendingPrompt,
  onClearPending,
}: AiTutorPanelProps) {
  const isTe = lang === 'te';
  const [responseLang, setResponseLang] = useState<LanguageMode>(lang);
  const [contextText, setContextText] = useState('');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setResponseLang(lang);
  }, [lang]);

  useEffect(() => {
    if (pendingPrompt) {
      setContextText(pendingPrompt.context);
      void sendQuery(pendingPrompt.prompt, pendingPrompt.context);
      onClearPending?.();
    }
  }, [pendingPrompt]);

  async function sendQuery(queryText: string, ctx = contextText) {
    const clean = queryText.trim();
    if (!clean || loading) return;

    setError(null);
    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      role: 'user',
      text: clean,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const recentSessionHistory = messages.slice(-6).map((m) => ({
      role: m.role,
      text: m.text.slice(0, 600),
    }));

    try {
      const result = await apiJsonRequest<{
        answer?: string;
        sources?: GroundingSource[];
        error?: string;
      }>('/api/ai/assistant', {
        method: 'POST',
        body: {
          prompt: clean,
          lang: responseLang,
          context: ctx,
          sessionHistory: recentSessionHistory,
        },
      });

      if (!result.ok || !result.data || !result.data.answer) {
        if (
          result.status === 401 ||
          result.status === 404 ||
          result.status === 405 ||
          result.status === 429 ||
          result.status === 502 ||
          result.status === 503 ||
          result.status === 0
        ) {
          const local = buildGroundedMentorFallback({
            prompt: clean,
            lang: responseLang,
            educationLevel,
            context: ctx,
          });
          setMessages((prev) => [
            ...prev,
            {
              id: `a_${Date.now()}`,
              role: 'assistant',
              text: local.answer,
              sources: local.sources,
            },
          ]);
          return;
        }
        throw new Error(
          extractReadableApiError(result.errorMessage, 'AI Assistant could not respond.')
        );
      }

      const data = result.data;
      setMessages((prev) => [
        ...prev,
        {
          id: `a_${Date.now()}`,
          role: 'assistant',
          text: data.answer || '',
          sources: data.sources || [],
        },
      ]);
    } catch (err) {
      setError(
        extractReadableApiError(
          err instanceof Error ? err.message : undefined,
          'AI Assistant could not respond.'
        )
      );
    } finally {
      setLoading(false);
    }
  }

  const starterPrompts = isTe
    ? [
        'RBI రెపో రేటు మరియు ద్రవ్యోల్బణం మధ్య సంబంధాన్ని సులభంగా వివరించండి.',
        'కృష్ణా బేసిన్ కాలువ సోలార్ ప్రాజెక్ట్ వల్ల AP & తెలంగాణకు కలిగే ప్రయోజనాలు ఏమిటి?',
        'UPSC ప్రిలిమ్స్ కోసం నావిక్ (NavIC) ముఖ్య అంశాలను తెలుగులో ఇవ్వండి.',
      ]
    : [
        'Explain the difference between UPI and RBI Digital Rupee (e₹) for Banking & UPSC exams.',
        'Summarize how India’s 7th Schedule divides water & energy responsibilities.',
        'Give me 3 high-probability MCQs on ISRO’s NavIC Rubidium atomic clock.',
      ];

  return (
    <div className="bg-white dark:bg-[#161B22] border border-stone-200 dark:border-slate-800 rounded-xl overflow-hidden flex flex-col min-h-[620px]">
      {/* Header Strip */}
      <div className="px-6 py-4 border-b border-stone-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#1D4ED8] dark:text-[#60A5FA]">
            <Sparkles className="w-4 h-4" />
            <span>
              {isTe ? 'విద్యార్థి AI సహాయకుడు' : 'VidyaAI Bilingual Academic Mentor'}
            </span>
          </div>
          <p className="text-xs text-stone-500 dark:text-slate-400 mt-0.5">
            {isTe ? 'స్థాయి:' : 'Calibrated for:'}{' '}
            {EDUCATION_LEVEL_LABELS[educationLevel][isTe ? 'te' : 'en']}
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-stone-100 dark:bg-slate-800 rounded-lg">
          {(['en', 'te', 'bilingual'] as LanguageMode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setResponseLang(m)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                responseLang === m
                  ? 'bg-white dark:bg-slate-900 text-[#171513] dark:text-white shadow-sm'
                  : 'text-stone-600 dark:text-slate-300'
              }`}
            >
              {m === 'en' ? 'English' : m === 'te' ? 'తెలుగు' : 'Dual'}
            </button>
          ))}
        </div>
      </div>

      {/* Attached Story/Question Context */}
      {contextText && (
        <div className="px-6 py-2.5 bg-[#FAF8F3] dark:bg-[#0E1116] border-b border-stone-200 dark:border-slate-800 flex items-center justify-between gap-3 text-xs">
          <p className="truncate text-stone-600 dark:text-slate-300">
            <strong className="font-semibold text-[#171513] dark:text-slate-100">
              {isTe ? 'సందర్భం:' : 'Attached Context:'}{' '}
            </strong>
            {contextText}
          </p>
          <button
            type="button"
            onClick={() => setContextText('')}
            aria-label="Clear context"
            className="text-stone-400 hover:text-stone-700 dark:hover:text-white shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Conversation Area */}
      <div className="flex-1 p-6 space-y-5 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="max-w-2xl mx-auto py-8 space-y-6">
            <div className="text-center space-y-2">
              <h2 className="font-display text-2xl font-semibold">
                {isTe
                  ? 'కరెంట్ అఫైర్స్, పరీక్షల సందేహాలను అడగండి'
                  : 'Ask Any Current Affairs or Exam Question'}
              </h2>
              <p className="text-sm text-stone-600 dark:text-slate-300">
                {isTe
                  ? 'మీ విద్యార్హత స్థాయికి అనుగుణంగా తెలుగు, ఇంగ్లీష్ భాషల్లో సమాధానాలు పొందండి.'
                  : 'Get grounded explanations, bilingual summaries, and exam-ready practice prompts calibrated to your education level.'}
              </p>
            </div>

            <div className="space-y-2.5">
              {starterPrompts.map((sp, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => void sendQuery(sp)}
                  className="w-full text-left px-4 py-3 rounded-lg border border-stone-200 dark:border-slate-800 bg-[#FAF8F3] dark:bg-[#0E1116] hover:border-[#1D4ED8] dark:hover:border-[#60A5FA] text-xs font-medium transition-colors"
                >
                  {sp}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`max-w-3xl ${msg.role === 'user' ? 'ml-auto' : 'mr-auto'}`}
            >
              <div
                className={`rounded-xl px-5 py-3.5 text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-[#1D4ED8] text-white'
                    : 'bg-[#FAF8F3] dark:bg-[#0E1116] border border-stone-200 dark:border-slate-800 text-[#171513] dark:text-slate-100'
                }`}
              >
                {msg.text}
              </div>

              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-stone-500 dark:text-slate-400">
                  <span>{isTe ? 'ఆధారాలు:' : 'Sources:'}</span>
                  {msg.sources.map((src, idx) => (
                    <a
                      key={idx}
                      href={src.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#1D4ED8] dark:text-[#60A5FA] hover:underline flex items-center gap-1 max-w-[200px] truncate"
                    >
                      <span className="truncate">{src.title}</span>
                      <ArrowUpRight className="w-3 h-3 shrink-0" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))
        )}

        {loading && (
          <div className="max-w-xs px-4 py-3 rounded-xl bg-[#FAF8F3] dark:bg-[#0E1116] border border-stone-200 dark:border-slate-800 text-xs text-stone-500 dark:text-slate-400">
            {isTe ? 'సమాధానం సిద్ధమవుతోంది...' : 'Researching & drafting explanation...'}
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="p-3 rounded-lg border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30 text-xs text-red-700 dark:text-red-300"
          >
            {error}
          </div>
        )}
      </div>

      {/* Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void sendQuery(input);
        }}
        className="p-4 border-t border-stone-200 dark:border-slate-800 flex items-center gap-3"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            isTe
              ? 'మీ ప్రశ్నను తెలుగు లేదా ఇంగ్లీష్‌లో టైప్ చేయండి...'
              : 'Ask about regional news, constitutional articles, or exam concepts...'
          }
          className="flex-1 px-4 py-2.5 text-sm rounded-lg border border-stone-300 dark:border-slate-700 bg-[#FAF8F3] dark:bg-[#0E1116] focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
        />
        <button
          type="submit"
          disabled={loading || input.trim().length < 2}
          className="px-4 py-2.5 text-xs font-semibold rounded-lg bg-[#1D4ED8] hover:bg-[#1E40AF] disabled:opacity-50 text-white flex items-center gap-1.5 whitespace-nowrap shrink-0"
        >
          <Send className="w-3.5 h-3.5" />
          <span>{isTe ? 'పంపండి' : 'Ask'}</span>
        </button>
      </form>
    </div>
  );
}
