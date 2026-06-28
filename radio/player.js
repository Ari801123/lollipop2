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

function createResource() {
  const ff = spawn(ffmpeg, [
    "-reconnect", "1",
    "-reconnect_streamed", "1",
    "-reconnect_delay_max", "5",
    "-i", RADIO_URL,
    "-loglevel", "0",
    "-analyzeduration", "0",
    "-f", "s16le",
    "-ar", "48000",
    "-ac", "2",
    "pipe:1"
  ]);

  ff.stderr.on("data", data => {
    console.log(data.toString());
  });

  ff.on("error", console.error);

  return createAudioResource(ff.stdout, {
    inputType: StreamType.Raw,
    inlineVolume: false
  });
}

async function play(channel) {
  const connection = joinVoiceChannel({
    channelId: channel.id,
    guildId: channel.guild.id,
    adapterCreator: channel.guild.voiceAdapterCreator,
    selfDeaf: false
  });

  await entersState(connection, VoiceConnectionStatus.Ready, 20000);

  connection.subscribe(player);

  player.removeAllListeners(AudioPlayerStatus.Idle);
  player.on(AudioPlayerStatus.Idle, () => {
    player.play(createResource());
  });

  player.play(createResource());

  return connection;
}

module.exports = {
  play
};
