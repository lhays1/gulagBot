const eris = require('eris');
const fs = require('fs');

const PREFIX = 'gu!';
const BOT_OWNER_ID = '<redacted>';

// Create a Client instance with our bot token.
const bot = new eris.Client('<redacted>');

var path = 'user-data.json';

const commandForName = {};
commandForName['tally'] = {
  execute: (msg, args) => {
    const mention = args[0];
    const winsToAdd = parseFloat(args[1]);
    const lossesToAdd = parseFloat(args[2]);

    // Accessing the user data file
    var read = fs.readFileSync(path);
    var userData = JSON.parse(read);
    if (!userData[mention]) { //this checks if data for the user has already been created
        userData[mention] = {wins: 0, losses: 0}; // if not, create it
        fs.writeFileSync(path, JSON.stringify(userData, null, 1));
    }
    // Update the user data to use
    read = fs.readFileSync(path);
    userData = JSON.parse(read);
    var userWins = Number(userData[mention].wins) + winsToAdd; //Add wins to the user wins
    var userLosses = Number(userData[mention].losses) + lossesToAdd; //Add losses to the user losses
    userData[mention] = {wins: userWins, losses: userLosses};
    fs.writeFileSync(path, JSON.stringify(userData, null, 1));
    console.log(`Updating ${mention} wins to ${userWins} and losses to ${userLosses}`)
    return msg.channel.createMessage(`Updating ${mention}'s wins to ${userWins} and losses to ${userLosses}.`);
  },
};

commandForName['win'] = {
  execute: (msg, args) => {
    const mention = args[0];

    // Accessing the user data file
    var read = fs.readFileSync(path);
    var userData = JSON.parse(read);
    if (!userData[mention]) { //this checks if data for the user has already been created
        userData[mention] = {wins: 0, losses: 0}; // if not, create it
        fs.writeFileSync(path, JSON.stringify(userData, null, 1));
    }
    // Update the user data to use
    read = fs.readFileSync(path);
    userData = JSON.parse(read);
    var userWins = Number(userData[mention].wins) + 1; //Add wins to the user wins
    var userLosses = Number(userData[mention].losses); //Add losses to the user losses
    userData[mention] = {wins: userWins, losses: userLosses};
    fs.writeFileSync(path, JSON.stringify(userData, null, 1));
    console.log(`Updating ${mention} wins to ${userWins}`)

    return msg.channel.createMessage(`Updating ${mention}'s wins to ${userWins}.`);
  },
};

commandForName['loss'] = {
  execute: (msg, args) => {
    const mention = args[0];

    // Accessing the user data file
    var read = fs.readFileSync(path);
    var userData = JSON.parse(read);
    if (!userData[mention]) { //this checks if data for the user has already been created
        userData[mention] = {wins: 0, losses: 0}; // if not, create it
        fs.writeFileSync(path, JSON.stringify(userData, null, 1));
    }
    // Update the user data to use
    read = fs.readFileSync(path);
    userData = JSON.parse(read);
    var userWins = Number(userData[mention].wins); //Add wins to the user wins
    var userLosses = Number(userData[mention].losses) + 1; //Add losses to the user losses
    userData[mention] = {wins: userWins, losses: userLosses};
    fs.writeFileSync(path, JSON.stringify(userData, null, 1));
    console.log(`Updating ${mention} losses to ${userLosses}`)

    return msg.channel.createMessage(`Updating ${mention}'s losses to ${userLosses}.`);
  },
};

commandForName['ratio'] = {
  execute: (msg, args) => {
    const mention = args[0];

    // Accessing the user data file
    var read = fs.readFileSync(path);
    var userData = JSON.parse(read);

    if (!userData[mention]) { // this checks if data for the user exists
      return msg.channel.createMessage(`User ${mention} does not exist or has no wins or losses.`);
    }
    var wins = Number(userData[mention].wins);
    var losses = Number(userData[mention].losses);
    var ratio = (wins/(wins+losses)) * 100;

    return msg.channel.createMessage(`Win percentage for ${mention} is ${ratio}%`);
  },
};

commandForName['stats'] = {
  execute: (msg, args) => {
    const mention = args[0];

    // Accessing the user data file
    var read = fs.readFileSync(path);
    var userData = JSON.parse(read);

    if (!userData[mention]) { // this checks if data for the user exists
      return msg.channel.createMessage(`User ${mention} does not exist or has no wins or losses.`);
    }
    var wins = Number(userData[mention].wins);
    var losses = Number(userData[mention].losses);

    return msg.channel.createMessage(`${mention} has ${wins} wins and ${losses} losses.`);
  },
};

commandForName['reset'] = {
  botOwnerOnly: true,
  execute: (msg, args) => {
    const mention = args[0];

    // Accessing the user data file
    var read = fs.readFileSync(path);
    var userData = JSON.parse(read);

    if (!userData[mention]) { // this checks if data for the user exists
      return msg.channel.createMessage(`User ${mention} does not exist or has no wins or losses.`);
    }
    userData[mention] = {wins: 0, losses: 0}; // if not, create it
    fs.writeFileSync(path, JSON.stringify(userData, null, 1));

    return msg.channel.createMessage(`${mention}'s wins and losses have been eliminated.`);
  },
};

// When the bot is connected and ready, log to console.
bot.on('ready', () => {
   console.log('Connected and ready to operate.');
});

bot.on('messageCreate', async (msg) => {
    const content = msg.content;

    // Ignore any messages sent as direct messages.
    // The bot will only accept commands issued in
    // a guild.
    if (!msg.channel.guild) {
      return;
    }

    // Ignore any message that doesn't start with the correct prefix.
    if (!content.startsWith(PREFIX)) {
        return;
    }

    // Extract the parts of the command and the command name
    const parts = content.split(' ').map(s => s.trim()).filter(s => s);
    const commandName = parts[0].substr(PREFIX.length);

    // Get the requested command, if there is one.
    const command = commandForName[commandName];
    if (!command) {
        return;
    }

    // If this command is only for the bot owner, refuse
    // to execute it for any other user.
    const authorIsBotOwner = msg.author.id === BOT_OWNER_ID;
    if (command.botOwnerOnly && !authorIsBotOwner) {
        return await msg.channel.createMessage('Sorry only the owner can do this!');
    }

    // Separate the command arguments from the command prefix and command name.
    const args = parts.slice(1);

    try {
        // Execute the command.
        await command.execute(msg, args);
    } catch (err) {
        console.warn('Error handling command');
        console.warn(err);
    }
  });

bot.on('error', err => {
   console.warn(err);
});

bot.connect();