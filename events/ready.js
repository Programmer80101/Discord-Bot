const {Events} = require("discord.js");
const {initCache} = require("../cache");

module.exports = {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    await initCache();
    console.log(`Ready! Logged in as ${client.user.tag}`);
  },
};
