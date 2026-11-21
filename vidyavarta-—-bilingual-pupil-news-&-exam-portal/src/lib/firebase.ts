import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocFromServer,
  getDocs,
  getFirestore,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import type {
  EducationLevel,
  ExamTrack,
  LanguageMode,
  MockTestAttemptRecord,
  NewsCategory,
  RefreshIntervalSec,
  ThemeMode,
} from '../types/portal';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

let connectionTested = false;
export async function testConnection(): Promise<boolean> {
  if (connectionTested) return true;
  connectionTested = true;
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
      return false;
    }
    return true;
  }
}

const VALID_ID_REGEX = /^[a-zA-Z0-9_-]+$/;

function sanitizeId(raw: string, maxLen = 64): string {
  const cleaned = raw.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, maxLen);
  return VALID_ID_REGEX.test(cleaned) && cleaned.length > 0 ? cleaned : 'record_1';
}

function clampString(val: string, minLen: number, maxLen: number, fallback: string): string {
  const trimmed = val.trim();
  if (trimmed.length < minLen) return fallback;
  return trimmed.slice(0, maxLen);
}

export async function signInWithGoogleCloud() {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

export async function signOutFirebaseCloud() {
  await firebaseSignOut(auth);
}

export async function syncPupilToFirestore(params: {
  uid: string;
  pupilName: string;
  email: string;
  educationLevel: EducationLevel;
  preferredLang: LanguageMode;
  preferredTheme: ThemeMode;
  refreshIntervalSec: RefreshIntervalSec;
  otpVerified: boolean;
}) {
  const uid = sanitizeId(params.uid, 128);
  const profilePath = `users/${uid}`;
  const contactPath = `users/${uid}/private/contact`;

  const cleanName = clampString(params.pupilName, 2, 80, 'Pupil');
  const cleanEmail = clampString(params.email, 5, 160, 'pupil@example.com');

  try {
    const profileRef = doc(db, 'users', uid);
    const existingSnap = await getDoc(profileRef);
    if (!existingSnap.exists()) {
      await setDoc(profileRef, {
        uid,
        pupilName: cleanName,
        educationLevel: params.educationLevel,
        preferredLang: params.preferredLang,
        preferredTheme: params.preferredTheme,
        refreshIntervalSec: params.refreshIntervalSec,
        otpVerified: Boolean(params.otpVerified),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } else {
      await updateDoc(profileRef, {
        pupilName: cleanName,
        educationLevel: params.educationLevel,
        otpVerified: Boolean(params.otpVerified),
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, profilePath);
  }

  try {
    const contactRef = doc(db, 'users', uid, 'private', 'contact');
    const contactSnap = await getDoc(contactRef);
    if (!contactSnap.exists()) {
      await setDoc(contactRef, {
        uid,
        email: cleanEmail,
        otpVerifiedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } else {
      await updateDoc(contactRef, {
        email: cleanEmail,
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, contactPath);
  }
}

export async function updateFirestorePreferences(params: {
  uid: string;
  preferredLang: LanguageMode;
  preferredTheme: ThemeMode;
  refreshIntervalSec: RefreshIntervalSec;
}) {
  const uid = sanitizeId(params.uid, 128);
  const profilePath = `users/${uid}`;
  try {
    await updateDoc(doc(db, 'users', uid), {
      preferredLang: params.preferredLang,
      preferredTheme: params.preferredTheme,
      refreshIntervalSec: params.refreshIntervalSec,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, profilePath);
  }
}

export async function saveMockAttemptToFirestore(params: {
  uid: string;
  attemptId: string;
  testId: string;
  testTitle: string;
  examTrack: ExamTrack;
  score: number;
  totalQuestions: number;
  accuracyPct: number;
  durationSec: number;
}) {
  const uid = sanitizeId(params.uid, 128);
  const attemptId = sanitizeId(params.attemptId, 64);
  const path = `users/${uid}/attempts/${attemptId}`;
  try {
    await setDoc(doc(db, 'users', uid, 'attempts', attemptId), {
      uid,
      testId: sanitizeId(params.testId, 64),
      testTitle: clampString(params.testTitle, 2, 140, 'Mock Test'),
      examTrack: params.examTrack,
      score: Math.max(0, Math.min(500, Math.round(params.score))),
      totalQuestions: Math.max(1, Math.min(200, Math.round(params.totalQuestions))),
      accuracyPct: Math.max(0, Math.min(100, Number(params.accuracyPct.toFixed(1)))),
      durationSec: Math.max(0, Math.min(18000, Math.round(params.durationSec))),
      status: 'completed',
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function saveBookmarkToFirestore(params: {
  uid: string;
  articleId: string;
  titleEn: string;
  titleTe: string;
  category: NewsCategory;
}) {
  const uid = sanitizeId(params.uid, 128);
  const articleId = sanitizeId(params.articleId, 64);
  const path = `users/${uid}/bookmarks/${articleId}`;
  try {
    await setDoc(doc(db, 'users', uid, 'bookmarks', articleId), {
      uid,
      articleId,
      titleEn: clampString(params.titleEn, 2, 200, 'Article'),
      titleTe: clampString(params.titleTe, 2, 240, 'వార్త'),
      category: params.category,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function deleteBookmarkFromFirestore(uidRaw: string, articleIdRaw: string) {
  const uid = sanitizeId(uidRaw, 128);
  const articleId = sanitizeId(articleIdRaw, 64);
  const path = `users/${uid}/bookmarks/${articleId}`;
  try {
    await deleteDoc(doc(db, 'users', uid, 'bookmarks', articleId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function saveQuizRecordToFirestore(params: {
  uid: string;
  quizId: string;
  score: number;
  total: number;
}) {
  const uid = sanitizeId(params.uid, 128);
  const quizId = sanitizeId(params.quizId, 64);
  const path = `users/${uid}/quizProgress/${quizId}`;
  try {
    await setDoc(doc(db, 'users', uid, 'quizProgress', quizId), {
      uid,
      quizId,
      score: Math.max(0, Math.min(50, Math.round(params.score))),
      total: Math.max(1, Math.min(50, Math.round(params.total))),
      status: 'completed',
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function fetchCloudPupilRecords(uidRaw: string): Promise<{
  attempts: MockTestAttemptRecord[];
  bookmarkedIds: string[];
}> {
  const uid = sanitizeId(uidRaw, 128);
  const attemptsPath = `users/${uid}/attempts`;
  const bookmarksPath = `users/${uid}/bookmarks`;

  const attempts: MockTestAttemptRecord[] = [];
  const bookmarkedIds: string[] = [];

  try {
    const q = query(
      collection(db, 'users', uid, 'attempts'),
      where('uid', '==', uid),
      orderBy('createdAt', 'desc')
    );
    const snap = await getDocs(q);
    snap.forEach((docSnap) => {
      const d = docSnap.data();
      attempts.push({
        id: docSnap.id,
        testId: String(d.testId ?? ''),
        testTitle: String(d.testTitle ?? ''),
        examTrack: (d.examTrack as ExamTrack) || 'UPSC',
        score: Number(d.score ?? 0),
        totalQuestions: Number(d.totalQuestions ?? 1),
        accuracyPct: Number(d.accuracyPct ?? 0),
        durationSec: Number(d.durationSec ?? 0),
        createdAt: d.createdAt?.toDate ? d.createdAt.toDate().toISOString() : new Date().toISOString(),
      });
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, attemptsPath);
  }

  try {
    const q = query(collection(db, 'users', uid, 'bookmarks'), where('uid', '==', uid));
    const snap = await getDocs(q);
    snap.forEach((docSnap) => {
      bookmarkedIds.push(docSnap.id);
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, bookmarksPath);
  }

  return { attempts, bookmarkedIds };
}
