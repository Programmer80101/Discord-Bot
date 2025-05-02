const {
  MessageFlags,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
} = require("discord.js");
const {SlashCommandBuilder} = require("discord.js");
const commandsData = require("../../commands");
const config = require("../../config");

const games = new Map();
const command = commandsData.games.commands.handCricket;

const runButtons1 = new ActionRowBuilder().addComponents(
  [1, 2, 3].map((n) =>
    new ButtonBuilder()
      .setCustomId(`run_${n}`)
      .setLabel(`${n}`)
      .setStyle(ButtonStyle.Secondary)
  )
);

const runButtons2 = new ActionRowBuilder().addComponents(
  [4, 5, 6].map((n) =>
    new ButtonBuilder()
      .setCustomId(`run_${n}`)
      .setLabel(`${n}`)
      .setStyle(ButtonStyle.Secondary)
  )
);

const createGameState = (
  channelId,
  player1,
  player2,
  tossWinner,
  battingFirst
) => {
  return {
    channelId: channelId,
    players: [player1, player2],
    tossWinner: tossWinner,
    battingFirst: battingFirst,
    inning: 1,
    runs: [0, 0],
    balls: [0, 0],
    finished: false,
  };
};

const updateGameState = (gameId, key, value, index = null) => {
  const gameState = games.get(gameId);
  if (!gameState) throw new Error(`Game not found for ID: ${gameId}`);

  if (index === null) gameState[key] = value;
  else gameState[key][index] = value;
};

const sendTimeoutEmbed = async (channel) => {
  const timeoutEmbed = {
    color: config.embed.color.red,
    title: "🏏 Hand Cricket: ⏰ Match Timed Out",
    description: "Match ended as both the players didn't respond in time!",
  };

  await channel.send({
    embeds: [timeoutEmbed],
  });
};

const createInningEmbed = (gameState) => {
  const index = gameState.inning - 1;
  const battingFirst = gameState.battingFirst;
  const battingSecond = gameState.players.find((id) => id !== battingFirst.id);

  const currentBatting = index === 0 ? battingFirst : battingSecond;

  const inningEmbed = {
    color: config.embed.color.purple,
    title: `🏏 Hand Cricket: ${gameState.inning == 1 ? "1st" : "2nd"} Inning`,
    description: `**${gameState.players[0]}** vs **${gameState.players[1]}**`,
    fields: [
      {
        name: "🏏 Current Batting",
        value: currentBatting.toString(),
      },
      {
        name: "🏃 Runs",
        value: `${gameState.runs[index]} runs`,
      },
      {
        name: "⚾ Balls",
        value: `${gameState.balls[index]} balls`,
      },
    ],
  };

  return inningEmbed;
};

async function playOneBall(channel, inningMessage, gameState) {
  const embed = createInningEmbed(gameState);

  await inningMessage.edit({
    embeds: [embed],
    components: [runButtons1, runButtons2],
  });

  const batId =
    gameState.inning == 1
      ? gameState.battingFirst.id
      : gameState.players.find((id) => id !== gameState.battingFirst.id).id;

  const bowlId = gameState.players.find((id) => id !== batId).id;

  const picks = {};
  const filter = (i) =>
    !gameState.finished &&
    gameState.players.includes(i.user.id) &&
    i.customId.startsWith("run_");

  const collector = channel.createMessageComponentCollector({
    max: 2,
    time: 30_000,
    filter: filter,
    ComponentType: ComponentType.Button,
  });

  collector.on("collect", async (interaction) => {
    await i.deferUpdate();

    if (picks[interaction.user.id]) {
      await interaction.reply({
        content: "You have already made your choice!",
        flags: MessageFlags.Ephemeral,
      });
    }

    const num = Number(interaction.customId.split("_")[1]);
    picks[interaction.user.id] = num;

    await interaction.reply({
      content: `You picked **${num}**!`,
      flags: MessageFlags.Ephemeral,
    });
  });

  const outcome = await new Promise((resolve) => {
    collector.on("end", () => {
      const disabled = new ActionRowBuilder().addComponents(
        row.components.map((btn) => ButtonBuilder.from(btn).setDisabled(true))
      );

      inningMessage.edit({components: [disabled]}).catch(() => {});

      if (Object.keys(picks).length < 2) {
        return resolve({timeout: true});
      }

      updateGameState(
        gameState.channelId,
        "balls",
        gameState.balls[gameState.inning - 1] + 1,
        gameState.inning - 1
      );

      const batPick = picks[batId];
      const bowlPick = picks[bowlId];

      if (Object.values(picks)[0] === Object.values(picks)[1]) {
        updateGameState(gameState.channelId, "inning", gameState.inning + 1);
        return resolve({wicket: true, batId: batId, pick: batPick});
      } else {
        updateGameState(
          gameState.channelId,
          "runs",
          (gameState.runs[gameState.inning - 1] += batPick),
          gameState.inning - 1
        );

        return resolve({
          wicket: false,
          batId: batId,
          batPick: batPick,
          bowlPick: bowlPick,
        });
      }
    });
  });

  return outcome;
}

const playOneInning = async (channel, inningMessage, gameState) => {
  while (!gameState.finished) {
    const outcome = playOneBall(channel, gameState);

    if (outcome.timeout) {
      await sendTimeoutEmbed(channel);
      break;
    }

    if (outcome.wicket) {
      const embed = createInningEmbed(gameState);
      embed.description += `\n💥 <@${outcome.batId}> is out! Both chose ${outcome.pick}`;
      embed.color = config.embed.color.red;
      await inningMessage.edit({
        embeds: [embed],
        components: [],
      });

      break;
    }

    const embed = createInningEmbed(gameState);
    updateGameState(
      gameState.channelId,
      "runs",
      gameState.runs[gameState.inning - 1] + outcome.batPick,
      gameState.inning - 1
    );

    embed.description += `\n**${outcome.batPick}** runs! Bowler chose ${outcome.bowlPick}`;
    await inningMessage.edit({
      embeds: [embed],
      components: [runButtons1, runButtons2],
    });

    if (gameState.inning === 2 && gameState.runs[1] > gameState.runs[0]) {
      break;
    }
  }
};

