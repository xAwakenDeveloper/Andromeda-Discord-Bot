const { SlashCommandBuilder, ChannelType, EmbedBuilder, PermissionsBitField } = require('discord.js');
const { setServerConfig, getServerConfig } = require('../utils/configUtil');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('Sets up the Andromeda configuration for this server.')
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

    async execute(interaction, client) {

        if(!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {

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

        const channel = interaction.options.getChannel('channel');
        const mode = interaction.options.getString('mode');
        const guildId = interaction.guild.id;
        const prevConfig = getServerConfig(guildId);

        setServerConfig(guildId, channel.id, mode);

        let embed;

        if(prevConfig) {

            embed = new EmbedBuilder()
            .setColor('Yellow')
            .setTitle('Andromeda setup updated!')
            .setDescription(`Andromeda has been updated in this server!\n\n\u200B- **New Channel:** <#${channel.id}>\n\u200B- **New Mode:**  \`${mode}\``)
            .setFooter({ 
                text: 'You can change these settings later using the /setup command.', 
                iconURL: client.user.displayAvatarURL()
            })
            .setTimestamp();

        } else {

            embed = new EmbedBuilder()
                .setColor('Green')
                .setTitle('Andromeda setup complete!')
                .setDescription(`Andromeda has been successfully set up in this server!\n\n\u200B- **Channel:** <#${channel.id}>\n\u200B- **Mode:**  \`${mode}\``)
                .setFooter({ 
                    text: 'You can change these settings later using the /setup command.', 
                    iconURL: client.user.displayAvatarURL()
                })
                .setTimestamp();

        }

        await interaction.reply({ embeds: [embed], ephemeral: true });
    }


}