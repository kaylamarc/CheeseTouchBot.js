const { Events } = require('discord.js');
const fs = require('fs');

// Initialize blacklist with 100 most common English words
const commonWords = fs.readFileSync('blacklist.txt', 'utf8').split('\n');
const blacklist = new Set(commonWords.slice(0, 100));

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {

        //get the cheese touch emoji in the guild
        const cheeseTouchEmoji = message.guild.emojis.cache.find(emoji => emoji.name === 'cheesetouch');

        // grab the message content
        messageContent = message.content.toLowerCase();

        // check if the message contains the codeword and that it's not from a bot
        if (messageContent.includes('test') && !message.author.bot) {

            // get author as guild member
            const member = message.member;

            // check if they already have the cheese touch
            if (member.roles.cache.some(role => role.name === 'Cheese Touch')) {
                console.log(`${member.displayName} already has cheese touch`);
                return;
            }

            // grab the cheese touch role
            const role = message.guild.roles.cache.find(role => role.name === 'Cheese Touch');

            // check if role exists
            if (role) {
                // get all members with cheese touch role
                const membersWithRole = message.guild.roles.cache.get(role.id).members;

                // remove everyone that has the cheese touch role
                membersWithRole.forEach(member => {
                    if (member.id !== message.author.id) {
                        member.roles.remove(role)
                            .then(() => {
                                console.log(`Role '${role.name}' has been removed from ${member.displayName}.`);
                            })
                            .catch(error => {
                                console.error(error);
                            });
                    }
                });

                // add the role to the message author
                message.member.roles.add(role)
                    .then(() => {
                        console.log(`Role '${role.name}' has been assigned to ${message.author.username}.`);
                        message.react(cheeseTouchEmoji);
                        message.reply(`${cheeseTouchEmoji} ${message.author} has contracted the ${role}! ${cheeseTouchEmoji}`);
                        // DM the user that said codeword
                        message.author.send(`:cheese: YOU HAVE CONTRACTED THE  **CHEESE TOUCH** :cheese:\n Please enter a ***new*** codeword that is not already on the blacklist:${getBlacklistStr()}`);
                    })
                    .catch(error => {
                        console.error(error);
                    });
            }
        }
    },
};

// returns a string list of the blacklist
function getBlacklistStr() {
	str = '\n- ';
	arr = Array.from(blacklist.values());
	str += arr.join('\n- ')
	return str;
}