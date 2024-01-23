const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('softban')
        .setDescription('Softban a user')
        .addUserOption(option => 
            option.setName('username')
                .setDescription('The username to softban')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('duration')
                .setDescription('The duration of the softban (e.g., 1d, 2h)')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('reason')
                .setDescription('The reason for the softban')
                .setRequired(true)),
    async execute(interaction) {
        // Check if the user executing the command has the 'BAN_MEMBERS' permission
        if (!interaction.member.permissions.has('BAN_MEMBERS')) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        const userToSoftban = interaction.options.getUser('username');
        const duration = interaction.options.getString('duration');
        const reason = interaction.options.getString('reason');

        if (userToSoftban) {
            // Softban logic: Kick the user and immediately ban them
            await interaction.guild.members.ban(userToSoftban.id, { reason: reason, days: 7 });

            setTimeout(async () => {
                await interaction.guild.bans.remove(userToSoftban.id, 'Softban duration expired');
            }, parseDuration(duration));

            interaction.reply({ content: `${userToSoftban.tag} has been softbanned for ${duration} with reason: ${reason}`, ephemeral: true });
        } else {
            interaction.reply({ content: 'User not found.', ephemeral: true });
        }
    },
};

// Function to parse duration strings like '1d', '2h' into milliseconds
function parseDuration(duration) {
    const regex = /(\d+)([smhdwMy])?/g;
    const matches = [...duration.matchAll(regex)];

    let milliseconds = 0;

    for (const match of matches) {
        const value = parseInt(match[1]);
        const unit = match[2];

        switch (unit) {
            case 's':
                milliseconds += value * 1000;
                break;
            case 'm':
                milliseconds += value * 60 * 1000;
                break;
            case 'h':
                milliseconds += value * 60 * 60 * 1000;
                break;
            case 'd':
                milliseconds += value * 24 * 60 * 60 * 1000;
                break;
            case 'w':
                milliseconds += value * 7 * 24 * 60 * 60 * 1000;
                break;
            case 'M':
                milliseconds += value * 30 * 24 * 60 * 60 * 1000;
                break;
            case 'y':
                milliseconds += value * 365 * 24 * 60 * 60 * 1000;
                break;
            default:
                break;
        }
    }

    return milliseconds;
}
