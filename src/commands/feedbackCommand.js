const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const FEEDBACK_EMAIL = process.env.FEEDBACK_EMAIL;
const FEEDBACK_EMAIL_USER = process.env.FEEDBACK_EMAIL_USER;
const FEEDBACK_EMAIL_PASSWORD = process.env.FEEDBACK_EMAIL_PASSWORD;
const LOGO_PATH = './src/images/Andromeda_Bot_Logo.png';

async function sendFeedbackMail({ username, type, title, description, date, feedbackId }) {

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: FEEDBACK_EMAIL_USER,
            pass: FEEDBACK_EMAIL_PASSWORD
        }
    });

    const mailHtml = `
    <div style="font-family: 'Poppins', Arial, sans-serif; max-width:600px; margin:auto;">
        <link href="https://fonts.googleapis.com/css?family=Poppins:400,700&display=swap" rel="stylesheet">
        <div style="display:flex;align-items:center;justify-content:center;margin-top:20px;">
            <img src="cid:andromeda-logo" alt="Andromeda Logo" style="height:80px;"/>
        </div>
        <h2 style="margin-top:24px;font-family:'Poppins',Arial,sans-serif;">Otrzymano nowe zgłoszenie feedback.</h2>
        <h3 style="font-weight:400;font-family:'Poppins',Arial,sans-serif;">Treść zgłoszenia znajduje się poniżej.</h3>
        <div style="background:#f6f6f6;padding:24px;border-radius:8px;border:1px solid #e6e6e6;margin-top:24px;">
            <table style="width:100%;font-size:1.1em;font-family:'Poppins',Arial,sans-serif;">
                <tr>
                    <td style="font-weight:700;">Nazwa użytkownika</td>
                    <td>${username}</td>
                </tr>
                <tr>
                    <td style="font-weight:700;">Typ zgłoszenia</td>
                    <td>${type}</td>
                </tr>
                <tr>
                    <td style="font-weight:700;">Tytuł</td>
                    <td>${title}</td>
                </tr>
                <tr>
                    <td style="font-weight:700;">Opis</td>
                    <td>${description}</td>
                </tr>
                <tr>
                    <td style="font-weight:700;">Data</td>
                    <td>${date}</td>
                </tr>
                <tr>
                    <td style="font-weight:700;">Numer zgłoszenia</td>
                    <td>${feedbackId}</td>
                </tr>
            </table>
        </div>
        <p style="margin-top:32px;color:#888;font-family:'Poppins',Arial,sans-serif;">
            Wiadomość została wygenerowana automatycznie przez Andromeda Discord Bot.<br>Możesz odpowiedzieć użytkownikowi poprzez Discorda.
        </p>
    </div>
    `;

    await transporter.sendMail({
        from: `"Andromeda Bot" <${FEEDBACK_EMAIL}>`,
        to: FEEDBACK_EMAIL,
        subject: `Nowy feedback - Andromeda Discord Bot [${feedbackId}]`,
        html: mailHtml,
        attachments: [
            {
                filename: 'Andromeda_Bot_Logo.png',
                path: LOGO_PATH,
                cid: 'andromeda-logo'
            }
        ]
    });
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('feedback')
        .setDescription('Send feedback or report an issue to Lunatic Dreams.')
        .addStringOption(option =>
            option.setName('type')
                .setDescription('Feedback type')
                .setRequired(true)
                .addChoices(
                    { name: 'Feedback', value: 'Feedback' },
                    { name: 'Issue', value: 'Issue' }
                )
        )
        .addStringOption(option =>
            option.setName('title')
                .setDescription('Feedback title')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('description')
                .setDescription('Feedback description')
                .setRequired(true)
        ),

    async execute(interaction, client) {
        const username = interaction.user.username;
        const type = interaction.options.getString('type');
        const title = interaction.options.getString('title');
        const description = interaction.options.getString('description');
        const date = new Date().toLocaleString('pl-PL', { dateStyle: 'long', timeStyle: 'short' });
        const feedbackId = uuidv4();

        try {
            await sendFeedbackMail({ username, type, title, description, date, feedbackId });

            const embed = new EmbedBuilder()
                .setColor('Green')
                .setTitle('Feedback sent successfully!')
                .setDescription('Your feedback has been sent to Lunatic Dreams. Thank you!')
                .addFields(
                    { name: 'Feedback ID', value: feedbackId },
                    { name: 'Type', value: type, inline: true },
                    { name: 'Title', value: title, inline: true },
                    { name: 'Description', value: description, inline: true }
                )
                .setFooter({
                    text: 'If you have another suggestion or issue, please use this command again.',
                    iconURL: client.user.displayAvatarURL()
                })
                .setTimestamp();

            await interaction.reply({ embeds: [embed], ephemeral: true });
        } catch (err) {
            console.error('Feedback mail error:', err);
            const embed = new EmbedBuilder()
                .setColor('Red')
                .setTitle('Error sending feedback!')
                .setDescription('Something went wrong while sending your feedback. Please try again later.')
                .setFooter({
                    text: 'Try using this command again later.',
                    iconURL: client.user.displayAvatarURL()
                })
                .setTimestamp();

            await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }
};