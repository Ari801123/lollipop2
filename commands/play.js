const { SlashCommandBuilder } = require("discord.js");
const { play } = require("../radio/player");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Pokreni Lollipop Radio"),

    async execute(interaction) {

        console.log("Play command pokrenut.");

        if (!interaction.member.voice.channel) {
            return interaction.reply({
                content: "❌ Uđi u voice kanal.",
                ephemeral: true
            });
        }

        try {

            console.log("Defer reply...");

            await interaction.deferReply();

            console.log("Pozivam player...");

            await play(interaction.member.voice.channel);

            console.log("Player uspješno pokrenut.");

            await interaction.editReply({
                content: "🎵 Lollipop Radio je pokrenut."
            });

        } catch (err) {

            console.error("PLAY ERROR:");
            console.error(err);

            try {

                if (interaction.deferred || interaction.replied) {

                    await interaction.editReply({
                        content: "❌ Dogodila se greška."
                    });

                } else {

                    await interaction.reply({
                        content: "❌ Dogodila se greška.",
                        ephemeral: true
                    });

                }

            } catch (replyError) {

                console.error("REPLY ERROR:");
                console.error(replyError);

            }

        }

    }

};