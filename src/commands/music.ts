import { ArgsOf, Command, Discord, On } from "@typeit/discord";
import { Client } from "discord.js";
import { Config } from "../config";
import { LocalMusicPlayer, YTPlayer } from "../modes/music";

@Discord(Config.music.command) // Decorate the class
// eslint-disable-next-line @typescript-eslint/no-unused-vars
abstract class PlayMusic {
  player: LocalMusicPlayer | YTPlayer;

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
        this.player = simpMessage.includes("https://www.youtube.com")
          ? new YTPlayer(
              await message.member.voice.channel.join(),
              simpMessage.replace(`${Config.music.commands.random}:`, ""),
              simpMessage.includes(Config.music.commands.random)
            )
          : new LocalMusicPlayer(await message.member.voice.channel.join(), {
              random: simpMessage == Config.music.commands.random,
              url: simpMessage.includes("https://") ? simpMessage : null,
            });
        await this.player.loadSongs();
        this.player.on("songStart", async (next: string) => {
          message.channel.send("Reproduciendo: " + next);
        });
        this.player.on("finished", async () => {
          message.channel.send("La canción terminó");
        });
        this.player.on("error", async (err) => {
          message.channel.send(err);
        });
        await this.player.play();
      }
    } else {
      if (
        !message.author.bot &&
        message.content.startsWith(Config.music.command)
      )
        message.reply("Para reproducir música entra en un canal de voz");
    }
  }
  @Command(Config.music.commands.next)
  private async next() {
    await this.player.next();
  }
  @Command(Config.music.commands.previous)
  private async previous() {
    await this.player.previous();
  }
  @Command(Config.music.commands.pause)
  private async pause() {
    await this.player.pause();
  }
  @Command(Config.music.commands.resume)
  private async resume() {
    await this.player.resume();
  }
  @Command(Config.music.commands.stop)
  private async stop() {
    await this.player.stop();
  }
}
