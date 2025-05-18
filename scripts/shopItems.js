const {db} = require("../db");
const config = require("../config");

const shopItems = {
  [config.shopItems[0]]: {
    id: config.shopItems[0],
    name: "Auto Response",
    description: "An Auto Response of your choice!",
    price: 1500,
    stock: 2,
  },
  [config.shopItems[1]]: {
    id: config.shopItems[1],
    name: "Custom Role",
    description: "An private/custom role you can show off!",
    price: 2000,
    stock: 5,
  },
};

async function seedShop() {
  const batch = db.batch();
  for (const [id, data] of Object.entries(shopItems)) {
    const ref = db.collection("shopItems").doc(id);
    batch.set(ref, data, {merge: true});
  }

  await batch.commit();
  console.log("✅ Shop items seeded!");
  process.exit(0);
}

seedShop().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
