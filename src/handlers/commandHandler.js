const fs = require('fs'); 
const path = require('path');

function loadCommands(commandsPath) {

    const commands = new Map();
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for(const file of commandFiles) {
        const command = require(path.join(commandsPath, file));
        if (command.data && command.execute) {
            commands.set(command.data.name, command);
        }
    }

    return commands;
}

module.exports = { loadCommands };
