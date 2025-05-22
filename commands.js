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
        cooldown: 3,
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
        cooldown: 10,
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
        cooldown: 5,
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
        cooldown: 3,
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
      guide: {
        name: "guide",
        emoji: "📖",
        description: "Guide for using the bot.",
        aliases: ["guide"],
        usage: `${prefix}guide`,
        args: [],
        examples: [
          {
            command: `${prefix}guide`,
            note: "Guide for using the bot.",
          },
        ],
      },
      rules: {
        name: "rules",
        emoji: "📜",
        description: "Rules for using the bot.",
        aliases: ["rules", "rules"],
        usage: `${prefix}rules`,
        args: [],
        examples: [
          {
            command: `${prefix}rules`,
            note: "Rules for using the bot.",
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
        cooldown: 5,
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
        cooldown: 5,
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
      shop: {
        name: "shop",
        emoji: "🛍️",
        cooldown: 10,
        description: "Check out the shop for cool items!",
        aliases: ["shop"],
        usage: `${prefix}shop`,
        examples: [
          {
            command: `${prefix}shop`,
            note: "Check out the shop for cool items!",
          },
        ],
      },
      buy: {
        name: "buy",
        emoji: "🛒",
        cooldown: 5,
        description: "Buy an item from the shop!",
        aliases: ["buy"],
        usage: `${prefix}buy (item_name) [quantity]`,
        args: [
          {
            name: "item_name",
            type: "string",
            required: true,
            description: "The item that you want to buy!",
          },
          {
            name: "quantity",
            type: "integer",
            required: false,
            description: "Amount of items to buy!",
          },
        ],
        examples: [
          {
            command: `${prefix}buy Auto Response`,
            note: "The item that you want to buy!",
          },
        ],
      },
      inventory: {
        name: "inventory",
        emoji: "📦",
        cooldown: 5,
        description: "Check your inventory!",
        aliases: ["inv", "inven", "inventory"],
        usage: `${prefix}inventory`,
        examples: [
          {
            command: `${prefix}inv`,
            note: "Collect your daily balance",
          },
        ],
      },
      use: {
        name: "use",
        emoji: "🛠️",
        cooldown: 5,
        description: "Use an item from your inventory!",
        aliases: ["use"],
        usage: `${prefix}use (item_name) [quantity]`,
        args: [
          {
            name: "item_name",
            type: "string",
            required: true,
            description: "The item that you want to buy!",
          },
          {
            name: "quantity",
            type: "integer",
            required: false,
            description: "Amount of items to use!",
          },
        ],
        examples: [
          {
            command: `${prefix}use Auto Response 2`,
          },
        ],
      },
      transfer: {
        name: "transfer",
        emoji: "🔄",
        cooldown: 10,
        description: "Transfer coins to another user",
        aliases: ["transfer"],
        usage: `${prefix}transfer (user) (amount) [reason]`,
        args: [
          {
            name: "user",
            type: "user",
            required: true,
            description: "The user you want to transfer coins to",
          },
          {
            name: "amount",
            type: "integer",
            required: false,
            description: "Amount of coins to transfer",
          },
          {
            name: "reason",
            type: "string",
            required: false,
            description: "Reason for the transfer",
          },
        ],
        examples: [
          {
            command: `${prefix}transfer @user 100 for helping me`,
            note: "Transfer 100 coins to @user for helping me",
          },
        ],
      },
    },
  },
};
