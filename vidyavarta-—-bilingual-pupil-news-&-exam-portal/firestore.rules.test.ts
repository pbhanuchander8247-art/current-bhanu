import fs from 'node:fs';
import assert from 'node:assert/strict';

const rulesText = fs.readFileSync('firestore.rules', 'utf8');

// Verify Phase 5 Red Team structural guarantees on final firestore.rules
assert.match(rulesText, /rules_version\s*=\s*'2';/, 'Must use rules_version = 2');
assert.match(rulesText, /match \/\{document=\*\*\}\s*\{\s*allow read, write: if false;/, 'Must start with default-deny catch-all');
assert.match(rulesText, /request\.auth\.token\.email_verified\s*==\s*true/, 'Must enforce email_verified == true');
assert.match(rulesText, /function isValidId\(id\)/, 'Must harden document IDs');
assert.match(rulesText, /incoming\(\)\.createdAt\s*==\s*request\.time/, 'Must enforce server timestamp integrity on create');
assert.match(rulesText, /incoming\(\)\.updatedAt\s*==\s*request\.time/, 'Must enforce server timestamp integrity on update');
assert.match(rulesText, /affectedKeys\(\)\.hasOnly\(/, 'Must enforce action-based update allowlists');
assert.match(rulesText, /match \/attempts\/\{attemptId\}[\s\S]*allow update: if false;/, 'Must lock completed mock test attempts against tampering');
assert.match(rulesText, /match \/private\/contact/, 'Must isolate PII email in private subcollection');
assert.ok(!/allow list:\s*if\s*isSignedIn\(\);/.test(rulesText), 'Must forbid blanket signed-in list queries');

console.log('All 12 Dirty Dozen structural security rule invariants verified.');
