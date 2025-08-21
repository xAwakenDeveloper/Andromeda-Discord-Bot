const fs = require('fs');
const path = require('path');
const configPath = path.join(__dirname, '..', 'data', 'serverData.json');

function loadConfig() {

    if(!fs.existsSync(configPath)) {
        fs.writeFileSync(configPath, JSON.stringify({}));
    }

    return JSON.parse(fs.readFileSync(configPath));

}

function saveConfig(config) {

    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

}

function setServerConfig(guildId, channelId, mode) {

    const config = loadConfig();

    config[guildId] = {
        channelId: channelId,
        mode: mode
    };

    saveConfig(config);
}

function getServerConfig(guildId) {

    const config = loadConfig();

    return config[guildId] || null;

}

module.exports = { setServerConfig, getServerConfig, loadConfig, saveConfig };