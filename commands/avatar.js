const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Get the avatar of a user')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user to get the avatar of')
                .setRequired(true)),
    async execute(interaction) {
        const targetUser = interaction.options.getUser('target');

        const embed = new EmbedBuilder()
            .setColor('#3498db')
            .setTitle(`${targetUser.username}'s Avatar`)
            .setImage(targetUser.displayAvatarURL({ dynamic: true, size: 512 }))
            .setTimestamp()
            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });

        interaction.reply({ embeds: [embed], ephemeral: true });
    },
};
