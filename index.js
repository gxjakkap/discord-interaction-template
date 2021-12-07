const { REST, DiscordAPIError } = require('@discordjs/rest');
const { Client, Intents, Collection } = require('discord.js');
const { Routes } = require('discord-api-types/v9');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
var settings = require('./settings.json');
const fs = require('fs');
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

const commands = [];
client.commands = new Collection();

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
    client.commands.set(command.data.name, command);
}

const rest = new REST({ version: '9' }).setToken(settings.botToken);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationCommands(settings.botClientId),
      { body: commands },
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();

client.on('ready', () => {
    switch(settings.activityType){
      case "STREAMING":
        client.user.setActivity(settings.activityMessage, { type: 'STREAMING', url: settings.streamURL});
        break;
      case "PLAYING":
      case "LISTENING":
      case "WATCHING":
        client.user.setActivity(settings.activityMessage, { type: settings.activityType});
        break;
      default:
        client.user.setActivity('/short', { type: 'PLAYING'});
        break;
    }
    console.log(`Logged in as ${client.user.tag}!`);
  });
  client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;
    const command = client.commands.get(interaction.commandName);
    if (!command) return;
    try {
        await command.execute(interaction);
    } catch (error) {
        if (error) console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
    });

  client.on("guildCreate", guild => {
    console.log("Guild Joined: " + guild.name + ` (${guild.id})`);
  })
  client.on("guildDelete", guild => {
    console.log("Guild Left: " + guild.name+ ` (${guild.id})`);
  })
  
  client.login(settings.botToken);