const config = require("./config");
const prefix = config.prefix;

module.exports = {
  basic: {
    emoji: "🗒️",
    name: "Basic",
    description: "Basic commands for the bot.",
    footer: "These commands are available for all users.",
    commands: {
      help: {
        name: "help",
        emoji: "❓",
        description: "Displays a list of all commands.",
        aliases: ["help", "h"],
        usage: `${prefix}help [category | command]`,
        args: [
          {
            name: "category",
            type: "string",
            required: false,
            description: "Name of a category",
          },
          {
            name: "command",
            type: "string",
            required: false,
            description: "Name of a command",
          },
        ],
        examples: [
          {
            command: `${prefix}help`,
            note: "Displays a list of all commands.",
          },
          {
            command: `${prefix}help ping`,
            note: "Displays how to use the `ping` command.",
          },
        ],
      },
      botInfo: {
        name: "botinfo",
        emoji: "ℹ️",
        description: "Provides all necessary about the bot.",
        aliases: ["botinfo", "bot", "bi"],
        usage: `${prefix}botinfo`,
        args: [],
        examples: [
          {
            command: `${prefix}botinfo`,
            note: "Displays necessary information about the bot.",
          },
        ],
      },
      user: {
        name: "user",
        emoji: "👤",
        description: "Displays information about a user.",
        aliases: ["user", "u"],
        usage: `${prefix}user [user]`,
        args: [
          {
            name: "user",
            type: "user",
            required: false,
            description: "The user to get information about",
          },
        ],
        examples: [
          {
            command: `${prefix}user`,
            note: "Displays information about yourself.",
          },
          {
            command: `${prefix}user @username`,
            note: "Displays information about the mentioned user.",
          },
        ],
      },
      ping: {
        name: "ping",
        emoji: "🏓",
        description: "Checks the latency of the bot.",
        aliases: ["ping", "p", "latency", "l"],
        usage: `${prefix}ping`,
        args: [],
        examples: [
          {
            command: `${prefix}ping`,
            note: "Displays the latency of the bot.",
          },
        ],
      },
    },
  },
  economy: {
    emoji: "💰",
    name: "Economy",
    description: "Economy commands for coins.",
    footer: "These commands are available for all users.",
    commands: {
      balance: {
        name: "balance",
        emoji: "🪙",
        description: "Get your current balance.",
        aliases: ["balance", "bal"],
        usage: `${prefix}balance [user]`,
        args: [
          {
            name: "user",
            type: "user",
            required: false,
            description: "The user to get balance of",
          },
        ],
        examples: [
          {
            command: `${prefix}user`,
            note: "Shows your current balance.",
          },
          {
            command: `${prefix}user @username`,
            note: "Shows the current balance of the mentioned user.",
          },
        ],
      },
      daily: {
        name: "daily",
        emoji: "🪙",
        description: "Collect your daily coins",
        aliases: ["daily"],
        usage: `${prefix}daily`,
        examples: [
          {
            command: `${prefix}daily`,
            note: "Collect your daily balance",
          },
        ],
      },
    },
  },
};
