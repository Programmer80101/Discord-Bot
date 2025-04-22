const {
  InteractionContextType,
  SlashCommandBuilder,
  MessageFlags,
} = require("discord.js");

const command = {
  name: "echo",
  description: "Sends a message in the specified channel.",
  aliases: ["echo", "send", "say"],
};

module.exports = {
  ...command,
  data: new SlashCommandBuilder()
    .setName(command.name)
    .setDescription(command.description)
    .addStringOption((option) => {
      return option
        .setName("message")
        .setDescription("The message to send.")
        .setRequired(true);
    })
    .addChannelOption((option) => {
      return option
        .setName("channel")
        .setDescription("The channel to send into.")
        .setRequired(false);
    })
    .setContexts(InteractionContextType.Guild),

  async execute(interaction) {
    const text = interaction.options.getString("message");
    const channel =
      interaction.options.getChannel("channel") || interaction.channel;

    try {
      await channel.send(text);
      await interaction.reply({
        content: `✅ Message echoed in ${channel}. \n**Message:** ${text}`,
        flags: MessageFlags.Ephemeral,
      });
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: `❌ Failed to send message in ${channel}. \n**Error:** ${error.message}`,
        flags: MessageFlags.Ephemeral,
      });
    }
  },

  async prefix(message, args) {
    const optionalChannel = message.mentions.channels.first();
    let targetChannel = message.channel;
    if (optionalChannel) {
      targetChannel = optionalChannel;
      args.pop();
    }

    const text = args.join(" ");
    if (!text) {
      return await message.reply("Please provide a message to send.");
    }

    try {
      await targetChannel.send(text);
      if (targetChannel != message.channel) {
        await message.reply(
          `✅ Message echoed in ${targetChannel}. \n**Message:** ${text}`
        );
      }
    } catch (error) {
      console.error(error);
      await message.reply(
        `❌ Failed to send message in ${targetChannel}. \n**Error:** ${error.message}`
      );
    }
  },
};
