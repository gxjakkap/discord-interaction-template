const { MessageEmbed, Interaction } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription("Wonder what returns with this command"),
    async execute(interaction) {
        interaction.reply("Pong!")
    }
}