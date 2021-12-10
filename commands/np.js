const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('np')
		.setDescription('Shows the current song playing'),
	async execute(client, interaction, musicHandler) {
    musicHandler.execute(client, interaction, 'nowPlaying')
	},
};