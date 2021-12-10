const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!"),
  async execute(client, interaction, addon) {
    const latency = Date.now() - interaction.createdAt;
    await interaction.reply(`Pong! in ${latency}ms`);
    console.log(
      "Pinged from " + interaction.guild.name + `(${interaction.guildId})`
    );
  },
};
