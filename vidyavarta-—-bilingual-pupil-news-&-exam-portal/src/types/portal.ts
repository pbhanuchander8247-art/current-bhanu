export type EducationLevel =
  | 'high_school'
  | 'intermediate'
  | 'undergraduate'
  | 'postgraduate'
  | 'competitive_aspirant';

export type LanguageMode = 'en' | 'te' | 'bilingual';

export type ThemeMode = 'light' | 'dark';

export type RefreshIntervalSec = 0 | 30 | 120 | 300;

export type NewsCategory =
  | 'regional'
  | 'national'
  | 'international'
  | 'science'
  | 'economy'
  | 'exams';

export type ExamTrack = 'UPSC' | 'APPSC_TSPSC' | 'SSC_BANKING' | 'FOUNDATION';

export interface PupilSession {
  pupilName: string;
  email: string;
  educationLevel: EducationLevel;
  preferredLang: LanguageMode;
  preferredTheme: ThemeMode;
  refreshIntervalSec: RefreshIntervalSec;
  otpVerified: boolean;
  verifiedAt: string;
  sessionStable: boolean;
  cloudUid?: string | null;
  hasPassword?: boolean;
}

export interface NewsArticle {
  id: string;
  category: NewsCategory;
  regionLabelEn: string;
  regionLabelTe: string;
  titleEn: string;
  titleTe: string;
  deckEn: string;
  deckTe: string;
  bodyEn: string[];
  bodyTe: string[];
  examRelevanceEn: string;
  examRelevanceTe: string;
  examTracks: ExamTrack[];
  sourceName: string;
  publishedAt: string;
  readTimeMin: number;
  imageUrl?: string;
  imageCaptionEn?: string;
  imageCaptionTe?: string;
  isBreaking?: boolean;
  externalUrl?: string;
  isLiveApi?: boolean;
}

export interface ExamUpdate {
  id: string;
  examBody: string;
  track: ExamTrack;
  titleEn: string;
  titleTe: string;
  summaryEn: string;
  summaryTe: string;
  deadlineDate: string;
  stageEn: string;
  stageTe: string;
  eligibleLevels: EducationLevel[];
}

export interface MockQuestion {
  id: string;
  subjectEn: string;
  subjectTe: string;
  questionEn: string;
  questionTe: string;
  optionsEn: [string, string, string, string];
  optionsTe: [string, string, string, string];
  correctIndex: number;
  explanationEn: string;
  explanationTe: string;
}

export interface MockTest {
  id: string;
  track: ExamTrack;
  titleEn: string;
  titleTe: string;
  subtitleEn: string;
  subtitleTe: string;
  durationMinutes: number;
  questions: MockQuestion[];
}

export interface MockTestAttemptRecord {
  id: string;
  testId: string;
  testTitle: string;
  examTrack: ExamTrack;
  score: number;
  totalQuestions: number;
  accuracyPct: number;
  durationSec: number;
  createdAt: string;
}

export interface GlossaryTerm {
  id: string;
  termEn: string;
  termTe: string;
  pronunciationTe: string;
  domain: 'Polity' | 'Economy' | 'Science' | 'Diplomacy' | 'Ecology';
  definitionEn: string;
  definitionTe: string;
  examNoteEn: string;
  examNoteTe: string;
}

export interface InfographicDataPoint {
  id: string;
  labelEn: string;
  labelTe: string;
  value: number;
  unit: string;
  detailEn: string;
  detailTe: string;
  colorHex: string;
}

export interface InfographicModule {
  id: string;
  titleEn: string;
  titleTe: string;
  subtitleEn: string;
  subtitleTe: string;
  sourceNote: string;
  chartType: 'bar' | 'donut' | 'timeline';
  points: InfographicDataPoint[];
}

export interface GroundedBriefingItem {
  headlineEn: string;
  headlineTe: string;
  summaryEn: string;
  summaryTe: string;
  scope: 'Regional' | 'National' | 'International';
  examTipEn: string;
  examTipTe: string;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface LiveBriefingPayload {
  generatedAt: string;
  items: GroundedBriefingItem[];
  sources: GroundingSource[];
  cached: boolean;
}
