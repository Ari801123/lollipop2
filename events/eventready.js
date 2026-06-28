const { Events, ActivityType } = require("discord.js");

module.exports = {
    name: Events.ClientReady,
    once: true,

    execute(client) {
        console.log(`${client.user.tag} je online!`);

        client.user.setActivity("Lollipop Radio", {
            type: ActivityType.Listening
        });
    }
};