require('dotenv').config();
const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

async function deployCommands() {

    const commands = [];
    const commandsPath = path.join(__dirname, '..', 'commands');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for(const file of commandFiles) {

        const command = require(path.join(commandsPath, file));
        
        if ('data' in command) {

            commands.push(command.data.toJSON());

        }

    }

    const rest = new REST().setToken(process.env.DISCORD_TOKEN);
    const CLIENT_ID = process.env.CLIENT_ID;

    try {

        console.log(`Registering ${commands.length}` + ' application commands.');

        await rest.put(
            Routes.applicationCommands(CLIENT_ID),
            { body: commands },
        );
        
        console.log('Successfully registered application commands.');

    }
    catch (error) {

        console.error('Error:' + error);

    }

}

if (require.main === module) {

    deployCommands();

}

module.exports = { deployCommands };
    