const fs = require("fs");
const { Client, Intents, Collection } = require("discord.js");
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_VOICE_STATES,
  ],
});

const { Player } = require("discord-music-player");
const player = new Player(client, {
  leaveOnEmpty: true,
});
client.player = player;
const musicHandler = require("./music");

const deployCommands = require("./deploy-commands");

//const config = require("./config.json");

//Setting all the commands to the collection
client.commands = new Collection();
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));
console.log("Reading commands:");
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  console.log(file);
  // Set a new item in the Collection
  // With the key as the command name and the value as the exported module
  client.commands.set(command.data.name, command);
}

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
  const Guilds = client.guilds.cache.map((guild) => guild.id);
  deployCommands(Guilds, commandFiles);
  client.user.setActivity({
    type: "LISTENING",
    name: `${Guilds.length} servers`,
  });
});

client.on("guildCreate", (newGuild) => {
  deployCommands([newGuild.id], commandFiles);
  newGuild.systemChannel.send(
    `Hello, I'm Just a BOT. Thanks for inviting me, you can check a list my commands with the /help command(Make sure to select me when prompted with the list in Discord`
  );
  console.log(`Joined Guild: ${newGuild.id}`);
});

//Player Events handling part
client.player
  // Emitted when channel was empty.
  .on("channelEmpty", async (queue) => {
    await queue.data.interractionObj.channel.send(
      `Everyone left the Voice Channel, queue ended.`
    );
  })
  // Emitted when a song was added to the queue.
  .on("songAdd", async (queue, song) => {
    /* Uncomment this if you want to delete the searching reply
    try {
      await queue.data.interractionObj.deleteReply();
    } catch (e) {
      console.log(e);
    }
    */
    await queue.data.interractionObj.channel.send(
      `**${song}** was added to the queue :clipboard:\n${song.url}`
    );
  })
  // Emitted when a playlist was added to the queue.
  .on("playlistAdd", async (queue, playlist) => {
    await queue.data.interractionObj.channel.send(
      `Playlist ${playlist} with ${playlist.songs.length} was added to the queue.`
    );
  })
  // Emitted when there was no more music to play.
  .on("queueDestroyed", (queue) => console.log(`The queue was destroyed.`))
  // Emitted when the queue was destroyed (either by ending or stopping).
  .on("queueEnd", async (queue) => {
    await queue.data.interractionObj.channel.send(
      `:clipboard: The queue has ended.`
    );
  })
  // Emitted when a song changed.
  .on("songChanged", async (queue, newSong, oldSong) => {
    await queue.data.interractionObj.channel.send(
      `Now Playing: :notes: **${newSong}**\n${newSong.url}`
    );
  })
  // Emitted when a first song in the queue started playing.
  .on("songFirst", (queue, song) => {
    console.log(`Started playing ${song}. on Guild ID: ${queue.guild.id}`);
  })
  // Emitted when someone disconnected the bot from the channel.
  .on("clientDisconnect", async (queue) => {
    await queue.data.interractionObj.channel.send(
      `I was kicked from the Voice Channel :cry: , queue ended.`
    );
  })
  // Emitted when deafenOnJoin is true and the bot was undeafened
  .on("clientUndeafen", (queue) => console.log(`I got undefeanded.`))
  // Emitted when there was an error in runtime
  .on("error", async (error, queue) => {
    await queue.data.interractionObj.channel.send(error);
    console.log(`Error: ${error} in ${queue.guild.name}`);
  });

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(client, interaction, musicHandler);
  } catch (error) {
    console.error(error);

    await interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
});

const TOKEN = process.env.TOKEN;
client.login(TOKEN);
