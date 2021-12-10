const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
    .addStringOption(option=>
    option.setName('song')
    .setRequired(true)
    .setDescription('The search term or link of the song to be played'))
		.setDescription('Plays a song from search or link'),
	async execute(client, interaction, musicHandler) {
    const args = interaction.options.getString('song')
    musicHandler.execute(client, interaction, 'play' ,args)
	},
};