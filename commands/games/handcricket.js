const {
  MessageFlags,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
} = require("discord.js");
const {SlashCommandBuilder} = require("discord.js");
const {createCommandGuideEmbed} = require("../../utils");
const commandsData = require("../../commands");
const config = require("../../config");

const games = new Map();
const command = commandsData.games.commands.handcricket;

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
    choices: {},
    eventLog: [],
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
    title: "🏏 Hand Cricket: ⏰ Time Out",
    description: "Match ended as both the players didn't respond in time!",
  };

  await channel.send({
    embeds: [timeoutEmbed],
  });
};

const createInningEmbed = (gameState) => {
  const index = gameState.inning - 1;
  const batId =
    gameState.inning == 1
      ? gameState.battingFirst.id
      : gameState.players.find(
          (player) => player.id !== gameState.battingFirst.id
        ).id;

  const header = `**${gameState.players[0]}** vs **${gameState.players[1]}**`;
  const body = gameState.eventLog.join("\n");
  const description = `${header}\n\n${body}`;

  const currentBatting = `<@${batId}>`;

  const choiceFields = Object.entries(gameState.choices || {}).map(
    ([userId, hasPicked]) => ({
      name: `<@${userId}>`,
      value: hasPicked ? "🟢 Chosen" : "🔴 Waiting",
      inline: true,
    })
  );

  const inningEmbed = {
    color: config.embed.color.purple,
    title: `🏏 Hand Cricket: ${gameState.inning == 1 ? "1st" : "2nd"} Inning`,
    description: description,
    fields: [
      {
        name: "🏏 Current Batting",
        value: currentBatting,
      },
      {
        name: "🏃 Runs",
        value: `${gameState.runs[index]} runs`,
      },
      {
        name: "⚾ Balls",
        value: `${gameState.balls[index]} balls`,
      },
      ...choiceFields,
    ],
  };

  return inningEmbed;
};

