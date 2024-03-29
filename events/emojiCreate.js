const {MessageEmbed} = require('discord.js');

module.exports = async (bot, emoji) => {
    const rows = await bot.db.query('select * from serverInfo where serverID = ?', [emoji.guild.id]).catch(bot.errHandle);
    if (rows != undefined) {
        const botPerms = emoji.guild.me.permissions.has(['SEND_MESSAGES', 'VIEW_AUDIT_LOG', 'EMBED_LINKS', 'MANAGE_EMOJIS'], { checkAdmin: true });
        const logCHNL = emoji.guild.channels.cache.find(chnl => chnl.id === rows[0].serverClogID);
        if (botPerms) {
            if (rows[0].serverLog === 'Y' && logCHNL) {
                let executor = await emoji.fetchAuthor().catch(bot.errHandle);
                if (!executor) {
                    const embed = new MessageEmbed()
                    .setAuthor('Emoji created')
                    .setDescription(`By: Unknown\nName: ${emoji.name}\nID: ${emoji.id}`)
                    .setColor('#42f456')
                    .setTimestamp();
                    return logCHNL.send({embeds: [embed]}).catch(bot.errHandle);
                } else {
                    const embed = new MessageEmbed()
                    .setAuthor('Emoji created')
                    .setDescription(`By: ${executor}\nName: ${emoji.name}\nID: ${emoji.id}`)
                    .setColor('#42f456')
                    .setTimestamp();
                    return logCHNL.send({embeds: [embed]}).catch(bot.errHandle);
                }
            }
        }
    } else { return bot.errL.send('Issue occured trying to log emoji creation in a server, should it occur commonly check code').catch(bot.errHandle); }
};
