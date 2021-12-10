const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stop')
		.setDescription('Stops the current song.'),
	async execute(client, interaction, musicHandler) {
    musicHandler.execute(client, interaction, 'stop')
	},
};