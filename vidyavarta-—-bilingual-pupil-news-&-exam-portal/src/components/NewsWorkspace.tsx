import React, { useState } from 'react';
import {
  ArrowUpRight,
  Bookmark,
  BookOpen,
  Pause,
  Play,
  Sparkles,
  X,
} from 'lucide-react';
import { CATEGORY_META, getUiCopy } from '../data/bilingualContent';
import { apiJsonRequest } from '../lib/http';
import { buildArticleQuizFallback, extractReadableApiError } from '../lib/localAiMentor';
import type {
  LanguageMode,
  LiveBriefingPayload,
  MockQuestion,
  NewsArticle,
  NewsCategory,
} from '../types/portal';

interface NewsWorkspaceProps {
  articles: NewsArticle[];
  breakingArticles: NewsArticle[];
  selectedCategory: 'all' | NewsCategory;
  onSelectCategory: (cat: 'all' | NewsCategory) => void;
  lang: LanguageMode;
  bookmarks: string[];
  onToggleBookmark: (article: NewsArticle) => void;
  onAskAi: (prompt: string, context: string) => void;
  liveBriefing: LiveBriefingPayload | null;
  liveBriefingLoading: boolean;
  liveBriefingError: string | null;
  onFetchLiveBriefing: (force?: boolean) => void;
}

