const Command = require('../../Handlers/Command.js')
const Discord = require("discord.js")
const guildConfig = require('../../config/models/guildConfig.js')
const colour = require("../../config/assets/Json/colours.json")
module.exports = new Command({
    name: "welcomechannel",
    description: "Set the welcome channel.",
    userPermissions: ["MANAGE_GUILD"],
    botPermissions: "SEND_MESSAGES",
    cooldown: 10000,
    type: "Text",
    async run(message, args, client) {
        const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1])
        const SuccessEmbed = new Discord.MessageEmbed()
        .setColor(colour.lightish_blue)
        .setTitle("Successfully set the Welcome Channel. ")
        .setDescription(`**${message.author.username}** You have set the welcome channel!`)
        .addField("Welcome Channel:", `<#${channel.id}>`)

        const UpdatedEmbed = new Discord.MessageEmbed()
        .setColor(colour.lightish_blue)
        .setTitle("Successfully updated the Welcome Channel. ")
        .setDescription(`**${message.author.username}** You have updated the welcome channel!`)
        .addField("Welcome Channel:", `<#${channel.id}>`)
        const row = new Discord.MessageActionRow()
        .addComponents(
            new Discord.MessageButton()
            .setLabel("Success")
            .setCustomId("Succes")
            .setStyle("PRIMARY")
            .setDisabled(true)
            .setEmoji("916869194400796772")
        )

        const Nochannel = new Discord.MessageEmbed()
        .setColor("RED")
        .setDescription("Please mention the channel to set the welcome channel as!")
        .setTitle(":x: MISSING ARGUEMENT!")
        if (!channel) return message.reply({embeds: [Nochannel]})
    
        const data = await guildConfig.findOne({ guildId: message.guild.id }) 
    
        if (!data) {
            try {
                const data1 = await guildConfig.create({
                    guildId: message.guild.id
                })

                await data1.updateOne({ welcomeChannel: channel.id })
                return message.reply({ embeds: [SuccessEmbed], components: [row], allowedMentions: {repliedUser: false} })
            } catch (error) {
                console.log(error)
            }
        } else if (data) {
            await data.updateOne({ welcomeChannel: channel.id })
            return message.reply({ embeds: [UpdatedEmbed], components: [row], allowedMentions: {repliedUser: false} })
        }
    }
})   