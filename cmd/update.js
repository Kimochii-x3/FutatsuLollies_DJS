const Discord = require('discord.js');

module.exports = {
    name: 'update',
    description: 'used to update various bot things',
    usage: 'fl.update',
    cd: 0,
    guildOnly: false,
    args: false,
    async execute(bot, message, args, option, commands, prefix) {
        // prefix and command length get removed, option[0] is always the text (if any) before the first > - < (minus).
        // checking if the message author id is either bot's maintainer or owner's id
        if (message.author.id === bot.owner.id || message.author.id === bot.maintainer.id) {
            // shallow copy of option array with first entry removed, then converted the output to be with a - instead of ,
            switch (option.slice(1).reduce((c, e) => c += "-" + e)) {
                // case to change the MOTD
                case "set-motd": {
                    await bot.db.query('update botStats set motd = ?', [option[0]]).catch(bot.errHandle);
                    await bot.user.setActivity(`${bot.guilds.cache.size} servers / MOTD: ${option[0]}`, { type: 'watching' });
                }
                // case to delete the MOTD
                case "delete-motd": {
                    await bot.db.query(`update botStats set motd = NULL`).catch(bot.errHandle);
                    await bot.user.setActivity(`${bot.guilds.cache.size} servers`, { type: 'watching' });
                }
                // case to update the bot
                case "update": {
                    // tries to update the code from github followed by restart, if error occurs it replies to the channel
                    try {
                        let out = require("child_process").execSync("git pull").toString();
                        message.channel.send(out, {code: "css"});
                        return setTimeout(async () => {
                            await message.channel.send('Restarting!');
                            return require("child_process").execSync("pm2 restart FutatsuLollies");
                        }, 3000);
                    } catch (err) {
                        return message.channel.send(err, {code: "js"});
                    }
                }
            }
        } else {
            // lole
            return message.react('🤔').catch(bot.errHandle);
        }
    }
};
