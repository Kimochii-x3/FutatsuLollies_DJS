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
        if (message.author.id === bot.owner.id || message.author.id === bot.maintainer.id) {
            // if (option[1] === 'set' && option[2] === 'motd') {
            //     await bot.db.query('update botStats set motd = ?', [option[0]]).catch(bot.errHandle);
            //     await bot.user.setActivity(`${bot.guilds.cache.size} servers / MOTD: ${option[0]}`, { type: 'watching' });
            // } else if (option[1] === 'delete' && option[2] === 'motd') {
            //     await bot.db.query(`update botStats set motd =NULL`).catch(bot.errHandle);
            //     await bot.user.setActivity(`${bot.guilds.cache.size} servers`, { type: 'watching' });
            // } else if (option[1] === 'update') {
            //     try {
            //         let out = require("child_process").execSync("git pull").toString();
            //         message.channel.send(out, {code: "css"});
            //         return setTimeout(async () => {
            //             await message.channel.send('Restarting!');
            //             return require("child_process").execSync("pm2 restart FutatsuLollies");
            //         }, 3000);
            //     } catch (err) {
            //         return message.channel.send(err, {code: "js"});
            //     }
            //     /*.then((out) => message.channel.send(out, {code: "css"})).catch((err) => )*/
            // }
            
            switch (option.slice(1).toString()) {
                case 'set,motd': {
                    await bot.db.query('update botStats set motd = ?', [option[0]]).catch(bot.errHandle);
                    await bot.user.setActivity(`${bot.guilds.cache.size} servers / MOTD: ${option[0]}`, { type: 'watching' });
                    return message.channel.send('MOTD updated').catch(bot.errHandle);
                }
                case 'delete,motd': {
                    await bot.db.query(`update botStats set motd = NULL`).catch(bot.errHandle);
                    await bot.user.setActivity(`${bot.guilds.cache.size} servers`, { type: 'watching' });
                    return message.channel.send('MOTD deleted').catch(bot.errHandle);
                }
                case 'update': {
                    console.log('option update ' + option);
                    try {
                        let out = require("child_process").execSync("git pull").toString();
                        message.channel.send({content: out, code: "css"}).catch(bot.errHandle);
                        return setTimeout(async () => {
                            await message.channel.send('Restarting!').catch(bot.errHandle);
                            return require("child_process").execSync("pm2 restart FutatsuLollies");
                        }, 3000);
                    } catch (err) {
                        return message.channel.send({content: err, code: "js"});
                    }
                }
                default: { return; }
            }
        } else {
            return message.react('🤔').catch(bot.errHandle);
        }
    }
};
