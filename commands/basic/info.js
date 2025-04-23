const {SlashCommandBuilder} = require("discord.js");
const osu = require("node-os-utils");
const commandsData = require("../../commands");
const {getRandomTip} = require("../../utils");
const config = require("../../config");

const command = commandsData.basic.commands.info;

const getInfoEmbed = async (client) => {
  const creationTimestamp = Math.floor(client.user.createdTimestamp / 1000);
  const ownerId = config.owner.id;

  const latency = Math.round(client.ws.ping);
  const uptimeInSeconds = Math.floor(client.uptime / 1000);
  const cpuUsage = Math.round(await osu.cpu.usage());

  const memoryInfo = await osu.mem.used();
  const totalMemory = Math.round(memoryInfo.totalMemMb);
  const memoryUsed = Math.round(memoryInfo.usedMemMb);

  const memoryUsage = `${memoryUsed} / ${totalMemory} MB`;
  console.log();
  return {
    color: config.embed.color.default,
    title: "🤖 Bot Information",
    description: "All necessary information about the bot!",
    fields: [
      {
        name: "📅 Created At",
        value: `<t:${creationTimestamp}:F>`,
      },
      {
        name: "👤 Owner",
        value: `<@${ownerId}>`,
      },
      {
        name: "🕔 Uptime",
        value:
          `${Math.floor(uptimeInSeconds / 3600)}h ` +
          `${Math.floor((uptimeInSeconds % 3600) / 60)}m ` +
          `${uptimeInSeconds % 60}s`,
      },
      {
        name: "⚡ Latency",
        value: `${latency}ms`,
      },
      {
        name: "🗄️ CPU Usage",
        value: `${cpuUsage}%`,
      },
      {
        name: "🧠 Memory",
        value: memoryUsage,
      },
    ],
    footer: {
      text: getRandomTip(commandsData.basic.name, command.name),
    },
  };
};

module.exports = {
  ...command,
  data: new SlashCommandBuilder()
    .setName(command.name)
    .setDescription(command.description),

  async execute(interaction) {
    await interaction.reply({embeds: [await getInfoEmbed(interaction.client)]});
  },

  async prefix(message, args) {
    await message.reply({embeds: [await getInfoEmbed(message.client)]});
  },
};
