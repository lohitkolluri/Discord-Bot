const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kick a user from the server')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('The user to kick')
                .setRequired(true)),
    async execute(interaction) {

        if (!interaction.member.permissions.has('ADMINISTRATOR')) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        const userToKick = interaction.options.getUser('user');
        const member = interaction.guild.members.cache.get(userToKick.id);

        if (member) {
            try {
                await member.kick();
                interaction.reply({ content: `${userToKick.tag} has been kicked.`, ephemeral: true });
            } catch (error) {
                console.error('Error kicking user:', error);
                interaction.reply({ content: 'An error occurred while kicking the user.', ephemeral: true });
            }
        } else {
            interaction.reply({ content: 'User not found.', ephemeral: true });
        }
    },
};
