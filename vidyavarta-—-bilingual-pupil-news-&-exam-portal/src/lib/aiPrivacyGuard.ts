import type {
  GroundingSource,
  LanguageMode,
  LiveBriefingPayload,
  MockQuestion,
} from '../types/portal.ts';

export interface SessionPiiContext {
  email?: string | null;
  pupilName?: string | null;
  cloudUid?: string | null;
}

const RESTRICTED_REQUEST_PATTERNS: RegExp[] = [
  /\b(gemini[_\s-]?api[_\s-]?key|api[_\s-]?key|session[_\s-]?secret|secret[_\s-]?key|private[_\s-]?key)\b/i,
  /\b(process\.env|env(?:ironment)?\s+var(?:iable)?s?|system\s+prompt|hidden\s+prompt|developer\s+prompt)\b/i,
  /\b(password[_\s-]?hash|password[_\s-]?salt|otp[_\s-]?hash|trusted[_\s-]?device[_\s-]?ids?)\b/i,
  /\b(portal-store\.json|session-secret\.key|firebase-applet-config|service[_\s-]?account)\b/i,
  /\b(admin\s+(?:data|panel|credentials|users|records|password|dump)|all\s+users(?:'|\s+data|\s+emails)?|other\s+users(?:'|\s+data|\s+emails)?|list\s+all\s+accounts|database\s+dump)\b/i,
  /\b(show|reveal|print|dump|leak|extract|give\s+me|tell\s+me)\b.{0,40}\b(api\s*key|credentials|passwords?|tokens?|cookies?|user\s*emails?|personal\s*(?:id|data|info)|admin)\b/i,
];

const SENSITIVE_QUERY_PARAMS = new Set([
  'key',
  'api_key',
  'apikey',
  'token',
  'access_token',
  'id_token',
  'secret',
  'auth',
  'password',
  'email',
  'uid',
  'session',
]);

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function containsRestrictedInfoRequest(rawText: string): boolean {
  const clean = rawText.trim();
  if (!clean) return false;
  return RESTRICTED_REQUEST_PATTERNS.some((pattern) => pattern.test(clean));
}

export function buildRestrictedRefusal(lang: LanguageMode): string {
  if (lang === 'te') {
    return 'క్షమించండి. నేను మీ ప్రస్తుత అధ్యయన సెషన్‌కు సంబంధించిన కరెంట్ అఫైర్స్ మరియు పరీక్షా అంశాలను మాత్రమే ప్రాసెస్ చేస్తాను. వ్యక్తిగత గుర్తింపు వివరాలు, API కీలు, పాస్‌వర్డ్‌లు లేదా అడ్మిన్ డేటాను నేను యాక్సెస్ చేయను మరియు వెల్లడించను.';
  }
  if (lang === 'bilingual') {
    return [
      'I can only process current affairs, academic concepts, and exam-preparation topics relevant to your active study session. I do not access, process, or disclose personal identification, API keys, credentials, or administrative data.',
      '',
      '--- తెలుగు ---',
      'నేను మీ ప్రస్తుత అధ్యయన సెషన్‌కు సంబంధించిన కరెంట్ అఫైర్స్ మరియు పరీక్షా అంశాలను మాత్రమే ప్రాసెస్ చేస్తాను. వ్యక్తిగత వివరాలు, API కీలు లేదా అడ్మిన్ డేటాను వెల్లడించను.',
    ].join('\n');
  }
  return 'I can only process current affairs, academic concepts, and exam-preparation topics relevant to your active study session. I do not access, process, or disclose personal identification, API keys, credentials, or administrative data.';
}

