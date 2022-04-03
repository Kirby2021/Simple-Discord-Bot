const Command = require('../../Handlers/Command.js')
const colour = require('../../config/assets/Json/colours.json')
const ms = require("ms")
const { MessageEmbed } = require("discord.js");
// i think i used Lyxcode code from a while back, im not sure if im right here
module.exports = new Command({

    name: "giveaway",
    description: "Create a giveaway",
    userPermissions: 'MANAGE_GUILD',
    botPermissions: 'SEND_MESSAGES',
    cooldown: 4000,
    type: "Slash",
    slashCommandOptions: [
            { 
                name: "start",
                description: "Starts a give away",
                type: "SUB_COMMAND",
                options: [
                    { 
                        name: "duration",
                        description: "Provide a duration for this give away. (1m, 1h, 1d)",
                        type: "STRING",
                        required: true
                    },
                    {
                        name: "winners",
                        description: "Select the amount of winners",
                        type: "INTEGER",
                        required: true
                    },
                    { 
                        name: "prize",
                        description: "Provide the prize of the giveaway",
                        type: "STRING",
                        required: true
                    },
                    { 
                        name: "channel",
                        description: "Mention the channel the give away will be in",
                        type: "CHANNEL",
                        channelTypes: ["GUILD_TEXT"]
                    }
                ]
            },
            {
                name: "actions",
                description: "Options for the giveaway",
                type: "SUB_COMMAND",
                options: [ 
                    { 
                        name: "options",
                        description: "Select an option",
                        type: "STRING",
                        required: true,
                        choices: [ 
                            {
                                name: "end",
                                value: "end",
                            },
                            {
                                name: "reroll",
                                value: "reroll",
                            },
                            {
                                name: "delete",
                                value: "delete",
                            },
                        ]
                    },
                    {
                        name: "message-id",
                        description: "Provide the message id of the giveaway.",
                        type: "STRING",
                        required: true
                    }
                ]
            }],

         async run(interaction, args, client) {
            
            const { options } = interaction;

            const Sub = options.getSubcommand();
            
            const errorEmbed = new MessageEmbed()
            .setColor(colour['light red']);
    
            const successEmbed = new MessageEmbed()
            .setColor(colour['light green']);
      
            switch(Sub) { 
                case "start" : { 
    
                    const gchannel = options.getChannel("channel") || interaction.channel
                    const duration = options.getString("duration");
                    const winnerCount = options.getInteger("winners");
                    const prize = options.getString("prize");
    
     
                    client.giveawaysManager.start(gchannel, {
                        duration: ms(duration),
                        winnerCount,
                        prize,
                        messages : { 
                            giveaway: "🎉**Giveaway has begun!** 🥂",
                            giveawayEnded: "🎊**Giveaway has ended**🎊",
                            winMessage: "Congratulations, {winners}! You have won **{this.prize}**"
                        }
                    }).then((async) => {
                        successEmbed.setDescription("Giveaway has succesfully started!")
                        return interaction.followUp({embeds: [successEmbed], ephemeral: true});
                    }).catch((err) => { 
                        errorEmbed.setDescription(`An error has occured trying to run this command\n\`${err}\``)
                        return interaction.followUp({embeds: [errorEmbed], ephemeral: true});
                    })
    
    
    
    
                }
                break;
    
                case "actions" : { 
                    const choice = options.getString("options");
                    const messageId = options.getString("message-id");
    
                    const giveaway = client.giveawaysManager.giveaways.find((g) => g.guildId === messageId);
                    
                    if (!giveaway) {
                        errorEmbed.setDescription(`I can not find that giveaway with the message id you gave me : ${messageId} in the server.`);
                        return interaction.followUp({embeds: [errorEmbed], ephemeral: true})
                    }
    
                    switch(choice) { 
                        case "end" : { 
                            client.giveawaysManager.end(messageId).then(() => {
                                successEmbed.setDescription("Giveaway has ended!");
                               return interaction.followUp({embeds: [successEmbed], ephemeral: true})
                            }).catch((err) => {
                                errorEmbed.setDescription(`An error has occured trying to run this command\n\`${err}\``)
                                return interaction.followUp({embeds: [errorEmbed], ephemeral: true});
                            });
                        }
                        break;
    
                        case "reroll" : { 
                            client.giveawaysManager.reroll(messageId).then(() => {
                                successEmbed.setDescription("Giveaway has been rerolled and we have a new winner!");
                                return interaction.followUp({embeds: [successEmbed], ephemeral: true})
                            }).catch((err) => {
                                errorEmbed.setDescription(`An error has occured trying to run this command\n\`${err}\``)
                                return interaction.followUp({embeds: [errorEmbed], ephemeral: true});
                            });
                        }
                        break;
    
                        case "delete" : { 
                            client.giveawaysManager.delete(messageId).then(() => {
                                successEmbed.setDescription("Giveaway has been cancled / deleted.");
                                return   interaction.followUp({embeds: [successEmbed], ephemeral: true})
                            }).catch((err) => {
                                errorEmbed.setDescription(`An error has occured trying to run this command\n\`${err}\``)
                                return  interaction.followUp({embeds: [errorEmbed], ephemeral: true});
                            });
                        }
                        break;
    
                        default : { 
                            console.log("Error in give away command.")
                        }
                    }
                }
                break;
            }
    
        }
    })
