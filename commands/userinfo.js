const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('Display information about a user')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user to get information about')
                .setRequired(true)),
    async execute(interaction) {
        const targetUser = interaction.options.getUser('target');

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('User Information')
            .addFields(
                { name: 'Username', value: targetUser.username, inline: true }, 
                { name: 'User ID', value: targetUser.id, inline: true },
            )
            .setThumbnail(targetUser.displayAvatarURL({ dynamic: true }))
            .setTimestamp()
            .setFooter({ text: 'Requested by ' + interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });


        interaction.reply({ embeds: [embed], ephemeral: true });
    },
};
