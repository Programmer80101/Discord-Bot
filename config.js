require("dotenv").config();

const prefix = "!";

module.exports = {
  name: "Ash Greninja",
  prefix: prefix,
  iconURL: "https://images.app.goo.gl/6uZ9YvYERfWabBS27",
  cooldown: {
    default: 1,
    mod: 10,
  },
  owner: {
    id: "855342398115414037",
    name: "Pikachu",
  },
  embed: {
    color: {
      default: 0x0099ff,
      purple: 0x8c00ff,
      green: 0x17ca26,
      gold: 0xffd900,
      red: 0xe43336,
    },
  },
  server: {
    id: "1168944263413891082",
  },
  channel: {
    log: "",
  },
  tips: {
    basic: {
      help: {
        default: `Use ${prefix}help to see a list of all commands.`,
        command: `Use ${prefix}help [command] to see how to use a specific command.`,
        category: `Use ${prefix}help [category] to see a list of commands in a category.`,
      },
      info: {
        default: `Use ${prefix}info to see information about the bot.`,
      },
      ping: {
        default: `Use ${prefix}ping to check the bot's latency.`,
      },
      user: {
        default: `Use ${prefix}user to see detailed info about yourself.`,
        user: `Use ${prefix}user [user] to see information about a specific user.`,
      },
    },
    moderation: {
      warn: {
        default: `Use ${prefix}warn (user) (reason) to warn a user.`,
      },
      unwarn: {
        default: `Use ${prefix}unwarn (user) (reason) to unwarn a user.`,
      },
      mute: {
        default: `Use ${prefix}mute (user) (time) (reason) to mute a user for a certain amount of time.`,
      },
      unmute: {
        default: `Use ${prefix}unmute (user) (reason) to unmute a user.`,
      },
      kick: {
        default: `Use ${prefix}kick (user) (reason) to kick a user.`,
      },
      ban: {
        default: `Use ${prefix}ban (user) (reason) to ban a user.`,
      },
      unban: {
        default: `Use ${prefix}unban (user) (reason) to unban a user.`,
      },
    },
    botUtility: {
      echo: {
        default: `Use ${prefix}echo (message) to send a message in the channel.`,
        channel: `Use ${prefix}echo (message) [channel] to send a message in a specific channel.`,
      },
      embed: {
        default: `Use ${prefix}embed to create an embed message.`,
      },
    },
  },
};
