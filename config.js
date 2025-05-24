require("dotenv").config();

const prefix = "!";
const isDev = process.env.NODE_ENV == "dev";

module.exports = {
  name: isDev ? "Juice WRLD Dev Bot" : "Juice WRLD Coin Bot",
  isDev: isDev,
  isProd: !isDev,
  prefix: prefix,
  iconURL: "https://images.app.goo.gl/6uZ9YvYERfWabBS27",
  cooldown: {
    default: 1,
    mod: 10,
    economy: 3,
  },
  economy: {
    daily: {
      amount: 10,
      cooldownHours: 23,
    },
    coinDrop: {
      chance: 0.05,
      cooldownSeconds: 60,
      range: [0, 10],
      channelId: isDev ? "1372890783895519285" : "1320040091892056115",
    },
  },
  owner: {
    id: "855342398115414037",
    name: "Pikachu",
  },
  ownerAlt: {
    id: "1369969377235046400",
    name: "Charizard",
  },
  embed: {
    color: {
      neutral: 0x636363,
      default: 0x0099ff,
      purple: 0x992bff,
      yellow: 0xd4d440,
      green: 0x27c027,
      gold: 0xffd900,
      red: 0xd43636,
    },
  },
  server: {
    id: isDev ? "1372890783417630810" : "1304614532265672745",
  },
  allowed: {
    channels: [
      "1375112371764330517", // juice wrld coin
      "1320040119247441941", // staff bot commands
      "1320040095910465637", // bot commands
      "1372951737341575288", // dev -> bot
      "1372923613258321991", // dev -> dev
    ],
  },
  channel: {
    log: "",
  },
  items: {},
  emoji: {
    general: {
      duration: "⏱️",
      partyPopper: "🎉",
      confetti: "🎊",
      ribbon: "🎀",
      present: "🎁",
      link: "🔗",
      pin: "📌",
      roundPin: "📍",
      hourglass: "⌛",
      hourglass2: "⏳",
      cabinet: "🗄️",
      alert: "🚨",
      warning: "⚠️",
      fire: "🔥",
      thunder: "⚡",
      drop: "💧",
      snowflake: "❄️",
      profit: "📈",
      loss: "📉",
      label: "🏷️",
      bookmark: "🔖",
      coin: "🪙",
      currency: "<:WrldCoin:1373929792755339366>",
      in: "📥",
      out: "📤",
      success: "✅",
      error: "❌",
    },
  },
  errors: {
    mod: {
      somethingWentWrong: "⚠️ Something went wrong",
      selfSabotage: "🔰 Self Sabotage",
      roleHierarchy: "📊 Improper Role Heirarchy",
      insufficientPermissions: "⛔ Insufficient Permissions",
      invalidArguments: "❌ Invalid Arguments",
      invalidDuration: "⏱️ Invalid Duration",
    },
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
      purge: {
        default: `Use ${prefix}purge (amount) to delete a certain amount of messages.`,
      },
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
    economy: {
      balance: {
        default: `Use ${prefix}balance to check your balance`,
        user: `Use ${prefix}balance [user] to check a user's balance`,
      },
      daily: {
        default: `Use ${prefix}daily to collect your daily free coins!`,
      },
    },
  },
};