export function NewsWorkspace({
  articles,
  breakingArticles,
  selectedCategory,
  onSelectCategory,
  lang,
  bookmarks,
  onToggleBookmark,
  onAskAi,
  liveBriefing,
  liveBriefingLoading,
  liveBriefingError,
  onFetchLiveBriefing,
}: NewsWorkspaceProps) {
  const [tickerPaused, setTickerPaused] = useState(false);
  const [activeArticle, setActiveArticle] = useState<NewsArticle | null>(null);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  // On-demand Gemini 3-question article quiz state
  const [storyQuizLoading, setStoryQuizLoading] = useState(false);
  const [storyQuizError, setStoryQuizError] = useState<string | null>(null);
  const [storyQuiz, setStoryQuiz] = useState<MockQuestion[] | null>(null);
  const [storyQuizAnswers, setStoryQuizAnswers] = useState<Record<number, number>>({});

  const copy = getUiCopy(lang);
  const showEn = lang === 'en' || lang === 'bilingual';
  const showTe = lang === 'te' || lang === 'bilingual';

  const leadArticle = articles[0] ?? null;
  const secondaryArticles = articles.slice(1, 3);
  const wireArticles = articles.slice(3);

  function openArticle(article: NewsArticle) {
    setActiveArticle(article);
    setStoryQuiz(null);
    setStoryQuizError(null);
    setStoryQuizAnswers({});
  }

  async function handleGenerateStoryQuiz(article: NewsArticle) {
    setStoryQuizLoading(true);
    setStoryQuizError(null);
    setStoryQuiz(null);
    setStoryQuizAnswers({});
    try {
      const result = await apiJsonRequest<{ questions?: MockQuestion[]; error?: string }>(
        '/api/ai/article-quiz',
        {
          method: 'POST',
          body: {
            title: `${article.titleEn} / ${article.titleTe}`,
            summary: `${article.deckEn}\n${article.bodyEn.join('\n')}`,
          },
        }
      );
      if (!result.ok || !result.data || !Array.isArray(result.data.questions)) {
        if (
          result.status === 401 ||
          result.status === 404 ||
          result.status === 405 ||
          result.status === 429 ||
          result.status === 502 ||
          result.status === 503 ||
          result.status === 0
        ) {
          setStoryQuiz(
            buildArticleQuizFallback(
              `${article.titleEn} / ${article.titleTe}`,
              `${article.deckEn}\n${article.bodyEn.join('\n')}`
            )
          );
          return;
        }
        throw new Error(extractReadableApiError(result.errorMessage, 'Could not generate quiz.'));
      }
      setStoryQuiz(result.data.questions || []);
    } catch (err) {
      setStoryQuizError(
        extractReadableApiError(err instanceof Error ? err.message : undefined, 'Quiz generation failed.')
      );
    } finally {
      setStoryQuizLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Breaking News Ticker */}
      {breakingArticles.length > 0 && (
        <div className="bg-white dark:bg-[#161B22] border border-stone-200 dark:border-slate-800 rounded-lg overflow-hidden flex items-center">
          <div className="px-4 py-2.5 bg-[#1D4ED8] text-white text-xs font-semibold tracking-wide whitespace-nowrap shrink-0">
            {copy.breakingLabel}
          </div>
          <div className="vv-ticker-wrapper flex-1 overflow-hidden relative py-2.5 px-4">
            <div className="vv-ticker-track gap-10" data-paused={tickerPaused ? 'true' : 'false'}>
              {[...breakingArticles, ...breakingArticles].map((item, idx) => (
                <button
                  key={`${item.id}-${idx}`}
                  type="button"
                  onClick={() => openArticle(item)}
                  className="text-xs font-medium text-stone-700 dark:text-slate-200 hover:text-[#1D4ED8] dark:hover:text-[#60A5FA] whitespace-nowrap shrink-0 flex items-center gap-2 transition-colors"
                >
                  <span>{lang === 'te' ? item.titleTe : item.titleEn}</span>
                  <span aria-hidden="true" className="text-stone-300 dark:text-slate-600">
                    /
                  </span>
                </button>
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setTickerPaused((p) => !p)}
            aria-label={tickerPaused ? 'Resume ticker' : 'Pause ticker'}
            className="px-3 py-2.5 border-l border-stone-200 dark:border-slate-800 text-stone-500 dark:text-slate-400 hover:text-[#171513] dark:hover:text-white shrink-0"
          >
            {tickerPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          </button>
        </div>
      )}

      {/* Category Filter Bar & Live Briefing Action */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-slate-800">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
          {(Object.keys(CATEGORY_META) as ('all' | NewsCategory)[]).map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => onSelectCategory(cat)}
                className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  active
                    ? 'bg-[#171513] dark:bg-slate-100 text-white dark:text-[#0E1116]'
                    : 'text-stone-600 dark:text-slate-300 hover:bg-stone-200/70 dark:hover:bg-slate-800'
                }`}
              >
                {lang === 'te' ? CATEGORY_META[cat].te : CATEGORY_META[cat].en}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          disabled={liveBriefingLoading}
          onClick={() => onFetchLiveBriefing(true)}
          className="px-4 py-2 text-xs font-semibold rounded-lg border border-[#1D4ED8]/30 dark:border-[#60A5FA]/40 text-[#1D4ED8] dark:text-[#60A5FA] bg-white dark:bg-[#161B22] hover:bg-[#1D4ED8]/5 dark:hover:bg-[#60A5FA]/10 transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 self-start lg:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>
            {liveBriefingLoading
              ? lang === 'te'
                ? 'తాజా సమాచారం సేకరిస్తోంది...'
                : 'Synthesizing Grounded Briefing...'
              : copy.liveBriefingBtn}
          </span>
        </button>
      </div>

      {/* Live Grounded Briefing Strip (when requested) */}
      {(liveBriefing || liveBriefingError) && (
        <section className="bg-white dark:bg-[#161B22] border border-stone-200 dark:border-slate-800 rounded-xl p-6">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-stone-200 dark:border-slate-800">
            <div>
              <h2 className="font-display text-lg font-semibold">
                {lang === 'te'
                  ? 'తాజా శోధన ఆధారిత కరెంట్ అఫైర్స్ సంక్షిప్తి'
                  : 'Live Search-Grounded Current Affairs Briefing'}
              </h2>
              {liveBriefing && (
                <p className="text-xs text-stone-500 dark:text-slate-400 mt-0.5 font-mono-num">
                  {new Date(liveBriefing.generatedAt).toLocaleTimeString()} ·{' '}
                  {liveBriefing.cached ? 'Cached' : 'Fresh'}
                </p>
              )}
            </div>
            {liveBriefing?.sources && liveBriefing.sources.length > 0 && (
              <div className="flex flex-wrap items-center gap-3 text-xs">
                {liveBriefing.sources.slice(0, 3).map((src, i) => (
                  <a
                    key={i}
                    href={src.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#1D4ED8] dark:text-[#60A5FA] hover:underline flex items-center gap-1 max-w-[180px] truncate"
                  >
                    <span className="truncate">{src.title}</span>
                    <ArrowUpRight className="w-3 h-3 shrink-0" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {liveBriefingError ? (
            <p className="mt-4 text-xs text-red-700 dark:text-red-300">{liveBriefingError}</p>
          ) : (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              {liveBriefing?.items.map((item, idx) => (
                <article
                  key={idx}
                  className="pb-4 border-b md:border-b-0 border-stone-200 dark:border-slate-800 space-y-2"
                >
                  <p className="text-xs text-stone-500 dark:text-slate-400 font-medium">
                    {item.scope}
                  </p>
                  {showEn && (
                    <h3 className="text-sm font-semibold leading-snug">{item.headlineEn}</h3>
                  )}
                  {showTe && (
                    <h3 className="text-sm font-semibold text-stone-800 dark:text-slate-200 leading-snug">
                      {item.headlineTe}
                    </h3>
                  )}
                  {showEn && (
                    <p className="text-xs text-stone-600 dark:text-slate-300 leading-relaxed">
                      {item.summaryEn}
                    </p>
                  )}
                  {showTe && (
                    <p className="text-xs text-stone-600 dark:text-slate-300 leading-relaxed">
                      {item.summaryTe}
                    </p>
                  )}
                  <p className="text-xs text-[#1D4ED8] dark:text-[#60A5FA] pt-1">
                    {lang === 'te' ? item.examTipTe : item.examTipEn}
                  </p>
                </article>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Empty Search State */}
      {articles.length === 0 ? (
        <div className="bg-white dark:bg-[#161B22] border border-stone-200 dark:border-slate-800 rounded-xl p-12 text-center">
          <p className="font-display text-xl font-semibold">
            {lang === 'te' ? 'సరిపోయే వార్తలు కనుగొనబడలేదు' : 'No dispatches matched your filter'}
          </p>
          <p className="text-sm text-stone-500 dark:text-slate-400 mt-2">
            {lang === 'te'
              ? 'వేరే వర్గం లేదా శోధన పదాన్ని ప్రయత్నించండి.'
              : 'Clear your search query or switch to All Editions.'}
          </p>
        </div>
      ) : (
        <>
          {/* Tier 1: Lead Editorial Story */}
          {leadArticle && (
            <article className="bg-white dark:bg-[#161B22] border border-stone-200 dark:border-slate-800 rounded-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch">
              <div className="lg:col-span-7 relative min-h-[260px] lg:min-h-[380px] bg-stone-100 dark:bg-slate-900">
                {leadArticle.imageUrl && !failedImages[leadArticle.id] ? (
                  <img
                    src={leadArticle.imageUrl}
                    alt={leadArticle.titleEn}
                    referrerPolicy="no-referrer"
                    onError={() =>
                      setFailedImages((prev) => ({ ...prev, [leadArticle.id]: true }))
                    }
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center p-8 text-sm text-stone-500 dark:text-slate-400">
                    {leadArticle.regionLabelEn}
                  </div>
                )}
              </div>

              <div className="lg:col-span-5 p-7 lg:p-9 flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 dark:text-slate-400">
                    <span className="font-semibold text-[#1D4ED8] dark:text-[#60A5FA]">
                      {lang === 'te' ? leadArticle.regionLabelTe : leadArticle.regionLabelEn}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono-num">{leadArticle.readTimeMin} min read</span>
                    <span aria-hidden="true">·</span>
                    <span>{leadArticle.examTracks.join(' / ')}</span>
                  </div>

                  {showEn && (
                    <h2
                      onClick={() => openArticle(leadArticle)}
                      className="font-display text-2xl lg:text-3xl font-semibold tracking-tight mt-3 text-balance cursor-pointer hover:text-[#1D4ED8] dark:hover:text-[#60A5FA] transition-colors"
                    >
                      {leadArticle.titleEn}
                    </h2>
                  )}
                  {showTe && (
                    <h2
                      onClick={() => openArticle(leadArticle)}
                      className={`font-display font-semibold tracking-tight mt-2.5 text-balance cursor-pointer hover:text-[#1D4ED8] dark:hover:text-[#60A5FA] transition-colors ${
                        lang === 'bilingual' ? 'text-lg text-stone-800 dark:text-slate-200' : 'text-2xl lg:text-3xl'
                      }`}
                    >
                      {leadArticle.titleTe}
                    </h2>
                  )}

                  {showEn && (
                    <p className="mt-3 text-sm text-stone-600 dark:text-slate-300 leading-relaxed">
                      {leadArticle.deckEn}
                    </p>
                  )}
                  {showTe && (
                    <p className="mt-2 text-sm text-stone-600 dark:text-slate-300 leading-relaxed">
                      {leadArticle.deckTe}
                    </p>
                  )}

                  <p className="mt-4 pt-4 border-t border-stone-200 dark:border-slate-800 text-xs text-stone-600 dark:text-slate-300">
                    <strong className="font-semibold text-[#171513] dark:text-slate-100">
                      {copy.examRelevanceLabel}:{' '}
                    </strong>
                    {lang === 'te' ? leadArticle.examRelevanceTe : leadArticle.examRelevanceEn}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => openArticle(leadArticle)}
                    className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#1D4ED8] hover:bg-[#1E40AF] text-white transition-colors flex items-center gap-1.5"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{copy.readFullStory}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onToggleBookmark(leadArticle)}
                    className="px-3 py-2 text-xs font-medium rounded-lg border border-stone-200 dark:border-slate-700 hover:bg-stone-100 dark:hover:bg-slate-800 flex items-center gap-1.5 transition-colors"
                  >
                    <Bookmark
                      className={`w-3.5 h-3.5 ${
                        bookmarks.includes(leadArticle.id)
                          ? 'fill-[#1D4ED8] text-[#1D4ED8] dark:fill-[#60A5FA] dark:text-[#60A5FA]'
                          : ''
                      }`}
                    />
                    <span>
                      {bookmarks.includes(leadArticle.id) ? copy.bookmarkSaved : copy.bookmarkSave}
                    </span>
                  </button>
                </div>
              </div>
            </article>
          )}

          {/* Tier 2: Secondary Feature Grid */}
          {secondaryArticles.length > 0 && (
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {secondaryArticles.map((art) => (
                <article
                  key={art.id}
                  className="bg-white dark:bg-[#161B22] border border-stone-200 dark:border-slate-800 rounded-xl overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    <div className="h-56 w-full bg-stone-100 dark:bg-slate-900 overflow-hidden">
                      {art.imageUrl && !failedImages[art.id] ? (
                        <img
                          src={art.imageUrl}
                          alt={art.titleEn}
                          referrerPolicy="no-referrer"
                          onError={() =>
                            setFailedImages((prev) => ({ ...prev, [art.id]: true }))
                          }
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-stone-500">
                          {art.regionLabelEn}
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 dark:text-slate-400">
                        <span className="font-semibold text-[#1D4ED8] dark:text-[#60A5FA]">
                          {lang === 'te' ? art.regionLabelTe : art.regionLabelEn}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono-num">{art.readTimeMin} min</span>
                        <span aria-hidden="true">·</span>
                        <span>{art.sourceName}</span>
                      </div>

                      {showEn && (
                        <h3
                          onClick={() => openArticle(art)}
                          className="font-display text-xl font-semibold mt-2.5 cursor-pointer hover:text-[#1D4ED8] dark:hover:text-[#60A5FA] transition-colors"
                        >
                          {art.titleEn}
                        </h3>
                      )}
                      {showTe && (
                        <h3
                          onClick={() => openArticle(art)}
                          className={`font-display font-semibold mt-2 cursor-pointer hover:text-[#1D4ED8] dark:hover:text-[#60A5FA] transition-colors ${
                            lang === 'bilingual' ? 'text-base text-stone-800 dark:text-slate-200' : 'text-xl'
                          }`}
                        >
                          {art.titleTe}
                        </h3>
                      )}

                      <p className="mt-2.5 text-sm text-stone-600 dark:text-slate-300 leading-relaxed">
                        {lang === 'te' ? art.deckTe : art.deckEn}
                      </p>
                    </div>
                  </div>

                  <div className="px-6 py-4 border-t border-stone-200 dark:border-slate-800 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => openArticle(art)}
                      className="text-xs font-semibold text-[#1D4ED8] dark:text-[#60A5FA] hover:underline"
                    >
                      {copy.readFullStory}
                    </button>
                    <button
                      type="button"
                      onClick={() => onToggleBookmark(art)}
                      aria-label={copy.bookmarkSave}
                      className="text-xs text-stone-500 dark:text-slate-400 hover:text-[#171513] dark:hover:text-white flex items-center gap-1"
                    >
                      <Bookmark
                        className={`w-3.5 h-3.5 ${
                          bookmarks.includes(art.id)
                            ? 'fill-[#1D4ED8] text-[#1D4ED8] dark:fill-[#60A5FA] dark:text-[#60A5FA]'
                            : ''
                        }`}
                      />
                      <span>{bookmarks.includes(art.id) ? copy.bookmarkSaved : copy.bookmarkSave}</span>
                    </button>
                  </div>
                </article>
              ))}
            </section>
          )}

          {/* Tier 3: Regional, National & International Wire List */}
          {wireArticles.length > 0 && (
            <section className="bg-white dark:bg-[#161B22] border border-stone-200 dark:border-slate-800 rounded-xl divide-y divide-stone-200 dark:divide-slate-800">
              {wireArticles.map((art) => (
                <article
                  key={art.id}
                  className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-stone-50/70 dark:hover:bg-slate-800/30 transition-colors"
                >
                  <div className="space-y-1.5 max-w-3xl">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 dark:text-slate-400">
                      <span className="font-semibold text-[#1D4ED8] dark:text-[#60A5FA]">
                        {lang === 'te' ? art.regionLabelTe : art.regionLabelEn}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{art.sourceName}</span>
                      {art.isLiveApi && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-emerald-700 dark:text-emerald-400 font-medium">
                            Live API
                          </span>
                        </>
                      )}
                      <span aria-hidden="true">·</span>
                      <span>{art.examTracks.join(' / ')}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono-num">{art.readTimeMin} min</span>
                    </div>

                    {showEn && (
                      <h3
                        onClick={() => openArticle(art)}
                        className="font-display text-lg font-semibold cursor-pointer hover:text-[#1D4ED8] dark:hover:text-[#60A5FA]"
                      >
                        {art.titleEn}
                      </h3>
                    )}
                    {showTe && (
                      <h3
                        onClick={() => openArticle(art)}
                        className="font-display text-base font-semibold text-stone-800 dark:text-slate-200 cursor-pointer hover:text-[#1D4ED8] dark:hover:text-[#60A5FA]"
                      >
                        {art.titleTe}
                      </h3>
                    )}
                    <p className="text-sm text-stone-600 dark:text-slate-300">
                      {lang === 'te' ? art.deckTe : art.deckEn}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      type="button"
                      onClick={() => openArticle(art)}
                      className="px-3.5 py-2 text-xs font-semibold rounded-lg border border-stone-200 dark:border-slate-700 hover:border-[#1D4ED8] dark:hover:border-[#60A5FA] transition-colors whitespace-nowrap"
                    >
                      {copy.readFullStory}
                    </button>
                    <button
                      type="button"
                      onClick={() => onToggleBookmark(art)}
                      aria-label={copy.bookmarkSave}
                      className="p-2 rounded-lg border border-stone-200 dark:border-slate-700 text-stone-500 dark:text-slate-400 hover:text-[#1D4ED8]"
                    >
                      <Bookmark
                        className={`w-4 h-4 ${
                          bookmarks.includes(art.id)
                            ? 'fill-[#1D4ED8] text-[#1D4ED8] dark:fill-[#60A5FA] dark:text-[#60A5FA]'
                            : ''
                        }`}
                      />
                    </button>
                  </div>
                </article>
              ))}
            </section>
          )}
        </>
      )}

      {/* Full Editorial Article Reader Modal */}
      {activeArticle && (
        <div
          className="fixed inset-0 z-50 bg-black/55 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={activeArticle.titleEn}
        >
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-[#161B22] border border-stone-200 dark:border-slate-800 rounded-xl p-6 lg:p-10 text-[#171513] dark:text-[#F1F5F9]">
            <div className="flex items-start justify-between gap-4 pb-5 border-b border-stone-200 dark:border-slate-800">
              <div className="text-xs text-stone-500 dark:text-slate-400 flex flex-wrap items-center gap-2">
                <span className="font-semibold text-[#1D4ED8] dark:text-[#60A5FA]">
                  {lang === 'te' ? activeArticle.regionLabelTe : activeArticle.regionLabelEn}
                </span>
                <span aria-hidden="true">·</span>
                <span>{activeArticle.sourceName}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono-num">{activeArticle.readTimeMin} min read</span>
              </div>
              <button
                type="button"
                onClick={() => setActiveArticle(null)}
                aria-label="Close dispatch"
                className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-slate-800 text-stone-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-6 max-w-prose">
              {showEn && (
                <h2 className="font-display text-2xl lg:text-3xl font-semibold text-balance leading-tight">
                  {activeArticle.titleEn}
                </h2>
              )}
              {showTe && (
                <h2 className="font-display text-xl lg:text-2xl font-semibold text-stone-800 dark:text-slate-200 mt-2 leading-snug">
                  {activeArticle.titleTe}
                </h2>
              )}

              {activeArticle.imageUrl && !failedImages[activeArticle.id] && (
                <figure className="my-6">
                  <img
                    src={activeArticle.imageUrl}
                    alt={activeArticle.titleEn}
                    referrerPolicy="no-referrer"
                    className="w-full h-64 object-cover rounded-lg border border-stone-200 dark:border-slate-800"
                  />
                  {activeArticle.imageCaptionEn && (
                    <figcaption className="text-xs text-stone-500 dark:text-slate-400 italic mt-2">
                      {lang === 'te'
                        ? activeArticle.imageCaptionTe
                        : activeArticle.imageCaptionEn}
                    </figcaption>
                  )}
                </figure>
              )}

              {showEn && (
                <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-stone-800 dark:text-slate-200">
                  {activeArticle.bodyEn.map((para, idx) => (
                    <p
                      key={idx}
                      className={
                        idx === 0
                          ? 'first-letter:text-4xl first-letter:font-display first-letter:font-semibold first-letter:float-left first-letter:mr-2.5 first-letter:leading-none'
                          : ''
                      }
                    >
                      {para}
                    </p>
                  ))}
                </div>
              )}

              {showTe && (
                <div className="mt-6 pt-6 border-t border-stone-200 dark:border-slate-800 space-y-4 text-[15px] leading-relaxed text-stone-800 dark:text-slate-200">
                  {activeArticle.bodyTe.map((para, idx) => (
                    <p key={idx}>{para}</p>
                  ))}
                </div>
              )}

              <div className="mt-6 p-4 rounded-lg bg-[#FAF8F3] dark:bg-[#0E1116] border border-stone-200 dark:border-slate-800 text-xs space-y-1.5">
                <p className="font-semibold text-[#1D4ED8] dark:text-[#60A5FA]">
                  {copy.examRelevanceLabel} · {activeArticle.examTracks.join(' / ')}
                </p>
                {showEn && <p>{activeArticle.examRelevanceEn}</p>}
                {showTe && <p>{activeArticle.examRelevanceTe}</p>}
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const article = activeArticle;
                    setActiveArticle(null);
                    onAskAi(
                      lang === 'te'
                        ? `"${article.titleTe}" వార్తలోని ముఖ్యాంశాలు మరియు పోటీ పరీక్షలకు ఉపయోగపడే ప్రశ్నలను వివరించండి.`
                        : `Explain the exam significance, constitutional/economic concepts, and likely UPSC/State PSC questions from: "${article.titleEn}"`,
                      `${article.titleEn}\n${article.bodyEn.join('\n')}`
                    );
                  }}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#1D4ED8] text-white hover:bg-[#1E40AF] flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{copy.askAiAboutStory}</span>
                </button>

                <button
                  type="button"
                  disabled={storyQuizLoading}
                  onClick={() => handleGenerateStoryQuiz(activeArticle)}
                  className="px-4 py-2 text-xs font-semibold rounded-lg border border-stone-300 dark:border-slate-700 hover:bg-stone-100 dark:hover:bg-slate-800 transition-colors"
                >
                  {storyQuizLoading
                    ? lang === 'te'
                      ? 'ప్రశ్నలు రూపొందిస్తోంది...'
                      : 'Generating Quiz...'
                    : copy.generateStoryQuiz}
                </button>

                {activeArticle.externalUrl && (
                  <a
                    href={activeArticle.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 text-xs font-semibold rounded-lg border border-stone-300 dark:border-slate-700 hover:border-[#1D4ED8] dark:hover:border-[#60A5FA] flex items-center gap-1.5 transition-colors"
                  >
                    <span>{lang === 'te' ? 'మూల వార్త చూడండి' : 'Original Source'}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              {storyQuizError && (
                <p className="mt-4 text-xs text-red-700 dark:text-red-300">{storyQuizError}</p>
              )}

              {storyQuiz && storyQuiz.length > 0 && (
                <div className="mt-6 pt-6 border-t border-stone-200 dark:border-slate-800 space-y-5">
                  <h3 className="font-display text-lg font-semibold">
                    {lang === 'te'
                      ? 'ఈ వార్తపై AI తయారు చేసిన క్విజ్'
                      : 'AI-Generated Story Comprehension Quiz'}
                  </h3>
                  {storyQuiz.map((q, qIdx) => {
                    const picked = storyQuizAnswers[qIdx];
                    const opts = lang === 'te' ? q.optionsTe : q.optionsEn;
                    return (
                      <div
                        key={qIdx}
                        className="p-4 rounded-lg border border-stone-200 dark:border-slate-800 bg-[#FAF8F3] dark:bg-[#0E1116] space-y-3"
                      >
                        <p className="text-sm font-semibold">
                          {qIdx + 1}. {lang === 'te' ? q.questionTe : q.questionEn}
                        </p>
                        {lang === 'bilingual' && (
                          <p className="text-xs text-stone-600 dark:text-slate-300">
                            {q.questionTe}
                          </p>
                        )}
                        <div className="space-y-2">
                          {opts.map((opt, oIdx) => {
                            const isPicked = picked === oIdx;
                            const isCorrect = oIdx === q.correctIndex;
                            let cls =
                              'border-stone-200 dark:border-slate-700 bg-white dark:bg-[#161B22] hover:border-[#1D4ED8]';
                            if (picked !== undefined) {
                              if (isCorrect) {
                                cls =
                                  'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200';
                              } else if (isPicked) {
                                cls =
                                  'border-red-500 bg-red-50 dark:bg-red-950/40 text-red-900 dark:text-red-200';
                              }
                            }
                            return (
                              <button
                                key={oIdx}
                                type="button"
                                onClick={() =>
                                  setStoryQuizAnswers((prev) => ({ ...prev, [qIdx]: oIdx }))
                                }
                                className={`w-full text-left px-3.5 py-2 text-xs rounded-lg border transition-colors ${cls}`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                        {picked !== undefined && (
                          <p className="text-xs text-stone-600 dark:text-slate-300 pt-1">
                            {lang === 'te' ? q.explanationTe : q.explanationEn}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
