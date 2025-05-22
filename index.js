require("dotenv").config();
require("./db");
const {registerCache} = require("./cache");
const {Client, GatewayIntentBits, Collection} = require("discord.js");
const fs = require("node:fs");
const path = require("node:path");
const axios = require("axios");

const express = require("express");
const app = express();

// Cache Registration

const {getAllShopItems} = require("./utils/shop");
registerCache("shopItems", getAllShopItems);

// Endpoints

app.get("/ping", (req, res) => {
  res.sendStatus(200);
});

// Start Express Server

const PORT = process.env.PORT || 10_000;
app.listen(PORT, () => {
  console.log(`✅ Server started at port: ${PORT}`);
});

// Self Ping

// const pingUrl = process.env.URL + "/ping";
// setInterval(async () => {
//   try {
//     await axios.get(pingUrl);
//   } catch (error) {
//     console.log("❌ Self Ping failed: ", error);
//   }
// }, 1 * 60 * 1000);

// Bot Setup

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.commands = new Collection();
client.cooldowns = new Collection();

const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

// Command Handler

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] ⚠️ The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
}

// Event Handler

const eventsPath = path.join(__dirname, "events");
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

client.login(process.env.TOKEN);
