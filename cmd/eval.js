module.exports = {
    name: 'eval',
    description: 'Evaluate code',
    usage: 'fl.eval <input>',
    cd: 0,
    guildOnly: false,
    args: true,
    async execute(bot, message, args, option, commands, prefix) {
        if (message.author.id === (bot.owner.id || bot.maintainer.id)) {
            let output;

            try {
                output = eval(args.slice(1).join(" "));
            } catch (error) {
                message.channel.send({embed: {
                    title: "Eval Error",
                    color: "#c4150f",
                    fields: [
                        {
                            name: "Error", value: `Message: ${error.message}\nType: ${error.type}`
                        }
                    ]
                }})
                return;
            }

            if (output instanceof Promise) {
                output = await output
            } 

            message.channel.send({embed: {
                title: "Eval",
                color: "#c4150f",
                fields: [
                    {
                        name: "Input 📥", value: `\`\`\`js\n${args.slice(1).join(" ")}\n\`\`\``
                    },
                    {
                        name: "Output 📤", value: `\`\`\`js\n${output}\n\`\`\``
                    },
                    {
                        name: "Type", value: `\`${typeof output}\``
                    }
                ]
            }})
        } else return
    }
}