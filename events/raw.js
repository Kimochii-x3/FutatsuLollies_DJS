module.exports = async (client, packet) => {
    if (packet.t === "MESSAGE_DELETE") {
        let message = await client.messages.fetch(packet.d.id);
        console.log(message.embds)
    }
}