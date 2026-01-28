const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, MessageFlags } = require('discord.js');
const { saveConfig, loadConfig } = require('../utils/configUtil');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reset')
        .setDescription('Deletes the Gemini Bot configuration for this server.'),

    async execute(interaction) {

        if (!interaction.inGuild()) return;

        const hasAdmin =
            (interaction.memberPermissions && interaction.memberPermissions.has(PermissionsBitField.Flags.Administrator)) ||
            (interaction.member?.permissions?.has(PermissionsBitField.Flags.Administrator));

        if (!hasAdmin) {
            const embed = new EmbedBuilder()
                .setColor('Red')
                .setTitle('Permission denied!')
                .setDescription('You need Administrator permission.')
                .setFooter({ text: 'Gemini Bot', iconURL: interaction.client.user.displayAvatarURL() })
                .setTimestamp();

            return interaction.reply({
                embeds: [embed],
                flags: MessageFlags.Ephemeral
            });
        }

        const guildId = interaction.guild.id;
        const config = loadConfig();

        if (!config[guildId]) {
            const embed = new EmbedBuilder()
                .setColor('Red')
                .setTitle('No configuration found!')
                .setFooter({ text: 'Gemini Bot', iconURL: interaction.client.user.displayAvatarURL() })
                .setTimestamp();

            return interaction.reply({
                embeds: [embed],
                flags: MessageFlags.Ephemeral
            });
        }

        delete config[guildId];
        saveConfig(config);

        const embed = new EmbedBuilder()
            .setColor('Green')
            .setTitle('Configuration reset!')
            .setDescription('Gemini Bot configuration has been removed.')
            .setFooter({ text: 'Gemini Bot', iconURL: interaction.client.user.displayAvatarURL() })
            .setTimestamp();

        await interaction.reply({
            embeds: [embed],
            flags: MessageFlags.Ephemeral
        });
    }
};
