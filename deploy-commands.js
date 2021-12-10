const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const clientId = "854988362900045825";

const config = require("./config.json");
const TOKEN = config['TOKEN'];

const rest = new REST({ version: "9" }).setToken(TOKEN);

module.exports = function deployCommands(GuildIds, commandFiles) {
  console.log("Begin command deployment for guild:");
  console.log(GuildIds);
  const commands = [];
  for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
  }
  for (const guildId of GuildIds) {
    rest
      .put(Routes.applicationGuildCommands(clientId, guildId), {
        body: commands,
      })
      .then(() =>
        console.log(
          "Successfully registered application commands for " + guildId
        )
      )
      .catch(console.error);
  }
};
