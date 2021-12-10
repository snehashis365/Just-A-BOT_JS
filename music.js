const ffmpeg = require("ffmpeg-static");

module.exports = {
  async execute(client, interraction, command, args = "") {
    let guildQueue = client.player.getQueue(interraction.guild.id);
    if (command === "play") {
      if(interraction.member.voice.channel)
      {
        await interraction.reply(`**Searching...:mag:**`);
        let queue = client.player.createQueue(interraction.guild.id, {
          data: {
            interractionObj: interraction,
          },
        });
        await queue.join(interraction.member.voice.channel);
        let song = await queue.play(args).catch((_) => {
          if (!guildQueue) queue.stop();
        });
      }
      else await interraction.reply(`:no_entry: You **need to be in a voice channel** to use this command`)
    }
    if (command === "skip") {
      if (guildQueue){
        guildQueue.skip();
        interraction.reply(`**Skipped** :fast_forward:`)
      }
    }
    if (command === "stop") {
      if (guildQueue){ 
        guildQueue.stop();
        interraction.reply(`**Stopped playback** :no_entry:`)
      }
    }
    if (command === "pause") {
      if (guildQueue){
        guildQueue.setPaused(true);
        interraction.reply(`**Paused** :pause_button:`)
      }
    }
    if (command === "resume") {
      if (guildQueue){
        guildQueue.setPaused(false);
        interraction.reply(`**Resumed** :play_pause:`)
      }
    }
    if (command === "nowPlaying") {
      if (guildQueue){
        const ProgressBar = guildQueue.createProgressBar();
        console.log(ProgressBar.prettier)
        console.log(ProgressBar.times)
        await interraction.reply(`Now Playing: :notes: **${guildQueue.nowPlaying}**`);
        
      }
      else
        await interraction.reply('No song playing at the moment');
    }
  },
};
