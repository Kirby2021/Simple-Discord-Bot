
const {Collection} = require('discord.js')
const voiceCollection = new Collection()
const db = require("../../config/models/vc")
const Event = require('../../Handlers/Event.js')
module.exports = new Event("voiceStateUpdate", async (client, oldState, newState) => { 
    const user = await client.users.fetch(newState.id)
    const member = newState.guild.members.cache.get(user.id)
    const data = await db.findOne({Guild: oldState.guild.id})
    if (!data) return

    if (!oldState.channel && newState.channel.id === data.Channel) {
        const channel = await newState.guild.channels.create(user.tag, {
            type: 'GUILD_VOICE',
            parent: newState.channel.parent,

        })
        member.voice.setChannel(channel)
        voiceCollection.set(user.id, channel.id)
    } else if (!newState.channel) {
        if (oldState.channelId === voiceCollection.get(newState.id)) return oldState.channel.delete()
    }
})
