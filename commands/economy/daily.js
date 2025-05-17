const dayjs = require("dayjs");
const relativeTime = require("dayjs/plugin/relativeTime");
const {SlashCommandBuilder, EmbedBuilder} = require("discord.js");
const commandsData = require("../../commands");
const {getRandomTip} = require("../../utils");
const {getLastDaily, setLastDaily, addBalance} = require("../../db");
const config = require("../../config");

dayjs.extend(relativeTime);

const command = commandsData.economy.commands.daily;
const COOLDOWN_HOURS = 23;
const DAILY_AMOUNT = 10;

const getDaily = async (source, user) => {
  const now = dayjs();
  const lastClaimIso = await getLastDaily(user.id);

  if (lastClaimIso) {
    const lastClaim = dayjs(lastClaimIso);
    const hoursSince = now.diff(lastClaim, "hour", true);

    if (hoursSince < COOLDOWN_HOURS) {
      const next = lastClaim.add(COOLDOWN_HOURS, "hour");
      const inTime = next.fromNow(true);

      const dailyEmbed = {
        title: "💸 Daily Already Claimed",
        color: config.embed.color.red,
        description: `
          You have already claimed your daily reward! Come back in ${inTime}.
        `,
        footer: {
          text: getRandomTip(commandsData.economy.name, command.name),
        },
      };
      return await source.reply({
        embeds: [dailyEmbed],
      });
    }
  }

  await addBalance(user.id, DAILY_AMOUNT);
  await setLastDaily(user.id, Date.now());

  const dailyEmbed = {
    title: "💸 Daily Reward",
    color: config.embed.color.green,
    description: `
      You claimed ${config.emoji.general.coin} ${DAILY_AMOUNT} coins!
      \nCome back again tomorrow to claim more coins!
    `,
    footer: {
      text: getRandomTip(commandsData.economy.name, command.name),
    },
  };

  await source.reply({embeds: [dailyEmbed]});
};

module.exports = {
  ...command,
  data: new SlashCommandBuilder()
    .setName(command.name)
    .setDescription(command.description),

  async execute(interaction) {
    const user = interaction.user;
    await getDaily(interaction, user);
  },

  async prefix(message) {
    const user = message.author;
    await getDaily(message, user);
  },
};
