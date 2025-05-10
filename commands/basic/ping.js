const {SlashCommandBuilder} = require("discord.js");
const commandsData = require("../../commands");

const command = commandsData.basic.commands.ping;
const getLatency = (client) => `🏓 Pong! ${client.ws.ping}ms.`;

module.exports = {
  ...command,
  data: new SlashCommandBuilder()
    .setName(command.name)
    .setDescription(command.description),

  async execute(interaction) {
    await interaction.reply(getLatency(interaction.client));
  },

  async prefix(message, args) {
    await message.reply(getLatency(message.client));
  },
};
