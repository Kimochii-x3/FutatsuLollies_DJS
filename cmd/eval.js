let expandEval = require("util").inspect;
let { shorten } = require("string-toolkit");

module.exports = {
    name: 'eval',
    description: 'Evaluate code',
    usage: 'fl.eval <input>',
    cd: 0,
    guildOnly: false,
    args: true,
    async execute(bot, message, args, option, commands, prefix) {
        if (message.author.id === bot.owner.id || message.author.id === bot.maintainer.id) {
            let output;

            try {
                output = expandEval(eval(args.join(" ")));
            } catch (error) {
                message.channel.send({
                    embeds: [{
                        title: "Eval Error",
                        color: 0xc4150f,
                        fields: [
                            {
                                name: "Error", value: `**Message:**\t\`${error.message}\`\n**Type:**\t\`${error.type}\``
                            }
                        ]
                    }]
                }).catch(bot.errHandle)
                return;
            }

            if (output instanceof Promise) {
                output = await output
            }

            message.channel.send({
                embeds: [{
                    title: "Eval",
                    color: 0xc4150f,
                    fields: [
                        {
                            name: "Input 📥", value: `\`\`\`js\n${args.join(" ")}\n\`\`\``
                        },
                        {
                            name: "Output 📤", value: `\`\`\`js\n${shorten(output, 990, "\n\n...output longer than 1024")}\n\`\`\``
                        },
                        {
                            name: "Type", value: `\`${typeof output}\``
                        }
                    ]
                }]
            }).catch(bot.errHandle)
        } else return
    }
}