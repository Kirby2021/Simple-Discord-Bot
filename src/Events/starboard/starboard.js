const Discord = require("discord.js")
const Event = require('../../Handlers/Event.js')
const starCount = "2"; 
module.exports = new Event("messageReactionAdd", async (client, reaction) => {
    const guildConfig = require('../../config/models/guildConfig.js')
    const data = await guildConfig.findOne({guildId: reaction.message.guild.id})
    if (!data) return;
    const SBchannelId = reaction.message.guild.channels.cache.find(c => c.id === data.starboardChannel)
    if (!SBchannelId) return;
    
    if (reaction.message.channel.type === "DM") return;
    if (reaction.message.channel.id === SBchannelId && reaction.message.author.id === `${client.user.id}`) return;
    if (reaction.emoji.name === "⭐") {
    if(reaction.count < starCount) return;

        const msgs = await SBchannelId.messages.fetch({ limit: 100 });

        const SentMessage = msgs.find(msg =>
            msg.embeds.length === 1 ?
                (msg.embeds[0].footer.text.endsWith(reaction.message.channel.name) ? true : false) : false)
                if (SentMessage) {

                    return SentMessage.edit(`:star: **${reaction.count}** ● ${reaction.message.channel}`);
    
                } else {
    
                    const Starboardembed = new Discord.MessageEmbed()
                    .setAuthor({ name: `${reaction.message.author.tag}`, iconURL: `${reaction.message.guild.iconURL({ dynamic: true })}`})
                    .addField("Content", ` > ${reaction.message.content ? `${reaction.message.content}` : `No content`}`, false)
                    .addField("Message Link:", `**[Jump!](https://discord.com/channels/${reaction.message.guildId}/${reaction.message.channel.id}/${reaction.message.id})**`, false)
                    .setFooter({ text: `${reaction.message.guild.name} ║ #${reaction.message.channel.name}`})
                    .setThumbnail(`${reaction.message.author.displayAvatarURL({ dynamic: true })}`)
                    .setImage(reaction.message.attachments.first()?.proxyURL || null)
                    .setColor("#FCCBDF")
    
                    await SBchannelId.send({ content: `:star: **${reaction.count}** ● ${reaction.message.channel}`, embeds: [Starboardembed]})
    
                }  
        }
            }
                )