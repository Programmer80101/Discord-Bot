const {
  InteractionContextType,
  PermissionFlagsBits,
  SlashCommandBuilder,
} = require("discord.js");

module.exports = {
  name: "ban",
  description: "Bans a user.",
  alias: ["banuser"],
  cooldown: 10,
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Bans a user.")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("The member to ban")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("reason").setDescription("The reason for banning")
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .setContexts(InteractionContextType.Guild),

  async execute(interaction) {
    const target = interaction.options.getUser("target");
    const reason =
      interaction.options.getString("reason") ?? "No reason provided";

    await interaction.guild.members.ban(target);
    await interaction.reply(`Banning ${target.username} for reason: ${reason}`);
  },

  async prefix({message, args}) {
    if (!message.member.permissions.has(PermissionFlagsBits.BanMembers)) {
      return message.reply("You do not have permission to ban members.");
    }

    const target = message.mentions.users.first();
    if (!target) {
      return message.reply("Please mention a user to ban.");
    }

    const reason = args.slice(1).join(" ") || "No reason provided";

    try {
      await message.guild.members.ban(target, {reason});
      await message.reply(`Banning ${target.username} for reason: ${reason}`);
    } catch (error) {
      console.error(error);
      await message.reply("Failed to ban the user.");
    }
  },
};
