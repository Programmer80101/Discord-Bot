// db.js
import {initializeApp, cert} from "firebase-admin/app";
import {getFirestore} from "firebase-admin/firestore";

// On Render we write your service account JSON to /tmp/serviceAccount.json
// and set GOOGLE_APPLICATION_CREDENTIALS accordingly before starting the bot.
initializeApp({
  credential: cert(process.env.FIREBASE_SERVICE_ACCOUNT),
});

const db = getFirestore();
const users = db.collection("users");

/**
 * Get a user's balance (defaults to 0 if no record exists).
 */
export async function getBalance(userId) {
  const snap = await users.doc(userId).get();
  return snap.exists ? snap.data().balance : 0;
}

/**
 * Add (or subtract) an amount to a user's balance.
 */
export async function addBalance(userId, amount) {
  const ref = users.doc(userId);
  await db.runTransaction(async (tx) => {
    const doc = await tx.get(ref);
    const current = doc.exists ? doc.data().balance : 0;
    tx.set(ref, {balance: current + amount}, {merge: true});
  });
}

/**
 * Get timestamp (ms) of last daily claim (or null).
 */
export async function getLastDaily(userId) {
  const snap = await users.doc(userId).get();
  return snap.exists && snap.data().lastDaily
    ? snap.data().lastDaily.toMillis()
    : null;
}

/**
 * Record the timestamp (ms) of a daily claim.
 */
export async function setLastDaily(userId, timestampMs) {
  await users.doc(userId).set({lastDaily: timestampMs}, {merge: true});
}

/**
 * Fetch the top N users by balance.
 */
export async function getLeaderboard(limit = 10) {
  const q = await users.orderBy("balance", "desc").limit(limit).get();
  return q.docs.map((doc) => ({
    userId: doc.id,
    balance: doc.data().balance,
  }));
}