export function sanitizeAiText(raw: string, sessionPii?: SessionPiiContext): string {
  if (!raw) return '';
  let out = raw;

  // 1. Redact explicit active session PII if ever echoed
  if (sessionPii?.email && sessionPii.email.trim().length >= 3) {
    out = out.replace(new RegExp(escapeRegExp(sessionPii.email.trim()), 'gi'), '[redacted-email]');
  }
  if (sessionPii?.cloudUid && sessionPii.cloudUid.trim().length >= 6) {
    out = out.replace(new RegExp(escapeRegExp(sessionPii.cloudUid.trim()), 'g'), '[redacted-uid]');
  }
  if (sessionPii?.pupilName) {
    const cleanName = sessionPii.pupilName.trim();
    if (cleanName.length >= 4 && !/^(india|telugu|english|upsc|appsc|tspsc|study|current|affairs)$/i.test(cleanName)) {
      out = out.replace(new RegExp(`\\b${escapeRegExp(cleanName)}\\b`, 'gi'), '[pupil]');
    }
  }

  // 2. Redact API keys, OAuth tokens, JWTs, private keys, and credentials
  out = out.replace(
    /-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]*?-----END [A-Z ]*PRIVATE KEY-----/g,
    '[redacted-private-key]'
  );
  out = out.replace(/\bAIza[0-9A-Za-z\-_]{20,}\b/g, '[redacted-api-key]');
  out = out.replace(
    /\b(?:sk-[a-zA-Z0-9_-]{16,}|ghp_[a-zA-Z0-9]{20,}|gho_[a-zA-Z0-9]{20,}|ya29\.[0-9A-Za-z\-_]{15,}|AKIA[0-9A-Z]{16}|xox[baprs]-[0-9A-Za-z-]{10,})\b/g,
    '[redacted-api-key]'
  );
  out = out.replace(/\bBearer\s+[A-Za-z0-9\-_.~+/]+=*/gi, 'Bearer [redacted-token]');
  out = out.replace(
    /\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/g,
    '[redacted-token]'
  );

  // 3. Redact email addresses, phone numbers, and Aadhaar-like identifiers
  out = out.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[redacted-email]');
  out = out.replace(
    /(?:\+91[\s-]?|(?:\+\d{1,3}[\s.-]))[6-9]\d{4}[\s-]?\d{5}\b/g,
    '[redacted-phone]'
  );
  out = out.replace(/\b[6-9]\d{9}\b/g, '[redacted-phone]');
  out = out.replace(/\b\d{4}\s\d{4}\s\d{4}\b/g, '[redacted-id]');

  // 4. Redact internal server/admin/env names if echoed
  out = out.replace(
    /\b(GEMINI_API_KEY|SESSION_SECRET|FIREBASE_ADMIN|portal-store\.json|session-secret\.key|passwordHash|passwordSalt|trustedDeviceIds|otpHash|vv_session|vv_trusted_device)\b/g,
    '[redacted-internal]'
  );

  return out;
}

export function sanitizeAiInput(raw: string, sessionPii?: SessionPiiContext): string {
  return sanitizeAiText(raw, sessionPii).trim();
}

export function sanitizeGroundingSources(
  sources: GroundingSource[],
  sessionPii?: SessionPiiContext
): GroundingSource[] {
  const safe: GroundingSource[] = [];
  for (const src of sources) {
    if (!src || typeof src.uri !== 'string') continue;
    try {
      const parsed = new URL(src.uri);
      if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') continue;
      parsed.username = '';
      parsed.password = '';
      for (const param of Array.from(parsed.searchParams.keys())) {
        if (SENSITIVE_QUERY_PARAMS.has(param.toLowerCase())) {
          parsed.searchParams.delete(param);
        }
      }
      safe.push({
        title: sanitizeAiText(String(src.title || parsed.hostname), sessionPii).slice(0, 120),
        uri: parsed.toString(),
      });
    } catch {
      // skip invalid URLs
    }
  }
  return safe;
}

export function sanitizeQuizQuestions(
  questions: MockQuestion[],
  sessionPii?: SessionPiiContext
): MockQuestion[] {
  return questions.map((q) => {
    const cleanOptionsEn = (Array.isArray(q.optionsEn) ? q.optionsEn : [])
      .slice(0, 4)
      .map((opt) => sanitizeAiText(String(opt ?? ''), sessionPii));
    const cleanOptionsTe = (Array.isArray(q.optionsTe) ? q.optionsTe : [])
      .slice(0, 4)
      .map((opt) => sanitizeAiText(String(opt ?? ''), sessionPii));
    while (cleanOptionsEn.length < 4) cleanOptionsEn.push('N/A');
    while (cleanOptionsTe.length < 4) cleanOptionsTe.push('వర్తించదు');

    return {
      ...q,
      questionEn: sanitizeAiText(String(q.questionEn ?? ''), sessionPii),
      questionTe: sanitizeAiText(String(q.questionTe ?? ''), sessionPii),
      optionsEn: cleanOptionsEn as [string, string, string, string],
      optionsTe: cleanOptionsTe as [string, string, string, string],
      correctIndex:
        typeof q.correctIndex === 'number' && q.correctIndex >= 0 && q.correctIndex <= 3
          ? q.correctIndex
          : 0,
      explanationEn: sanitizeAiText(String(q.explanationEn ?? ''), sessionPii),
      explanationTe: sanitizeAiText(String(q.explanationTe ?? ''), sessionPii),
    };
  });
}

export function sanitizeBriefingPayload(payload: LiveBriefingPayload): LiveBriefingPayload {
  return {
    generatedAt: payload.generatedAt,
    cached: Boolean(payload.cached),
    items: (payload.items || []).map((item) => ({
      headlineEn: sanitizeAiText(item.headlineEn),
      headlineTe: sanitizeAiText(item.headlineTe),
      summaryEn: sanitizeAiText(item.summaryEn),
      summaryTe: sanitizeAiText(item.summaryTe),
      scope: item.scope,
      examTipEn: sanitizeAiText(item.examTipEn),
      examTipTe: sanitizeAiText(item.examTipTe),
    })),
    sources: sanitizeGroundingSources(payload.sources || []),
  };
}
