const {SlashCommandBuilder} = require("discord.js");
const commandsData = require("../../commands");
const {getRandomTip} = require("../../utils");
const {getAllShopItems} = require("../../utils/shop");
const config = require("../../config");

const command = commandsData.economy.commands.shop;

const getShopEmbed = async () => {
  const allItems = await getAllShopItems();
  const fields = allItems.map(({emoji, name, price, stock, description}) => ({
    name: `${emoji} ${stock > 0 ? name : `~~${name}~~`}`,
    value: `Price: ${config.emoji.general.currency} ${price} | Stock: ${stock} \n${description}`,
  }));

  const shopEmbed = {
    title: "🛍️ Juice WRLD Shop",
    color: config.embed.color.default,
    description: `Buy an item from the shop using \`${config.prefix}buy (item name)\`!`,
    fields: fields,
    footer: {
      text: getRandomTip(commandsData.economy.name, command.name),
    },
  };

  return shopEmbed;
};

module.exports = {
  ...command,
  data: new SlashCommandBuilder()
    .setName(command.name)
    .setDescription(command.description),

  async execute(interaction) {
    await interaction.deferReply();
    const shopEmbed = await getShopEmbed();

    await interaction.editReply({
      embeds: [shopEmbed],
    });
  },

  async prefix(message) {
    const shopEmbed = await getShopEmbed(message);
    await message.reply({
      embeds: [shopEmbed],
    });
  },
};
