require('dotenv').config();
const { Client, GatewayIntentBits , Collection, Events} = require('discord.js');
const path = require('path');
const { loadCommands } = require('./handlers/commandHandler');
const { deployCommands } = require('./handlers/commandDeploy');
const { getServerConfig } = require('./utils/configUtil');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});

const commandsPath = path.join(__dirname, 'commands');
client.commands = loadCommands(commandsPath);

client.once('ready', () => {

    deployCommands();

    console.log(`Logged in as ${client.user.tag}!`);

});

client.on(Events.InteractionCreate, async interaction => {

    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if(!command) return; 

    try {

        await command.execute(interaction);

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

    if(config.mode === 'mention') {

        if(message.mentions.has(client.user)) {

            // TBD;

        }

    } else if (config.mode === 'auto') {

        // TBD;

    }

});

client.login(process.env.DISCORD_TOKEN);