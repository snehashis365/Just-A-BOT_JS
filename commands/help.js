const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Shows help message for the Bot"),
  async execute(client, interaction, addon) {
    await interaction.reply(
      "This bot uses slash commands primarily now start typing / and then choose from the list which command to use"
    );
  },
};
