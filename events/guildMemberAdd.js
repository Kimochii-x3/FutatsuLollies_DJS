const {MessageEmbed} = require('discord.js');

module.exports = async (bot, member) => {
    const rows = await bot.db.query('SELECT * FROM serverInfo WHERE serverID = ?', [member.guild.id]).catch(bot.errHandle);
    if (rows != undefined) {
        const botPerms = member.guild.me.permissions.has(['SEND_MESSAGES', 'EMBED_LINKS'], { checkAdmin: true });
        const logCHNL = member.guild.channels.cache.find(chnl => chnl.id === rows[0].serverClogID);
		if (botPerms) {
			if (rows[0].serverLog === 'Y' && logCHNL) {
				const embed = new MessageEmbed()
				.setAuthor('User join')
				.setDescription(`Username: **${member.user.tag}**\n ID: **${member.user.id}**`)
				.setColor('GREEN')
				.setTimestamp();  
				return logCHNL.send({embeds: [embed]}).cathc(bot.errHandle);
			}
		}
    } else { return bot.errL.send('Issue occured trying to log member joining in a server, should it occur commonly check code').catch(bot.errHandle); }
};
module.exports.help = {
  name: ''
};
