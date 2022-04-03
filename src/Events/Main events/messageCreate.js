/** @format */

const Event = require('../../Handlers/Event.js')
const Discord = require("discord.js")
const Timeout = new Discord.Collection()
const ms = require("ms")
const { owners } = require("../../config/Data/config.json");
const emotes = require('../../config/assets/Json/emotes.json')
const colour = require('../../config/assets/Json/colours.json')
module.exports = new Event("messageCreate", async (client, message) => {

	if (message.author.bot) return;

	const prefixes = [
		`<@$${client.user.id}>`,
        `<@!${client.user.id}>`,
		`${client.user.id}`,
		
	]

		const prefix = prefixes.find(x => message.content.startsWith(x)) 
		if (!prefix) return;

		const args = message.content.slice(prefix.length).trim().split(/ +/g)
		const command = client.commands.find(cmd => cmd.name == args[0].toLowerCase()) || client.commands.find(a => a.aliases && a.aliases.includes(args[0].toLowerCase()))
		if (!command) return;


		// -------------------------------- OWNER, DEV, Maintance commands --------------------------------- //

		const ownerOnlyEmbed = new Discord.MessageEmbed()
			.setColor("#FCC8EA")
			.setDescription("*Waa~~* you are not my owner (._.)\nThis commmand is restricted to be my owner's command only.")
			.setTitle("<:x_:904736839036993586> An Error Occured!")
			.setURL("https://discord.gg/TQ3mTPE7Pf")

		if (command) {
			if (command.owner) {
				if (command.owner && !owners.includes(message.author.id))
				return message.channel.send({ embeds: [ownerOnlyEmbed] })
				}

				if(command) {
					if(command.maintance) {
						if(command.maintance && !owners.includes(message.author.id))
						return message.channel.send({embeds: [new Discord.MessageEmbed()
							.setColor(colour.pink)
							.setTitle(`${emotes.Error} AN ERROR OCCURED`)
							.setDescription("Due to some difficulties this command is disabled!")
							.setURL("https://discord.gg/TQ3mTPE7Pf")
						]})
					}
				}


										// ---------------------------------------- NSFW CHECKING ------------------------- //
				const NSFW = new Discord.MessageEmbed()
				.setColor(colour['light red'])
				.setTitle(`${emotes.Error} THIS IS NOT AN NSFW CHANNEL`)
				.setDescription("Please run this command in an NSFW Channel")

				if (command) {
					if (!message.channel.nsfw && !owners.includes(message.author.id)) {
						if (command.nsfw) {
						message.react("<:Iki_MAD:874174682427969536>");
						return message.reply({ embeds: [NSFW], allowedMentions: {repliedUser: false} }).then((msg) => {
							setTimeout(() => msg.delete(), 4000);
						  });
						}
					}

		// ------------------------------ PERMISSION AND COMMAND TYPE CHECKING ----------------------------- //

			const SlashOnlyCMDEMBED = new Discord.MessageEmbed()
				.setColor("#EE3748")
				.setDescription("That command can only be done with a slash command! >o<")
				.setTitle(`<:Ikix:904736839036993586> WRONG USAGE!`)

			if (!["Text"].includes(command.type))
				return message.reply({ embeds: [SlashOnlyCMDEMBED], allowedMentions: { repliedUser: false }})

			const Userpermission = message.member.permissions.has(command.userPermissions);
			const UserpermEmbed = new Discord.MessageEmbed()
				.setColor("#EE3748")
				.setTitle("<:x_:904736839036993586> MISSING PERMISSIONS")
				.setURL("https://media.discordapp.net/attachments/934515089296486430/935225337774735430/unknown.png?width=991&height=242")
				.setDescription(`You do not have the sufficient permissions: \`\`${command.userPermissions}\`\``)
				.setTimestamp()

			const Botpermission = message.guild.me.permissions.has(command.botPermissions)
			const BotpermEmbed = new Discord.MessageEmbed()
				.setColor("#EE3748")
				.setTitle("<:x_:904736839036993586> MISSING PERMISSIONS")
				.setURL("https://media.discordapp.net/attachments/934515089296486430/935225337774735430/unknown.png?width=991&height=242")
				.setDescription(`I do not have the sufficient permissions: \`\`${command.botPermissions}\`\``)
				.setTimestamp()

			if (!Userpermission)
				return message.channel.send({ embeds: [UserpermEmbed] })
			if (!Botpermission)
				return message.channel.send({ embeds: [BotpermEmbed] })

			// ------------------------------------------- COMMAND COOLDOWNS ----------------------------------- //
			if (command) {
				if (command.cooldown && !owners.includes(message.author.id)) {
					if (Timeout.has(`${command.name}${message.author.id}`)) return message.reply({
						embeds: [new Discord.MessageEmbed()
							.setColor("#ff3235")
							.setAuthor({ name: "*Waaa~* you need to wait! (；⌣̀_⌣́)", iconURL: `${message.guild.iconURL()}`})
							.setDescription(`<:Iki_xpinkdot:916869194400796772> You need to wait for ${ms(Timeout.get(`${command.name}${message.author.id}`) - Date.now(), { long: false })} to use __${command.name}__ again.`)
						], allowedMentions: {repliedUser: false}
					})
					command.run(message, args, client)
					Timeout.set(`${command.name}${message.author.id}`, Date.now() + command.cooldown)
					setTimeout(() => {
						Timeout.delete(`${command.name}${message.author.id}`)
					}, command.cooldown)
				}  else if(command.cooldown && owners.includes(message.author.id)) {
					command.run(message, args, client)
				} 
				if (!command.cooldown) {
					command.run(message, args, client)
			}
			
			}
		}}
	}) 