const fs = require('fs');
const path = require('path');
const dataDir = path.join(__dirname, '..', 'data');
const configPath = path.join(dataDir, 'serverData.json');

function ensureDataDir() {
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }
}

function loadConfig() {
    ensureDataDir();
    if(!fs.existsSync(configPath)) {
        fs.writeFileSync(configPath, JSON.stringify({}));
    }
    try {
        return JSON.parse(fs.readFileSync(configPath, 'utf8'));
    } catch (e) {
        fs.writeFileSync(configPath, JSON.stringify({}));
        return {};
    }
}

function saveConfig(config) {
    ensureDataDir();
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
