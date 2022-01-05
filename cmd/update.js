const {MessageEmbed, MessageButton, MessageActionRow, Message} = require('discord.js');

module.exports = {
    name: 'update',
    description: 'Used to update or remove bot\'s MOTD or update the bot\'s code. Can only be used by the bot devs.',
    usage: 'Write the command `fl.update` after that interact with the buttons.',
    cd: 0,
    guildOnly: false,
    args: false,
    async execute(bot, message, args, option, commands, prefix) {
        // prefix and command length get removed, option[0] is always the text (if any) before the first > - < (minus).
        // checking if the message author id is either bot's maintainer or owner's id
        if (message.author.id === bot.owner.id || message.author.id === bot.maintainer.id) {
            //#region new code
            const updateEmbed = new MessageEmbed()
            .setTitle('Select a option');
            const updateButtons = new MessageActionRow()
            .addComponents(
                new MessageButton()
                .setCustomId('nMotd')
                .setLabel('Update MOTD')
                .setStyle('PRIMARY')
                .setDisabled(false),
                new MessageButton()
                .setCustomId('rMotd')
                .setLabel('Remove MOTD')
                .setStyle('PRIMARY')
                .setDisabled(false),
                new MessageButton()
                .setCustomId('code')
                .setLabel('$')
                .setStyle('SECONDARY')
                .setDisabled(false),
                new MessageButton()
                .setCustomId('cancelInteraction')
                .setLabel('Cancel action')
                .setStyle('DANGER')
                .setDisabled(false),
            )
            const filter = (interaction) => (interaction.user.id === bot.owner.id || interaction.user.id === bot.maintainer.id);
            if (bot.code_type != bot.code_rels) {
                updateButtons.components.forEach(entry => {
                    if (entry.customId === updateButtons.components[2].customId) {
                        entry.label = 'Upload Code';
                        entry.style = 'DANGER';
                    }
                });
            }
            message.channel.send({embeds: [updateEmbed], components: [updateButtons]}).then(botMsg => awaitInput(botMsg)).catch(bot.errHandle);
            async function awaitInput(botMsg) {
                await botMsg.awaitMessageComponent({filter}).then(async interaction => {
                    if (interaction.customId === updateButtons.components[0].customId) {
                        const messageFilter = msg => (msg.author.id === bot.owner.id || msg.author.id === bot.maintainer.id) && (msg.content.length < 1025);
                        const collector = interaction.channel.createMessageCollector({messageFilter, max: 1});
                        const latestEmbed = new MessageEmbed(botMsg.embeds[0])
                        .setTitle('Write the new MOTD, up to 1024(inclusive) characters, write q to cancel');
                        await botMsg.edit({embeds: [latestEmbed], components: []}).catch(bot.errHandle);
                        collector.on('collect', async msg => {
                            if (msg.content === 'q') {
                                botMsg.edit({embeds: [botMsg.embeds[0].setTitle('MOTD change cancelled!')]}).catch(bot.errHandle);
                                collector.stop();
                            } else {
                                await bot.db.query('update botStats set motd = ?', [msg.content]).catch(bot.errHandle);
                                await bot.user.setActivity(`${msg.content}`, {name: 'MOTD', type: 'WATCHING'});
    
                                botMsg.edit({embeds: [botMsg.embeds[0].setTitle('MOTD change Accepted!')]}).catch(bot.errHandle);
                                collector.stop('MOTD collected and set');
                            }
                        });
                        await interaction.deferUpdate();
                        collector.on('end', async collected => {
                            setTimeout(async () => {
                                return botMsg.edit({embeds: [updateEmbed], components: [updateButtons]}).then(botMsg => awaitInput(botMsg)).catch(bot.errHandle);
                            }, 1000);
                        });
                    } else if (interaction.customId === updateButtons.components[1].customId) {
                        const latestEmbed = new MessageEmbed(botMsg.embeds[0])
                        .setTitle('MOTD deleted!');
                        await bot.db.query(`update botStats set motd = NULL`).catch(bot.errHandle);
                        await bot.user.setActivity(`yes`, {name: 'MOTD', type: 'WATCHING'});
                        await interaction.deferUpdate();
                        await botMsg.edit({embeds: [latestEmbed]}).then(botMsg => awaitInput(botMsg)).catch(bot.errHandle);
                    } else if (interaction.customId === updateButtons.components[2].customId) {
                        await interaction.deferUpdate();
                        if (bot.code_type === bot.code_rels) {
                            try {
                                let output = require("child_process").execSync("git pull").toString();
                                const latestEmbed = new MessageEmbed(botMsg.embeds[0])
                                .setTitle('Output')
                                .setDescription(`\`\`\`CSS\n${output}\`\`\``);
                                botMsg.edit({embeds: [latestEmbed], components: []}).catch(bot.errHandle);
                                await new Promise(wait => setTimeout(wait, 5000));
                                await botMsg.edit({embeds: [botMsg.embeds[0].setTitle('Restarting in a second').setDescription('')]}).catch(bot.errHandle);
                                await new Promise(wait => setTimeout(wait, 1000));
                                return require("child_process").execSync("pm2 restart FutatsuLollies");
                            } catch (err) {
                                const latestEmbed = new MessageEmbed(botMsg.embeds[0])
                                .setTitle('Error')
                                .setDescription(`\`\`\`JS\n${err}\`\`\``);
                                botMsg.edit({embeds: [latestEmbed], components: []}).catch(bot.errHandle);
                            }
                        } else {
                            try {
                                const messageFilter = msg => (msg.author.id === bot.owner.id || msg.author.id === bot.maintainer.id) && (msg.content.length < 1025);
                                const collector = interaction.channel.createMessageCollector({messageFilter, max: 1});
                                const latestEmbed = new MessageEmbed(botMsg.embeds[0])
                                .setTitle('Write the comment for `git commit -am`, up to 1024(inclusive) characters, write q to cancel');
                                await botMsg.edit({embeds: [latestEmbed], components: []}).catch(bot.errHandle);
                                collector.on('collect', async msg => {
                                    if (msg.content === 'q') {
                                        botMsg.edit({embeds: [botMsg.embeds[0].setTitle('Uploading cancelled.')]}).catch(bot.errHandle);
                                        collector.stop();
                                    } else {
                                        await botMsg.edit({embeds: [botMsg.embeds[0].setTitle('Comment accepted!')]}).catch(bot.errHandle);
                                        await new Promise(wait => setTimeout(wait, 2000));
                                        let commit = require("child_process").execSync(`git commit -am "${msg.content}"`).toString();
                                        await botMsg.edit({embeds: [botMsg.embeds[0].setTitle('Code commited!').spliceFields(0, 0, [{name: 'Output - Commit', value: `\`\`\`CSS\n${commit}\`\`\``, inline: false}])]}).catch(bot.errHandle);
                                        await new Promise(wait => setTimeout(wait, 2000));
                                        let uploadCode = require("child_process").execSync("upcode").toString();
                                        await botMsg.edit({embeds: [botMsg.embeds[0].setTitle('Code uploaded!').spliceFields(0, 1, [{name: 'Output - Upload', value: `\`\`\`CSS\n${uploadCode}\`\`\``, inline: false}])]}).catch(bot.errHandle);
                                        collector.stop();
                                    }
                                });
                                collector.on('end', async collected => {
                                    setTimeout(async () => {
                                        return botMsg.edit({embeds: [updateEmbed], components: [updateButtons]}).then(botMsg => awaitInput(botMsg)).catch(bot.errHandle);
                                    }, 1000);
                                });
                            } catch (err) {
                                const latestEmbed = new MessageEmbed(botMsg.embeds[0])
                                .setTitle('Error')
                                .setDescription(`\`\`\`JS\n${err}\`\`\``);
                                botMsg.edit({embeds: [latestEmbed], components: []}).catch(bot.errHandle);
                            }
                        }
                    } else if (interaction.customId === updateButtons.components[3].customId) {
                        console.log(interaction);
                        await botMsg.edit({embeds: [botMsg.embeds[0].setTitle('Interaction cancelled.')], components: []}).catch(bot.errHandle);
                        await interaction.deferUpdate();
                    }
                }).catch(bot.errHandle);
            }
            //#endregion
            //#region old code
            // // shallow copy of option array with first entry removed, then converted the output to be with a - instead of ,
            // switch (option.slice(1).reduce((c, e) => c += "-" + e)) {
            //     // case to change the MOTD
            //     case "set-motd": {
            //         await bot.db.query('update botStats set motd = ?', [option[0]]).catch(bot.errHandle);
            //         await bot.user.setActivity(`${bot.guilds.cache.size} servers / MOTD: ${option[0]}`, { type: 'watching' });
            //     }
            //     // case to delete the MOTD
            //     case "delete-motd": {
            //         await bot.db.query(`update botStats set motd = NULL`).catch(bot.errHandle);
            //         await bot.user.setActivity(`${bot.guilds.cache.size} servers`, { type: 'watching' });
            //     }
            //     // case to update the bot
            //     case "update": {
            //         // tries to update the code from github followed by restart, if error occurs it replies to the channel
            //         try {
            //             let out = require("child_process").execSync("git pull").toString();
            //             message.channel.send(out, {code: "css"});
            //             return setTimeout(async () => {
            //                 await message.channel.send('Restarting!');
            //                 return require("child_process").execSync("pm2 restart FutatsuLollies");
            //             }, 3000);
            //         } catch (err) {
            //             return message.channel.send(err, {code: "js"});
            //         }
            //     }
            // }
            //#endregion
        } else {
            // lole
            return message.react('🤔').catch(bot.errHandle);
        }
    }
};
