const { SlashCommandBuilder, ChannelType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('Sets up the bot in the server.')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('The channel to send messages to Andromeda.')
                .addChannelTypes(ChannelType.GuildText)
                .setRequired(true))
        .addStringOption(option =>
            option.setName('mode')
                .setDescription('The mode Andromeda will use for replying.')
                .setRequired(true)
                .adChoices(
                    { name: 'mention', value: 'mention' },
                    { name: 'auto', value: 'auto' }
                )
            ),

    async execute(interaction) {

        const channel = interaction.options.getChannel('channel');
        const mode = interaction.options.getString('mode');

    }


}