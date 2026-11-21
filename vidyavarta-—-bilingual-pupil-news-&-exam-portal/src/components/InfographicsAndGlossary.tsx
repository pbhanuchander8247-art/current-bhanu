import React, { useState } from 'react';
import { BookMarked, Search, Sparkles } from 'lucide-react';
import { GLOSSARY_TERMS, INFOGRAPHIC_MODULES } from '../data/bilingualContent';
import { apiJsonRequest } from '../lib/http';
import { buildGlossaryExplainFallback, extractReadableApiError } from '../lib/localAiMentor';
import type { GlossaryTerm, InfographicDataPoint, LanguageMode } from '../types/portal';

interface InfographicsWorkspaceProps {
  lang: LanguageMode;
  onAskAi: (prompt: string, context: string) => void;
}

export function InfographicsWorkspace({ lang, onAskAi }: InfographicsWorkspaceProps) {
  const isTe = lang === 'te';
  const showEn = lang === 'en' || lang === 'bilingual';
  const showTe = lang === 'te' || lang === 'bilingual';

  const [selectedPoints, setSelectedPoints] = useState<Record<string, InfographicDataPoint>>({
    'info-union-capex': INFOGRAPHIC_MODULES[0].points[0],
    'info-krishna-godavari': INFOGRAPHIC_MODULES[1].points[0],
  });

  return (
    <div className="space-y-8">
      <div className="pb-4 border-b border-stone-200 dark:border-slate-800">
        <p className="text-xs font-semibold text-[#1D4ED8] dark:text-[#60A5FA]">
          {isTe ? 'విజువల్ లెర్నింగ్ ఎయిడ్స్' : 'Interactive Data & Policy Infographics'}
        </p>
        <h2 className="font-display text-2xl font-semibold mt-1">
          {isTe
            ? 'జాతీయ మరియు ప్రాంతీయ అభివృద్ధి ఇన్ఫోగ్రాఫిక్స్'
            : 'Interactive Visual Briefs for Competitive Exams'}
        </h2>
      </div>

      <div className="space-y-8">
        {INFOGRAPHIC_MODULES.map((mod) => {
          const maxVal = Math.max(...mod.points.map((p) => p.value), 1);
          const activePoint = selectedPoints[mod.id] || mod.points[0];

          return (
            <section
              key={mod.id}
              className="bg-white dark:bg-[#161B22] border border-stone-200 dark:border-slate-800 rounded-xl p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              {/* Interactive Chart Canvas */}
              <div className="lg:col-span-7 space-y-5">
                <div>
                  {showEn && <h3 className="font-display text-xl font-semibold">{mod.titleEn}</h3>}
                  {showTe && (
                    <h3 className="font-display text-lg font-semibold text-stone-800 dark:text-slate-200 mt-1">
                      {mod.titleTe}
                    </h3>
                  )}
                  <p className="text-xs text-stone-500 dark:text-slate-400 mt-1.5">
                    {isTe ? mod.subtitleTe : mod.subtitleEn}
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  {mod.points.map((pt) => {
                    const widthPct = Math.max(8, Math.round((pt.value / maxVal) * 100));
                    const isActive = activePoint.id === pt.id;
                    return (
                      <button
                        key={pt.id}
                        type="button"
                        onClick={() =>
                          setSelectedPoints((prev) => ({ ...prev, [mod.id]: pt }))
                        }
                        className={`w-full text-left p-3 rounded-lg border transition-colors ${
                          isActive
                            ? 'border-[#1D4ED8] dark:border-[#60A5FA] bg-[#FAF8F3] dark:bg-[#0E1116]'
                            : 'border-stone-200 dark:border-slate-800 hover:border-stone-300 dark:hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3 text-xs mb-2">
                          <span className="font-medium">
                            {isTe ? pt.labelTe : pt.labelEn}
                          </span>
                          <span className="font-mono-num font-semibold">
                            {pt.value} {pt.unit}
                          </span>
                        </div>
                        <div className="h-2.5 w-full rounded-full bg-stone-200/80 dark:bg-slate-800 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-300"
                            style={{
                              width: `${widthPct}%`,
                              backgroundColor: pt.colorHex,
                            }}
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>

                <p className="text-xs text-stone-500 dark:text-slate-400 pt-2">
                  {mod.sourceNote}
                </p>
              </div>

              {/* Inspector Detail Deck */}
              <div className="lg:col-span-5 bg-[#FAF8F3] dark:bg-[#0E1116] border border-stone-200 dark:border-slate-800 rounded-xl p-6 flex flex-col justify-between space-y-5">
                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-slate-400">
                    {isTe ? 'ఎంచుకున్న సూచిక వివరాలు' : 'Selected Indicator Inspector'}
                  </p>
                  <p className="font-mono-num text-4xl font-semibold text-[#1D4ED8] dark:text-[#60A5FA]">
                    {activePoint.value} <span className="text-lg">{activePoint.unit}</span>
                  </p>
                  {showEn && <h4 className="font-display text-lg font-semibold">{activePoint.labelEn}</h4>}
                  {showTe && (
                    <h4 className="font-display text-base font-semibold text-stone-800 dark:text-slate-200">
                      {activePoint.labelTe}
                    </h4>
                  )}
                  {showEn && (
                    <p className="text-sm text-stone-600 dark:text-slate-300 leading-relaxed">
                      {activePoint.detailEn}
                    </p>
                  )}
                  {showTe && (
                    <p className="text-sm text-stone-600 dark:text-slate-300 leading-relaxed">
                      {activePoint.detailTe}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() =>
                    onAskAi(
                      isTe
                        ? `"${activePoint.labelTe}" (${activePoint.value} ${activePoint.unit}) గురించి పోటీ పరీక్షలకు ఉపయోగపడే విశ్లేషణ ఇవ్వండి.`
                        : `Break down the policy significance and potential exam questions for "${activePoint.labelEn}" (${activePoint.value} ${activePoint.unit}).`,
                      `${mod.titleEn}: ${activePoint.labelEn} — ${activePoint.detailEn}`
                    )
                  }
                  className="w-full py-2.5 px-4 text-xs font-semibold rounded-lg bg-[#1D4ED8] hover:bg-[#1E40AF] text-white flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>
                    {isTe ? 'AI ట్యూటర్‌తో విశ్లేషించండి' : 'Analyze Indicator with AI Tutor'}
                  </span>
                </button>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

interface GlossaryWorkspaceProps {
  lang: LanguageMode;
  globalSearch: string;
}

export function GlossaryWorkspace({ lang, globalSearch }: GlossaryWorkspaceProps) {
  const isTe = lang === 'te';
  const [domainFilter, setDomainFilter] = useState<'All' | GlossaryTerm['domain']>('All');
  const [localSearch, setLocalSearch] = useState('');
  const [aiExplanations, setAiExplanations] = useState<Record<string, string>>({});
  const [loadingTermId, setLoadingTermId] = useState<string | null>(null);
  const [termError, setTermError] = useState<string | null>(null);

  const combinedQuery = (localSearch || globalSearch).trim().toLowerCase();

  const filteredTerms = GLOSSARY_TERMS.filter((term) => {
    if (domainFilter !== 'All' && term.domain !== domainFilter) return false;
    if (!combinedQuery) return true;
    return (
      term.termEn.toLowerCase().includes(combinedQuery) ||
      term.termTe.toLowerCase().includes(combinedQuery) ||
      term.definitionEn.toLowerCase().includes(combinedQuery) ||
      term.definitionTe.toLowerCase().includes(combinedQuery)
    );
  });

  async function handleExplainTerm(term: GlossaryTerm) {
    setLoadingTermId(term.id);
    setTermError(null);
    try {
      const result = await apiJsonRequest<{ explanation?: string; error?: string }>(
        '/api/ai/glossary-explain',
        {
          method: 'POST',
          body: { termEn: term.termEn, termTe: term.termTe },
        }
      );
      if (!result.ok || !result.data || !result.data.explanation) {
        if (
          result.status === 401 ||
          result.status === 404 ||
          result.status === 405 ||
          result.status === 429 ||
          result.status === 502 ||
          result.status === 503 ||
          result.status === 0
        ) {
          setAiExplanations((prev) => ({
            ...prev,
            [term.id]: buildGlossaryExplainFallback(
              term.termEn,
              term.termTe,
              'competitive_aspirant'
            ),
          }));
          return;
        }
        throw new Error(
          extractReadableApiError(result.errorMessage, 'Could not generate explanation.')
        );
      }
      setAiExplanations((prev) => ({ ...prev, [term.id]: result.data?.explanation || '' }));
    } catch (err) {
      setTermError(
        extractReadableApiError(
          err instanceof Error ? err.message : undefined,
          'Explanation request failed.'
        )
      );
    } finally {
      setLoadingTermId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-slate-800">
        <div>
          <p className="text-xs font-semibold text-[#1D4ED8] dark:text-[#60A5FA]">
            {isTe ? 'ద్విభాషా పదకోశం' : 'Bilingual Academic & Policy Glossary'}
          </p>
          <h2 className="font-display text-2xl font-semibold mt-1">
            {isTe
              ? 'క్లిష్టమైన పదాలు — ఇంగ్లీష్ & తెలుగు వివరణలు'
              : 'Complex Terms Explained in English & Telugu'}
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder={isTe ? 'పదం వెతకండి...' : 'Filter glossary terms...'}
              className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-stone-300 dark:border-slate-700 bg-white dark:bg-[#161B22] focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]"
            />
          </div>

          <div className="flex items-center gap-1">
            {(['All', 'Polity', 'Economy', 'Science', 'Diplomacy', 'Ecology'] as const).map(
              (dom) => (
                <button
                  key={dom}
                  type="button"
                  onClick={() => setDomainFilter(dom)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                    domainFilter === dom
                      ? 'bg-[#171513] dark:bg-slate-100 text-white dark:text-[#0E1116]'
                      : 'text-stone-600 dark:text-slate-300 hover:bg-stone-200/70 dark:hover:bg-slate-800'
                  }`}
                >
                  {dom}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {termError && (
        <div className="p-3 rounded-lg border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30 text-xs text-red-700 dark:text-red-300">
          {termError}
        </div>
      )}

      {filteredTerms.length === 0 ? (
        <div className="bg-white dark:bg-[#161B22] border border-stone-200 dark:border-slate-800 rounded-xl p-10 text-center text-sm text-stone-500">
          {isTe ? 'సరిపోయే పదాలు లేవు.' : 'No glossary terms match your filter.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredTerms.map((term) => (
            <article
              key={term.id}
              className="bg-white dark:bg-[#161B22] border border-stone-200 dark:border-slate-800 rounded-xl p-6 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2 text-xs text-stone-500 dark:text-slate-400">
                  <span className="font-semibold text-[#1D4ED8] dark:text-[#60A5FA]">
                    {term.domain}
                  </span>
                  <span>{term.pronunciationTe}</span>
                </div>

                <div>
                  <h3 className="font-display text-lg font-semibold">{term.termEn}</h3>
                  <p className="text-base font-semibold text-stone-800 dark:text-slate-200 mt-0.5">
                    {term.termTe}
                  </p>
                </div>

                <p className="text-sm text-stone-600 dark:text-slate-300 leading-relaxed">
                  {term.definitionEn}
                </p>
                <p className="text-sm text-stone-700 dark:text-slate-200 leading-relaxed pt-2 border-t border-stone-200 dark:border-slate-800">
                  {term.definitionTe}
                </p>
                <p className="text-xs text-stone-500 dark:text-slate-400">
                  <BookMarked className="w-3.5 h-3.5 inline mr-1.5 text-[#1D4ED8] dark:text-[#60A5FA]" />
                  {isTe ? term.examNoteTe : term.examNoteEn}
                </p>
              </div>

              <div>
                {aiExplanations[term.id] ? (
                  <div className="p-3.5 rounded-lg bg-[#FAF8F3] dark:bg-[#0E1116] border border-stone-200 dark:border-slate-800 text-xs leading-relaxed whitespace-pre-wrap text-stone-700 dark:text-slate-200">
                    {aiExplanations[term.id]}
                  </div>
                ) : (
                  <button
                    type="button"
                    disabled={loadingTermId === term.id}
                    onClick={() => handleExplainTerm(term)}
                    className="px-3.5 py-2 text-xs font-semibold rounded-lg border border-stone-300 dark:border-slate-700 hover:border-[#1D4ED8] dark:hover:border-[#60A5FA] flex items-center gap-1.5 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#1D4ED8] dark:text-[#60A5FA]" />
                    <span>
                      {loadingTermId === term.id
                        ? isTe
                          ? 'వివరణ సిద్ధమవుతోంది...'
                          : 'Generating Examples...'
                        : isTe
                          ? 'AI ఉదాహరణలు చూడండి'
                          : 'AI Deep-Dive & Examples'}
                    </span>
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
