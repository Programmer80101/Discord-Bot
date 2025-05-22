const {SlashCommandBuilder} = require("discord.js");
const commandsData = require("../../commands");
const {getRandomTip} = require("../../utils");
const config = require("../../config.js");

const command = commandsData.basic.commands.rules;

const sendRules = async (source) => {
  let description = `Follow these rules all the time while using the bot! \n\n`;

  description += `**1. No Spamming**Don't spam commands or slash commands. \n`;
  description += `**3. No Exploiting**Don't exploit any bugs or glitches in the bot.\n`;
  description += `**2. No Alt Accounts**Don't use multiple accounts to get an advantage.\n`;

  description += `\n\n🪲 If you find any bugs or glitches, please report them to <@${config.owner.id}>. If you successfully report an exploit you'll be given ${config.emoji.general.currency} 100.`;
  description += `\n\n📄 If you found someone else breaking the rules, please report them to the moderators.`;
  description += `\n\n⚠️ If you break any of the rules, necessary action will be taken!`;

  const guideEmbed = {
    color: config.embed.color.default,
    title: `${command.emoji} Bot Rules`,
    description: description,
    footer: {
      text: getRandomTip(commandsData.basic.name, command.name),
    },
  };

  await source.reply({
    embeds: [guideEmbed],
  });
};

module.exports = {
  ...command,
  data: new SlashCommandBuilder()
    .setName(command.name)
    .setDescription(command.description),

  async execute(interaction) {
    await sendRules(interaction);
  },

  async prefix(message, args) {
    await sendRules(message);
  },
};
