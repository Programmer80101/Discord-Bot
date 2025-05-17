const {time} = require("discord.js");
const {initializeApp, cert} = require("firebase-admin/app");
const {getFirestore, Timestamp} = require("firebase-admin/firestore");

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
initializeApp({credential: cert(serviceAccount)});

const db = getFirestore();
const users = db.collection("users");

async function getBalance(userId) {
  const snap = await users.doc(userId).get();
  return snap.exists ? snap.data().balance : 0;
}

async function addBalance(userId, amount) {
  const ref = users.doc(userId);
  await db.runTransaction(async (tx) => {
    const doc = await tx.get(ref);
    const current = doc.exists ? doc.data().balance : 0;
    tx.set(ref, {balance: current + amount}, {merge: true});
  });
}

async function getLastDaily(userId) {
  const snap = await users.doc(userId).get();
  return snap.exists && snap.data().lastDaily
    ? snap.data().lastDaily.toMillis()
    : null;
}

async function setLastDaily(userId, timestampMs) {
  const timestamp = Timestamp.fromMillis(timestampMs);
  await users.doc(userId).set({lastDaily: timestamp}, {merge: true});
}

async function getLeaderboard(limit = 10) {
  const q = await users.orderBy("balance", "desc").limit(limit).get();
  return q.docs.map((doc) => ({userId: doc.id, balance: doc.data().balance}));
}

module.exports = {
  getBalance,
  addBalance,
  getLastDaily,
  setLastDaily,
  getLeaderboard,
};
