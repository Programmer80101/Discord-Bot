const {SlashCommandBuilder} = require("discord.js");
const commandsData = require("../../commands");
const {getRandomTip} = require("../../utils");
const {getInventory} = require("../../utils/inventory");
const {getShopItemById} = require("../../utils/shop");
const config = require("../../config");

const command = commandsData.economy.commands.inventory;

const sendInventory = async (source, user) => {
  const inv = (await getInventory(user.id)) || {};
  const fields = Object.entries(inv).map(async ([itemId, amount]) => {
    const item = await getShopItemById(itemId);
    return {
      name: `${item.emoji} ${item.name}`,
      value: `Amount: ${amount}`,
    };
  });

  const invEmbed = {
    color: config.embed.color.default,
    title: `${command.emoji} Inventory: ${user.username}`,
    description: `Inventory of ${user}!`,
    fields:
      fields.length > 0
        ? await Promise.all(fields)
        : [
            {
              name: "No items",
              value: "You have no items in your inventory.",
            },
          ],
    footer: {
      text: getRandomTip(commandsData.economy.name, command.name),
    },
  };

  await source.reply({embeds: [invEmbed]});
};

module.exports = {
  ...command,
  data: new SlashCommandBuilder()
    .setName(command.name)
    .setDescription(command.description),

  async execute(interaction) {
    await sendInventory(interaction, interaction.user);
  },

  async prefix(message) {
    await sendInventory(message, message.author);
  },
};
