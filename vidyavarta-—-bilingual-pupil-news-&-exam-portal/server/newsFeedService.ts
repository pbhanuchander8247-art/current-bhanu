import crypto from 'node:crypto';
import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';
import { NEWS_ARTICLES } from '../src/data/bilingualContent.ts';
import type { ExamTrack, NewsArticle, NewsCategory } from '../src/types/portal.ts';

interface FeedSource {
  category: NewsCategory;
  url: string;
  lang: 'en' | 'te';
  regionLabelEn: string;
  regionLabelTe: string;
  examTracks: ExamTrack[];
  defaultSource: string;
}

const LIVE_FEED_SOURCES: FeedSource[] = [
  {
    category: 'regional',
    url: 'https://news.google.com/rss/search?q=Andhra+Pradesh+OR+Telangana&hl=en-IN&gl=IN&ceid=IN:en',
    lang: 'en',
    regionLabelEn: 'AP & Telangana · Live Wire',
    regionLabelTe: 'AP & తెలంగాణ · లైవ్ వార్తలు',
    examTracks: ['APPSC_TSPSC', 'UPSC'],
    defaultSource: 'Regional News Wire',
  },
  {
    category: 'regional',
    url: 'https://news.google.com/rss/search?q=%E0%B0%86%E0%B0%82%E0%B0%A7%E0%B1%8D%E0%B0%B0%E0%B0%AA%E0%B1%8D%E0%B0%B0%E0%B0%A6%E0%B1%87%E0%B0%B6%E0%B1%8D+OR+%E0%B0%A4%E0%B1%86%E0%B0%B2%E0%B0%82%E0%B0%97%E0%B0%BE%E0%B0%A3&hl=te&gl=IN&ceid=IN:te',
    lang: 'te',
    regionLabelEn: 'AP & Telangana · Telugu Wire',
    regionLabelTe: 'AP & తెలంగాణ · తెలుగు వార్తలు',
    examTracks: ['APPSC_TSPSC'],
    defaultSource: 'తెలుగు ప్రాంతీయ వార్తలు',
  },
  {
    category: 'national',
    url: 'https://news.google.com/rss?hl=en-IN&gl=IN&ceid=IN:en',
    lang: 'en',
    regionLabelEn: 'India · National Wire',
    regionLabelTe: 'భారత్ · జాతీయ వార్తలు',
    examTracks: ['UPSC', 'SSC_BANKING'],
    defaultSource: 'India National Wire',
  },
  {
    category: 'international',
    url: 'https://feeds.bbci.co.uk/news/world/rss.xml',
    lang: 'en',
    regionLabelEn: 'World · International Wire',
    regionLabelTe: 'ప్రపంచం · అంతర్జాతీయ వార్తలు',
    examTracks: ['UPSC', 'SSC_BANKING'],
    defaultSource: 'BBC World News',
  },
  {
    category: 'science',
    url: 'https://news.google.com/rss/headlines/section/topic/SCIENCE?hl=en-IN&gl=IN&ceid=IN:en',
    lang: 'en',
    regionLabelEn: 'Science & Tech · Live Wire',
    regionLabelTe: 'సైన్స్ & టెక్ · లైవ్ వార్తలు',
    examTracks: ['UPSC', 'FOUNDATION'],
    defaultSource: 'Science & Tech Wire',
  },
  {
    category: 'economy',
    url: 'https://news.google.com/rss/headlines/section/topic/BUSINESS?hl=en-IN&gl=IN&ceid=IN:en',
    lang: 'en',
    regionLabelEn: 'Economy & Policy · Live Wire',
    regionLabelTe: 'ఆర్థికం & విధానాలు · లైవ్ వార్తలు',
    examTracks: ['UPSC', 'SSC_BANKING', 'APPSC_TSPSC'],
    defaultSource: 'Economy Wire',
  },
  {
    category: 'exams',
    url: 'https://news.google.com/rss/search?q=UPSC+OR+APPSC+OR+TSPSC+OR+SSC+exam&hl=en-IN&gl=IN&ceid=IN:en',
    lang: 'en',
    regionLabelEn: 'Exam Desk · Live Alerts',
    regionLabelTe: 'పరీక్షల విభాగం · లైవ్ సమాచారం',
    examTracks: ['UPSC', 'APPSC_TSPSC', 'SSC_BANKING', 'FOUNDATION'],
    defaultSource: 'Competitive Exam Wire',
  },
];

