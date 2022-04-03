const Event = require('../../Handlers/Event.js')
const Discord = require('discord.js')
const c = require("../../config/assets/Json/colours.json")

module.exports = new Event("guildCreate", async(client, guild) => {

    const ch = guild.channels.cache.filter(c => c.name.includes('general')).first() || guild.channels.cache.filter(c => c.name.includes('chat')).first() || guild.channels.cache.filter(c => c.name.includes('lounge')).first() || guild.systemChannel || guild.channels.cache.filter(c => c.type == 'GUILD_TEXT').first()
    if (!ch) return;
    
    const owner = await guild.fetchOwner()
    
    const row = new Discord.MessageActionRow()
    .addComponents(
        new Discord.MessageButton()
            .setLabel("Bot Devs Server:")
            .setStyle('LINK')
            .setURL('https://discord.gg/myztGNxaJQ')
            )

    const Invite = new Discord.MessageEmbed()
    .setTitle("Thanks for adding me! <:Ayu_Sakura:957444820232708116>")
    .setURL('https://discord.gg/myztGNxaJQ')
    .setDescription(`Thanks for adding me! I will keep ${owner}'s server in good condition!`)
    .addField("<a:Kao_crown:940625784199073812> Who am i:", `My name is **__${client.user.tag}__**.\nI was developed by __Sensei | 旭陽#8751__ using javascript and discord.js.`, true)
    .setThumbnail(client.user.displayAvatarURL())
    .setColor(`#4D9AE6`) 
    .setFooter({ text: "Thanks for inviting me!"})

    if (guild.me.permissionsIn(ch).has("EMBED_LINKS")) ch.send({ embeds: [Invite], components: [row]})

})