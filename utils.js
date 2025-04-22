const commandsData = require("./commands.js");
const config = require("./config.js");

function toCamelCase(str) {
  return str
    .toLowerCase()
    .replace(/['\W]+(.)?/g, (_, ch) => (ch ? ch.toUpperCase() : ""))
    .replace(/^./, (ch) => ch.toLowerCase());
}

const getRandomValue = (obj) => {
  const keys = Object.keys(obj);
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  return obj[randomKey];
};

const getRandomTip = (category, exception = "") => {
  const id = toCamelCase(category);
  const keys = Object.keys(config.tips[id]).filter((key) => key !== exception);
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  return getRandomValue(config.tips[id][randomKey]);
};

const createCommandGuideEmbed = (name) => {
  const query = name.toLowerCase();

  for (const category of Object.values(commandsData)) {
    for (const cmd of Object.values(category.commands)) {
      if (
        cmd.name.toLowerCase() === query ||
        (cmd.aliases &&
          cmd.aliases.some((alias) => alias.toLowerCase() === query))
      ) {
        const fields = [
          {
            name: "📂 Category",
            value: category.name,
          },
          {
            name: "📝 Description",
            value: cmd.description || "No description provided.",
          },
        ];

        if (cmd.usage) {
          fields.push({
            name: "⚙️ Usage",
            value: `\`${cmd.usage}\``,
          });
        }

        if (cmd.aliases && cmd.aliases.length > 0) {
          fields.push({
            name: "🔀 Aliases",
            value: cmd.aliases.map((a) => `\`${a}\``).join(", "),
          });
        }

        if (cmd.cooldown) {
          fields.push({
            name: "⏱️ Cooldown",
            value: `${cmd.cooldown}s`,
          });
        }

        if (cmd.notes) {
          fields.push({
            name: "ℹ️ Notes",
            value: cmd.notes.join("\n"),
          });
        }

        return {
          title: `Command Guide: \`${cmd.name}\``,
          description: cmd.description || null,
          color: config.embed.color.default,
          fields,
          footer: {
            text: getRandomTip("basic"),
          },
        };
      }
    }
  }

  for (const category of Object.values(commandsData)) {
    if (category.name.toLowerCase() === query) {
      const commandsList = Object.values(category.commands).map((cmd) => ({
        name: config.prefix + cmd.name,
        value: cmd.description ?? "No description.",
      }));

      return {
        title: `${category.emoji} ${category.name} Commands`,
        description: category.description,
        color: config.embed.color.default,
        fields: commandsList,
        footer: {
          text: getRandomTip(category.name),
        },
      };
    }
  }

  return {
    title: "Not Found",
    description: `No command or category found matching \`${name}\`.`,
    color: config.embed.color.red,
    footer: {
      text: config.tips.basic.help.default,
    },
  };
};

module.exports = {createCommandGuideEmbed, getRandomTip, getRandomValue};
