import { StreamDispatcher, VoiceConnection } from "discord.js";
import { readdir } from "fs";
import { promisify } from "util";
import * as dotenv from "dotenv";
import { createNanoEvents, Emitter, Unsubscribe } from "nanoevents";
import { client } from "..";

type MusicPlayerOptions = {
  random?: boolean;
  url?: string;
};

interface MusicPlayerEvents {
  playingNext: (next: string) => Promise<void>;
  finished: () => Promise<void>;
  paused: () => Promise<void>;
  resumed: () => Promise<void>;
}

export default class MusicPlayer {
  private conn: VoiceConnection;
  private emitter: Emitter;
  private songs: string[];
  private random: boolean;
  private previousIndex = 0;
  index = 0;
  private dis: StreamDispatcher;
  private url;
  constructor(conn: VoiceConnection, options: MusicPlayerOptions) {
    this.emitter = createNanoEvents<MusicPlayerEvents>();
    this.conn = conn;
    this.random = options.random || false;
    this.url = options.url;
  }
  async loadSongs(): Promise<void> {
    this.songs = [];
    if (this.url != null) {
      this.songs.push(this.url);
    } else {
      const env = dotenv.config();
      this.songs = [];
      const read = promisify(readdir);
      const dir = await read(env.parsed.MUSIC_LOCATION);
      dir.forEach((i) => {
        if (i.includes(".mp3") || i.includes(".aac"))
          this.songs.push(`${env.parsed.MUSIC_LOCATION}/${i}`);
      });
      if (this.random)
        this.index = Math.floor(Math.random() * this.songs.length);
    }
  }

  async play(): Promise<void> {
    this.dis = this.conn.play(this.songs[this.index]);
    client.user.setPresence({
      activity: {
        type: "LISTENING",
        name: this.getSongTitle(),
      },
    });
    this.dis.on("start", () => {
      this.emitter.emit("playingNext", this.getSongTitle());
    });
    this.dis.on("error", (e) => console.log(e));
    this.dis.on("finish", async () => {
      if (this.random) {
        this.index = Math.floor(Math.random() * this.songs.length);
        await this.play();
      } else {
        if (this.index < this.songs.length - 1) {
          this.previousIndex = this.index;
          this.index++;
          await this.play();
        } else {
          this.conn.disconnect();
          this.emitter.emit("finished");
        }
      }
    });
  }

  getSongTitle(): string {
    const n = this.songs[this.index].split("/");
    return n[n.length - 1].replace(".mp3", "").replace(".acc", "");
  }

  pause(): void {
    client.user.setPresence({ activity: null });
    this.dis.pause();
    this.emitter.emit("paused");
  }

  resume(): void {
    client.user.setPresence({
      activity: { type: "LISTENING", name: this.getSongTitle() },
    });
    this.dis.resume();
    this.emitter.emit("resumed");
  }

  async next(): Promise<void> {
    if (this.index < this.songs.length - 1) {
      this.index = this.random
        ? Math.floor(Math.random() * this.songs.length)
        : this.index + 1;
      await this.play();
    }
  }

  async previous(): Promise<void> {
    if (this.index > 0) {
      this.index--;
      await this.play();
    }
  }

  stop(): void {
    this.dis.destroy();
    this.conn.disconnect();
    client.user.setPresence({ activity: null });
  }

  on<E extends keyof MusicPlayerEvents>(
    event: E,
    callback: MusicPlayerEvents[E]
  ): Unsubscribe {
    return this.emitter.on(event, callback);
  }
}