function decodeHtmlEntities(input: string): string {
  return input
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_m, dec) => String.fromCharCode(Number(dec)))
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractTag(block: string, tagName: string): string {
  const regex = new RegExp(`<${tagName}(?:\\s+[^>]*)?>([\\s\\S]*?)<\\/${tagName}>`, 'i');
  const match = block.match(regex);
  return match ? decodeHtmlEntities(match[1]) : '';
}

function parseRssItems(xml: string, limit = 3): Array<{
  title: string;
  link: string;
  description: string;
  pubDate: string;
  source: string;
}> {
  const items: Array<{
    title: string;
    link: string;
    description: string;
    pubDate: string;
    source: string;
  }> = [];

  const itemRegex = /<item\b[^>]*>([\s\S]*?)<\/item>/gi;
  let match: RegExpExecArray | null;
  while ((match = itemRegex.exec(xml)) !== null && items.length < limit) {
    const block = match[1];
    let title = extractTag(block, 'title');
    const link = extractTag(block, 'link');
    const description = extractTag(block, 'description');
    const pubDate = extractTag(block, 'pubDate');
    let source = extractTag(block, 'source');

    // Google News RSS often appends " - Publisher Name" to titles
    if (!source && title.includes(' - ')) {
      const idx = title.lastIndexOf(' - ');
      const candidateSource = title.slice(idx + 3).trim();
      if (candidateSource.length >= 2 && candidateSource.length <= 60) {
        source = candidateSource;
        title = title.slice(0, idx).trim();
      }
    }

    if (title && link) {
      items.push({
        title,
        link,
        description: description || title,
        pubDate: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
        source,
      });
    }
  }
  return items;
}

async function fetchExternalJsonApis(): Promise<NewsArticle[]> {
  const results: NewsArticle[] = [];

  // Optional GNews.io API if user configured GNEWS_API_KEY
  if (process.env.GNEWS_API_KEY) {
    try {
      const res = await fetch(
        `https://gnews.io/api/v4/top-headlines?country=in&lang=en&max=5&apikey=${encodeURIComponent(
          process.env.GNEWS_API_KEY
        )}`,
        { signal: AbortSignal.timeout(4000) }
      );
      if (res.ok) {
        const raw = await res.text();
        const data = (raw && raw.trim() ? JSON.parse(raw) : {}) as {
          articles?: Array<{
            title: string;
            description?: string;
            url: string;
            publishedAt?: string;
            source?: { name?: string };
          }>;
        };
        for (const a of data.articles ?? []) {
          if (!a.title || !a.url) continue;
          const id = `gnews_${crypto.createHash('sha1').update(a.url).digest('hex').slice(0, 10)}`;
          results.push({
            id,
            category: 'national',
            regionLabelEn: 'India · GNews API',
            regionLabelTe: 'భారత్ · లైవ్ API వార్తలు',
            titleEn: a.title,
            titleTe: a.title,
            deckEn: a.description || a.title,
            deckTe: a.description || a.title,
            bodyEn: [a.description || a.title],
            bodyTe: [a.description || a.title],
            examRelevanceEn: 'Current Affairs Dispatch · Relevant for GS & Competitive Exams.',
            examRelevanceTe: 'కరెంట్ అఫైర్స్ వార్త · పోటీ పరీక్షలకు ఉపయోగకరం.',
            examTracks: ['UPSC', 'SSC_BANKING'],
            sourceName: a.source?.name || 'GNews API',
            publishedAt: a.publishedAt || new Date().toISOString(),
            readTimeMin: 2,
            externalUrl: a.url,
            isLiveApi: true,
            isBreaking: true,
          });
        }
      }
    } catch {
      // Fall back silently to RSS feeds
    }
  }

  // Optional NewsAPI.org if user configured NEWS_API_KEY
  if (process.env.NEWS_API_KEY) {
    try {
      const res = await fetch(
        `https://newsapi.org/v2/top-headlines?country=in&pageSize=5&apiKey=${encodeURIComponent(
          process.env.NEWS_API_KEY
        )}`,
        { signal: AbortSignal.timeout(4000) }
      );
      if (res.ok) {
        const raw = await res.text();
        const data = (raw && raw.trim() ? JSON.parse(raw) : {}) as {
          articles?: Array<{
            title: string;
            description?: string;
            url: string;
            publishedAt?: string;
            source?: { name?: string };
          }>;
        };
        for (const a of data.articles ?? []) {
          if (!a.title || !a.url || a.title === '[Removed]') continue;
          const id = `newsapi_${crypto.createHash('sha1').update(a.url).digest('hex').slice(0, 10)}`;
          results.push({
            id,
            category: 'national',
            regionLabelEn: 'India · NewsAPI',
            regionLabelTe: 'భారత్ · లైవ్ API వార్తలు',
            titleEn: a.title,
            titleTe: a.title,
            deckEn: a.description || a.title,
            deckTe: a.description || a.title,
            bodyEn: [a.description || a.title],
            bodyTe: [a.description || a.title],
            examRelevanceEn: 'Current Affairs Dispatch · Relevant for GS & Competitive Exams.',
            examRelevanceTe: 'కరెంట్ అఫైర్స్ వార్త · పోటీ పరీక్షలకు ఉపయోగకరం.',
            examTracks: ['UPSC', 'SSC_BANKING'],
            sourceName: a.source?.name || 'NewsAPI',
            publishedAt: a.publishedAt || new Date().toISOString(),
            readTimeMin: 2,
            externalUrl: a.url,
            isLiveApi: true,
            isBreaking: true,
          });
        }
      }
    } catch {
      // Fall back silently to RSS feeds
    }
  }

  return results;
}

