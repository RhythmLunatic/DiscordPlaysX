//var irc = require('irc'),
var Discord = require('discord.js'),
printf = require('printf'),
keyHandler = require('./keyHandler.js');
const config = require('./config.json');

const client = new Discord.Client()

client.on('ready', () => {
  // This event will run if the bot starts, and logs in, successfully.
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`)
  console.log(`Add me with https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=0`)
  // Example of changing the bot's playing game to something useful. `client.user` is what the
  // docs refer to as the "ClientUser".
  //client.user.setActivity(`on ${client.guilds.size} servers`)
})

var commandRegex = config.regexCommands ||
new RegExp('^(' + config.commands.join('|') + ')$', 'i');

client.on('message', async message => {
	if (message.channel.id !== config.discord_channel_id) return
	
    if (message.cleanContent.match(commandRegex)) {

        if (config.printToConsole) {
            //format console output if needed
            //var maxName = config.maxCharName,
            //maxCommand = config.maxCharCommand,
            var logFrom = message.author.username.substring(0, 20),
            logMessage = message.cleanContent.substring(0, 10).toLowerCase();
            //format log
            console.log(printf('%-' + 20 + 's % ' + 10 + 's',
                logFrom, logMessage));
			//console.log(logFrom+": "+logMessage)
        }

        // Should the message be sent the program?
        if (config.sendKey) {
            keyHandler.sendKey(message.cleanContent.toLowerCase());
        }
    }
});

client.login(process.env.DISCORD_TOKEN)
console.log('Connecting...');
