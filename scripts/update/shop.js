const {db, shopItems} = require("../../db");

const shop = {
  auto_response: {
    id: "auto_response",
    emoji: "💱",
    name: "Auto Response",
    description: "An Auto Response of your choice!",
    price: 1500,
    stock: 1,
  },
  custom_role: {
    id: "custom_role",
    emoji: "🛡️",
    name: "Custom Role",
    description:
      "An private/custom role you can show off! \nRole Reward: <@&1320039974447611926>",
    price: 2000,
    stock: 5,
  },
  custom_vc: {
    id: "custom_vc",
    emoji: "🔊",
    name: "Custom VC",
    description: "An Custom VC for you and your friends!",
    price: 2000,
    stock: 5,
  },
  custom_channel: {
    id: "custom_channel",
    emoji: "💬",
    name: "Custom Channel",
    description: "An Custom Channel for you and your friends!",
    price: 2500,
    stock: 2,
  },
  discord_nitro: {
    id: "discord_nitro",
    emoji: "<:nitro:1374004904506425424>",
    name: "Discord Nitro",
    description: "A Discord Nitro",
    price: 5000,
    stock: 4,
  },
};

module.exports = async () => {
  console.log("🔄 Updating shop items...");

  const batch = db.batch();
  for (const [id, data] of Object.entries(shop)) {
    const ref = shopItems.doc(id);
    batch.set(ref, data, {merge: true});
  }

  await batch.commit();
  console.log("✅ Shop items updated!");
  process.exit(0);
};
