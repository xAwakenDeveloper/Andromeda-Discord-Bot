# Andromeda Assistant Discord Bot

**Andromeda Assistant Discord Bot** is a lightweight AI Assistant in form of a Discord bot powered by the **Andromeda (Gemini 2.0 Flash)** model.  
It’s designed to be easy to use, fast, and open source, making it perfect for anyone who wants a simple AI companion on their server.

---

## Features

- ⚡ **Fast and responsive** – Generates replies quickly for smooth conversations.  
- 🛠️ **Easy to configure** – Minimal setup required, no API key needed.  
- 🤖 **Discord integration** – Ready to add to your server and interact with users.  
- 💬 **Simple AI responses** – Can answer questions, chat, and assist with basic tasks.  

---

## Add bot to your Discord server

To add bot to your Discord server [click here.](https://discord.com/oauth2/authorize?client_id=1407763160534089808&permissions=8&integration_type=0&scope=bot)

---

## Local Installation (API KEY REQUIRED)

1. Clone the repository:

```bash
git clone https://github.com/Lunatic-Dreams/Andromeda-Discord-Bot
```

---

2. Install required depencies:

```bash
npm install discord.js 
npm install dotenv
```

---

3. Create .env file in main project directory with following variables:

- DISCORD_TOKEN
- DISCORD_CLIENT_ID
- ANDROMEDA_API_URL
- ANDROMEDA_API_KEY
- SYSTEM_INSTRUCTIONS

---

4. Create new application on [Discord Developer Portal.](https://discord.com/developers)

 **IMPORTANT:** 
 - Enable Presence Intent 
 - Enable Server Members Intent 
 - Enable Message Content Intent

 ---

5. Get your API key from [Google AI Studio.](https://aistudio.google.com/app/u/3/apikey?pli=1)

---

6. Fill out all variables in .env file:

- DISCORD_TOKEN: This is a bot token. 
- DISCORD_CLIENT_ID: This is application ID of your bot.
- ANDROMEDA_API_URL: URL of model you wanna use (For e.g. Gemini 2.0 Flash).
- ANDROMEDA_API_KEY: API key from Google AI Studio.
- SYSTEM_INSTRUCTIONS: Instructions to tell AI how it should behave.

---

7. Start it and enjoy!

```bash
node src/index.js
```
