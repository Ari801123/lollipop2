require("dotenv").config();

const { REST, Routes } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

const commands = [
    new SlashCommandBuilder()
        .setName("play")
        .setDescription("Pokreni Lollipop Radio"),

    new SlashCommandBuilder()
        .setName("stop")
        .setDescription("Zaustavi radio")
].map(command => command.toJSON());

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

(async () => {

    try {

        console.log("Registriram slash naredbe...");

        await rest.put(
            Routes.applicationGuildCommands(
                process.env.CLIENT_ID,
                process.env.GUILD_ID
            ),
            { body: commands }
        );

        console.log("Slash naredbe uspješno registrirane.");

    } catch (error) {

        console.error(error);

    }

})();