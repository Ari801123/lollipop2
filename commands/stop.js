const {
    SlashCommandBuilder
} = require("discord.js");

const {
    getVoiceConnection
} = require("@discordjs/voice");

module.exports = {

    data: new SlashCommandBuilder()

        .setName("stop")

        .setDescription("Zaustavi radio"),

    async execute(interaction) {

        const connection = getVoiceConnection(interaction.guild.id);

        if (connection)
            connection.destroy();

        await interaction.reply({
            content: "⏹️ Radio zaustavljen."
        });

    }

};