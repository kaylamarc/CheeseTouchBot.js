// Require the necessary discord.js classes
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

// Log in to Discord with your client's token
client.login(token);

client.commands = new Collection();

// constructs a path to the commands directory
const commandsPath = path.join(__dirname, 'commands');

// reads the path to the directory and returns an array of all the file names it contains that end with .js
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

// loop over the array and dynamically set each command into the client.commands Collection
for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	}
	else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

// create a listener to respond to a command
client.on(Events.InteractionCreate, interaction => {
	// Make sure to only handle slash commands; exit the handler if another type is encountered
	if (!interaction.isChatInputCommand()) return;
	console.log(interaction);
});