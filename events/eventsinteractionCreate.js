const { Events } = require("discord.js");

module.exports = {
    name: Events.InteractionCreate,

    async execute(interaction, client) {

        if (!interaction.isChatInputCommand()) return;

        const command = client.commands.get(interaction.commandName);

        if (!command) return;

        try {
            await command.execute(interaction);
        } catch (error) {

            console.error(error);

            if (interaction.deferred || interaction.replied) {

                await interaction.editReply("❌ Dogodila se greška.");

            } else {

                await interaction.reply({
                    content: "❌ Dogodila se greška.",
                    ephemeral: true
                });

            }

        }

    }
};