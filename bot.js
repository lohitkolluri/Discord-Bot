const express = require('express');
const { Client, GatewayIntentBits } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');
require('dotenv').config();

const token = process.env.BOT_TOKEN;
const PORT = process.env.PORT || 3000;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.commands = new Map();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

const app = express();

app.get('/', (req, res) => {
  if (!client.user) {
    res.send('Bot is not ready yet. Please wait.');
    return;
  }

  const botUsername = client.user.username;
  const botAvatar = client.user.avatarURL();
  const commands = Array.from(client.commands.keys());
  const inviteLink = `https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot`;

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${botUsername} Status Page</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f8f9fa;
          color: #343a40;
          text-align: center;
          margin: 20px;
        }
        h1 {
          color: #3498db;
        }
        img {
          border-radius: 50%;
          margin-top: 10px;
          border: 2px solid #3498db;
          animation: pulse 2s infinite alternate; /* Add this line for the pulsating effect */
        }
        p {
          color: #2ecc71;
          font-size: 18px;
        }
        ul {
          list-style-type: none;
          padding: 0;
        }
        li {
          background-color: #ecf0f1;
          margin: 10px;
          padding: 15px;
          border-radius: 8px;
          display: inline-block;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease-in-out;
        }
        li:hover {
          transform: scale(1.05);
          background-color: #3498db;
          color: #fff;
        }
        button {
          background-color: #3498db;
          color: #fff;
          padding: 10px 20px;
          font-size: 16px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s ease-in-out;
        }
        button:hover {
          background-color: #2980b9;
        }
        /* Pulsating effect animation */
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(46, 204, 113, 0.7);
          }
          100% {
            box-shadow: 0 0 20px 20px rgba(46, 204, 113, 0);
          }
        }
      </style>
    </head>
    <body>
      <h1>${botUsername} Status Page</h1>
      <img src="${botAvatar}" alt="Bot Avatar" width="150" height="150">
      <p>Server Count: ${client.guilds.cache.size}</p>
      
      <h2>Available Commands:</h2>
      <ul>
        ${commands.map(command => `<li>${command}</li>`).join('')}
      </ul>

      <a href="${inviteLink}" target="_blank">
        <button>Invite Bot</button>
      </a>
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);

  const clientId = client.user.id;
  const rest = new REST({ version: '9' }).setToken(token);

  (async () => {
    try {
      console.log('Started refreshing application (/) commands.');

      await rest.put(
        Routes.applicationCommands(clientId),
        { body: Array.from(client.commands.values()).map(command => command.data) },
      );

      console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
      console.error(error);
    }
  })();
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (client.commands.has(commandName)) {
    try {
      await client.commands.get(commandName).execute(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
  }
});

client.login(token);