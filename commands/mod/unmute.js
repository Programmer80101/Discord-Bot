const {
  InteractionContextType,
  PermissionFlagsBits,
  SlashCommandBuilder,
} = require("discord.js");
const {createCommandGuideEmbed, getRandomTip} = require("../../utils");
const commandsData = require("../../commands");
const config = require("../../config");

const command = commandsData.moderation.commands.unmute;

const createUnmuteEmbed = (success, title, description) => {
  return {
    title: title,
    description: description,
    color: success ? config.embed.color.green : config.embed.color.red,
    footer: {
      text: getRandomTip(commandsData.moderation.name, command.name),
    },
  };
};

const muteUser = async (source, invoker, targetMember, reason) => {
  if (!targetMember) {
    const embed = createCommandGuideEmbed(command.name);
    return await source.reply({embeds: [embed]});
  }

  if (!targetMember.isCommunicationDisabled()) {
    const embed = createUnmuteEmbed(
      false,
      config.message.error.invalidArguments,
      `${config.emoji.general.error} Target member is not muted!`
    );
    return await source.reply({embeds: [embed]});
  }

  if (invoker.id == targetMember.id) {
    const embed = createUnmuteEmbed(
      false,
      config.message.error.selfSabotage,
      `${config.emoji.general.error} If you want to unmute yourself ask the Owner about it! 😉`
    );

    return await source.reply({embeds: [embed]});
  }

  if (
    config.owner.id == targetMember.id ||
    targetMember.id === source.guild.ownerId
  ) {
    await source.reply("Get lost!");
  }

  if (!invoker.permissions.has(PermissionFlagsBits.ModerateMembers)) {
    const embed = createUnmuteEmbed(
      false,
      config.message.error.insufficientPermissions,
      `${config.emoji.general.error} You do not have permission to unmute members.`
    );

    return await source.reply({embeds: [embed]});
  }

  const bot = await source.guild.members.fetchMe();

  if (!bot.permissions.has(PermissionFlagsBits.ModerateMembers)) {
    const embed = createUnmuteEmbed(
      false,
      config.message.error.insufficientPermissions,
      `${config.emoji.general.error} I do not have permission to unmute members.`
    );

    return await source.reply({embeds: [embed]});
  }

  const botHighestRole = bot.roles.highest.position;
  const memberHighestRole = invoker.roles.highest.position;
  const targetHighestRole = targetMember.roles.highest.position;

  if (memberHighestRole <= targetHighestRole) {
    const embed = createUnmuteEmbed(
      false,
      config.message.error.roleHierarchy,
      `${config.emoji.general.error} You cannot unmute a member with a equal or higher role.`
    );

    return await source.reply({embeds: [embed]});
  }

  if (botHighestRole <= targetHighestRole) {
    const embed = createUnmuteEmbed(
      false,
      config.message.error.roleHierarchy,
      `${config.emoji.general.error} I cannot unmute a unmember with a equal or higher role.`
    );

    return await source.reply({embeds: [embed]});
  }

  try {
    await targetMember.timeout(null, reason);
    await targetMember.send({
      embeds: [
        {
          title: `${command.emoji} You were unmuted!`,
          description: `You were unmuted in **${source.guild.name}** \n**Reason**: ${reason}`,
          color: config.embed.color.red,
        },
      ],
    });
    await source.reply({
      embeds: [
        {
          title: `${command.emoji} Unmute Successful`,
          description: `${config.emoji.general.success} **${targetMember.user.tag}** was Unmuted! \n**Reason**: ${reason}`,
          color: config.embed.color.green,
        },
      ],
    });
  } catch (error) {
    console.error(error);
    await source.reply({
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
    .addUserOption((option) =>
      option
        .setName(command.args[0].name)
        .setDescription(command.args[0].description)
        .setRequired(command.args[0].required)
    )
    .addStringOption((option) =>
      option
        .setName(command.args[1].name)
        .setDescription(command.args[1].description)
        .setRequired(command.args[1].required)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .setContexts(InteractionContextType.Guild),

  async execute(interaction) {
    const targetMember = interaction.options.getMember(command.args[0].name);
    const reason =
      interaction.options.getString(command.args[1].name) ??
      "No reason provided";

    await muteUser(interaction, interaction.member, targetMember, reason);
  },

  async prefix(message, args) {
    const targetUser = message.mentions.users.first();
    const targetMember = targetUser
      ? await message.guild.members.fetch(targetUser.id).catch(() => null)
      : null;

    const reason = args.slice(1).join(" ") || "No reason provided";

    await muteUser(message, message.member, targetMember, reason);
  },
};
