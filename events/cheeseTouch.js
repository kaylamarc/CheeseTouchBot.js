const { ActionRowBuilder, Events, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const fs = require('fs');

// Initialize blacklist with 100 most common English words
const commonWords = fs.readFileSync('blacklist.txt', 'utf8').split('\n');
const blacklist = new Set(commonWords.slice(0, 100));

// set initial codeword to most commonly used word in english language
let codeword = 'the'

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {

        // grab the message content
        messageContent = message.content.toLowerCase();

        //get the cheese touch emoji in the guild
        const cheeseTouchEmoji = message.guild.emojis.cache.find(emoji => emoji.name === 'cheesetouch');

        // check if the message contains the codeword and that it's not from a bot
        if (messageContent.includes(codeword) && !message.author.bot) {

            // get author as guild member
            const member = message.member;

            // check if they already have the cheese touch
            if (hasCheeseTouch(member)) {
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

                        // react to message containing codeword with cheesetouch emoji
                        message.react(cheeseTouchEmoji);

                        // reply to message with codeword announcing transfer of cheese touch
                        message.reply(`${cheeseTouchEmoji} ${message.author} has contracted the ${role}! ${cheeseTouchEmoji}`);

                        // DM the user that said codeword
                        message.author.send(`:cheese: YOU HAVE CONTRACTED THE  **CHEESE TOUCH** :cheese:\nPlease send me your codeword.\nCodewords must only be **ONE WORD** with **no spaces** and cannot be a word someone else has used.\nInvalid Codewords:${getBlacklistStr()}`);


                        // TODO:
                        // have the user do /codeword command to add a codeword 
                        // OR somehow have the bot execute /codeword command and get a user to input the codeword?

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

// check if they already have the cheese touch
function hasCheeseTouch(member) {
    if (member.roles.cache.some(role => role.name === 'Cheese Touch')) {
        return true;
    }
    return false;
}