const startMatch = async (source, player1, player2) => {
  if (games.has(source.channelId)) {
    return await source.reply({
      content: "❌ A game is already in progress in this channel.",
    });
  }

  const channel = await source.client.channels.fetch(source.channelId);
  const tossWinner = Math.random() < 0.5 ? player1 : player2;

  const gameState = createGameState(
    source.channelId,
    player1,
    player2,
    tossWinner,
    null
  );

  games.set(source.channelId, gameState);

  const tossEmbed = {
    color: config.embed.color.default,
    title: "🏏 Hand Cricket",
    description: `**${player1}** and **${player2}** are playing a game of Hand Cricket!`,
    fields: [
      {
        name: " 🪙 Coin Toss",
        value: "Flipping a coin...",
      },
    ],
  };

  const tossMessage = await source.reply({
    embeds: [tossEmbed],
    withResponse: true,
  });

  setTimeout(async () => {
    tossEmbed.fields[0].value = `**${tossWinner}** won the toss!`;
    tossEmbed.fields.push({
      name: "🏏 Choose your play!",
      value: `**${tossWinner}** choose what you want to play first!`,
    });

    const buttonRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("batFirst")
        .setLabel("🏏  Bat")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("ballFirst")
        .setLabel("⚾  Bowl")
        .setStyle(ButtonStyle.Secondary)
    );

    await tossMessage.edit({
      embeds: [tossEmbed],
      components: [buttonRow],
      withResponse: true,
    });

    const userChoices = new Map();

    try {
      const choiceCollector = await channel.createMessageComponentCollector({
        time: 30_000,
      });

      choiceCollector.on("collect", async (tossInteraction) => {
        if (tossInteraction.user.id != tossWinner.id) {
          await tossInteraction.reply({
            content: "You can't use this!",
            flags: MessageFlags.Ephemeral,
          });

          return;
        }
        if (userChoices.has(tossInteraction.user.id)) {
          await tossInteraction.reply({
            content: "You have already made your choice!",
            flags: MessageFlags.Ephemeral,
          });

          return;
        }

        const winnerChoice = tossInteraction.customId;
        userChoices.set(tossInteraction.user.id, winnerChoice);

        const choiceEmoji = winnerChoice === "batFirst" ? "🏏" : "⚾";
        const choiceMessage = winnerChoice === "batFirst" ? "bat" : "bowl";

        const battingFirst = winnerChoice === "batFirst" ? player1 : player2;
        const battingSecond = winnerChoice === "batFirst" ? player2 : player1;

        updateGameState(source.channelId, "battingFirst", battingFirst);

        tossEmbed.fields[1].value = `**${tossWinner}** decided to ${choiceEmoji} ${choiceMessage} first!`;

        await tossInteraction.update({
          embeds: [tossEmbed],
          components: [],
        });

        choiceCollector.stop();

        const firstInningEmbed = createInningEmbed(gameState);
        const firstInningMessage = await channel.send({
          embeds: [firstInningEmbed],
          components: [runButtons1, runButtons2],
        });

        await playOneInning(channel, firstInningMessage, gameState);
        updateGameState(gameState.channelId, "inning", 2);

        const secondInningEmbed = createInningEmbed(gameState);
        const secondInningMessage = await channel.send({
          embeds: [secondInningEmbed],
          components: [runButtons1, runButtons2],
        });

        await playOneInning(channel, secondInningMessage, gameState);

        const runs = gameState.runs;
        const winnerEmbed = {
          color: config.embed.color.gold,
          title: "🏏 Hand Cricket: Match Ended",
          description: "",
          fields: [],
        };

        if (runs[0] == runs[1]) {
          winnerEmbed.color = config.embed.color.neutral;
          winnerEmbed.description = "🤝 Match ended in a draw!";
          winnerEmbed.fields = [
            {
              name: "🏃 Runs",
              value: runs[0],
            },
          ];
        }

        if (runs[0] > runs[1]) {
          winnerEmbed.description = `🎉 ${battingFirst} won the match!`;
          winnerEmbed.fields = [
            {
              name: "🏆 Winner",
              value: battingFirst.toString(),
            },
          ];
        }

        if (runs[0] < runs[1]) {
          winnerEmbed.description = `🎉 ${battingSecond} won the match!`;
          winnerEmbed.fields = [
            {
              name: "🏆 Winner",
              value: battingSecond.toString(),
            },
          ];
        }

        games.delete(gameState.channelId);
        await channel.send({
          embeds: [winnerEmbed],
        });
      });
    } catch (error) {
      console.error("Error waiting for toss interaction:", error);
      games.delete(source.channelId);
      return await sendTimeoutEmbed(channel);
    }
  }, 1500);
};

module.exports = {
  ...command,
  data: new SlashCommandBuilder()
    .setName(command.name)
    .setDescription(command.description)
    .addUserOption((option) => {
      return option
        .setName(command.args[0].name)
        .setDescription(command.args[0].description)
        .setRequired(command.args[0].required);
    }),

  async execute(interaction) {
    const user = interaction.options.getUser(command.args[0].name);

    await startMatch(interaction, interaction.user, user);
  },

  async prefix(message, args) {
    const user = message.mentions.users.first();

    await startMatch(message, message.author, user);
  },
};
