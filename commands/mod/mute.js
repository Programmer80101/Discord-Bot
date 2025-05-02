const {
  InteractionContextType,
  PermissionFlagsBits,
  SlashCommandBuilder,
} = require("discord.js");
const {
  createCommandGuideEmbed,
  getRandomTip,
  parseTime,
} = require("../../utils");
const commandsData = require("../../commands");
const config = require("../../config");

const command = commandsData.moderation.commands.mute;

const createMuteEmbed = (success, title, description) => {
  return {
    title: title,
    description: description,
    color: success ? config.embed.color.green : config.embed.color.red,
    footer: {
      text: getRandomTip(commandsData.moderation.name, command.name),
    },
  };
};

const muteUser = async (source, invoker, targetMember, duration, reason) => {
  if (!targetMember) {
    const embed = createCommandGuideEmbed(command.name);
    return await source.reply({embeds: [embed]});
  }

  if (invoker.id == targetMember.id) {
    const embed = createMuteEmbed(
      false,
      config.message.error.selfSabotage,
      `${config.emoji.general.error} If you want to mute yourself ask the Owner about it! 😉`
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
    const embed = createMuteEmbed(
      false,
      config.message.error.insufficientPermissions,
      `${config.emoji.general.error} You do not have permission to mute members.`
    );

    return await source.reply({embeds: [embed]});
  }

  const bot = await source.guild.members.fetchMe();

  if (!bot.permissions.has(PermissionFlagsBits.ModerateMembers)) {
    const embed = createMuteEmbed(
      false,
      config.message.error.insufficientPermissions,
      `${config.emoji.general.error} I do not have permission to mute members.`
    );

    return await source.reply({embeds: [embed]});
  }

  const botHighestRole = bot.roles.highest.position;
  const memberHighestRole = invoker.roles.highest.position;
  const targetHighestRole = targetMember.roles.highest.position;

  if (memberHighestRole <= targetHighestRole) {
    const embed = createMuteEmbed(
      false,
      config.message.error.roleHierarchy,
      `${config.emoji.general.error} You cannot mute a member with a equal or higher role.`
    );

    return await source.reply({embeds: [embed]});
  }

  if (botHighestRole <= targetHighestRole) {
    const embed = createMuteEmbed(
      false,
      config.message.error.roleHierarchy,
      `${config.emoji.general.error} I cannot mute a member with a equal or higher role.`
    );

    return await source.reply({embeds: [embed]});
  }

  const {success, durationInMs, message} = parseTime(duration);

  if (durationInMs <= 0) {
    const embed = createMuteEmbed(
      false,
      config.message.error.invalidDuration,
      `${config.emoji.general.error} Invalid duration format. \nUse \`1s\`, \`1m\`, \`1h\`, \`1d\`, \`1w\`, or \`1y\`.`
    );

    return await source.reply({embeds: [embed]});
  }

  if (durationInMs > 28 * 24 * 60 * 60 * 1000) {
    const embed = createMuteEmbed(
      false,
      config.message.error.invalidDuration,
      `${config.emoji.general.error} The maximum mute duration is 28 days.`
    );

    return await source.reply({embeds: [embed]});
  }

  try {
    await targetMember.timeout(durationInMs);
    await targetMember.send({
      embeds: [
        {
          title: `${command.emoji}  You were muted!`,
          description: `You were muted in **${source.guild.name}** \n**Duration**: ${duration} \n**Reason**: ${reason}`,
          color: config.embed.color.red,
        },
      ],
    });
    await source.reply({
      embeds: [
        {
          title: `${command.emoji} Mute Successful`,
          description: `${config.emoji.general.success} **${targetMember.user.tag}** was muted!  \n**Duration**: ${duration} \n**Reason**: ${reason}`,
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
    .addStringOption((option) =>
      option
        .setName(command.args[2].name)
        .setDescription(command.args[2].description)
        .setRequired(command.args[2].required)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .setContexts(InteractionContextType.Guild),

  async execute(interaction) {
    const targetMember = interaction.options.getMember(command.args[0].name);
    const duration = interaction.options.getString(command.args[1].name);
    const reason =
      interaction.options.getString(command.args[2].name) ??
      "No reason provided";

    await muteUser(
      interaction,
      interaction.member,
      targetMember,
      duration,
      reason
    );
  },

  async prefix(message, args) {
    const targetUser = message.mentions.users.first();
    const duration = args[1];
    const targetMember = targetUser
      ? await message.guild.members.fetch(targetUser.id).catch(() => null)
      : null;

    const reason = args.slice(2).join(" ") || "No reason provided";

    await muteUser(message, message.member, targetMember, duration, reason);
  },
};
