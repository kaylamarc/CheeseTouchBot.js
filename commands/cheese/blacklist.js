// User uses '/blacklist' command, bot replies with all words on the blacklist except the current codeword
const fs = require('fs');
const { SlashCommandBuilder } = require('discord.js');

const commonWords = fs.readFileSync('blacklist.txt', 'utf8').split('\n');
const blacklist = new Set(commonWords.slice(0, 100));

module.exports = {
	data: new SlashCommandBuilder()
		.setName('blacklist')
		.setDescription('Replies with blacklist except current codeword.'),
	async execute(interaction) {
		await interaction.reply({content: getBlacklistStr(), ephemeral: true});
	},
};

// returns a string list of the blacklist
function getBlacklistStr() {
	str = "BLACKLISTED CODEWORDS:\n- ";
	arr = Array.from(blacklist.values());

	// initial blacklist before a user adds a codeword
	// do not remove last word
	if (arr.length > 100) {
		codeword = arr.pop()
	}

	str += arr.join('\n- ')
	return str;
}