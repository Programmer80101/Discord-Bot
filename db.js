require("dotenv").config();
const {initializeApp, cert} = require("firebase-admin/app");
const {getFirestore} = require("firebase-admin/firestore");

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
initializeApp({credential: cert(serviceAccount)});

const db = getFirestore();
const users = db.collection("users");
const shopItems = db.collection("shopItems");

module.exports = {
  db,
  users,
  shopItems,
};
