require("dotenv").config();
const {Events, Collection} = require("discord.js");
const config = require("../config");
const prefix = config.prefix;

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command =
      message.client.commands.get(commandName) ||
      message.client.commands.find((cmd) => cmd.aliases?.includes(commandName));

    if (!command) {
      return message.reply(
        `Command \`${commandName}\` not found. \nType \`${prefix}help\` for a list of commands.`
      );
    }

    const {cooldowns} = message.client;

    if (!cooldowns.has(command.name)) {
      cooldowns.set(command.name, new Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const defaultCooldownDuration = 3;
    const cooldownAmount =
      (command.cooldown ?? defaultCooldownDuration) * 1_000;

    if (timestamps.has(message.author.id)) {
      const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

      if (now < expirationTime) {
        const expiredTimestamp = Math.round(expirationTime / 1_000);
        return message.reply({
          content: `Please wait, you are on a cooldown for \`${command.data.name}\`. \nYou can use it again <t:${expiredTimestamp}:R>.`,
        });
      }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    try {
      await command.prefix(message, args);
    } catch (error) {
      console.error(error);
      message.reply(
        `Something went wrong while executing the command. \nContact <@${process.env.OWNER_ID}> to help resolve this issue!`
      );
    }
  },
};
