const { MessageEmbed, Message } = require('discord.js');

/**
 * 
 * @param {*} bot 
 * @param {Message} message 
 * @returns 
 */
module.exports = async (bot, message) => {
	if (!message.author.bot || message.channel.type !== 'dm') {
		const rows = await bot.db.query('SELECT * FROM serverInfo WHERE serverID = ?', [message.guild.id]).catch(bot.errHandle);
		if (rows != undefined) {
			const botPerms = message.guild.me.permissions.has(['SEND_MESSAGES', 'EMBED_LINKS'], { checkAdmin: true });
			const logCHNL = message.guild.channels.cache.find(chnl => chnl.id === rows[0].serverClogID);
			if (botPerms) {
				let message = await message.fetch();
				if (rows[0].serverLog === 'Y' && logCHNL) {
					const mFiles = message.attachments.map(a => a.proxyURL);
					if (mFiles.length === 0) {
						const mDelete = new MessageEmbed()
							.setAuthor(message.author.tag, message.author.displayAvatarURL())
							.setDescription(`**Message sent by **${message.author}** was deleted in **${message.channel}\n${message.content}`)
							.setColor('#c4150f')
							.setTimestamp()
							.setFooter(`Author ID: ${message.author.id} & Message ID: ${message.id}`);
						logCHNL.send({ embeds: [mDelete] });

						if (message.embeds.length > 0 && message.embeds.some(e => e.image !== null || e.video !== null)) {
							let embeds = message.embeds; 

							for (const embed of embeds) {
								let tempMsg = new MessageEmbed()
									.setAuthor(message.author.tag, message.author.displayAvatarURL())
									.setColor('#c4150f')
									.setTimestamp()
									.setImage(embed.image.url ?? embed.video.url ?? "https://www.vhv.rs/dpng/d/416-4167052_cross-sign-png-tic-tac-toe-cross-transparent.png")
									.setFooter(`Author ID: ${message.author.id} & Message ID: ${message.id}`);

								logCHNL.send({ embeds: [tempMsg] }).catch(bot.errHandle)
							}
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

								{ setTimeout(() => { logCHNL.send({ embeds: [mDelete] }); }, 1250); }
								return;
							} else {
								const mDelete = new MessageEmbed()
									.setAuthor(message.author.tag, message.author.displayAvatarURL())
									.setDescription(`**Message sent by **${message.author}** was deleted in **${message.channel}\n${message.content}\n**File format not an image: **${a}`)
									.setColor('#c4150f')
									.setTimestamp()
									.setFooter(`Author ID: ${message.author.id} & Message ID: ${message.id}`);
								return logCHNL.send({ embeds: [mDelete] });
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
