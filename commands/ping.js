const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: {
    name: 'ping',
    description: 'Replies with Pong and displays bot latency!',
  },
  async execute(interaction) {
    try {
      const startTime = Date.now();
      const reply = await interaction.reply({
        content: 'Pinging... 🏓',
        fetchReply: true,
      });

      const endTime = Date.now();
      const latency = endTime - startTime;

      const embed = new EmbedBuilder()
        .setTitle('Pong! 🏓')
        .setDescription(`Latency: ${latency}ms ⌛`)
        .setColor('#0099ff');

      await interaction.editReply({ content: '\u200B', embeds: [embed] });
    } catch (error) {
      console.error(error);
    }
  },
};
