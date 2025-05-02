const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  InteractionContextType,
} = require("discord.js");
const {createCommandGuideEmbed, getRandomTip} = require("../../utils");
const commandsData = require("../../commands");
const config = require("../../config");

const command = commandsData.moderation.commands.kick;

const createKickEmbed = (success, title, description) => {
  return {
    title: title,
    description: description,
    color: success ? config.embed.color.green : config.embed.color.red,
    footer: {text: getRandomTip(commandsData.moderation.name, command.name)},
  };
};

const kickUser = async (source, invoker, targetMember, reason) => {
  if (!targetMember) {
    const embed = createCommandGuideEmbed(command.name);
    return await source.reply({embeds: [embed]});
  }

  if (invoker.id == targetMember?.id) {
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

  if (!invoker.permissions.has(PermissionFlagsBits.KickMembers)) {
    const embed = createKickEmbed(
      false,
      config.message.error.insufficientPermissions,
      `${config.emoji.error.default} You do not have permission to kick members.`
    );

    return await source.reply({embeds: [embed]});
  }

  const bot = await source.guild.members.fetchMe();

  if (!bot.permissions.has(PermissionFlagsBits.KickMembers)) {
    const embed = createKickEmbed(
      false,
      config.message.error.insufficientPermissions,
      `${config.emoji.error.default} I do not have permission to kick members.`
    );

    return await source.reply({embeds: [embed]});
  }

  const botHighestRole = bot.roles.highest.position;
  const memberHighestRole = invoker.roles.highest.position;
  const targetHighestRole = targetMember.roles.highest.position;

  if (memberHighestRole <= targetHighestRole) {
    const embed = createKickEmbed(
      false,
      config.message.error.roleHierarchy,
      `${config.emoji.error.default} You cannot kick a member with a equal or higher role.`
    );

    return await source.reply({embeds: [embed]});
  }

  if (botHighestRole <= targetHighestRole) {
    const embed = createKickEmbed(
      false,
      config.message.error.roleHierarchy,
      `${config.emoji.error.default} You cannot kick a member with a equal or higher role.`
    );

    return await source.reply({embeds: [embed]});
  }

  if (!targetMember.kickable) {
    const embed = createKickEmbed(
      false,
      config.message.error.insufficientPermissions,
      `${config.emoji.error.default} I cannot kick that member.`
    );

    return await source.reply({embeds: [embed]});
  }

  try {
    await source.client.users.send(targetMember.id, {
      embeds: [
        {
          title: `${command.emoji} You were kicked!`,
          description: `You were kicked from **${source.guild.name}** \n**Reason**: ${reason}`,
          color: config.embed.color.red,
        },
      ],
    });
    await source.guild.members.kick(targetMember.id, {reason});
    await source.reply({
      embeds: [
        {
          title: `${command.emoji} Kick Successful`,
          description: `${config.emoji.general.success} **${targetMember.user.tag}** was kicked!`,
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
  data: new SlashCommandBuilder()
    .setName(command.name)
    .setDescription(command.description)
    .addUserOption((opt) =>
      opt
        .setName(command.args[0].name)
        .setDescription(command.args[0].description)
        .setRequired(command.args[0].required)
    )
    .addStringOption((opt) =>
      opt
        .setName(command.args[1].name)
        .setDescription(command.args[1].description)
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .setContexts(InteractionContextType.Guild),

  async execute(interaction) {
    const targetMember = interaction.options.getMember(command.args[0].name);
    const reason =
      interaction.options.getString(command.args[1].name) ||
      "No reason provided";
    await kickUser(interaction, interaction.member, targetMember, reason);
  },

  async prefix(message, args) {
    const targetUser = message.mentions.users.first();
    const targetMember = targetUser
      ? await message.guild.members.fetch(targetUser.id).catch(() => null)
      : null;
    const reason = args.slice(1).join(" ") || "No reason provided";
    await kickUser(message, message.member, targetMember, reason);
  },
};
