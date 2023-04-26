const { Events } = require('discord.js');
const fs = require('fs');

// Initialize blacklist with 100 most common English words
const commonWords = fs.readFileSync('blacklist.txt', 'utf8').split('\n');
const blacklist = new Set(commonWords.slice(0, 100));

module.exports = {
	name: Events.MessageCreate,
	async execute(message) {

        // grab the message content
        messageContent = message.content.toLowerCase();

        // check if the message contains the codeword
        if (messageContent.includes("test")) {

            // get author as guild member
            const member = message.member;

            // check if they already have the cheese touch
            if (member.roles.cache.some(role => role.name === 'Cheese Touch')) {
                console.log('user already has cheese touch');
                return;
            }

            // // DM the user that said codeword
            message.author.send('YOU HAVE CONTRACTED THE **CHEESE TOUCH**\n Please enter a ***new*** codeword that is not already on the blacklist:\n');

        }
	},
};