require('dotenv').config();
const { Client, GatewayIntentBits, Events, ActivityType } = require('discord.js');
const path = require('path');
const { loadCommands } = require('./handlers/commandHandler');
const { deployCommands } = require('./handlers/commandDeploy');
const { getServerConfig } = require('./utils/configUtil');
const { askAndromeda } = require('./utils/apiUtil');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});

const commandsPath = path.join(__dirname, 'commands');
const userConversations = new Map();

client.commands = loadCommands(commandsPath);

client.once('ready', () => {

    deployCommands();

    console.log(`Logged in as ${client.user.tag}!`);

    client.user.setActivity('👀 Listening to user commands.', { type: ActivityType.Custom});

});

client.on(Events.InteractionCreate, async interaction => {

    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if(!command) return; 

    try {

        await command.execute(interaction, client);

    }
    catch (error) {

        console.error("Error: " + error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });

    }

});

client.on('messageCreate', async message => {

    if(message.author.bot) return;

    const config = getServerConfig(message.guild?.id);

    if(!config) return;

    if(message.channel.id !== config.channelId) return;

    let prompt;

    if(config.mode === 'mention') {

        if(message.mentions.has(client.user)) {

        prompt = message.content.replace(`<@!${client.user.id}>`, '').trim();

        } else {

            return;

        }

    } else if (config.mode === 'auto') {

        prompt = message.content;

    } else {

        return;

    }

    const userId = message.author.id;

    if(!userConversations.has(userId)) {

        userConversations.set(userId, []);

    }

    const history = userConversations.get(userId);

    history.push({ role: "user", parts: [{ text: prompt }] });

    if (history.length > 10) history.shift();

    let typing = true;

    async function keepTyping() {

        while (typing) {

            await message.channel.sendTyping();
            await new Promise(resolve => setTimeout(resolve, 4000));

        }

    }

    keepTyping();

    let reply;

    try {

        reply = await askAndromeda(history);
        history.push({ role: "model", parts: [{ text: reply }] });
        if(history.length > 10) history.shift();

    } finally {

        typing = false;

    }

    const MAX_LENGTH = 2000;

    if(reply.length <= MAX_LENGTH) {

        await message.reply(reply);

    } else {

        for (let i = 0; i < reply.length; i += MAX_LENGTH) {

            await message.reply(reply.slice(i, i + MAX_LENGTH));

        }

    }

});

client.login(process.env.DISCORD_TOKEN);