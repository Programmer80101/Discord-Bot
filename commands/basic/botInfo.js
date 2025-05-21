const {SlashCommandBuilder} = require("discord.js");
const osu = require("node-os-utils");
const commandsData = require("../../commands");
const {getRandomTip} = require("../../utils");
const config = require("../../config");

const command = commandsData.basic.commands.botInfo;

const thresholds = {
  cpu: [80, 95],
  memory: [75, 90],
  ping: [60, 200],
};

const getInfoEmbed = async (client) => {
  const ownerId = config.owner.id;

  const latency = Math.round(client.ws.ping);
  const uptimeInSeconds = Math.floor(client.uptime / 1000);
  const cpuUsage = await osu.cpu.usage();

  const memoryInfo = await osu.mem.used();
  const totalMemory = Math.round(memoryInfo.totalMemMb);
  const memoryUsed = Math.round(memoryInfo.usedMemMb);

  const memoryUsage = (memoryUsed / totalMemory) * 100;

  let critical = "";
  let warning = "";
  let embedColor = config.embed.color.green;

  const checkThresholds = (name, value, thresholds) => {
    if (value >= thresholds[1]) {
      critical += `${name} is very high!\n`;
    } else if (value >= thresholds[0]) {
      warning += `${name} is slightly high!\n`;
    }
  };

  checkThresholds("Ping", latency, thresholds.ping);
  checkThresholds("CPU Usage", cpuUsage, thresholds.cpu);
  checkThresholds("Memory Usage", memoryUsage, thresholds.memory);

  const fields = [
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
      value: `${memoryUsage.toFixed(2)}%`,
    },
  ];

  if (warning) {
    embedColor = config.embed.color.yellow;
    fields.push({
      name: "🟡 Warning",
      value: warning,
    });
  }

  if (critical) {
    embedColor = config.embed.color.red;
    fields.push({
      name: "🔴 Critical",
      value: critical,
    });
  }

  if (!warning && !critical) {
    fields.push({
      name: "🟢 Normal",
      value: "Everthing is normal!",
    });
  }

  return {
    color: embedColor,
    title: "🤖 Bot Information",
    description: "All necessary information about the bot!",
    fields: fields,
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
    await interaction.reply({
      embeds: [await getInfoEmbed(interaction.client)],
    });
  },

  async prefix(message, args) {
    await message.reply({embeds: [await getInfoEmbed(message.client)]});
  },
};
