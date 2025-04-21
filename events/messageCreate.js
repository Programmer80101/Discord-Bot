require("dotenv").config();
const {Events} = require("discord.js");
const prefix = process.env.PREFIX;

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command =
      message.client.commands.get(commandName) ||
      message.client.commands.find((cmd) => cmd.aliases?.includes(commandName));

    if (!command) return;

    try {
      await command.prefix(message, args);
    } catch (error) {
      console.error(error);
      message.reply(
        `Something went wrong while executing the command. Contact <@${process.env.OWNER_ID}> right away!`
      );
    }
  },
};
