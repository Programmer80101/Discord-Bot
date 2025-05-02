const {
  InteractionContextType,
  PermissionFlagsBits,
  SlashCommandBuilder,
} = require("discord.js");
const {createCommandGuideEmbed, getRandomTip} = require("../../utils");
const commandsData = require("../../commands");
const config = require("../../config");

const command = commandsData.moderation.commands.purge;

const createBanEmbed = (success, title, description) => {
  return {
    title: title,
    description: description,
    color: success ? config.embed.color.green : config.embed.color.red,
    footer: {text: getRandomTip(commandsData.moderation.name, command.name)},
  };
};

const banUser = async (source, invoker, targetMember, reason) => {
  if (!targetMember) {
    const embed = createCommandGuideEmbed(command.name);
    return await source.reply({embeds: [embed]});
  }

  if (invoker.id == targetMember.id) {
    const embed = createBanEmbed(
      false,
      config.message.error.selfSabotage,
      `${config.emoji.error.default} If you want to ban yourself ask the Owner about it! 😉`
    );

    return await source.reply({embeds: [embed]});
  }

  if (
    config.owner.id == targetMember.id ||
    targetMember.id === source.guild.ownerId
  ) {
    await source.reply("Get lost!");
  }

  if (!invoker.permissions.has(PermissionFlagsBits.BanMembers)) {
    const embed = createBanEmbed(
      false,
      config.message.error.insufficientPermissions,
      `${config.emoji.error.default} You do not have permission to ban members.`
    );

    return await source.reply({embeds: [embed]});
  }

  const bot = await source.guild.members.fetchMe();

  if (!bot.permissions.has(PermissionFlagsBits.BanMembers)) {
    const embed = createBanEmbed(
      false,
      config.message.error.insufficientPermissions,
      `${config.emoji.error.default} I do not have permission to ban members.`
    );

    return await source.reply({embeds: [embed]});
  }

  const botHighestRole = bot.roles.highest.position;
  const memberHighestRole = invoker.roles.highest.position;
  const targetHighestRole = targetMember.roles.highest.position;

  if (memberHighestRole <= targetHighestRole) {
    const embed = createBanEmbed(
      false,
      config.message.error.roleHierarchy,
      `${config.emoji.error.default} You cannot ban a member with a equal or higher role.`
    );

    return await source.reply({embeds: [embed]});
  }

  if (botHighestRole <= targetHighestRole) {
    const embed = createBanEmbed(
      false,
      config.message.error.roleHierarchy,
      `${config.emoji.error.default} I cannot ban a member with a equal or higher role.`
    );

    return await source.reply({embeds: [embed]});
  }

  if (!targetMember.bannable) {
    const embed = createBanEmbed(
      false,
      config.message.error.insufficientPermissions,
      `${config.emoji.error.default} I cannot ban that member.`
    );

    return await source.reply({embeds: [embed]});
  }

  try {
    await source.client.users.send(targetMember.id, {
      embeds: [
        {
          title: `${command.emoji} You were banned!`,
          description: `You were banned from **${source.guild.name}** \n**Reason**: ${reason}`,
          color: config.embed.color.red,
        },
      ],
    });
    await source.guild.members.ban(targetMember.id, {reason});
    await source.reply({
      embeds: [
        {
          title: `${command.emoji} Ban Successful`,
          description: `${config.emoji.general.success} **${targetMember.user.tag}** was banned! \n**Reason**: ${reason}`,
          color: config.embed.color.green,
        },
      ],
    });
  } catch (error) {
    console.error(error);
    await interaction.reply({
      embeds: [
        {
          title: config.message.error.somethingWentWrong,
          description: "Uh-oh! Something unexpected happened.",
          color: config.embed.color.red,
          footer: {
            text: `Contact ${config.owner.name} to resolve this issue!`,
          },
        },
      ],
    });
  }
};

module.exports = {
  ...command,
  data: new SlashCommandBuilder()
    .setName(command.name)
    .setDescription(command.description)
    .addIntegerOption((option) =>
      option
        .setName(command.args[0].name)
        .setDescription(command.args[0].description)
        .setRequired(command.args[0].required)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .setContexts(InteractionContextType.Guild),

  async execute(interaction) {
    const targetMember = interaction.options.getMember(command.args[0].name);
    const reason =
      interaction.options.getString(command.args[1].name) ??
      "No reason provided";

    await banUser(interaction, interaction.member, targetMember, reason);
  },

  async prefix(message, args) {
    const amount = parseInt(args[1]);
    await purge(message, amount);
  },
};
