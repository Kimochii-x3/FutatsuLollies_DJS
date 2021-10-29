const {MessageEmbed, Message} = require('discord.js');

module.exports = async (bot, message) => {
    if (!message.author.bot || message.channel.type !== 'dm') {
        const rows = await bot.db.query('SELECT * FROM serverInfo WHERE serverID = ?', [message.guild.id]).catch(bot.errHandle);
		if(rows != undefined) {
			const botPerms = message.guild.me.permissions.has(['SEND_MESSAGES', 'EMBED_LINKS'], { checkAdmin: true });
			const logCHNL = message.guild.channels.cache.find(chnl => chnl.id === rows[0].serverClogID);
			if (botPerms) {
				if (rows[0].serverLog === 'Y' && logCHNL) {
					const mFiles = message.attachments.map(a => a.proxyURL);
					if (mFiles.length === 0) {
						let embeds = message.embeds;

						const mDelete = new MessageEmbed()
						.setAuthor(message.author.tag, message.author.displayAvatarURL())
						.setDescription(`**Message sent by **${message.author}** was deleted in **${message.channel}\n${message.content}`)
						.setColor('#c4150f')
						.setTimestamp()
						.setFooter(`Author ID: ${message.author.id} & Message ID: ${message.id}`);
						logCHNL.send({embeds: [mDelete]});

						for (const embed of embeds) {
							bot.errHandle("got embed")

							let tempMsg = new MessageEmbed()
							.setAuthor(message.author.tag, message.author.displayAvatarURL())
							.setColor('#c4150f')
							.setTimestamp()
							.setImage(embed.image)
							.setFooter(`Author ID: ${message.author.id} & Message ID: ${message.id}`);
	
							message.channel.send({embeds: [tempMsg]})
						}

						return
					} else {
						mFiles.forEach(async (a) => {
							if (['.png', '.jpg', '.gif', '.jpeg', '.tiff', '.tif', '.bmp'].some(e => a.includes(e))) {
								const mDelete = new MessageEmbed()
								.setAuthor(message.author.tag, message.author.displayAvatarURL())
								.setDescription(`**Message sent by **${message.author}** was deleted in **${message.channel}\n${message.content}`)
								.setColor('#c4150f')
								.setTimestamp()
								.setImage(a)
								.setFooter(`Author ID: ${message.author.id} & Message ID: ${message.id}`);
				
								{ setTimeout(() => { logCHNL.send({embeds: [mDelete]}); }, 1250); }
								return;
							} else {
								const mDelete = new MessageEmbed()
								.setAuthor(message.author.tag, message.author.displayAvatarURL())
								.setDescription(`**Message sent by **${message.author}** was deleted in **${message.channel}\n${message.content}\n**File format not an image: **${a}`)
								.setColor('#c4150f')
								.setTimestamp()
								.setFooter(`Author ID: ${message.author.id} & Message ID: ${message.id}`);
								return logCHNL.send({embeds: [mDelete]}); 
							}
						});
					}
				}
			}
		} else { return bot.errL.send('Issue occured trying to log message deletion in a server, should it occur commonly check code').catch(bot.errHandle); }
    }
};
module.exports.help = {
  name: ''
};
