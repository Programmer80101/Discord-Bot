const {SlashCommandBuilder} = require("discord.js");

const command = {
  name: "ping",
  description: "Checks the latency of the bot.",
  aliases: ["ping", "p"],
  cooldown: 10,
};

const getLatency = (client) => `🏓 Pong! Latency is ${client.ws.ping}ms.`;

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
