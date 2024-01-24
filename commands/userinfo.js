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
        const member = interaction.guild.members.cache.get(targetUser.id);

        const embed = new EmbedBuilder()
        .setColor('#3498db')
        .setTitle('User Information')
        .setThumbnail(targetUser.displayAvatarURL({ dynamic: true }))
        .addFields(
            { name: 'Username', value: targetUser.username, inline: true },
            { name: 'User ID', value: targetUser.id, inline: true },
            { name: 'Tag', value: targetUser.tag, inline: true },
            { name: 'Joined Server', value: member.joinedAt.toDateString(), inline: true },
            { name: 'Account Created', value: targetUser.createdAt.toDateString(), inline: true },
            { name: 'Roles', value: member.roles.cache.map(role => role.name).join(', '), inline: false }
        )
        .setTimestamp()
        .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });
    

        interaction.reply({ embeds: [embed], ephemeral: true });
    },
};
