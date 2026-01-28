const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Clears the Gemini Bot messages on selected channel.')
        .addIntegerOption(option =>
            option.setName('quantity')
                .setDescription('Quantity of bot messages to clear (1-100).')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(100)
        ),

    async execute(interaction) {

        if (!interaction.inGuild()) return;

        const hasManage =
            (interaction.memberPermissions && interaction.memberPermissions.has(PermissionsBitField.Flags.ManageMessages)) ||
            (interaction.member?.permissions?.has(PermissionsBitField.Flags.ManageMessages));

        if (!hasManage) {
            const embed = new EmbedBuilder()
                .setColor('Red')
                .setTitle('Permission denied!')
                .setDescription('You need to have the Manage Messages permission to use this command.')
                .setFooter({ text: 'Gemini Bot', iconURL: interaction.client.user.displayAvatarURL() })
                .setTimestamp();

            return interaction.reply({
                embeds: [embed],
                flags: MessageFlags.Ephemeral
            });
        }

        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        const quantity = interaction.options.getInteger('quantity');

        try {
            const messages = await interaction.channel.messages.fetch({ limit: 100 });

            const toDelete = messages
                .filter(m =>
                    m.author.id === interaction.client.user.id &&
                    Date.now() - m.createdTimestamp < 14 * 24 * 60 * 60 * 1000
                )
                .first(quantity);

            if (!toDelete.length) {
                const embed = new EmbedBuilder()
                    .setColor('Yellow')
                    .setTitle('No messages to clear!')
                    .setDescription('There are no bot messages to delete.')
                    .setFooter({ text: 'Gemini Bot', iconURL: interaction.client.user.displayAvatarURL() })
                    .setTimestamp();

                return interaction.editReply({ embeds: [embed] });
            }

            await interaction.channel.bulkDelete(toDelete, true);

            const embed = new EmbedBuilder()
                .setColor('Green')
                .setTitle('Messages cleared!')
                .setDescription(`Cleared ${toDelete.length} bot messages.`)
                .setFooter({ text: 'Gemini Bot', iconURL: interaction.client.user.displayAvatarURL() })
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            const embed = new EmbedBuilder()
                .setColor('Red')
                .setTitle('Error clearing messages!')
                .setDescription(error.message || 'Unknown error')
                .setFooter({ text: 'Gemini Bot', iconURL: interaction.client.user.displayAvatarURL() })
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
        }
    }
};
