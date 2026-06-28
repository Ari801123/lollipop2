const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
  VoiceConnectionStatus,
  entersState,
  StreamType,
} = require("@discordjs/voice");

const { spawn } = require("child_process");
const ffmpeg = require("ffmpeg-static");

const RADIO_URL = "https://streaming.tdiradio.com/lollipop.mp3";

const player = createAudioPlayer();

player.on("error", error => {
  console.error("PLAYER ERROR:", error);
});

player.on("stateChange", (oldState, newState) => {
  console.log(`Player state: ${oldState.status} -> ${newState.status}`);
});

function createResource() {
  console.log("Pokrećem FFmpeg...");

  const ff = spawn(ffmpeg, [
    "-reconnect", "1",
    "-reconnect_streamed", "1",
    "-reconnect_delay_max", "5",

    "-user_agent", "Mozilla/5.0",
    "-headers", "Icy-MetaData: 1\r\n",

    "-i", RADIO_URL,

    "-loglevel", "warning",
    "-analyzeduration", "1000000",
    "-probesize", "1000000",

    "-f", "s16le",
    "-ar", "48000",
    "-ac", "2",

    "pipe:1"
  ]);

  ff.stderr.on("data", data => {
    console.log("FFMPEG:", data.toString());
  });

  ff.on("error", error => {
    console.error("FFMPEG ERROR:", error);
  });

  ff.on("close", code => {
    console.log("FFMPEG CLOSED:", code);
  });

  return createAudioResource(ff.stdout, {
    inputType: StreamType.Raw,
    inlineVolume: false
  });
}

async function play(channel) {
  console.log("Spajam se na voice kanal:", channel.name);

  const connection = joinVoiceChannel({
    channelId: channel.id,
    guildId: channel.guild.id,
    adapterCreator: channel.guild.voiceAdapterCreator,
    selfDeaf: false
  });

  await entersState(connection, VoiceConnectionStatus.Ready, 20000);

  console.log("Voice connection READY");

  connection.subscribe(player);

  player.removeAllListeners(AudioPlayerStatus.Idle);

  player.on(AudioPlayerStatus.Idle, () => {
    console.log("Player idle, restartam stream...");
    player.play(createResource());
  });

  console.log("Pokrećem player...");
  player.play(createResource());

  return connection;
}

module.exports = {
  play
};