async function enrichBilingualWithGemini(articles: NewsArticle[]): Promise<NewsArticle[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || articles.length === 0) {
    return articles;
  }

  const subset = articles.slice(0, 8);
  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
  });

  try {
    const inputPayload = subset.map((a) => ({
      id: a.id,
      title: a.titleEn,
      summary: a.deckEn.slice(0, 220),
    }));

    const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 5500));
    const genPromise = ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: `Translate/adapt each news item into crisp natural Telugu and English (if input is already Telugu, keep Telugu and produce natural English), plus a 1-line competitive exam takeaway in both languages.\nItems:\n${JSON.stringify(
        inputPayload
      )}`,
      config: {
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              titleEn: { type: Type.STRING },
              titleTe: { type: Type.STRING },
              deckEn: { type: Type.STRING },
              deckTe: { type: Type.STRING },
              examRelevanceEn: { type: Type.STRING },
              examRelevanceTe: { type: Type.STRING },
            },
            required: [
              'id',
              'titleEn',
              'titleTe',
              'deckEn',
              'deckTe',
              'examRelevanceEn',
              'examRelevanceTe',
            ],
          },
        },
      },
    });

    const response = await Promise.race([genPromise, timeoutPromise]);
    if (!response || !response.text) return articles;

    const translations = JSON.parse(response.text.trim()) as Array<{
      id: string;
      titleEn: string;
      titleTe: string;
      deckEn: string;
      deckTe: string;
      examRelevanceEn: string;
      examRelevanceTe: string;
    }>;

    const byId = new Map(translations.map((t) => [t.id, t]));
    return articles.map((art) => {
      const tr = byId.get(art.id);
      if (!tr) return art;
      return {
        ...art,
        titleEn: tr.titleEn || art.titleEn,
        titleTe: tr.titleTe || art.titleTe,
        deckEn: tr.deckEn || art.deckEn,
        deckTe: tr.deckTe || art.deckTe,
        bodyEn: [tr.deckEn || art.deckEn],
        bodyTe: [tr.deckTe || art.deckTe],
        examRelevanceEn: tr.examRelevanceEn || art.examRelevanceEn,
        examRelevanceTe: tr.examRelevanceTe || art.examRelevanceTe,
      };
    });
  } catch {
    return articles;
  }
}