async function playOneBall(channel, inningMessage, gameState, batId, bowlId) {
  gameState.choices = {
    [batId]: 0,
    [bowlId]: 0,
  };

  await inningMessage.edit({
    embeds: [createInningEmbed(gameState)],
    components: [runButtons1, runButtons2],
  });

  const filter = (interaction) =>
    !gameState.finished &&
    (interaction.user.id === batId || interaction.user.id === bowlId) &&
    interaction.customId.startsWith("run_");

  const collector = channel.createMessageComponentCollector({
    max: 2,
    time: 30_000,
    filter: filter,
    ComponentType: ComponentType.Button,
  });

  collector.on("collect", async (interaction) => {
    const userId = interaction.user.id;
    if (gameState.choices[userId]) {
      return await interaction.reply({
        content: "You have already made your choice!",
        flags: MessageFlags.Ephemeral,
      });
    }

    const num = Number(interaction.customId.split("_")[1]);
    gameState.choices[userId] = num;

    await interaction.reply({
      content: `You picked **${num}**!`,
      flags: MessageFlags.Ephemeral,
    });

    const updatedEmbed = createInningEmbed(gameState);
    await inningMessage.edit({
      embeds: [updatedEmbed],
      components: [runButtons1, runButtons2],
    });
  });

  const outcome = await new Promise((resolve) => {
    collector.on("end", () => {
      const picks = gameState.choices;
      const allPicked = Object.values(picks).every((num) => num !== 0);

      if (!allPicked || Object.keys(picks).length < 2) {
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

      gameState.choices = {
        [batId]: 0,
        [bowlId]: 0,
      };

      if (batPick == bowlPick) {
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
  const batId =
    gameState.inning == 1
      ? gameState.battingFirst.id
      : gameState.players.find(
          (player) => player.id !== gameState.battingFirst.id
        ).id;

  const bowlId = gameState.players.find((player) => player.id !== batId).id;

  while (!gameState?.finished) {
    const outcome = await playOneBall(
      channel,
      inningMessage,
      gameState,
      batId,
      bowlId
    );

    if (outcome?.timeout) {
      await sendTimeoutEmbed(channel);
      return {timeout: true};
    }

    if (outcome?.wicket) {
      gameState.eventLog.push(
        `💥 <@${outcome.batId}> is out! Both chose ${outcome.pick}`
      );
      const embed = createInningEmbed(gameState);
      embed.color = config.embed.color.red;
      await inningMessage.edit({
        embeds: [embed],
        components: [],
      });

      return {timeout: false};
    }

    gameState.eventLog.push(
      `**${outcome.batPick}** runs! Bowler chose ${outcome.bowlPick}`
    );
    const embed = createInningEmbed(gameState);
    await inningMessage.edit({
      embeds: [embed],
      components: [runButtons1, runButtons2],
    });

    if (gameState.inning === 2 && gameState.runs[1] > gameState.runs[0]) {
      gameState.eventLog = ["Second inning completed!"];
      gameState.finished = true;
      return {timeout: false};
    }
  }
};

const startMatch = async (source, player1, player2) => {
  if (!player2) {
    const embed = createCommandGuideEmbed(command.name);
    return await source.reply({embeds: [embed]});
  }

  const gameId = source.channelId;
  if (games.has(gameId)) {
    return await source.reply({
      content: "❌ A game is already in progress in this channel.",
    });
  }

  const channel = await source.client.channels.fetch(source.channelId);
  const tossWinner = Math.random() < 0.5 ? player1 : player2;

  const gameState = createGameState(gameId, player1, player2, tossWinner, null);
  games.set(gameId, gameState);

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

        updateGameState(gameId, "battingFirst", battingFirst);

        tossEmbed.fields[1].value = `**${tossWinner}** decided to ${choiceEmoji} ${choiceMessage} first!`;

        await tossInteraction.update({
          embeds: [tossEmbed],
          components: [],
        });

        choiceCollector.stop("choiceMade");

        const firstInningEmbed = createInningEmbed(gameState);
        const firstInningMessage = await channel.send({
          embeds: [firstInningEmbed],
          components: [runButtons1, runButtons2],
          withResponse: true,
        });

        const inningOne = await playOneInning(
          channel,
          firstInningMessage,
          gameState
        );

        if (inningOne.timeout) return;

        const secondInningEmbed = createInningEmbed(gameState);
        const secondInningMessage = await channel.send({
          embeds: [secondInningEmbed],
          components: [runButtons1, runButtons2],
          withResponse: true,
        });

        gameState.inning = 2;
        gameState.eventLog = ["Second inning started!"];

        const inningTwo = await playOneInning(
          channel,
          secondInningMessage,
          gameState
        );

        if (inningTwo.timeout) return;

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
          winnerEmbed.description += `\n${battingFirst} won the match by chasing the target!`;
          winnerEmbed.fields = [
            {
              name: "🏆 Winner",
              value: battingFirst.toString(),
            },
          ];
        }

        if (runs[0] < runs[1]) {
          winnerEmbed.description = `🎉 ${battingSecond} won the match!`;
          winnerEmbed.description += `\n${battingSecond} won by ${
            runs[1] - runs[0]
          } runs!`;
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

      choiceCollector.on("end", async (collected, reason) => {
        if (reason === "time") {
          tossEmbed.color = config.embed.color.red;
          tossEmbed.fields[1].value = "⏰ Time's up! Match timed out!";
          tossEmbed.description += `\n⏰ **${tossWinner}** didn't make a choice in time!`;
          await tossMessage.edit({
            embeds: [tossEmbed],
            components: [],
          });
        } else if (reason === "choiceMade") {
          return;
        } else {
          console.error("Collector ended due to unknown reason: ", reason);
        }

        games.delete(gameId);
        return await sendTimeoutEmbed(channel);
      });
    } catch (error) {
      console.error("Error waiting for toss interaction:", error);
      games.delete(gameId);
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
