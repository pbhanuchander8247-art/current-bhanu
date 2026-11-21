import {
  EXAM_UPDATES,
  GLOSSARY_TERMS,
  INFOGRAPHIC_MODULES,
  MOCK_TESTS,
  NEWS_ARTICLES,
} from '../data/bilingualContent.ts';
import {
  buildRestrictedRefusal,
  containsRestrictedInfoRequest,
  sanitizeAiInput,
  sanitizeAiText,
  sanitizeGroundingSources,
  sanitizeQuizQuestions,
} from './aiPrivacyGuard.ts';
import type {
  EducationLevel,
  GroundingSource,
  LanguageMode,
  MockQuestion,
} from '../types/portal.ts';

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 2);
}

function scoreMatch(queryTokens: string[], haystack: string): number {
  const lower = haystack.toLowerCase();
  let score = 0;
  for (const tok of queryTokens) {
    if (lower.includes(tok)) {
      score += tok.length >= 5 ? 3 : 1;
    }
  }
  return score;
}

export function extractReadableApiError(rawError: string | null | undefined, fallback: string): string {
  if (!rawError) return fallback;
  const trimmed = rawError.trim();
  if (trimmed.startsWith('{')) {
    try {
      const parsed = JSON.parse(trimmed) as { error?: { message?: string; code?: number } | string };
      if (typeof parsed.error === 'string') return sanitizeAiText(parsed.error);
      if (parsed.error && typeof parsed.error === 'object' && parsed.error.message) {
        return sanitizeAiText(parsed.error.message);
      }
    } catch {
      // fall through
    }
  }
  return sanitizeAiText(trimmed);
}

