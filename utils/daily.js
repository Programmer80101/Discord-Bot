const {Timestamp} = require("firebase-admin/firestore");
const {users} = require("../db");

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

module.exports = {
  getLastDaily,
  setLastDaily,
};
