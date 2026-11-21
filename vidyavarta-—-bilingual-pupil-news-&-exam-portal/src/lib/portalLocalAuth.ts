import type {
  EducationLevel,
  LanguageMode,
  MockTestAttemptRecord,
  PupilSession,
  RefreshIntervalSec,
  ThemeMode,
} from '../types/portal';

const STORAGE_KEY = 'bcr_portal_local_auth_v1';

interface LocalPupilRecord {
  email: string;
  pupilName: string;
  educationLevel: EducationLevel;
  preferredLang: LanguageMode;
  preferredTheme: ThemeMode;
  refreshIntervalSec: RefreshIntervalSec;
  otpVerified: boolean;
  verifiedAt: string;
  trusted: boolean;
  passwordSalt?: string;
  passwordHash?: string;
  cloudUid?: string | null;
  bookmarks: string[];
  attempts: MockTestAttemptRecord[];
}

interface LocalAuthStore {
  activeEmail: string | null;
  pupils: Record<string, LocalPupilRecord>;
}

interface PendingLocalChallenge {
  challengeId: string;
  email: string;
  pupilName: string;
  educationLevel: EducationLevel;
  salt: string;
  otpHash: string;
  expiresAt: number;
  attempts: number;
}

const pendingChallenges = new Map<string, PendingLocalChallenge>();

const VALID_LEVELS = new Set<EducationLevel>([
  'high_school',
  'intermediate',
  'undergraduate',
  'postgraduate',
  'competitive_aspirant',
]);

function normalizeEmail(raw: string): string {
  return raw.trim().toLowerCase();
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) && email.length <= 160;
}

function loadStore(): LocalAuthStore {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as LocalAuthStore;
      if (parsed && typeof parsed.pupils === 'object') {
        return parsed;
      }
    }
  } catch {
    // ignore storage errors
  }
  return { activeEmail: null, pupils: {} };
}

function saveStore(store: LocalAuthStore): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // ignore quota errors
  }
}

function toPublicPupil(record: LocalPupilRecord): PupilSession {
  return {
    pupilName: record.pupilName,
    email: record.email,
    educationLevel: record.educationLevel,
    preferredLang: record.preferredLang,
    preferredTheme: record.preferredTheme,
    refreshIntervalSec: record.refreshIntervalSec,
    otpVerified: record.otpVerified,
    verifiedAt: record.verifiedAt,
    sessionStable: true,
    cloudUid: record.cloudUid ?? null,
    hasPassword: Boolean(record.passwordHash),
  };
}

