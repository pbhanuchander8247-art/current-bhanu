# VidyaVarta Firestore Security Specification

## 1. Data Invariants
1. **Identity & Ownership**: Every pupil document (`/users/{userId}`), private contact document (`/users/{userId}/private/contact`), mock test attempt (`/users/{userId}/attempts/{attemptId}`), bookmark (`/users/{userId}/bookmarks/{bookmarkId}`), and daily quiz record (`/users/{userId}/quizProgress/{quizId}`) must satisfy `request.auth != null`, `request.auth.token.email_verified == true`, `request.auth.uid == userId`, and `incoming().uid == request.auth.uid`.
2. **PII Isolation**: Pupil `email` is isolated in `/users/{userId}/private/contact` and never stored on `/users/{userId}`. Neither document allows cross-user reads or blanket `list` queries.
3. **Immutable Audit & Scores**: `createdAt` and `uid` are immutable on updates. Mock test `attempts` and `quizProgress` records have terminal status `'completed'` and cannot be altered once written.
4. **Temporal & Volumetric Integrity**: All `createdAt` and `updatedAt` timestamps must equal `request.time`. All document IDs match `^[a-zA-Z0-9_\-]+$` (`<= 128` chars), and every string/number field enforces explicit bounds.
5. **Action-Based Updates**: Updates to `/users/{userId}` are partitioned into explicit actions (`isProfileUpdateAction`, `isPreferencesUpdateAction`) using `affectedKeys().hasOnly(...)` with `isValidPupilProfile(incoming())` gating the entire update block.

## 2. The "Dirty Dozen" Adversarial Payloads
1. **Unauthenticated Profile Read/Write**: `request.auth == null` attempting `get` or `create` on `/users/u1`. Expected: `PERMISSION_DENIED`.
2. **Unverified Email Token Write**: Authenticated user with `email_verified == false` writing to `/users/u1`. Expected: `PERMISSION_DENIED`.
3. **Cross-Tenant Spoofed UID**: User `u2` writing `/users/u1` or setting `uid: "u1"` inside `/users/u2`. Expected: `PERMISSION_DENIED`.
4. **Shadow Ghost Field Injection**: Creating `/users/u1` with extra field `isAdmin: true` or `role: "superadmin"`. Expected: `PERMISSION_DENIED` (`keys().hasOnly(...)`).
5. **PII Leakage Probe**: User `u2` reading `/users/u1/private/contact`. Expected: `PERMISSION_DENIED`.
6. **Blanket Collection Listing**: User `u1` issuing a `list` query on `/users` or `/users/u2/attempts`. Expected: `PERMISSION_DENIED`.
7. **ID Poisoning**: Creating `/users/u1/bookmarks/bad$id..1500chars` with invalid characters or length > 128. Expected: `PERMISSION_DENIED` (`isValidId`).
8. **Score Tampering / Terminal Lock Bypass**: Attempting `update` on `/users/u1/attempts/a1` to raise `score` after `status == "completed"`. Expected: `PERMISSION_DENIED` (`allow update: if false`).
9. **Client Timestamp Forgery**: Creating `/users/u1/attempts/a1` with `createdAt` different from `request.time`. Expected: `PERMISSION_DENIED`.
10. **Immutable Field Mutation**: Updating `/users/u1` to mutate `createdAt` or `uid`. Expected: `PERMISSION_DENIED`.
11. **Value Type/Bound Poisoning**: Updating `pupilName` with a 5,000-character string or `refreshIntervalSec: -99`. Expected: `PERMISSION_DENIED`.
12. **Master Gate Orphan Write**: Creating `/users/u1/attempts/a1` when parent `/users/u1` does not exist. Expected: `PERMISSION_DENIED` (`exists(/databases/$(database)/documents/users/$(userId))`).
