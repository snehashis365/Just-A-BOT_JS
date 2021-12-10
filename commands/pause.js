const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pause')
		.setDescription('Pauses the current playing song.'),
	async execute(client, interaction, musicHandler) {
    musicHandler.execute(client, interaction, 'pause')
	},
};