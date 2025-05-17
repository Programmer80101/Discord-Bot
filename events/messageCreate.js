require("dotenv").config();
const {Events, Collection} = require("discord.js");
const {addBalance} = require("../db");
const config = require("../config");
const prefix = config.prefix;

const lastDropTimestamps = new Map();

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    if (message.author.bot) return;
    if (message.channel.id == config.economy.coinDrop.channel.id) {
      const now = Date.now();
      const last = lastDropTimestamps.get(message.author.id) || 0;
      if (now - last < config.economy.coinDrop.cooldown) return;
      lastDropTimestamps.set(message.author.id, now);

      if (Math.random() >= config.economy.coinDrop.chance) return;

      const winAmount = 10;
      await addBalance(message.author.id, winAmount);

      await message.reply({
        content: `You won ${config.emoji.general.coin} **${winAmount}** coins for chatting!`,
      });
    }

    if (!message.content.startsWith(prefix)) return;

    if (
      process.env.NODE_ENV == "dev" &&
      !config.dev.channels.includes(message.channel.id)
    )
      return;

    if (
      process.env.NODE_ENV !== "dev" &&
      config.dev.channels.includes(message.channel.id)
    )
      return;

    if (
      process.env.NODE_ENV != "dev" &&
      !config.allowed.channels.includes(message.channel.id)
    ) {
      return await message.reply({
        content: `You can't use my commands here! \nThey are available to use in <#${config.allowed.channels[0]}>`,
      });
    }

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
        `Something went wrong while executing the command. \nContact <@${config.owner.id}> to help resolve this issue!`
      );
    }
  },
};
