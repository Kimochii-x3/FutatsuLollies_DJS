const Discord = require('discord.js');

/**
 * 
 * @param bot 
 * @param {Discord.GuildBan} ban 
 * @returns 
 */
module.exports = async (bot, ban) => {
    const rows = await bot.db.query('select * from serverInfo where serverID = ?', [ban.guild.id]).catch(bot.errHandle);
    if (rows != undefined) {
        const botPerms = ban.guild.me.permissions.has(['SEND_MESSAGES', 'VIEW_AUDIT_LOG', 'EMBED_LINKS'], { checkAdmin: true, checkOwner: false });
        const logCHNL = ban.guild.channels.cache.find(chnl => chnl.id === rows[0].serverClogID);
        if (botPerms) {
            if (rows[0].serverLog === 'Y' && logCHNL) {
                const aLogFound = await ban.guild.fetchAuditLogs({ type: 'MEMBER_KICK', limit: 1 }).then(aLog => aLog.entries.first()).catch(bot.errHandle);

                if (!aLogFound) return logCHNL.send(`User ${ban.user.id} was banned, but there was no audit log present.`);

                const {target, executor, reason} = aLogFound;

                const embedBan = new Discord.MessageEmbed()
                    .setAuthor('User banned')
                    .setDescription(`Moderator: ${executor}\n Member: ${target} (${target.username} - ${target.id})\n ${reason ? `Reason: ${reason}` : ""}`)
                    .setColor('#c4150f')
                    .setTimestamp();

                return logCHNL.send({ embeds: [embedBan] }).catch(bot.errHandle);
            }
        }
    } else { return bot.errL.send('Issue occured trying to log member banning in a server, should it occur commonly check code').catch(bot.errHandle); }
};
