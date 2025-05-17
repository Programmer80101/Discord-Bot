const dayjs = require("dayjs");
const relativeTime = require("dayjs/plugin/relativeTime");
const duration = require("dayjs/plugin/duration");
const {SlashCommandBuilder} = require("discord.js");
const commandsData = require("../../commands");
const {getRandomTip} = require("../../utils");
const config = require("../../config");

dayjs.extend(relativeTime);
dayjs.extend(duration);

const command = commandsData.basic.commands.user;

const getUserEmbed = async (user, member) => {
  const createdAt = `<t:${Math.floor(user.createdTimestamp / 1000)}:D>`;

  const joinedAt = member.joinedTimestamp
    ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:D>`
    : "N/A";

  const accountAgeInMs = Date.now() - user.createdTimestamp;
  const serverAgeInMs = Date.now() - member.joinedTimestamp;

  const accountAge = dayjs.duration(accountAgeInMs).humanize();
  const serverAge = dayjs.duration(serverAgeInMs).humanize();

  const roles =
    member.roles.cache
      .filter((r) => r.id !== member.guild.id)
      .sort((a, b) => b.position - a.position)
      .map((r) => r.toString())
      .join("\n") || "*None*";

  const embed = {
    color: config.embed.color.default,
    title: `User: ${user}`,
    description: "",
    fields: [
      {
        name: "🆔 ID",
        value: user.id,
      },
      {
        name: "📅 Created",
        value: createdAt,
      },
      {
        name: "👤 Username",
        value: user.username,
      },
      {
        name: "💳 Display Name",
        value: user.globalName,
      },
      {
        name: "🗄️ Server Nickname",
        value: member.nickname || "None",
      },
      {
        name: "🚪 Joined",
        value: joinedAt,
      },
      {
        name: "⏰ Account Age",
        value: accountAge,
      },
      {
        name: "🕘 Server Age",
        value: serverAge,
      },
      {
        name: "⚙️ Roles",
        value: roles,
      },
    ],
    footer: {text: getRandomTip(commandsData.basic.name, command.name)},
  };

  return embed;
};

module.exports = {
  ...command,
  data: new SlashCommandBuilder()
    .setName(command.name)
    .setDescription(command.description)
    .addUserOption((option) => {
      return option
        .setName(command.args[0].name)
        .setDescription(command.args[0].description)
        .setRequired(command.args[0].required);
    }),

  async execute(interaction) {
    const user = interaction.options.getUser("target") || interaction.user;
    const member = await interaction.guild.members.fetch(user.id);

    const userEmbed = await getUserEmbed(user, member);

    await interaction.reply({embeds: [userEmbed]});
  },

  async prefix(message, args) {
    const user = message.mentions.users.first() || message.author;
    const member = await message.guild.members.fetch(user.id);

    const userEmbed = await getUserEmbed(user, member);

    await message.reply({embeds: [userEmbed]});
  },
};