export function buildGroundedMentorFallback(input: {
  prompt: string;
  lang: LanguageMode;
  educationLevel: EducationLevel;
  context?: string;
  liveHeadlines?: { titleEn: string; titleTe: string; deckEn: string; externalUrl?: string; sourceName?: string }[];
}): { answer: string; sources: GroundingSource[] } {
  const cleanPrompt = sanitizeAiInput(input.prompt);
  const cleanContext = sanitizeAiInput(input.context || '');
  if (containsRestrictedInfoRequest(`${cleanPrompt} ${cleanContext}`)) {
    return {
      answer: buildRestrictedRefusal(input.lang),
      sources: [],
    };
  }
  const tokens = tokenize(`${cleanPrompt} ${cleanContext}`);
  const isTe = input.lang === 'te';
  const isDual = input.lang === 'bilingual';

  const matchedArticles = NEWS_ARTICLES.map((a) => ({
    item: a,
    score: scoreMatch(
      tokens,
      `${a.titleEn} ${a.titleTe} ${a.deckEn} ${a.deckTe} ${a.examRelevanceEn} ${a.bodyEn.join(' ')}`
    ),
  }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
    .map((x) => x.item);

  const matchedTerms = GLOSSARY_TERMS.map((g) => ({
    item: g,
    score: scoreMatch(
      tokens,
      `${g.termEn} ${g.termTe} ${g.definitionEn} ${g.definitionTe} ${g.examNoteEn}`
    ),
  }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
    .map((x) => x.item);

  const matchedQuestions = MOCK_TESTS.flatMap((t) => t.questions)
    .map((q) => ({
      item: q,
      score: scoreMatch(
        tokens,
        `${q.questionEn} ${q.questionTe} ${q.explanationEn} ${q.explanationTe}`
      ),
    }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
    .map((x) => x.item);

  const matchedLive = (input.liveHeadlines || [])
    .map((h) => ({
      item: h,
      score: scoreMatch(tokens, `${h.titleEn} ${h.titleTe} ${h.deckEn}`),
    }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
    .map((x) => x.item);

  const enLines: string[] = [];
  const teLines: string[] = [];
  const sources: GroundingSource[] = [];

  if (cleanContext) {
    const snippet = cleanContext.slice(0, 280);
    enLines.push(`• Context Summary: ${snippet}${cleanContext.length > 280 ? '...' : ''}`);
    teLines.push(`• సందర్భ సారాంశం: ${snippet}${cleanContext.length > 280 ? '...' : ''}`);
  }

  for (const t of matchedTerms) {
    enLines.push(`• ${t.termEn}: ${t.definitionEn}`);
    enLines.push(`  Exam Tip: ${t.examNoteEn}`);
    teLines.push(`• ${t.termTe}: ${t.definitionTe}`);
    teLines.push(`  పరీక్షా సూచన: ${t.examNoteTe}`);
  }

  for (const a of matchedArticles) {
    enLines.push(`• ${a.titleEn} — ${a.deckEn}`);
    enLines.push(`  Exam Focus: ${a.examRelevanceEn}`);
    teLines.push(`• ${a.titleTe} — ${a.deckTe}`);
    teLines.push(`  పరీక్షా ప్రాముఖ్యత: ${a.examRelevanceTe}`);
  }

  for (const l of matchedLive) {
    enLines.push(`• Live Dispatch (${l.sourceName || 'News Wire'}): ${l.titleEn} — ${l.deckEn}`);
    teLines.push(`• తాజా వార్త (${l.sourceName || 'వార్తా సేవ'}): ${l.titleTe || l.titleEn}`);
    if (l.externalUrl) {
      sources.push({ title: `${l.sourceName || 'News'}: ${l.titleEn.slice(0, 60)}`, uri: l.externalUrl });
    }
  }

  for (const q of matchedQuestions) {
    enLines.push(`• Practice Question: ${q.questionEn}`);
    enLines.push(`  Answer: ${q.optionsEn[q.correctIndex]} (${q.explanationEn})`);
    teLines.push(`• అభ్యాస ప్రశ్న: ${q.questionTe}`);
    teLines.push(`  సమాధానం: ${q.optionsTe[q.correctIndex]} (${q.explanationTe})`);
  }

  // Fallback general exam study framework if query didn't match curated items
  if (enLines.length === 0) {
    const topUpdate = EXAM_UPDATES[0];
    const topInfo = INFOGRAPHIC_MODULES[0];
    enLines.push(
      `• Key Exam Perspective (${input.educationLevel.replace('_', ' ')}): Break "${cleanPrompt}" into 3 pillars: (1) Constitutional / Institutional mandate, (2) Recent policy or economic metrics, and (3) Prelims vs Mains comparative points.`,
      `• Related Current Focus: ${topUpdate.titleEn} — ${topUpdate.summaryEn}`,
      `• Visual Data Reference: ${topInfo.titleEn} (${topInfo.subtitleEn})`
    );
    teLines.push(
      `• పరీక్షా దృక్కోణం: "${cleanPrompt}" అంశాన్ని 3 భాగాలుగా అధ్యయనం చేయండి: (1) రాజ్యాంగ/సంస్థాగత నేపథ్యం, (2) ఇటీవలి విధాన గణాంకాలు, (3) ప్రిలిమ్స్ & మెయిన్స్ ముఖ్య అంశాలు.`,
      `• సంబంధిత సమకాలీన అంశం: ${topUpdate.titleTe} — ${topUpdate.summaryTe}`,
      `• డేటా సూచన: ${topInfo.titleTe} (${topInfo.subtitleTe})`
    );
  }

  let answer = '';
  if (isTe) {
    answer = teLines.join('\n');
  } else if (isDual) {
    answer = `${enLines.join('\n')}\n\n--- తెలుగు సారాంశం ---\n${teLines.join('\n')}`;
  } else {
    answer = enLines.join('\n');
  }

  return {
    answer: sanitizeAiText(answer),
    sources: sanitizeGroundingSources(sources),
  };
}

export function buildArticleQuizFallback(title: string, summary: string): MockQuestion[] {
  const cleanTitle = sanitizeAiInput(title);
  const cleanSummary = sanitizeAiInput(summary);
  const tokens = tokenize(`${cleanTitle} ${cleanSummary}`);
  const ranked = MOCK_TESTS.flatMap((t) => t.questions)
    .map((q) => ({
      q,
      score: scoreMatch(tokens, `${q.questionEn} ${q.explanationEn}`),
    }))
    .sort((a, b) => b.score - a.score);

  const selected: MockQuestion[] = [];
  const headlineQuestion: MockQuestion = {
    id: `story_q_${Date.now()}`,
    subjectEn: 'Current Affairs',
    subjectTe: 'కరెంట్ అఫైర్స్',
    questionEn: `Which statement accurately summarizes the core focus of "${cleanTitle.split('/')[0].trim()}"?`,
    questionTe: `"${cleanTitle.split('/').pop()?.trim() || cleanTitle}" వార్త యొక్క ప్రధాన అంశాన్ని ఏ వాక్యం సరిగ్గా వివరిస్తుంది?`,
    optionsEn: [
      cleanSummary.split('\n')[0].slice(0, 140) || 'Policy & regional development dispatch',
      'It strictly suspends all inter-state coordination mechanisms',
      'It eliminates digital public infrastructure initiatives nationwide',
      'None of the above statements apply',
    ],
    optionsTe: [
      cleanSummary.split('\n')[0].slice(0, 140) || 'విధాన మరియు ప్రాంతీయ అభివృద్ధి వార్త',
      'ఇది అన్ని అంతర్రాష్ట్ర సమన్వయ వ్యవస్థలను రద్దు చేస్తుంది',
      'ఇది దేశవ్యాప్తంగా డిజిటల్ విద్యా కార్యక్రమాలను నిలిపివేస్తుంది',
      'పైవేవీ కావు',
    ],
    correctIndex: 0,
    explanationEn: `Grounded directly in the dispatch summary: ${cleanSummary.split('\n')[0].slice(0, 180)}`,
    explanationTe: `వార్తా సారాంశం ఆధారంగా మొదటి ఎంపిక సరైనది.`,
  };
  selected.push(headlineQuestion);

  for (const item of ranked) {
    if (selected.length >= 3) break;
    if (!selected.some((s) => s.id === item.q.id)) {
      selected.push(item.q);
    }
  }
  return sanitizeQuizQuestions(selected.slice(0, 3));
}

export function buildGlossaryExplainFallback(
  termEn: string,
  termTe: string,
  educationLevel: EducationLevel
): string {
  const cleanEn = sanitizeAiInput(termEn);
  const cleanTe = sanitizeAiInput(termTe);
  const found = GLOSSARY_TERMS.find(
    (g) => g.termEn.toLowerCase() === cleanEn.toLowerCase()
  );
  if (found) {
    return sanitizeAiText(
      [
        `1) Concept (${educationLevel.replace('_', ' ')}): ${found.definitionEn}`,
        `2) Exam & Policy Relevance: ${found.examNoteEn}`,
        `3) Common Exam Trap: Avoid confusing "${found.termEn}" with short-term market liquidity indicators; verify the statutory authority involved.`,
        `4) తెలుగు సారాంశం (${found.termTe}): ${found.definitionTe} ${found.examNoteTe}`,
      ].join('\n\n')
    );
  }
  return sanitizeAiText(
    [
      `1) Concept (${educationLevel.replace('_', ' ')}): ${cleanEn} refers to a core policy/academic framework frequently tested in competitive exams.`,
      `2) Policy Example: Track official RBI, Union Budget, and AP/Telangana institutional releases referencing ${cleanEn}.`,
      `3) Common Exam Trap: Watch for inverted cause-and-effect wording in Prelims statements.`,
      `4) తెలుగు సారాంశం (${cleanTe}): ${cleanEn} అంశానికి సంబంధించిన నిర్వచనం మరియు ప్రభుత్వ విధాన ఉదాహరణలను ప్రిలిమ్స్ కోసం పునశ్చరణ చేయండి.`,
    ].join('\n\n')
  );
}
