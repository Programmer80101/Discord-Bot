const {createCommandGuideEmbed, getRandomTip} = require("../../utils");
const {SlashCommandBuilder} = require("discord.js");
const commandsData = require("../../commands");
const config = require("../../config");

const command = commandsData.basic.commands.help;

const fields = Object.values(commandsData).map((category) => ({
  name: `${category.emoji} ${category.name}`,
  value:
    Object.values(category.commands)
      .map((cmd) => `\`${cmd.name}\``)
      .join(", ") || "*None*",
}));

const helpEmbed = {
  color: config.embed.color.default,
  title: "📘 Command Guide",
  description: "List of all available commands with categories!",
  footer: {text: getRandomTip(commandsData.basic.name, command.name)},
  fields,
};

const executeCommand = async (source, text) => {
  if (!text) {
    return await source.reply({embeds: [helpEmbed]});
  }

  await source.reply({embeds: [createCommandGuideEmbed(text)]});
};

module.exports = {
  ...command,
  data: new SlashCommandBuilder()
    .setName(command.name)
    .setDescription(command.description)
    .addStringOption((option) => {
      return option
        .setName(command.args[0].name)
        .setDescription(command.args[0].description)
        .setRequired(command.args[0].required);
    }),

  async execute(interaction) {
    const text = interaction.options.getString(command.args[0].name);
    executeCommand(interaction, text);
  },

  async prefix(message, args) {
    const text = args.join(" ");
    executeCommand(message, text);
  },
};
