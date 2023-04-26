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
                console.log(`${member.displayName} already has cheese touch`);
                return;
            }

            const role = message.guild.roles.cache.find(role => role.name === 'Cheese Touch');

            if (role) {
                const membersWithRole = message.guild.roles.cache.get(role.id).members;
                membersWithRole.forEach(member => {
                  if (member.id !== message.author.id) {
                    member.roles.remove(role)
                      .then(() => {
                        console.log(`Role "${role.name}" has been removed from ${member.displayName}.`);
                      })
                      .catch(error => {
                        console.error(error);
                      });
                  }
                });
                message.member.roles.add(role)
                  .then(() => {
                    console.log(`Role "${role.name}" has been assigned to ${message.author.username}.`);
                    // DM the user that said codeword
                    message.author.send('YOU HAVE CONTRACTED THE **CHEESE TOUCH**\n Please enter a ***new*** codeword that is not already on the blacklist:\n');
                  })
                  .catch(error => {
                    console.error(error);
                  });
              }

        }
	},
};