interface NewsCacheEntry {
  fetchedAt: number;
  expiresAt: number;
  liveCount: number;
  articles: NewsArticle[];
}

let newsCache: NewsCacheEntry | null = null;

export async function getAggregatedNews(forceRefresh = false): Promise<{
  articles: NewsArticle[];
  liveCount: number;
  refreshedAt: string;
  cached: boolean;
}> {
  const now = Date.now();
  if (newsCache && !forceRefresh && now < newsCache.expiresAt) {
    return {
      articles: newsCache.articles,
      liveCount: newsCache.liveCount,
      refreshedAt: new Date(newsCache.fetchedAt).toISOString(),
      cached: true,
    };
  }

  // Prevent rapid upstream hammering on forceRefresh (< 15s cooldown)
  if (newsCache && forceRefresh && now - newsCache.fetchedAt < 15_000) {
    return {
      articles: newsCache.articles,
      liveCount: newsCache.liveCount,
      refreshedAt: new Date(newsCache.fetchedAt).toISOString(),
      cached: true,
    };
  }

  const feedResults = await Promise.allSettled(
    LIVE_FEED_SOURCES.map(async (src) => {
      const res = await fetch(src.url, {
        signal: AbortSignal.timeout(4500),
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; BCRCurrentAffairs/1.0)',
          Accept: 'application/rss+xml, application/xml, text/xml',
        },
      });
      if (!res.ok) return [] as NewsArticle[];
      const xml = await res.text();
      const parsed = parseRssItems(xml, 3);
      return parsed.map((item, idx): NewsArticle => {
        const id = `live_${src.category}_${crypto
          .createHash('sha1')
          .update(item.link)
          .digest('hex')
          .slice(0, 10)}`;
        const cleanSummary =
          item.description && item.description !== item.title
            ? item.description
            : `${item.title} — Reported via ${item.source || src.defaultSource}.`;
        return {
          id,
          category: src.category,
          regionLabelEn: src.regionLabelEn,
          regionLabelTe: src.regionLabelTe,
          titleEn: item.title,
          titleTe: src.lang === 'te' ? item.title : item.title,
          deckEn: cleanSummary,
          deckTe: cleanSummary,
          bodyEn: [cleanSummary],
          bodyTe: [cleanSummary],
          examRelevanceEn: `Live Current Affairs (${src.examTracks.join(' / ')}) — Review primary policy, geographic, or institutional context.`,
          examRelevanceTe: `తాజా కరెంట్ అఫైర్స్ (${src.examTracks.join(' / ')}) — విధాన, భౌగోళిక మరియు పరీక్షా అంశాలను గమనించండి.`,
          examTracks: src.examTracks,
          sourceName: item.source || src.defaultSource,
          publishedAt: item.pubDate,
          readTimeMin: 2,
          externalUrl: item.link,
          isLiveApi: true,
          isBreaking: idx === 0,
        };
      });
    })
  );

  const apiExtras = await fetchExternalJsonApis();
  const collected: NewsArticle[] = [...apiExtras];
  const seenTitles = new Set<string>(apiExtras.map((a) => a.titleEn.toLowerCase()));

  for (const res of feedResults) {
    if (res.status === 'fulfilled') {
      for (const art of res.value) {
        const key = art.titleEn.toLowerCase();
        if (!seenTitles.has(key)) {
          seenTitles.add(key);
          collected.push(art);
        }
      }
    }
  }

  const enrichedLive = await enrichBilingualWithGemini(collected);

  // Place curated editorial lead stories with generated documentary photography first,
  // interleaved cleanly with live API news dispatches across all categories.
  const combined: NewsArticle[] = [...NEWS_ARTICLES, ...enrichedLive];

  newsCache = {
    fetchedAt: now,
    expiresAt: now + 180_000,
    liveCount: enrichedLive.length,
    articles: combined,
  };

  return {
    articles: combined,
    liveCount: enrichedLive.length,
    refreshedAt: new Date(now).toISOString(),
    cached: false,
  };
}
