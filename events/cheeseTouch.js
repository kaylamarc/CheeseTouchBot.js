const { Events } = require('discord.js');

module.exports = {
	name: Events.MessageCreate,
	async execute(message) {

        // grab the message content
        messageContent = message.content.toLowerCase();

        // check if the message contains the codeword
        if (messageContent.includes("test")) {
            console.log("message contained codeword")

            // DM the user that said codeword
            message.author.send('YOU HAVE CONTRACTED THE **CHEESE TOUCH**')

        }
	},
};