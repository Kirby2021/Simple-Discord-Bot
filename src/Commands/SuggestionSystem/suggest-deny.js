const Command = require('../../Handlers/Command.js')
const Discord = require('discord.js')
const emotes = require('../../config/assets/Json/emotes.json')
const colour = require('../../config/assets/Json/colours.json')
const guildConfig = require('../../config/models/guildConfig')
module.exports = new Command({

    name: 'deny',
    aliases: ['deny-suggestion', 'denysuggestion', 'reject', 'rejectsuggestion', 'reject-suggestion', "decline"], 
    description: "Deny A Suggestion",
 type: "Text",
    userPermissions: 'MANAGE_GUILD',
    botPermissions: 'ADMINISTRATOR',
    cooldown: 4000,
    nsfw: false,

    async run(message, args, client) {

    
        const data = await guildConfig.findOne({guildId: message.guild.id})
        const channel = message.guild.channels.cache.find(c => c.id === data.suggestionChannel)

        let SuggestionID = args[1]
        if(!SuggestionID)return message.reply({ embeds: [new Discord.MessageEmbed()
            .setTitle(`${emotes.Error} MISSING ARGUEMENT`)
            .setDescription("You must provide an ID!")
            .setColor(colour['angel white'])
        ], allowedMentions: {repliedUser: false}})


        let Comment = args.slice(2).join(" ")
        if(!Comment) return message.reply({ embeds: [new Discord.MessageEmbed()
            .setTitle(`${emotes.Error} MISSING ARGUEMENT`)
            .setDescription("You must provide a message to why this is being denied!")
            .setColor(colour['angel white'])
        ], allowedMentions: {repliedUser: false}})


        try {

            let Suggestion = await channel.messages.fetch(SuggestionID, { limit: 150 });
            let SuggestionEmbed = Suggestion.embeds[0]

            const messageAuthorig = await client.users.cache.find((c) => c.tag === SuggestionEmbed.author.name)

            let deniedSuggestionEmbed = new Discord.MessageEmbed()
            .setColor(colour['light green'])

            .setAuthor({ name: `${message.author.username}`, iconURL: `${message.author.displayAvatarURL({  dynamic: true })}` })
            .setDescription(Suggestion.embeds[0].description)

            .setImage(SuggestionEmbed.image)
            .setFooter(Suggestion.embeds[0].footer)
            .addField("Submitted by:", `<@${messageAuthorig.id}>`)
            .addField("Comment:", `${Comment}`)
            .setTitle("Suggestion Rejected!")
            .setTimestamp()

            Suggestion.edit({ embeds: [deniedSuggestionEmbed], content: `<@${messageAuthorig.id}>`})
            let sentembed = new Discord.MessageEmbed()
                .setAuthor({ name: `${message.author.username}`, iconURL:` ${message.guild.iconURL()}`})
                .setDescription(`**You have Denied the suggestion**`)
                .setColor(colour['light green'])

                .setTimestamp()
            let msg = await message.channel.send({embeds: [sentembed]});
            setTimeout(() => msg.delete(), 12000);
            
        } catch(error) {
            message.channel.send({ embeds: [new Discord.MessageEmbed()
                .setColor(colour['light green'])

                .setTitle(`${emotes.Error} AN ERROR OCCURED`)
                .setDescription(`*Waa~* this suggestion [id](${message.url}) doesnt exist!`)
            ]})
            throw new Error(error)
        }

    }
})
