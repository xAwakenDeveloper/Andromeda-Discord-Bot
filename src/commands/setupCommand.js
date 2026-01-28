const { SlashCommandBuilder, ChannelType, EmbedBuilder, PermissionsBitField, MessageFlags } = require('discord.js');
const { setServerConfig, getServerConfig } = require('../utils/configUtil');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('Sets up the Gemini Bot configuration for this server.')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('The channel to send messages to Gemini Bot.')
                .addChannelTypes(ChannelType.GuildText)
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('mode')
                .setDescription('The mode Gemini Bot will use for replying.')
                .setRequired(true)
                .addChoices(
                    { name: 'mention', value: 'mention' },
                    { name: 'auto', value: 'auto' }
                )
        ),

    async execute(interaction) {

        if (!interaction.inGuild()) return;

        const hasAdmin =
            (interaction.memberPermissions && interaction.memberPermissions.has(PermissionsBitField.Flags.Administrator)) ||
            (interaction.member?.permissions?.has(PermissionsBitField.Flags.Administrator));

        if (!hasAdmin) {
            const embed = new EmbedBuilder()
                .setColor('Red')
                .setTitle('Permission denied!')
                .setFooter({ text: 'Gemini Bot', iconURL: interaction.client.user.displayAvatarURL() })
                .setTimestamp();

            return interaction.reply({
                embeds: [embed],
                flags: MessageFlags.Ephemeral
            });
        }

        const channel = interaction.options.getChannel('channel');
        const mode = interaction.options.getString('mode');
        const guildId = interaction.guild.id;

        const prevConfig = getServerConfig(guildId);
        setServerConfig(guildId, channel.id, mode);

        const embed = new EmbedBuilder()
            .setColor(prevConfig ? 'Yellow' : 'Green')
            .setTitle(prevConfig ? 'Setup updated!' : 'Setup complete!')
            .addFields(
                { name: 'Channel', value: `<#${channel.id}>`, inline: true },
                { name: 'Mode', value: mode, inline: true }
            )
            .setFooter({ text: 'Gemini Bot', iconURL: interaction.client.user.displayAvatarURL() })
            .setTimestamp();

        await interaction.reply({
            embeds: [embed],
            flags: MessageFlags.Ephemeral
        });
    }
};
