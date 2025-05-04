const {
  InteractionContextType,
  PermissionFlagsBits,
  SlashCommandBuilder,
} = require("discord.js");
const {createCommandGuideEmbed, getRandomTip} = require("../../utils");
const commandsData = require("../../commands");
const config = require("../../config");

const command = commandsData.moderation.commands.purge;

const createPurgeEmbed = (success, title, description) => {
  return {
    title: title,
    description: description,
    color: success ? config.embed.color.green : config.embed.color.red,
    footer: {text: getRandomTip(commandsData.moderation.name, command.name)},
  };
};

const purge = async (source, invoker, amount) => {
  if (!amount) {
    const embed = createCommandGuideEmbed(command.name);
    return await source.reply({embeds: [embed]});
  }

  if (!invoker.permissions.has(PermissionFlagsBits.ManageMessages)) {
    const embed = createPurgeEmbed(
      false,
      config.message.error.insufficientPermissions,
      `${config.emoji.error.default} You do not have permission to delete messages.`
    );

    return await source.reply({embeds: [embed]});
  }

  const bot = await source.guild.members.fetchMe();

  if (!bot.permissions.has(PermissionFlagsBits.ManageMessages)) {
    const embed = createPurgeEmbed(
      false,
      config.message.error.insufficientPermissions,
      `${config.emoji.error.default} I do not have permission to delete messages.`
    );

    return await source.reply({embeds: [embed]});
  }

  if (isNaN(amount) || amount < 1 || amount > 99) {
    const embed = createPurgeEmbed(
      false,
      config.message.error.invalidArguments,
      `${config.emoji.error.default} Purge amount should be a valid integer between 1 and 100.`
    );

    return await source.reply({embeds: [embed]});
  }

  try {
    await source.channel.bulkDelete(amount + 1, true);
    const channel = await source.client.channels.fetch(source.channelId);
    const successMessage = await channel.send({
      embeds: [
        {
          title: `${command.emoji} Purge Successful`,
          description: `${config.emoji.general.success} Purged **${amount}** messages.`,
          color: config.embed.color.green,
        },
      ],
    });

    setTimeout(async () => {
      await successMessage.delete();
    }, 5_000);
    return;
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
    .addIntegerOption((option) =>
      option
        .setName(command.args[0].name)
        .setDescription(command.args[0].description)
        .setRequired(command.args[0].required)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .setContexts(InteractionContextType.Guild),

  async execute(interaction) {
    const amount = interaction.options.getInteger(command.args[0].name);
    await purge(interaction, interaction.member, amount);
  },

  async prefix(message, args) {
    const amount = parseInt(args[0], 10);
    await purge(message, message.member, amount);
  },
};
