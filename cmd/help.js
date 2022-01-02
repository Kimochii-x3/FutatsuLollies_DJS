const {MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu} = require('discord.js');
// help command, not much going on here
module.exports = {
    name: 'help',
    description: 'Sends an embed with button interactions to view:\n1. The initial embed that is sent.\n2. Singular commands.\n3. Bot information such as support server, github, etc.',
    usage: 'Write the command `fl.help` after that interact with the buttons.',
    cd: 0,
    guildOnly: true,
    args: false,
    async execute (bot, message, args, option, commands, prefix) {
        const singleCmdName = [];
        const singleCmdDesc = [];
        const singleCmdUsage = [];
        commands.map(command => {
            singleCmdName.push(command.name);
            singleCmdDesc.push(command.description);
            singleCmdUsage.push(command.usage);
        });
        const dataName = [];
        const dataUsage = [];
        const dataDesc = [];
        dataName.push(commands.map(command => `\`${command.name}\` >> ${command.usage}`).join('\n'));
        dataDesc.push(commands.map(command => `\`${command.name}\` >> ${command.description}`).join('\n'));
        const rows = await bot.db.query(`select * from botStats`).catch(err => errorLogs.send(err));
        //#region Working code 
        let expireTime = 45000;
        let embedExpireTime = Math.floor((Date.now()+expireTime)/1000);
        //#region Embeds
        const helpEmbed = new MessageEmbed()
            .setColor('GREY')
            .setAuthor('Select a button')
            .addField('Expires in', `<t:${embedExpireTime}:R> at <t:${embedExpireTime}:T>`, true)
            .addField('Button - Help', 'Brings you back to this embed.')
            .addField('Button - Commands', 'Lets you view individual commands')
            .addField('Button - Information', 'Lets you view bot information')
            //.setDescription('1. **Button `Help`** - Brings you back to this embed.\n2. **Button `Commands`** - Lets you view individual commands\n3. **Button `Information`** - Lets you view bot information');
        const cmdsEmbed = new MessageEmbed()
            .setColor('GREY')
            .setAuthor('Commands & Usages')
            .setDescription(dataName.toString());
        const descEmbed = new MessageEmbed()
            .setColor('GREY')
            .setAuthor('Descriptions')
            .setDescription(dataDesc.toString());
        const infoEmbed = new MessageEmbed()
            .setColor('GREY')
            .setAuthor('Bot information')
            .addField('Expires in', `<t:${embedExpireTime}:R> at <t:${embedExpireTime}:T>`, true)
            .addField('Devs', `${bot.owner.tag}`, true)
            .addField('Links', '[Invite Link](https://discordapp.com/oauth2/authorize?client_id=615263043001122817&scope=bot&permissions=1342205136)\n[Support Server](https://discord.gg/AThmedm)\n[Github Repository](https://github.com/Kimochii-x3/FutatsuLollies_DJS/tree/djs-13.2.0)', true)
            .setDescription(`${rows[0].info}`);
        // const interactionButtons = new MessageActionRow()
        // .addComponents(
        //     new MessageButton()
        //     .setCustomId('help')
        //     .setLabel('Help')
        //     .setStyle('PRIMARY')
        //     .setDisabled(true),
        //     new MessageButton()
        //     .setCustomId('cmds')
        //     .setLabel('Commands')
        //     .setStyle('PRIMARY')
        //     .setDisabled(false),
        //     new MessageButton()
        //     .setCustomId('desc')
        //     .setLabel('Description')
        //     .setStyle('PRIMARY')
        //     .setDisabled(false),
        //     new MessageButton()
        //     .setCustomId('info')
        //     .setLabel('Information')
        //     .setStyle('PRIMARY')
        //     .setDisabled(false),
        // );
        //#endregion
        // const filter = (interaction) => (interaction.customId === 'help' || interaction.customId === 'cmds' || interaction.customId === 'desc' || interaction.customId === 'info') && interaction.user.id === message.author.id;
        
        // message.channel.send({embeds: [helpEmbed], components: [interactionButtons]}).then(botMsg => changeEmbed(botMsg)).catch(bot.errHandle);
        
        
        //#region func changeEmbed
        // async function changeEmbed(botMsg) {
        //     //console.log(botMsg);
        //     await botMsg.awaitMessageComponent({filter, time: 30000, errors: ['time']}).then(async interaction => {
        //         // console.log(interaction);
        //         if (interaction.customId === 'help') {
        //             const latestEmbed = botMsg.embeds[0];
        //             await interactionButtons.components.forEach(button => {
        //                 if (button.customId === 'cmds' || button.customId === 'desc' || button.customId === 'info') {
        //                     button.disabled = false;
        //                 } else {
        //                     button.disabled = true;
        //                 }
        //             });
        //             interaction.deferUpdate();
        //             return botMsg.edit({embeds: [helpEmbed], components: [interactionButtons]}).then(botMsg => changeEmbed(botMsg).catch(bot.errHandle));
        //         } else if (interaction.customId === 'cmds') {
        //             const latestEmbed = botMsg.embeds[0];
        //             await interactionButtons.components.forEach(button => {
        //                 if (button.customId === 'help' || button.customId === 'desc' || button.customId === 'info') {
        //                     button.disabled = false;
        //                 } else {
        //                     button.disabled = true;
        //                 }
        //             });
        //             interaction.deferUpdate();
        //             return botMsg.edit({embeds: [cmdsEmbed], components: [interactionButtons]}).then(botMsg => changeEmbed(botMsg).catch(bot.errHandle));
        //         } else if (interaction.customId === 'desc') {
        //             const latestEmbed = botMsg.embeds[0];
        //             await interactionButtons.components.forEach(button => {
        //                 if (button.customId === 'cmds' || button.customId === 'help' || button.customId === 'info') {
        //                     button.disabled = false;
        //                 } else {
        //                     button.disabled = true;
        //                 }
        //             });
        //             interaction.deferUpdate();
        //             return botMsg.edit({embeds: [descEmbed], components: [interactionButtons]}).then(botMsg => changeEmbed(botMsg).catch(bot.errHandle));
        //         } else if (interaction.customId === 'info') {
        //             const latestEmbed = botMsg.embeds[0];
        //             await interactionButtons.components.forEach(button => {
        //                 if (button.customId === 'cmds' || button.customId === 'desc' || button.customId === 'help') {
        //                     button.disabled = false;
        //                 } else {
        //                     button.disabled = true;
        //                 }
        //             });
        //             interaction.deferUpdate();
        //             return botMsg.edit({embeds: [infoEmbed], components: [interactionButtons]}).then(botMsg => changeEmbed(botMsg).catch(bot.errHandle));
        //         }
        //     }).catch(err => {
        //         console.log(err);
        //         const latestEmbed = botMsg.embeds[0];
        //         const timeOut = new MessageEmbed(latestEmbed)
        //         .setTitle('Time')
        //         .setDescription('Wait time ended');
        //         botMsg.edit({embeds: [timeOut], components:[]}).catch(bot.errHandle);
        //     })
        // }
        //#endregion
        //#endregion
        




        //#region Test code
        // setInterval(() => {
        //     console.log(Date.now());
        // }, 1000);
        let commandIndex = 0;
        // setInterval(() => {
        //     console.log(commandIndex);
        // }, 1000);
        const cmdEmbedDefault = new MessageEmbed()
        const interactionButtonsDefault = new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setCustomId('help')
            .setLabel('Help')
            .setStyle('SECONDARY')
            .setDisabled(true),
            new MessageButton()
            .setCustomId('prev')
            .setLabel('⫷')
            .setStyle('PRIMARY')
            .setDisabled(true),
            new MessageButton()
            .setCustomId('cmds')
            .setLabel('Commands')
            .setStyle('PRIMARY')
            .setDisabled(false),
            new MessageButton()
            .setCustomId('next')
            .setLabel('⫸')
            .setStyle('PRIMARY')
            .setDisabled(true),
            new MessageButton()
            .setCustomId('info')
            .setLabel('Information')
            .setStyle('PRIMARY')
            .setDisabled(false),
        );
        const interactionMenuDefault = new MessageActionRow()
        .addComponents(
            new MessageSelectMenu()
            .setCustomId('selection')
            .setPlaceholder('Select a command')
        );
        singleCmdName.forEach(cmd => {
            interactionMenuDefault.components[0].addOptions([{
                label: cmd,
                value: cmd,
            }]);
        });
        await new Promise(wait => setTimeout(wait, 500));
        // console.log(interactionMenuDefault.components[0]);    
        const interactionButtons = new MessageActionRow(interactionButtonsDefault);
        const interactionMenu = new MessageActionRow(interactionMenuDefault);

        const filter = (interaction) => (interaction.customId === 'help' || interaction.customId === 'cmds' || interaction.customId === 'prev' || interaction.customId === 'next' || interaction.customId === 'info' || interaction.customId === 'selection') && (interaction.user.id === message.author.id || interaction.user.id === bot.owner.id || interaction.user.id === bot.maintainer.id);
        
        await interactionButtons.components.splice(1, 1);
        await interactionButtons.components.splice(2, 1);

        message.channel.send({embeds: [helpEmbed], components: [interactionButtons]}).then(botMsg => changeEmbed(botMsg)).catch(bot.errHandle);
        async function changeEmbed(botMsg) {
            embedExpireTime = Math.floor((Date.now()+expireTime)/1000);
            await botMsg.awaitMessageComponent({filter, time: expireTime, errors: ['time']}).then(async interaction => {
                
                if (interaction.customId === 'help') {
                    if (interactionButtons.components.length >= 4) {
                        await interactionButtons.components.splice(1, 1);
                        await interactionButtons.components.splice(2, 1);
                    }
                    await interactionButtons.components.forEach(button => {
                        if (button.customId === 'cmds' || button.customId === 'info') {
                            button.disabled = false;
                            button.style = 'PRIMARY';
                        } else {
                            button.disabled = true;
                            button.style = 'SECONDARY';
                        }
                    });
                    await interaction.deferUpdate();
                    return botMsg.edit({embeds: [helpEmbed], components: [interactionButtons]}).then(botMsg => changeEmbed(botMsg).catch(bot.errHandle));
                } else if (interaction.customId === 'cmds') {
                    const cmdEmbed = new MessageEmbed(cmdEmbedDefault)
                        .addField('Expires in', `<t:${embedExpireTime}:R> at <t:${embedExpireTime}:T>`, true)
                        .addField('Command', singleCmdName[commandIndex].toString().toUpperCase())
                        .addField('Description', singleCmdDesc[commandIndex].toString())
                        .addField('Usage', singleCmdUsage[commandIndex].toString())
                        .setFooter(`You are viewing command ${commandIndex+1}/${singleCmdName.length}`);
                    await interactionButtons.components.splice(1, 0, interactionButtonsDefault.components[1]);
                    await interactionButtons.components.splice(3, 0, interactionButtonsDefault.components[3]);
                    await interactionButtons.components.forEach(button => {
                        if (button.customId === 'help' || button.customId === 'prev' || button.customId === 'next' || button.customId === 'info') {
                            button.disabled = false;
                            button.style = 'PRIMARY';
                        } else {
                            button.disabled = true;
                            button.style = 'SECONDARY';
                        }
                    });
                    await interaction.deferUpdate();
                    return botMsg.edit({embeds: [cmdEmbed], components: [interactionButtons, interactionMenu]}).then(botMsg => changeEmbed(botMsg).catch(bot.errHandle));
                } else if (interaction.customId === 'prev') {
                    if (commandIndex <= 0) {
                        commandIndex = singleCmdName.length;
                    }
                    commandIndex--;
                    const cmdEmbed = new MessageEmbed(cmdEmbedDefault)
                        .addField('Expires in', `<t:${embedExpireTime}:R> at <t:${embedExpireTime}:T>`, true)
                        .addField('Command', singleCmdName[commandIndex].toString().toUpperCase())
                        .addField('Description', singleCmdDesc[commandIndex].toString())
                        .addField('Usage', singleCmdUsage[commandIndex].toString())
                        .setFooter(`You are viewing command ${commandIndex+1}/${singleCmdName.length}`);
                    await interactionButtons.components.forEach(button => {
                        if (button.customId === 'help' || button.customId === 'prev' || button.customId === 'next' || button.customId === 'info') {
                            button.disabled = false;
                            button.style = 'PRIMARY';
                        } else {
                            button.disabled = true;
                            button.style = 'SECONDARY';
                        }
                    });
                    await interaction.deferUpdate();
                    return botMsg.edit({embeds: [cmdEmbed], components: [interactionButtons, interactionMenu]}).then(botMsg => changeEmbed(botMsg).catch(bot.errHandle));
                } else if (interaction.customId === 'next') {
                    commandIndex++;
                    if (commandIndex > singleCmdName.length - 1) {
                        commandIndex = 0;
                    }
                    const cmdEmbed = new MessageEmbed(cmdEmbedDefault)
                        .addField('Expires in', `<t:${embedExpireTime}:R> at <t:${embedExpireTime}:T>`, true)
                        .addField('Command', singleCmdName[commandIndex].toString().toUpperCase())
                        .addField('Description', singleCmdDesc[commandIndex].toString())
                        .addField('Usage', singleCmdUsage[commandIndex].toString())
                        .setFooter(`You are viewing command ${commandIndex+1}/${singleCmdName.length}`);
                    await interactionButtons.components.forEach(button => {
                        if (button.customId === 'help' || button.customId === 'prev' || button.customId === 'next' || button.customId === 'info') {
                            button.disabled = false;
                            button.style = 'PRIMARY';
                        } else {
                            button.disabled = true;
                            button.style = 'SECONDARY';
                        }
                    });
                    await interaction.deferUpdate();
                    return botMsg.edit({embeds: [cmdEmbed], components: [interactionButtons, interactionMenu]}).then(botMsg => changeEmbed(botMsg).catch(bot.errHandle));
                } else if (interaction.customId === 'info') {
                    if (interactionButtons.components.length >= 4) {
                        await interactionButtons.components.splice(1, 1);
                        await interactionButtons.components.splice(2, 1);
                    }
                    await interactionButtons.components.forEach(button => {
                        if (button.customId === 'cmds' || button.customId === 'help') {
                            button.disabled = false;
                            button.style = 'PRIMARY';
                        } else {
                            button.disabled = true;
                            button.style = 'SECONDARY';
                        }
                    });
                    await interaction.deferUpdate();
                    return botMsg.edit({embeds: [infoEmbed], components: [interactionButtons]}).then(botMsg => changeEmbed(botMsg).catch(bot.errHandle));
                } else if (interaction.customId === 'selection') {
                    commandIndex = singleCmdName.indexOf(interaction.values[0]);
                    const cmdEmbed = new MessageEmbed(cmdEmbedDefault)
                        .addField('Expires in', `<t:${embedExpireTime}:R> at <t:${embedExpireTime}:T>`, true)
                        .addField('Command', singleCmdName[commandIndex].toString().toUpperCase())
                        .addField('Description', singleCmdDesc[commandIndex].toString())
                        .addField('Usage', singleCmdUsage[commandIndex].toString())
                        .setFooter(`You are viewing command ${commandIndex+1}/${singleCmdName.length}`);
                    // await interactionButtons.components.forEach(button => {
                    //     if (button.customId === 'cmds' || button.customId === 'help') {
                    //         button.disabled = false;
                    //         button.style = 'PRIMARY';
                    //     } else {
                    //         button.disabled = true;
                    //         button.style = 'SECONDARY';
                    //     }
                    // });
                    await interaction.deferUpdate();
                    return botMsg.edit({embeds: [cmdEmbed], components: [interactionButtons, interactionMenu]}).then(botMsg => changeEmbed(botMsg).catch(bot.errHandle));
                }
            }).catch(async err => {
                //console.log(err);
                const latestEmbed = botMsg.embeds[0];
                const timeOut = new MessageEmbed(latestEmbed)
                .spliceFields(0, 1, [{name: 'Expired', value: `<t:${embedExpireTime}:R> at <t:${embedExpireTime}:T>`, inline: true}]);
                await interactionButtons.components.forEach(button => {
                    button.disabled = true;
                    button.style = 'SECONDARY'
                });
                await interactionMenu.components.forEach(menu => {
                    menu.disabled = true;
                });
                botMsg.edit({embeds: [timeOut], components:[interactionButtons, interactionMenu]}).catch(bot.errHandle);
            })
        }
        //#endregion
        
        
        
        
        
        
        //#region Possible remove?
        // if (args[0] === 'cmds') {
        //     const cmdsEmbed = new MessageEmbed()
        //     .setColor('GREY')
        //     .setAuthor('Commands & Usages:')
        //     .setDescription(dataName.toString());
        //     return message.channel.send({embeds: [cmdsEmbed]}).catch(bot.errHandle);
        // } else if (args[0] === 'desc') {
        //     const descEmbed = new MessageEmbed()
        //     .setColor('GREY')
        //     .setAuthor('Descriptions:')
        //     .setDescription(dataDesc.toString());
        //     return message.channel.send({embeds: [descEmbed]}).catch(bot.errHandle);
        // } else if (args[0] === 'info') {
        //     const rows = await bot.db.query(`select * from botStats`).catch(err => errorLogs.send(err));
        //     const infoEmbed = new MessageEmbed()
        //     .setColor('GREY')
        //     .setAuthor('Bot info:')
        //     .setDescription(`${rows[0].info}\nDev: ${bot.owner.tag}\n[Invite Link](https://discordapp.com/oauth2/authorize?client_id=615263043001122817&scope=bot&permissions=1342205136)\n[Support server link](https://discord.gg/AThmedm)\n[Github Repository](https://github.com/Kimochii-x3/FutatsuLollies_DJS-12.5.0)`);
        //     return message.channel.send({embeds: [infoEmbed]}).catch(bot.errHandle);
        // } else if(!args[0]) {
        //     const helpEmbed = new MessageEmbed()
        //     .setColor('GREY')
        //     .setAuthor('There are 3 options for the help command; Example usage: fl.help cmds')
        //     .setDescription('1. **`cmds`** provides the command name list and usages\n2. **`desc`** provides command name list followed by description for each command and explains what it does\n3. **`info`** provides information about the bot');
        //     return message.channel.send({embeds: [helpEmbed]}).catch(bot.errHandle);
        // }
        //#endregion
    },
};
