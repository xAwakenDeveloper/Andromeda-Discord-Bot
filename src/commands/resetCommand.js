const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const { saveConfig, loadConfig } = require('../utils/configUtil');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reset')
        .setDescription('Deletes the Andromeda configuration for this server.'),

    async execute(interaction, client) {

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {

            const embed = new EmbedBuilder()
                .setColor('Red')
                .setTitle('Permission denied!')
                .setDescription('You need to have the Administrator permission to use this command.')
                .setFooter({
                    text: 'Ask server admin to run this command.',
                    iconURL: client.user.displayAvatarURL()
                })
                .setTimestamp();

            await interaction.reply({ embeds: [embed], ephemeral: true });
            return;
        }

        const guildId = interaction.guild.id;
        const config = loadConfig();

        if (config[guildId]) {

            delete config[guildId];
            saveConfig(config);

            const embed = new EmbedBuilder()
                .setColor('Green')
                .setTitle('Configuration reset!')
                .setDescription('Andromeda configuration for this server has been reset and removed.')
                .setFooter({
                    text: 'You can use /setup to configure Andromeda again.',
                    iconURL: client.user.displayAvatarURL()
                })
                .setTimestamp();

            await interaction.reply({ embeds: [embed], ephemeral: true });

        } else {

            const embed = new EmbedBuilder()
                .setColor('Yellow')
                .setTitle('No configuration found!')
                .setDescription('There is no Andromeda configuration for this server to reset.')
                .setFooter({
                    text: 'Use /setup to configure Andromeda.',
                    iconURL: client.user.displayAvatarURL()
                })
                .setTimestamp();

            await interaction.reply({ embeds: [embed], ephemeral: true });

        }
    }
};