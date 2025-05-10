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
  moderation: {
    emoji: "🛡️",
    name: "Moderation",
    description: `These are moderation commands for the bot`,
    footer: "These commands are only available for moderators.",
    commands: {
      purge: {
        name: "purge",
        emoji: "🗑️",
        description:
          "Deletes specified number of messages in the channel where command is used.",
        aliases: ["purge", "delete"],
        cooldown: 3,
        usage: `${prefix}purge (amount)`,
        args: [
          {
            name: "number",
            type: "integer",
            required: true,
            description: "Number of messages to delete",
          },
        ],
        examples: [
          {
            command: `${prefix}purge 20`,
            note: "Deletes 20 messages in the channel where command is used!",
          },
        ],
        notes: [`Amount must be a valid integer between 1 and 100`],
      },
      mute: {
        name: "mute",
        emoji: "🔇",
        description: "Mutes a user in the server.",
        aliases: ["mute", "m", "timeout", "tm"],
        cooldown: 10,
        usage: `${prefix}mute (user) (duration) [reason]`,
        args: [
          {
            name: "user",
            type: "user",
            required: true,
            description: "The user to mute",
          },
          {
            name: "duration",
            type: "string",
            required: true,
            description: "The duration to mute the user for",
          },
          {
            name: "reason",
            type: "string",
            required: false,
            description: "The reason for warning the user",
          },
        ],
        examples: [
          {
            command: `${prefix}mute @username 30s noob`,
            note: "Mutes the mentioned user for 30 seconds.",
          },
          {
            command: `${prefix}m @username 15m also noob`,
            note: "Mutes the mentioned user for 15 minutes.",
          },
          {
            command: `${prefix}timeout @username 1h ultra noob`,
            note: "Mutes the mentioned user for 1 hour.",
          },
          {
            command: `${prefix}tm @username 1d ultra pro max noob`,
            note: "Mutes the mentioned user for 1 day.",
          },
        ],
        notes: [`Maximum mute duration is 28 days.`],
      },
      unmute: {
        name: "unmute",
        emoji: "🔊",
        description: "Unmutes a user in the server.",
        aliases: ["unmute", "unm", "untimeout", "utm"],
        cooldown: 10,
        usage: `${prefix}unmute (user) [reason]`,
        args: [
          {
            name: "user",
            type: "user",
            required: true,
            description: "The user to mute",
          },
          {
            name: "reason",
            type: "string",
            required: false,
            description: "The reason for warning the user",
          },
        ],
        examples: [
          {
            command: `${prefix}mute @username 30s he is pro`,
            note: "Unmutes the mentioned user.",
          },
        ],
      },
      warn: {
        name: "warn",
        emoji: "⚠️",
        description: "Warns a user in the server.",
        kick: 3,
        aliases: ["warn", "w"],
        usage: `${prefix}warn (user) (duration) [reason]`,
        args: [
          {
            name: "user",
            type: "user",
            required: true,
            description: "The user to warn",
          },
          {
            name: "duration",
            type: "string",
            required: true,
            description: "The duration of the warn",
          },
          {
            name: "reason",
            type: "string",
            required: false,
            description: "The reason for warning the user",
          },
        ],
        examples: [
          {
            command: `${prefix}warn @username 14d Spamming`,
            note: "Warns the mentioned user for 14d.",
          },
        ],
        notes: ["Maximum warn duration is 30 days."],
      },
      kick: {
        name: "kick",
        emoji: "👢",
        description: "Kicks a user from the server.",
        kick: 10,
        aliases: ["kick", "k"],
        usage: `${prefix}kick (user) [reason]`,
        args: [
          {
            name: "user",
            type: "user",
            required: true,
            description: "The user to kick",
          },
          {
            name: "reason",
            type: "string",
            required: false,
            description: "The reason for kicking the user",
          },
        ],
        examples: [
          {
            command: `${prefix}kick @username Spamming`,
            note: "Kicks the user for spamming.",
          },
        ],
      },
      ban: {
        name: "ban",
        emoji: "🚫",
        description: "Bans a user from the server.",
        cooldown: 10,
        aliases: ["ban", "b"],
        usage: `${prefix}ban (user) [reason]`,
        args: [
          {
            name: "user",
            type: "user",
            required: true,
            description: "The user to ban",
          },
          {
            name: "reason",
            type: "string",
            required: false,
            description: "The reason for banning the user",
          },
        ],
        examples: [
          {
            command: `${prefix}ban @username Breaking rules`,
            note: "Bans the user for breaking rules.",
          },
        ],
      },
      unban: {
        name: "unban",
        emoji: "🔰",
        description: "Unbans a user from the server.",
        cooldown: 10,
        aliases: ["unban", "ub"],
        usage: `${prefix}unban (user)`,
        args: [
          {
            name: "user",
            type: "string",
            required: true,
            description: "The ID of the user to unban",
          },
        ],
        examples: [
          {
            command: `${prefix}unban @username`,
            note: "Unbans the user.",
          },
        ],
      },
    },
  },
  botUtility: {
    emoji: "🤖",
    name: "Bot Utility",
    description: `These are utility commands for the bot`,
    footer: "These commands are only available for moderators.",
    commands: {
      echo: {
        name: "echo",
        emoji: "💭",
        description: "Sends a message in the specified channel.",
        cooldown: 3,
        aliases: ["echo", "send", "say"],
        usage: `${prefix}echo (message) [channel]`,
        args: [
          {
            name: "message",
            type: "string",
            required: true,
            description: "The message to send",
          },
          {
            name: "channel",
            type: "channel",
            required: false,
            description: "The channel to send the message to",
          },
        ],
        examples: [
          {
            command: `${prefix}echo Hello World`,
            note: "Sends 'Hello World' in the current channel.",
          },
          {
            command: `${prefix}echo Hello World #general`,
            note: "Sends 'Hello World' in the #general channel.",
          },
        ],
      },
      embed: {
        name: "embed",
        emoji: "📋",
        description: "Sends an embed in the specified channel.",
        cooldown: 3,
        aliases: ["embed"],
        usage: `${prefix}embed`,
        args: [],
        examples: [
          {
            command: `${prefix}embed`,
            note: "Prompts the user to fill details before sending an embed in the specified channel.",
          },
        ],
      },
    },
  },
  fun: {
    emoji: "😁",
    name: "Fun",
    description: `These are some fun commands you can use to mess around!`,
    commands: {
      kill: {
        name: "kill",
        emoji: "🔪",
        description: "Sends a funny kill message 😂",
        aliases: ["kill", "k"],
        usage: `${prefix}kill`,
        args: [
          {
            name: "user",
            type: "string",
            required: false,
            description: "The user to kill",
          },
          {
            name: "user",
            type: "string",
            required: false,
            description: "The killer!",
          },
        ],
        examples: [
          {
            command: `${prefix}kill kowshik`,
            note: "Sends a funny kill message to Kowshik.",
          },
        ],
      },
    },
  },
  games: {
    emoji: "🎮",
    name: "Games",
    description: `These are some games that you can play with friends!`,
    commands: {
      handcricket: {
        name: "handcricket",
        emoji: "🏏",
        description: "Play hand cricket with your friends!",
        aliases: ["handcricket", "hc"],
        usage: `${prefix}handcricket (user)`,
        args: [
          {
            name: "user",
            type: "user",
            required: false,
            description: "The opponent player",
          },
        ],
        examples: [
          {
            command: `${prefix}hc @goldy`,
            note: "Starts a hand cricket match between you and Goldy.",
          },
        ],
      },
    },
  },
};
