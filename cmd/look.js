const Discord = require('discord.js');
// lookup command it takes arguments of avatar and tag and its used to lookup someone's avatar or user tag
module.exports = { 
    name: 'look',
    description: 'looks up a user\'s avatar/banner or tag by mentioning them or their ID, using ID lets you lookup (avatars/banners or tags) of any member in other servers',
    usage: 'fl.look (avatar/banner or tag) @<someone> / fl.look (avatar/banner or tag) <user ID>',
    cd: 0,
    guildOnly: true,
    args: true,
    async execute (bot, message, args, option, commands, prefix) {
        const lookup = args[0];
        const id = args[1];
        const mentionedMember = message.mentions.members.first();
        if (mentionedMember) {
            switch (lookup) {
                case 'avatar': {
                    const avatarurl = await bot.users.fetch(mentionedMember.id, {cache: false}).then(u => u.avatarURL({ format: 'png', dynamic: true, size: 4096 })).catch(bot.errHandle);
                    return message.channel.send({files: [avatarurl]}).catch(bot.errHandle);
                }
                case 'banner':
                {
                    const bannerurl = await bot.users.fetch(mentionedMember.id, {cache: false, force: true}).then(u => u.bannerURL({format: 'png', dynamic: true, size: 4096})).catch(bot.errHandle);
                    return message.channel.send({files: [bannerurl]}).catch(bot.errHandle);
                }
                case 'tag': {
                    const tag = await bot.users.fetch(mentionedMember.id, {cache: false}).then(u => u.tag).catch(bot.errHandle);
                    return message.channel.send(tag).catch(bot.errHandle);
                }
                default: { return; }
            }
        } else if (!mentionedMember) {
            switch (lookup) {
                case 'avatar': {
                    const avatarurl = await bot.users.fetch(id, {cache: false}).then(u => u.avatarURL({ format: 'png', dynamic: true, size: 4096 })).catch(bot.errHandle);
                    return message.channel.send({files: [avatarurl]}).catch(bot.errHandle);
                }
                case 'banner':
                {
                    const bannerurl = await bot.users.fetch(id, {cache: false, force: true}).then(u => u.bannerURL({format: 'png', dynamic: true, size: 4096})).catch(bot.errHandle);
                    return message.channel.send({files: [bannerurl]}).catch(bot.errHandle);
                }
                case 'tag': {
                    const tag = await bot.users.fetch(id, {cache: false}).then(u => u.tag).catch(bot.errHandle);
                    return message.channel.send(tag).catch(bot.errHandle);
                }
                default: { return; }
            }
        } else if (!args[1] || !mentionedMember) {
            switch (lookup) {
                case 'avatar': {
                    const avatarurl = await bot.users.fetch(message.author.id, {cache: false}).then(u => u.avatarURL({ format: 'png', dynamic: true, size: 4096 })).catch(bot.errHandle);
                    return message.channel.send({files: [avatarurl]}).catch(bot.errHandle);
                }
                case 'banner':
                {
                    const bannerurl = await bot.users.fetch(message.author.id, {cache: false, force: true}).then(u => u.bannerURL({format: 'png', dynamic: true, size: 4096})).catch(bot.errHandle);
                    return message.channel.send({files: [bannerurl]}).catch(bot.errHandle);
                }
                case 'tag': {
                    const tag = await bot.users.fetch(message.author.id, {cache: false}).then(u => u.tag).catch(bot.errHandle);
                    return message.channel.send(tag).catch(bot.errHandle);
                }
                default: { return; }
            }
        }
    }
};
