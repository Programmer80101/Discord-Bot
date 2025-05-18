moduke.exports = {
  shop: {
    emoji: "💰",
    name: "Economy",
    description: "Economy commands for coins.",
    footer: "These commands are available for all users.",
    commands: {
      buy: {
        name: "buy",
        emoji: "🛒",
        description: "Buy ",
        aliases: ["buy"],
        usage: `${prefix}buy (item-name)`,
        args: [
          {
            name: "item-name",
            type: "string",
            required: true,
            description: "The item that you want to buy!",
          },
        ],
        examples: [
          {
            command: `${prefix}shop`,
            note: "The item that you want to buy!",
          },
        ],
      },
    },
  },
};
