const Discord = require("discord.js")
const Event = require('../../Handlers/Event.js')
const starCount = "2"; 
module.exports = new Event("messageReactionAdd", async (client, reaction) => {
    const guildConfig = require('../../config/models/guildConfig.js')
    const data = await guildConfig.findOne({guildId: reaction.message.guild.id})
    if (!data) return;
    const SBchannelId = reaction.message.guild.channels.cache.find(c => c.id === data.starboardChannel)
    if (!SBchannelId) return;
    
    const msgs = await SBchannelId.messages.fetch({ limit: 100 });

    if (reaction.message.partial) {
        try {
            await reaction.message.fetch();
        } catch (error) {
            console.error('Something went wrong when fetching the message: ', error);
        }
    }

    if (reaction.message.channel.type === "DM") return;
    if (reaction.emoji.name !== "⭐") return;
    if (reaction.emoji.name === "⭐") {

        const SentMessage = msgs.find(msg =>
            msg.embeds.length === 1 ?
                (msg.embeds[0].footer.text.endsWith(reaction.message.channel.name) ? true : false) : false)


        if (SentMessage) {

            if (reaction.count >= starCount) {

                await SentMessage.edit(`:star: **${reaction.count}** ● ${reaction.message.channel}`);

            } else {

                await SentMessage?.delete()

            }
        } else {
            return;
        }
    }

})
