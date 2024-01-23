const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Clear a certain amount of messages in the channel')
        .addIntegerOption(option => 
            option.setName('amount')
                .setDescription('The number of messages to clear')
                .setRequired(true)),
    async execute(interaction) {
        const amount = interaction.options.getInteger('amount');

        if (amount <= 0 || amount > 100) {
            return interaction.reply({ content: 'Please provide a number between 1 and 100.', ephemeral: true });
        }

        await interaction.deferReply({ ephemeral: true });

        try {
            let fetchedMessages;
            let messagesToDelete = amount;

            while (messagesToDelete > 0) {
                const limit = messagesToDelete > 100 ? 100 : messagesToDelete;
                fetchedMessages = await interaction.channel.messages.fetch({ limit: limit });
                await interaction.channel.bulkDelete(fetchedMessages, true);

                messagesToDelete -= limit;
            }

            interaction.editReply({ content: `Cleared ${amount} messages.`, ephemeral: true });
        } catch (error) {
            console.error('Error clearing messages:', error);
            interaction.editReply({ content: 'An error occurred while clearing messages.', ephemeral: true });
        }
    },
};
