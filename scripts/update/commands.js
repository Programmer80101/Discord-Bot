require("dotenv").config();
const {REST, Routes} = require("discord.js");
const fs = require("node:fs");
const path = require("node:path");
const config = require("../../config");

const clientId = process.env.CLIENT_ID;
const token = process.env.TOKEN;
const guildId = config.server.id;

module.exports = async () => {
  const commands = [];
  const foldersPath = path.join(__dirname, "../../commands");
  const commandFolders = fs.readdirSync(foldersPath);

  for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file) => file.endsWith(".js"));

    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const command = require(filePath);

      if ("data" in command && "execute" in command) {
        commands.push(command.data.toJSON());
      } else {
        console.log(
          `⚠️ [WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
        );
      }
    }
  }

  try {
    const rest = new REST().setToken(token);

    try {
      await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
        body: [],
      });

      console.log("✅ Successfully deleted all guild commands.");
    } catch (error) {
      console.error(`❌ [ERROR] Failed to delete guild commands: ${error}`);
      return;
    }

    try {
      await rest.put(Routes.applicationCommands(clientId), {body: []});
      console.log("✅ Successfully deleted all application commands.");
    } catch (error) {
      console.error(
        `❌ [ERROR] Failed to delete application commands: ${error}`
      );
      return;
    }

    console.log(
      `🔄 Started refreshing ${commands.length} application (/) commands.`
    );

    try {
      const data = await rest.put(
        Routes.applicationGuildCommands(clientId, guildId),
        {body: commands}
      );
      console.log(
        `✅ Successfully reloaded ${data.length} application (/) commands.`
      );
    } catch (error) {
      console.error(
        `❌ [ERROR] Failed to register new guild commands: ${error}`
      );
    }
  } catch (error) {
    console.error(
      `❌ [ERROR] Failed to refresh application (/) commands: ${error}`
    );
  }
};