function randomHex(byteLen: number): string {
  const bytes = new Uint8Array(byteLen);
  window.crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

function randomSixDigitOtp(): string {
  const arr = new Uint32Array(1);
  window.crypto.getRandomValues(arr);
  return String(100000 + (arr[0] % 900000));
}

async function sha256Hex(input: string): Promise<string> {
  if (window.crypto?.subtle) {
    const data = new TextEncoder().encode(input);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('');
  }
  return input;
}

export function isBackendMissingStatus(status: number): boolean {
  return status === 404 || status === 405;
}

export function localGetSession(): {
  authenticated: boolean;
  pupil: PupilSession | null;
} {
  const store = loadStore();
  if (store.activeEmail) {
    const active = store.pupils[normalizeEmail(store.activeEmail)];
    if (active && active.otpVerified) {
      return {
        authenticated: true,
        pupil: toPublicPupil(active),
      };
    }
  }
  return {
    authenticated: false,
    pupil: null,
  };
}

export async function localRegisterWithPassword(input: {
  pupilName: string;
  educationLevel: EducationLevel;
  email: string;
  password: string;
}): Promise<{ ok: boolean; error?: string; authenticated?: boolean; pupil?: PupilSession }> {
  const pupilName = input.pupilName.trim();
  const email = normalizeEmail(input.email);
  const educationLevel = input.educationLevel;
  const password = input.password;

  if (pupilName.length < 2 || pupilName.length > 80) {
    return { ok: false, error: 'Pupil name must be between 2 and 80 characters.' };
  }
  if (!VALID_LEVELS.has(educationLevel)) {
    return { ok: false, error: 'Please select a valid education level.' };
  }
  if (!isValidEmail(email)) {
    return { ok: false, error: 'Please enter a valid email address.' };
  }
  if (password.length < 8 || password.length > 128) {
    return { ok: false, error: 'Password must be between 8 and 128 characters.' };
  }

  const store = loadStore();
  if (store.pupils[email]) {
    return { ok: false, error: 'An account with this email already exists. Please sign in.' };
  }

  const salt = randomHex(16);
  const passwordHash = await sha256Hex(`${salt}:${password}`);
  const record: LocalPupilRecord = {
    email,
    pupilName,
    educationLevel,
    preferredLang: 'bilingual',
    preferredTheme: 'light',
    refreshIntervalSec: 120,
    otpVerified: true,
    verifiedAt: new Date().toISOString(),
    trusted: true,
    passwordSalt: salt,
    passwordHash,
    cloudUid: null,
    bookmarks: [],
    attempts: [],
  };

  store.pupils[email] = record;
  store.activeEmail = email;
  saveStore(store);

  return {
    ok: true,
    authenticated: true,
    pupil: toPublicPupil(record),
  };
}

export async function localLoginWithPassword(input: {
  email: string;
  password: string;
}): Promise<{ ok: boolean; error?: string; authenticated?: boolean; pupil?: PupilSession }> {
  const email = normalizeEmail(input.email);
  const password = input.password;

  if (!isValidEmail(email) || password.length < 8 || password.length > 128) {
    return { ok: false, error: 'Enter a valid email address and password (min 8 characters).' };
  }

  const store = loadStore();
  const record = store.pupils[email];
  if (!record || !record.passwordSalt || !record.passwordHash) {
    return { ok: false, error: 'Invalid email or password.' };
  }

  const candidateHash = await sha256Hex(`${record.passwordSalt}:${password}`);
  if (candidateHash !== record.passwordHash) {
    return { ok: false, error: 'Invalid email or password.' };
  }

  store.activeEmail = email;
  saveStore(store);

  return {
    ok: true,
    authenticated: true,
    pupil: toPublicPupil(record),
  };
}

export async function localSetPassword(newPassword: string): Promise<PupilSession | null> {
  if (newPassword.length < 8 || newPassword.length > 128) return null;
  const store = loadStore();
  if (!store.activeEmail) return null;
  const record = store.pupils[normalizeEmail(store.activeEmail)];
  if (!record) return null;
  const salt = randomHex(16);
  record.passwordSalt = salt;
  record.passwordHash = await sha256Hex(`${salt}:${newPassword}`);
  saveStore(store);
  return toPublicPupil(record);
}

export async function localRequestOtp(input: {
  pupilName: string;
  educationLevel: EducationLevel;
  email: string;
}): Promise<{
  ok: boolean;
  error?: string;
  status?: string;
  authenticated?: boolean;
  pupil?: PupilSession;
  challengeId?: string;
  dispatchPreviewOtp?: string;
}> {
  const pupilName = input.pupilName.trim();
  const email = normalizeEmail(input.email);
  const educationLevel = input.educationLevel;

  if (pupilName.length < 2 || pupilName.length > 80) {
    return { ok: false, error: 'Pupil name must be between 2 and 80 characters.' };
  }
  if (!VALID_LEVELS.has(educationLevel)) {
    return { ok: false, error: 'Please select a valid education level.' };
  }
  if (!isValidEmail(email)) {
    return { ok: false, error: 'Please enter a valid email address.' };
  }

  const store = loadStore();
  const existing = store.pupils[email];
  if (existing?.passwordHash) {
    return {
      ok: false,
      error: 'This account uses a password. Please sign in with your email and password.',
    };
  }

  const otp = randomSixDigitOtp();
  const salt = randomHex(12);
  const challengeId = randomHex(16);
  const otpHash = await sha256Hex(`${salt}:${otp}`);

  pendingChallenges.set(challengeId, {
    challengeId,
    email,
    pupilName,
    educationLevel,
    salt,
    otpHash,
    expiresAt: Date.now() + 5 * 60 * 1000,
    attempts: 0,
  });

  return {
    ok: true,
    status: 'otp_required',
    challengeId,
    dispatchPreviewOtp: otp,
  };
}

export async function localVerifyOtp(input: {
  challengeId: string;
  email: string;
  otp: string;
}): Promise<{
  ok: boolean;
  error?: string;
  authenticated?: boolean;
  pupil?: PupilSession;
}> {
  const challengeId = input.challengeId.trim();
  const email = normalizeEmail(input.email);
  const otp = input.otp.trim();

  if (!challengeId || !/^\d{6}$/.test(otp)) {
    return { ok: false, error: 'Enter the 6-digit numeric passcode.' };
  }

  const challenge = pendingChallenges.get(challengeId);
  if (!challenge || challenge.email !== email) {
    return {
      ok: false,
      error: 'Verification challenge expired or invalid. Request a new code.',
    };
  }
  if (Date.now() > challenge.expiresAt) {
    pendingChallenges.delete(challengeId);
    return { ok: false, error: 'One-time passcode expired. Please request a fresh code.' };
  }
  if (challenge.attempts >= 5) {
    pendingChallenges.delete(challengeId);
    return { ok: false, error: 'Maximum verification attempts reached. Request a new code.' };
  }

  challenge.attempts += 1;
  const candidateHash = await sha256Hex(`${challenge.salt}:${otp}`);
  if (candidateHash !== challenge.otpHash) {
    return {
      ok: false,
      error: `Invalid passcode. ${5 - challenge.attempts} attempts remaining.`,
    };
  }

  pendingChallenges.delete(challengeId);
  const store = loadStore();
  const existing = store.pupils[email];
  const nowIso = new Date().toISOString();
  const record: LocalPupilRecord = existing
    ? {
        ...existing,
        pupilName: challenge.pupilName,
        educationLevel: challenge.educationLevel,
        otpVerified: true,
        trusted: true,
        verifiedAt: existing.verifiedAt || nowIso,
      }
    : {
        email,
        pupilName: challenge.pupilName,
        educationLevel: challenge.educationLevel,
        preferredLang: 'bilingual',
        preferredTheme: 'light',
        refreshIntervalSec: 120,
        otpVerified: true,
        verifiedAt: nowIso,
        trusted: true,
        bookmarks: [],
        attempts: [],
      };

  store.pupils[email] = record;
  store.activeEmail = email;
  saveStore(store);

  return {
    ok: true,
    authenticated: true,
    pupil: toPublicPupil(record),
  };
}

export function localUpdatePreferences(updates: {
  preferredLang?: LanguageMode;
  preferredTheme?: ThemeMode;
  refreshIntervalSec?: RefreshIntervalSec;
  educationLevel?: EducationLevel;
}): PupilSession | null {
  const store = loadStore();
  if (!store.activeEmail) return null;
  const record = store.pupils[normalizeEmail(store.activeEmail)];
  if (!record) return null;
  if (updates.preferredLang) record.preferredLang = updates.preferredLang;
  if (updates.preferredTheme) record.preferredTheme = updates.preferredTheme;
  if (updates.refreshIntervalSec !== undefined) {
    record.refreshIntervalSec = updates.refreshIntervalSec;
  }
  if (updates.educationLevel && VALID_LEVELS.has(updates.educationLevel)) {
    record.educationLevel = updates.educationLevel;
  }
  saveStore(store);
  return toPublicPupil(record);
}

export function localLogout(forgetDevice: boolean): void {
  const store = loadStore();
  if (forgetDevice && store.activeEmail) {
    const record = store.pupils[normalizeEmail(store.activeEmail)];
    if (record) {
      record.trusted = false;
    }
  }
  store.activeEmail = null;
  saveStore(store);
}

export function localGetRecords(): {
  bookmarks: string[];
  attempts: MockTestAttemptRecord[];
} {
  const store = loadStore();
  if (!store.activeEmail) return { bookmarks: [], attempts: [] };
  const record = store.pupils[normalizeEmail(store.activeEmail)];
  return {
    bookmarks: record?.bookmarks || [],
    attempts: record?.attempts || [],
  };
}

export function localToggleBookmark(articleId: string): string[] {
  const store = loadStore();
  if (!store.activeEmail) return [];
  const record = store.pupils[normalizeEmail(store.activeEmail)];
  if (!record) return [];
  if (record.bookmarks.includes(articleId)) {
    record.bookmarks = record.bookmarks.filter((id) => id !== articleId);
  } else {
    record.bookmarks = [articleId, ...record.bookmarks];
  }
  saveStore(store);
  return record.bookmarks;
}

export function localRecordAttempt(
  attempt: Omit<MockTestAttemptRecord, 'id' | 'createdAt'>
): { id: string; attempts: MockTestAttemptRecord[] } {
  const store = loadStore();
  const id = `att_${Date.now()}`;
  if (!store.activeEmail) return { id, attempts: [] };
  const record = store.pupils[normalizeEmail(store.activeEmail)];
  if (!record) return { id, attempts: [] };
  const next: MockTestAttemptRecord = {
    ...attempt,
    id,
    createdAt: new Date().toISOString(),
  };
  record.attempts = [next, ...(record.attempts || [])].slice(0, 50);
  saveStore(store);
  return { id, attempts: record.attempts };
}

export function localSyncVerifiedPupil(pupil: PupilSession): void {
  const email = normalizeEmail(pupil.email);
  if (!isValidEmail(email)) return;
  const store = loadStore();
  const existing = store.pupils[email];
  store.pupils[email] = {
    email,
    pupilName: pupil.pupilName,
    educationLevel: pupil.educationLevel,
    preferredLang: pupil.preferredLang || existing?.preferredLang || 'bilingual',
    preferredTheme: pupil.preferredTheme || existing?.preferredTheme || 'light',
    refreshIntervalSec: pupil.refreshIntervalSec ?? existing?.refreshIntervalSec ?? 120,
    otpVerified: true,
    verifiedAt: pupil.verifiedAt || existing?.verifiedAt || new Date().toISOString(),
    trusted: true,
    passwordSalt: existing?.passwordSalt,
    passwordHash: existing?.passwordHash,
    cloudUid: pupil.cloudUid ?? existing?.cloudUid ?? null,
    bookmarks: existing?.bookmarks || [],
    attempts: existing?.attempts || [],
  };
  store.activeEmail = email;
  saveStore(store);
}
