const {SlashCommandBuilder} = require("discord.js");
const commandsData = require("../../commands");
const {getRandomTip} = require("../../utils");
const {getBalance} = require("../../utils/balance");
const config = require("../../config");

const command = commandsData.economy.commands.balance;

const sendBalance = async (source, user) => {
  const balance = await getBalance(user.id);
  const balanceEmbed = {
    color: config.embed.color.gold,
    title: `💰 Balance: ${user.username}`,
    description: `Financial record of ${user}!`,
    fields: [
      {
        name: "Balance",
        value: `${config.emoji.general.coin} ${balance}`,
      },
    ],
    footer: {
      text: getRandomTip(commandsData.economy.name, command.name),
    },
  };

  await source.reply({embeds: [balanceEmbed]});
};

module.exports = {
  ...command,
  data: new SlashCommandBuilder()
    .setName(command.name)
    .setDescription(command.description)
    .addUserOption((option) => {
      return option
        .setName(command.args[0].name)
        .setDescription(command.args[0].description)
        .setRequired(command.args[0].required);
    }),

  async execute(interaction) {
    const user = interaction.user;
    await sendBalance(interaction, user);
  },

  async prefix(message) {
    const user = message.author;
    await sendBalance(message, user);
  },
};
