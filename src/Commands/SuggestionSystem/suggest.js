const Command = require('../../Handlers/Command.js')
const Discord = require('discord.js');
const colour = require("../../config/assets/Json/colours.json")
module.exports = new Command({

    name: 'suggest',
    description: "make a suggestion to your suggestion channel",
    userPermissions: ["SEND_MESSAGES"],
    botPermissions: "SEND_MESSAGES",
    type: "Text",
    aliases: ["suggestion", 'su', 'newidea', 's'],
    cooldown: 7000,

    async run(message, args, client){

      function generateRandomString(length) {
        var chars =
          "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        var random_string = "";
        if (length > 0) {
          for (var i = 0; i < length; i++) {
          random_string += chars.charAt(
            Math.floor(Math.random() * chars.length)
          );
          }
        }
        return random_string;
        }
        
        const SuggestionID = generateRandomString(7);           
        IDNumber = `${SuggestionID}`;

        const guildConfig = require('../../config/models/guildConfig')

        const data = await guildConfig.findOne({guildId: message.guild.id})
        const channel = message.guild.channels.cache.find(c => c.id === data.suggestionChannel)

        let suggestionMessage = args.slice(1).join(' ');
        const nosuggestion = new Discord.MessageEmbed()
        .setColor(colour['light green'])
        .setTitle("<:x_:904736839036993586> MISSING ARGUEMENT.")
        .setDescription("Please provide a suggestion!!")
        if(!suggestionMessage) return message.channel.send({embeds: [nosuggestion]})
        
        const suggestembed = new Discord.MessageEmbed()
        .setAuthor({ name: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL({  dynamic: true })}` })
        .setDescription(`**Suggestion:**\n${suggestionMessage}`)
        .setTimestamp()
        .setImage(message.attachments.first()?.proxyURL || null)
        .setFooter({ text: `User ID: ${message.author.id} | ID: ${IDNumber}`})
        .setColor(colour['light green'])
        
        const msg = await channel.send({embeds: [suggestembed]});
        msg.react("✅");
        msg.react("❎");


        let sentembed = new Discord.MessageEmbed()
        .setAuthor({ name: `${message.author.username}`, iconURL:` ${message.guild.iconURL()}`})
        .setDescription(`The suggestion has been sent to the **[Suggestion channel](${msg.url})**`)
        .setColor(colour['light green'])

        .setTimestamp()
        .setFooter({ text: `Suggestion ID: ${IDNumber}`})

        let msg2 = await message.channel.send({embeds: [sentembed]});

        setTimeout(() => msg2.delete(), 12000);

    }
})