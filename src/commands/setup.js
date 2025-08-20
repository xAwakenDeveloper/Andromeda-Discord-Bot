const { SlashCommandBuilder, ChannelType } = require('discord.js');
const { setServerConfig } = require('../utils/configUtil');

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
                .addChoices(
                    { name: 'mention', value: 'mention' },
                    { name: 'auto', value: 'auto' }
                )
            ),

    async execute(interaction) {

        const channel = interaction.options.getChannel('channel');
        const mode = interaction.options.getString('mode');

        setServerConfig(interaction.guild.id, channel.id, mode);

        await interaction.reply(`✅ Andromeda has been set up in this server! Channel: <#${channel.id}>, Mode: **${mode}**.`);

    }


}