const Discord = require('discord.js');

module.exports = {
    name: 'update',
    description: 'used to update various bot things',
    usage: 'fl.update',
    cd: 0,
    guildOnly: false,
    args: false,
    async execute(bot, message, args, option, commands, prefix) {
        // prefix and command length get removed, option[0] is always the text before the first > - < (minus).
        if (message.author.id === (bot.owner.id || bot.maintainer.id)) {
            if (option[1] === 'set' && option[2] === 'motd') {
                await bot.db.query('update botStats set motd = ?', [option[0]]).catch(bot.errHandle);
                await bot.user.setActivity(`${bot.guilds.cache.size} servers / MOTD: ${option[0]}`, { type: 'watching' });
            } else if (option[1] === 'delete' && option[2] === 'motd') {
                await bot.db.query(`update botStats set motd =NULL`).catch(bot.errHandle);
                await bot.user.setActivity(`${bot.guilds.cache.size} servers`, { type: 'watching' });
            } else if (option[1] === 'update') {
                require("child_process").exec("git pull").then((out) => message.channel.send(out, {code: "css"})).catch((err) => message.channel.send(err, {code: "js"}));
            }
        } else if (message.author.id !== (bot.owner.id || bot.maintainer.id)) {
            return message.react('🤔').catch(bot.errHandle);;
        }
    }
};
