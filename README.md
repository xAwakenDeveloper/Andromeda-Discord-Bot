<p align="center">
  <img src="/images/banner.png" alt="Gemini Discord Bot Banner">
</p>

<h1 align="center">Gemini Discord Chatbot</h1>

<p align="center"> 
A lightweight Discord chatbot powered by Google's Gemini AI. <br>
Designed to be easy to setup and use - perfect for anyone who wants a simple AI chatbot on their server.
</p>

<p align="center">
  <img src="https://img.shields.io/github/commit-activity/y/xAwakenDeveloper/Gemini-Discord-Bot?style=for-the-badge&color=28C76F" alt="Commits Badge" height="20">

  <img src="https://img.shields.io/github/issues/xAwakenDeveloper/Gemini-Discord-Bot?style=for-the-badge&color=C3FF00" alt="Issues Badge" height="20">

  <img src="https://img.shields.io/github/issues-pr/xAwakenDeveloper/Gemini-Discord-Bot?style=for-the-badge&color=FFD700" alt="Pull Requests Badge" height="20">

  <img src="https://img.shields.io/github/license/xAwakenDeveloper/Gemini-Discord-Bot?style=for-the-badge&color=FFA500" alt="License Badge" height="20">
</p>

## Features

- **Gemini API Integration** - Use any Gemini model of your choice
- **Custom System Instructions** - Inject custom instructions to personalize bot behavior
- **Multiple Conversation Modes** - Choose hot the bot responds to messages

## Installation

### Prerequisites

- [Node.JS](https://nodejs.org) (version 18 or higher)
- Discord Bot Token ([Discord Developer Portal](https://discord.com/developers/))
- Gemini API Key ([Google AI Studio](https://aistudio.google.com/))

### Setup

1. Clone the repository:
```bash
git clone https://github.com/xAwakenDeveloper/Gemini-Discord-Bot.git
cd Gemini-Discord-Bot
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in the root directory:
```env
DISCORD_TOKEN=your_discord_bot_token_here
DISCORD_CLIENT_ID=your_discord_bot_client_id_here
GEMINI_API_URL=your_gemini_api_url_here
GEMINI_API_KEY=your_gemini_api_key_here
SYSTEM_INSTRUCTIONS="Your custom system instructions here"
```

4. Start the bot:
```bash
node src/index.js
```

## Quick Start

1. **Add the bot to your Discord server**
2. **Initialize the bot** on your server:
```
/init
```

This creates a config file with settings for your server.

3. **Start chatting** Simply send messages in any channel where the bot has access.

## Available Commands

| Command | Description |
|---------|-------------|
| `/init` | Initializes the bot on your server (run this first) |
| `/reset` | Clear saved data and reset the bot to default settings |
| `/clear` | Remove all bot messages from the current channel |

## Contributing

Contributions are welcome, but please note that active development is not my main focus. Feel free to open pull requests or issues if you find something to improve or fix.

## License

The project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
