import { ArgsOf, Discord, On } from "@typeit/discord";
import { Client } from "discord.js";
import { Config } from "../config";
import { LocalMusicPlayer, YTPlayer } from "../modes/music";

let m: LocalMusicPlayer | YTPlayer;

@Discord(Config.music.command) // Decorate the class
// eslint-disable-next-line @typescript-eslint/no-unused-vars
abstract class PlayMusic {
  @On("message")
  private async onReady(
    [message]: ArgsOf<"message">,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    client: Client,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    guardPayload: any
  ) {
    if (message.member.voice.channel != null) {
      const simpMessage = message.content.replace(Config.music.command, "");
      if (
        simpMessage == "" ||
        simpMessage == Config.music.commands.random ||
        simpMessage.includes("https://")
      ) {
        m = simpMessage.includes("https://www.youtube.com")
          ? new YTPlayer(
              await message.member.voice.channel.join(),
              simpMessage.replace(`${Config.music.commands.random}:`, ""),
              simpMessage.includes(Config.music.commands.random)
            )
          : new LocalMusicPlayer(await message.member.voice.channel.join(), {
              random: simpMessage == Config.music.commands.random,
              url: simpMessage.includes("https://") ? simpMessage : null,
            });
        m.on("songStart", async (next: string) => {
          message.channel.send("Reproduciendo: " + next);
        });
        m.on("finished", async () => {
          message.channel.send("La canción terminó");
        });
        m.on("error", async (err) => {
          message.channel.send(err);
        });
        await m.loadSongs();
        await m.play();
      } else if (simpMessage == Config.music.commands.pause) {
        m.pause();
      } else if (simpMessage == Config.music.commands.resume) {
        m.resume();
      } else if (simpMessage == Config.music.commands.previous) {
        await m.previous();
      } else if (simpMessage == Config.music.commands.next) {
        await m.next();
      } else if (simpMessage == Config.music.commands.stop) {
        m.stop();
      }
    } else {
      if (
        !message.author.bot &&
        message.content.startsWith(Config.music.command)
      )
        message.reply("Para reproducir música entra en un canal de voz");
    }
  }
}
