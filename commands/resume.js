const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('resume')
		.setDescription('Resumes the current song.'),
	async execute(client, interaction, musicHandler) {
    musicHandler.execute(client, interaction, 'resume')
	},
};