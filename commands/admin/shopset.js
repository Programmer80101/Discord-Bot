// /*
// Firestore schema:
// - Collection: shopItems
//   - Doc ID: item.id
//   - Fields: { name, description, price, stock, autoClaim }

// - Collection: inventories
//   - Doc ID: userId
//   - Fields: { items: { [itemId]: quantity } }
// */

// // commands/economy/shop/addshopitem.js
// const {SlashCommandBuilder} = require("discord.js");
// const commandsData = require("../../../commands");
// const {addShopItem} = require("../../../db/shop");
// const command = commandsData.economy.commands.addshopitem;

// module.exports = {
//   ...command,
//   data: new SlashCommandBuilder()
//     .setName(command.name)
//     .setDescription(command.description)
//     .addStringOption((opt) =>
//       opt.setName("id").setDescription("Unique item ID").setRequired(true)
//     )
//     .addStringOption((opt) =>
//       opt.setName("name").setDescription("Item name").setRequired(true)
//     )
//     .addStringOption((opt) =>
//       opt
//         .setName("description")
//         .setDescription("Item description")
//         .setRequired(true)
//     )
//     .addIntegerOption((opt) =>
//       opt.setName("price").setDescription("Item price").setRequired(true)
//     )
//     .addIntegerOption((opt) =>
//       opt.setName("stock").setDescription("Initial stock").setRequired(true)
//     )
//     .addBooleanOption((opt) =>
//       opt
//         .setName("autoClaim")
//         .setDescription("Auto-claim on use")
//         .setRequired(true)
//     ),

//   async execute(interaction) {
//     if (!interaction.member.permissions.has("Administrator")) {
//       return interaction.reply({
//         content: "You need Admin permissions.",
//         ephemeral: true,
//       });
//     }
//     const {id, name, description, price, stock, autoClaim} = Object.fromEntries(
//       ["id", "name", "description", "price", "stock", "autoClaim"].map(
//         (key) => [key, interaction.options.get(key).value]
//       )
//     );
//     await addShopItem({id, name, description, price, stock, autoClaim});
//     await interaction.reply(`✅ Shop item **${name}** added.`);
//   },
// };

// // commands/economy/shop/stockset.js
// const {SlashCommandBuilder} = require("discord.js");
// const commandsData = require("../../../commands");
// const {setShopStock} = require("../../../db/shop");
// const command = commandsData.economy.commands.stockset;

// module.exports = {
//   ...command,
//   data: new SlashCommandBuilder()
//     .setName(command.name)
//     .setDescription(command.description)
//     .addStringOption((opt) =>
//       opt.setName("id").setDescription("Item ID").setRequired(true)
//     )
//     .addIntegerOption((opt) =>
//       opt.setName("stock").setDescription("New stock value").setRequired(true)
//     ),

//   async execute(interaction) {
//     if (!interaction.member.permissions.has("Administrator")) {
//       return interaction.reply({
//         content: "You need Admin permissions.",
//         ephemeral: true,
//       });
//     }
//     const id = interaction.options.getString("id");
//     const stock = interaction.options.getInteger("stock");
//     await setShopStock(id, stock);
//     await interaction.reply(`✅ Stock for item **${id}** set to **${stock}**.`);
//   },
// };

// // commands/economy/shop/shop.js
// const {SlashCommandBuilder} = require("discord.js");
// const commandsData = require("../../../commands");
// const {getAllShopItems} = require("../../../db/shop");
// const config = require("../../../config");
// const command = commandsData.economy.commands.shop;

// module.exports = {
//   ...command,
//   data: new SlashCommandBuilder()
//     .setName(command.name)
//     .setDescription(command.description),

//   async execute(interaction) {
//     const items = await getAllShopItems();
//     const embed = {
//       color: config.embed.color.blue,
//       title: "🛒 Shop",
//       fields: items.map((item) => ({
//         name: `${item.name} (ID: ${item.id})`,
//         value: `${item.description}\nPrice: ${config.emoji.general.coin} ${item.price} | Stock: ${item.stock}`,
//       })),
//     };
//     await interaction.reply({embeds: [embed]});
//   },
// };

// // commands/economy/shop/buy.js
// const {SlashCommandBuilder} = require("discord.js");
// const commandsData = require("../../../commands");
// const {buyItem} = require("../../../db/shop");
// const {getBalance, adjustBalance} = require("../../../db");
// const config = require("../../../config");
// const command = commandsData.economy.commands.buy;

// module.exports = {
//   ...command,
//   data: new SlashCommandBuilder()
//     .setName(command.name)
//     .setDescription(command.description)
//     .addStringOption((opt) =>
//       opt.setName("id").setDescription("Item ID").setRequired(true)
//     )
//     .addIntegerOption((opt) =>
//       opt.setName("quantity").setDescription("Quantity").setRequired(true)
//     ),

//   async execute(interaction) {
//     const userId = interaction.user.id;
//     const id = interaction.options.getString("id");
//     const qty = interaction.options.getInteger("quantity");
//     const {totalCost, item} = await buyItem(userId, id, qty);
//     const balance = await getBalance(userId);
//     if (balance < totalCost) {
//       return interaction.reply({
//         content: "Insufficient funds.",
//         ephemeral: true,
//       });
//     }
//     await adjustBalance(userId, -totalCost);
//     await interaction.reply(
//       `✅ You bought **${qty}x ${item.name}** for ${config.emoji.general.coin} ${totalCost}.`
//     );
//   },
// };

// // commands/economy/shop/use.js
// const {SlashCommandBuilder} = require("discord.js");
// const commandsData = require("../../../commands");
// const {useItem} = require("../../../db/shop");
// const command = commandsData.economy.commands.use;

// module.exports = {
//   ...command,
//   data: new SlashCommandBuilder()
//     .setName(command.name)
//     .setDescription(command.description)
//     .addStringOption((opt) =>
//       opt.setName("id").setDescription("Item ID").setRequired(true)
//     ),

//   async execute(interaction) {
//     const userId = interaction.user.id;
//     const id = interaction.options.getString("id");
//     const {autoClaim, name} = await useItem(userId, id);
//     if (!autoClaim) {
//       return interaction.reply(
//         `🗳️ You've used **${name}**! Ask a staff to claim your item.`
//       );
//     }
//     await interaction.reply(`✅ You used **${name}**.`);
//   },
// };
