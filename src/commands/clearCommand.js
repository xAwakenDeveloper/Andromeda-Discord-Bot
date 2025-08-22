const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Clears the Andromeda messages on selected channel.')
        .addIntegerOption(option =>
            option.setName('quantity')
                .setDescription('Quantity of bot messages to clear (1-100).')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(100)
        ),

    async execute(interaction, client) {

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {

            const embed = new EmbedBuilder()
                .setColor('Red')
                .setTitle('Permission denied!')
                .setDescription('You need to have the Manage Messages permission to use this command.')
                .setFooter({
                    text: 'Ask server admin to run this command.',
                    iconURL: client.user.displayAvatarURL()
                })
                .setTimestamp();

            await interaction.reply({ embeds: [embed], ephemeral: true });
            return;

        }

        const quantity = interaction.options.getInteger('quantity');
        let deleted = 0;

        try {

            const messages = await interaction.channel.messages.fetch({ limit: 100 });
            const botMessagesArray = messages
                .filter(m => m.author.id === client.user.id)
                .map(m => m);
            const toDelete = botMessagesArray.slice(0, quantity);

            if (toDelete.length === 0) {

                const embed = new EmbedBuilder()
                    .setColor('Yellow')
                    .setTitle('No messages to clear!')
                    .setDescription('There are no messages from the bot to clear in this channel.')
                    .setFooter({
                        text: 'You can use this command again to clear more messages.',
                        iconURL: client.user.displayAvatarURL()
                    })
                    .setTimestamp();

                await interaction.reply({ embeds: [embed], ephemeral: true });
                return;

            }

            for (const msg of toDelete) {

                await msg.delete();
                deleted++;

            }

            const embed = new EmbedBuilder()
                .setColor('Green')
                .setTitle('Messages cleared!')
                .setDescription(`Cleared ${deleted} bot messages from this channel.`)
                .setFooter({
                    text: 'You can use this command again to clear more messages.',
                    iconURL: client.user.displayAvatarURL()
                })
                .setTimestamp();

            await interaction.reply({ embeds: [embed], ephemeral: true });

        } catch (error) {

            const embed = new EmbedBuilder()
                .setColor('Red')
                .setTitle('Error clearing messages!')
                .setDescription(`Cannot clear messages, make sure messages are not older than 14 days.\n\n\u200B - **Error:**  ${error.message}`)
                .setFooter({
                    text: 'You can use this command again to clear more messages.',
                    iconURL: client.user.displayAvatarURL()
                })
                .setTimestamp();

            await interaction.reply({ embeds: [embed], ephemeral: true });
            
        }
    }
};