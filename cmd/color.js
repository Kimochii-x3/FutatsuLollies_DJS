const {Util, MessageEmbed, MessageActionRow, MessageButton} = require('discord.js');
// color command used to create a custom role color based on hex bot's color command, however it doesn't use external functions like hex bot does
module.exports = {
    name: 'color',
    description: 'creates a color role for yourself, works only with servers that have roles with the "default" color, also if the creator of the role leaves the server, the role (if it exists) will be deleted; fl.color @<someone> is to get their highest role color',
    usage: 'fl.color <Basic Color Name>/<Hex Code>/<RGB Number> / fl.color @<someone>',
    cd: 0,
    guildOnly: true,
    args: false,
    async execute (bot, message, args, option, commands, prefix) {
        // checks for perms before carrying on with command execution
        const botPerms = message.guild.me.permissions.has(['SEND_MESSAGES', 'MANAGE_ROLES', 'EMBED_LINKS', 'ADD_REACTIONS'], {checkAdmin: true});
        if (!botPerms) {
            return message.channel.send('I do not have one or more of these permissions: `Send Messages; Manage Roles; Embed Links; Add Reactions;` to my role `FutatsuLollies`').catch(bot.errHandle);
        } else {
            // after finding that placeholder role exists it has some definitions before carrying on with code, sets up preview embedded message too, then it has basic checks to see if hexCode would be someone mentioned and all that, most of the code after this is just copy paste
            function colorChanger() {
                const hexCode = args.reduce((c, e) => c += "_" + e);
                const idOthers = message.mentions.members.first();
                const roleColor = message.guild.roles.cache.find(r => r.name === `USER-${message.author.id}`);
                const placeholder = message.guild.roles.cache.find(r => r.name === '▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇');
                const errEmbed = new MessageEmbed()
                .setDescription(`I was unable to resolve the color, acceptable formats are:\n
                1. R,G,B Number - 0 to 255, 0 to 255, 0 to 255 **>>** 191,61,87\n
                2. Hex Code - containing 6 chars (from 0 to 9 and from a to f) **>>** f47fff\n
                3. Text Name - one of the following (has to be as it is written):\n
                default; white; aqua; green; blue; yellow; purple; luminous vivid pink; fuchsia; gold; orange; red; grey;\n
                navy; dark aqua; dark green; dark blue; dark purple; dark vivid pink; dark gold; dark orange; dark red;\n
                dark grey; darker grey; light grey; dark navy; blurple; greyple; dark but not black; not quite black; random;`)
                .setColor(message.member.displayHexColor);
                const rolePreview = new MessageEmbed()
                .setDescription(`**Your role will look like this: \n${placeholder}\n${placeholder}\n${placeholder}\nDo you want to change your color?**`)
                .setColor(message.member.displayHexColor);
                const rolePreviewButtons = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                    .setCustomId('yes')
                    .setLabel('Yes')
                    .setStyle('PRIMARY'),
                    new MessageButton()
                    .setCustomId('no')
                    .setLabel('No')
                    .setStyle('PRIMARY'),
                );
                if (!idOthers) {
                    if (!roleColor) {
                        if (!hexCode) {
                            return message.channel.send('No role found').catch(bot.errHandle);
                        } else if (hexCode) {
                            try {
                                Util.resolveColor(hexCode.toUpperCase());
                                placeholder.setColor(hexCode.toUpperCase()).then(async placeholderRole => {
                                    const filter = (interaction) => (interaction.customId === 'yes' || interaction.customId === 'no') && interaction.user.id === message.author.id;
                                    message.channel.send({embeds: [rolePreview], components: [rolePreviewButtons]}).then(async botMsg => {
                                        await botMsg.awaitMessageComponent({filter, time: 12000, errors: ['time'] }).then(async interaction => {
                                            if (interaction.customId === 'yes') {
                                                const latestEmbed = botMsg.embeds[0];
                                                const acceptEmbed = new MessageEmbed(latestEmbed)
                                                .setDescription('**Role set**')
                                                .setColor(message.member.displayHexColor);
                                                message.guild.roles.create({name: `USER-${message.author.id}`, color: hexCode.toUpperCase(), position: placeholder.position +1, permissions: [], reason: 'User requested role thru a command'}).then(async userRole => {
                                                    message.member.roles.add(userRole, 'Adding the custom color role to the requester');
                                                    botMsg.edit({embeds: [acceptEmbed], components: []}).catch(bot.errHandle);/*.then(async botMsgDelete => { setTimeout(() => {
                                                        botMsgDelete.delete().catch(bot.errHandle); });
                                                    }, 12_000);*/
                                                });
                                            } else if (interaction.customId === 'no') {
                                                const latestEmbed = botMsg.embeds[0];
                                                const cancelEmbed = new MessageEmbed(latestEmbed)
                                                .setDescription('**Cancelled**')
                                                .setColor(message.member.displayHexColor);
                                                botMsg.edit({embeds: [cancelEmbed], components: []}).catch(bot.errHandle);/*.then(async botMsgDelete => { setTimeout(() => {
                                                    botMsgDelete.delete().catch(bot.errHandle); });
                                                }, 12_000);*/
                                            }
                                        }).catch(err => {
                                            console.log(err);
                                            const latestEmbed = botMsg.embeds[0];
                                            const noResponseEmbed = new MessageEmbed(latestEmbed)
                                            .setDescription('**Times Up**')
                                            .setColor(botMsg.member.displayHexColor);
                                            botMsg.edit({embeds: [noResponseEmbed], components: []}).catch(bot.errHandle);/*.then(async botMsgDelete => { setTimeout(() => {
                                                botMsgDelete.delete().catch(bot.errHandle); });
                                            }, 12_000);*/
                                        });
                                    }).catch(bot.errHandle);
                                }).catch(bot.errHandle);
                            } catch (error) {
                                console.log(error);
                                return message.channel.send({embeds: [errEmbed]}).catch(bot.errHandle);
                            }
                        }
                    } else {
                        if (!hexCode) {
                            return message.channel.send(`Your role hex code is: ${roleColor.hexColor}`).catch(bot.errHandle);
                        } else if (hexCode.toLowerCase() === 'remove') {
                            roleColor.delete('User requested to delete their custom role').catch(bot.errHandle);
                            return message.channel.send(`${roleColor} was deleted`).catch(bot.errHandle);
                        } else if (hexCode) {
                            try {
                                Util.resolveColor(hexCode.toUpperCase());
                                placeholder.setColor(hexCode.toUpperCase()).then( async placeholderRole => {
                                    const filter = (interaction) => (interaction.customId === 'yes' || interaction.customId === 'no') && interaction.user.id === message.author.id;
                                    message.channel.send({embeds: [rolePreview], components: [rolePreviewButtons]}).then(async botMsg => {
                                        await botMsg.awaitMessageComponent({filter, time: 12_000, errors: ['time'] }).then(async interaction => {
                                            if (interaction.customId === 'yes') {
                                                const latestEmbed = botMsg.embeds[0];
                                                const acceptEmbed = new MessageEmbed(latestEmbed)
                                                .setDescription('**Role Updated**')
                                                .setColor(message.member.displayHexColor);
                                                roleColor.setColor(hexCode.toUpperCase()).catch(bot.errHandle);
                                                botMsg.edit({embeds: [acceptEmbed], components: []}).catch(bot.errHandle);/*.then(async botMsgDelete => { setTimeout(() => {
                                                    botMsgDelete.delete().catch(bot.errHandle); });
                                                }, 12_000);*/
                                            } else if (interaction.customId === 'no') {
                                                const latestEmbed = botMsg.embeds[0];
                                                const cancelEmbed = new MessageEmbed(latestEmbed)
                                                .setDescription('**Cancelled**')
                                                .setColor(message.member.displayHexColor);
                                                botMsg.edit({embeds: [cancelEmbed], components: []}).catch(bot.errHandle);/*.then(async botMsgDelete => { setTimeout(() => {
                                                    botMsgDelete.delete().catch(bot.errHandle); });
                                                }, 12_000);*/
                                            }
                                        }).catch(err => {
                                            console.log(err);
                                            const latestEmbed = botMsg.embeds[0];
                                            const noResponseEmbed = new MessageEmbed(latestEmbed)
                                            .setDescription('**Times Up**')
                                            .setColor(botMsg.member.displayHexColor);
                                            botMsg.edit({embeds: [noResponseEmbed], components: []}).catch(bot.errHandle);/*.then(async botMsgDelete => { setTimeout(() => {
                                                botMsgDelete.delete().catch(bot.errHandle); });
                                            }, 12_000);*/
                                        });
                                    }).catch(bot.errHandle);
                                }).catch(bot.errHandle);
                            } catch (error) {
                                console.log(error);
                                return message.channel.send({embeds: [errEmbed]}).catch(bot.errHandle);
                            }
                        }
                    }
                } else {
                    if (hexCode === idOthers) { // this could definitely be different lmao like just hexCode === idOthers :omegalul: - finally done?
                        const roleColorOthers = message.guild.roles.cache.find(role => role.name === `USER-${idOthers.id}`);
                        if (!roleColorOthers) {
                            return message.channel.send(`No user role found, however the highest role's hexcode is: ${idOthers.displayHexColor}`).catch(bot.errHandle);
                        } else if (roleColorOthers) {
                            return message.channel.send(`User role hexcode is: ${roleColorOthers.hexColor}`).catch(bot.errHandle);
                        }
                    }
                }
            }
            // after finding perms, it checks if a placeholder role used to preview role colors exists, if not i'll try to create it, else it'll carry on with code
            const phC = message.guild.roles.cache.find(r => r.name === '▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇');
            if (!phC) {
                message.guild.roles.create({ name: '▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇', reason: 'Creating a placeholder role to preview the colors',}).catch(bot.errHandle);
                return colorChanger();
            } else {
                return colorChanger();
            }
        }
    },
};
