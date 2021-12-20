const { MessageEmbed, GuildMember } = require('discord.js');

/**
 * 
 * @param {*} bot 
 * @param {GuildMember} member 
 * @returns 
 */
module.exports = async (bot, member) => {
    const rows = await bot.db.query('SELECT * FROM serverInfo WHERE serverID = ?', [member.guild.id]).catch(bot.errHandle);
    if (rows != undefined) {
        const botPerms = member.guild.me.permissions.has(['SEND_MESSAGES', 'VIEW_AUDIT_LOG', 'EMBED_LINKS'], { checkAdmin: true });
        const logCHNL = member.guild.channels.cache.find(chnl => chnl.id === rows[0].serverClogID);
        if (botPerms) {
            if (rows[0].serverLog === 'Y' && logCHNL) {
                const tempTimestamp = Date.now();
                const aLogFound = await member.guild.fetchAuditLogs({ type: 'MEMBER_KICK', limit: 1 }).then(aLog => aLog.entries.first()).catch(bot.errHandle);
                if (aLogFound.target.id !== member.id) {
                    const embedLeave = new MessageEmbed()
                        .setAuthor('User leave')
                        .setDescription(`Username: **${member.user.tag}**`)
                        .setColor('#c4150f')
                        .setTimestamp();

                    if (userRole) { userRole.delete(`Member ${member.user.tag} left the server'`).catch(bot.errHandle); }
                    return logCHNL.send({ embeds: [embedLeave] }).catch(bot.errHandle);
                } else if (aLogFound.target.id === member.id) {
                    const executor = aLogFound.executor.user.id;
                    const embedKick = new MessageEmbed()
                        .setAuthor('User kicked')
                        .setDescription(`Moderator: <@${executor}>\n Member: **${member.user.tag}**`)
                        .setColor('#c4150f')
                        .setTimestamp();
                    if (userRole) { userRole.delete(`Member ${member.user.tag} was kicked from the server`).catch(bot.errHandle); }
                    return logCHNL.send({ embeds: [embedKick] }).catch(bot.errHandle);
                }

                // if (aLogFound) {
                //     const uTarget = aLogFound.target;
                //     const aLogTimestamp = aLogFound.createdTimestamp;
                //     const userRole = member.guild.roles.cache.find(role => role.name === `USER-${member.id}`);

                //     const embedLeave = new MessageEmbed()
                //         .setAuthor('User leave')
                //         .setDescription(`Username: **${member.user.tag}**`)
                //         .setColor('#c4150f')
                //         .setTimestamp();

                //     if (tempTimestamp <= aLogTimestamp + 10000) {
                //         if (uTarget.id !== member.id) {
                //             if (userRole) { userRole.delete(`Member ${member.user.tag} left the server'`).catch(bot.errHandle); }
                //             return logCHNL.send({ embeds: [embedLeave] }).catch(bot.errHandle);
                //         } else {
                //             const executor = aLogFound.executor.user.id;
                //             const embedKick = new MessageEmbed()
                //                 .setAuthor('User kicked')
                //                 .setDescription(`Moderator: <@${executor}>\n Member: **${member.user.tag}**`)
                //                 .setColor('#c4150f')
                //                 .setTimestamp();
                //             if (userRole) { userRole.delete(`Member ${member.user.tag} was kicked from the server`).catch(bot.errHandle); }
                //             return logCHNL.send({ embeds: [embedKick] }).catch(bot.errHandle);
                //         }
                //     } else {
                //         if (userRole) { userRole.delete(`Member ${member.user.tag} left the server`).catch(bot.errHandle); }
                //         return logCHNL.send({ embeds: [embedLeave] }).catch(bot.errHandle);
                //     }
                // } else {
                //     const embedLeave = new MessageEmbed()
                //         .setAuthor('User leave')
                //         .setDescription(`Username: **${member.user.tag}**`)
                //         .setColor('#c4150f')
                //         .setTimestamp();
                //     return logCHNL.send({ embeds: [embedLeave] });
                // }
            }
        }
    } else { return bot.errL.send('Issue occured trying to log member leaving in a server, should it occur commonly check code').catch(bot.errHandle); }
};
module.exports.help = {
    name: ''
};
