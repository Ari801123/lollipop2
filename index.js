require("dotenv").config();

const fs = require("fs");
const path = require("path");

const {
    Client,
    Collection,
    GatewayIntentBits,
    ActivityType
} = require("discord.js");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates
    ]
});

client.commands = new Collection();

//
// Učitavanje commandova
//
const commandFiles = fs
    .readdirSync(path.join(__dirname, "commands"))
    .filter(file => file.endsWith(".js"));

for (const file of commandFiles) {

    const command = require(`./commands/${file}`);

    client.commands.set(command.data.name, command);

}
console.log("Commands pronađeni:", commandFiles);
console.log("Commands učitani:", [...client.commands.keys()]);
//
// Učitavanje eventa
//
const eventFiles = fs
    .readdirSync(path.join(__dirname, "events"))
    .filter(file => file.endsWith(".js"));

for (const file of eventFiles) {

    const event = require(`./events/${file}`);

    if (event.once) {

        client.once(event.name, (...args) => event.execute(...args, client));

    } else {

        client.on(event.name, (...args) => event.execute(...args, client));

    }

}

console.log("Pokrećem login...");

client.login(process.env.DISCORD_TOKEN)
    .then(() => console.log("Login OK"))
    .catch(console.error);