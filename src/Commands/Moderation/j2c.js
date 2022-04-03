const Command = require('../../Handlers/Command.js')
const Discord = require('discord.js')
const db = require("../../config/models/vc")
module.exports = new Command({

    name: 'set-vc',
    description: 'set the join2create vc channel (slash cmd)',
    type: 'Slash',
    userPermissions: 'MANAGE_GUILD',
    botPermissions: 'SEND_MESSAGES',
    slashCommandOptions: [{
             name: 'channel',
            description: 'The vc to set.',
            type: 'CHANNEL',
            channelTypes: ['GUILD_VOICE'],
            required: true
}],

    async run(interaction, args, client) {

        const channel = interaction.options.getChannel('channel')

        const SuccessEmbed = new Discord.MessageEmbed()
        .setColor(colour.lightish_blue)
        .setTitle("Successfully set the j2c Channel. ")
        .setDescription(`**${message.author.username}** You have set the j2c channel!`)
        .addField("j2c Channel:", `<#${channel.id}>`)

        const UpdatedEmbed = new Discord.MessageEmbed()
        .setColor(colour.lightish_blue)
        .setTitle("Successfully updated the j2c Channel. ")
        .setDescription(`**${message.author.username}** You have updated the j2c channel!`)
        .addField("j2c Channel:", `<#${channel.id}>`)
        const row = new Discord.MessageActionRow()
        .addComponents(
            new Discord.MessageButton()
            .setLabel("Success")
            .setCustomId("Succes")
            .setStyle("PRIMARY")
            .setDisabled(true)
            .setEmoji("916869194400796772")
        )


        const data = await db.findOne({Guild: interaction.guild.id})
        if (!data) {
            await db.create({Guild: interaction.guild.id, Channel: channel.id})
            return interaction.followUp({embeds: [SuccessEmbed], components: [row]})
        } else {
            await db.findOneAndUpdate({Guild: interaction.guild.id}, {Channel: channel.id})
            return interaction.followUp({embeds: [UpdatedEmbed], components: [row]})
        }
    }
})
