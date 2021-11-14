const { ClientUser } = require("discord.js");

/**
 * 
 * @param {ClientUser} client 
 * @param {*} packet 
 */
module.exports = async (client, packet) => {
    if (packet.t === "MESSAGE_DELETE") {
        // let message = await client.messages.fetch(packet.d.id);
        console.log(client)
    }
}