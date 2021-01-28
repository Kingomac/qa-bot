import { StreamDispatcher, VoiceConnection } from "discord.js";
import { readdir } from "fs";
import { promisify } from "util";
import * as dotenv from "dotenv";
import { createNanoEvents, Emitter, Unsubscribe } from "nanoevents";
import { client } from "..";
import * as ytdl from "ytdl-core";
import { Readable } from "stream";
import * as ytpl from "ytpl";

export interface IMusicPlayer {
  //conn: VoiceConnection
  //emitter: Emitter;
  //dis:StreamDispatcher
  loadSongs?(): Promise<void>;
  play(): Promise<void>;
  getSongTitle(): Promise<string>;
  pause(): Promise<void>;
  resume(): Promise<void>;
  next?(): Promise<void>;
  previous?(): Promise<void>;
}

interface IMusicPlayerEvents {
  songStart: (next: string) => Promise<void>;
  finished: () => Promise<void>;
  paused: () => Promise<void>;
  resumed: () => Promise<void>;
  error: (err: string) => Promise<void>;
}

type MusicPlayerOptions = {
  random?: boolean;
  url?: string;
};

export class LocalMusicPlayer implements IMusicPlayer {
  private conn: VoiceConnection;
  private emitter: Emitter;
  private songs: string[];
  private random: boolean;
  private previousIndex = 0;
  index = 0;
  private dis: StreamDispatcher;
  private url;
  constructor(conn: VoiceConnection, options: MusicPlayerOptions) {
    this.emitter = createNanoEvents<IMusicPlayerEvents>();
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
        name: await this.getSongTitle(),
      },
    });
    this.dis.on("start", () => {
      this.emitter.emit("songStart", this.getSongTitle());
    });
    this.dis.on("error", (e) => this.emitter.emit("error", e.message));
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

  async getSongTitle(): Promise<string> {
    const n = this.songs[this.index].split("/");
    return n[n.length - 1].replace(".mp3", "").replace(".acc", "");
  }

  async pause(): Promise<void> {
    await client.user.setPresence({ activity: null });
    this.dis.pause();
    this.emitter.emit("paused");
  }

  async resume(): Promise<void> {
    await client.user.setPresence({
      activity: { type: "LISTENING", name: await this.getSongTitle() },
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

  async stop(): Promise<void> {
    this.dis.destroy();
    this.conn.disconnect();
    await client.user.setPresence({ activity: null });
  }

  on<E extends keyof IMusicPlayerEvents>(
    event: E,
    callback: IMusicPlayerEvents[E]
  ): Unsubscribe {
    return this.emitter.on(event, callback);
  }
}

type YTSong = {
  url: string;
  title: string;
};

export class YTPlayer {
  url: string;
  conn: VoiceConnection;
  dis: StreamDispatcher;
  emitter: Emitter;
  stream: Readable;
  songs: YTSong[];
  index: number;
  random: boolean;
  constructor(conn: VoiceConnection, url: string, random: boolean) {
    this.conn = conn;
    this.url = url;
    this.emitter = createNanoEvents<IMusicPlayerEvents>();
    this.random = random;
  }

  async play(): Promise<void> {
    console.log(this.songs[this.index].url);
    this.stream = ytdl(this.songs[this.index].url, { quality: 140 });
    this.dis = this.conn.play(this.stream);
    this.dis.on("error", (e) => this.emitter.emit("error", e.message));
    this.dis.on("start", async () => {
      this.emitter.emit("songStart", await this.getSongTitle());
      await client.user.setPresence({
        activity: {
          type: "LISTENING",
          name: await this.getSongTitle(),
        },
      });
    });
    this.dis.on("finish", async () => {
      this.emitter.emit("finished");
      client.user.setPresence({});
    });
  }
  async getSongTitle(): Promise<string> {
    return this.songs[this.index].title;
  }

  async pause(): Promise<void> {
    await client.user.setPresence({ activity: null });
    this.dis.pause();
    this.emitter.emit("paused");
  }

  async resume(): Promise<void> {
    await client.user.setPresence({
      activity: { type: "LISTENING", name: await this.getSongTitle() },
    });
    this.dis.resume();
    this.emitter.emit("resumed");
  }
  async loadSongs(): Promise<void> {
    this.songs = [];
    console.log(this.url);
    if (this.url.includes("list=")) {
      try {
        const list = await ytpl(this.url.split("&index")[0], {
          limit: Infinity,
        });
        list.items.forEach((e) => {
          this.songs.push({ title: e.title, url: e.url });
        });
        if (this.url.includes("index=")) {
          const index = parseInt(this.url.split("&index=")[1]);
          this.index = index - (this.random ? 1 : 2);
        } else {
          this.index = this.random
            ? Math.floor(Math.random() * this.songs.length)
            : 0;
        }
      } catch (e) {
        this.emitter.emit(
          "error",
          "Para poder reproducir una lista debe ser pública"
        );
      }
    } else {
      this.index = 0;
      this.songs.push({
        title: (await ytdl.getBasicInfo(this.url)).videoDetails.title,
        url: this.url,
      });
    }
  }
  async next(): Promise<void> {
    if (this.url.includes("index")) {
      if (!this.random && this.index < this.songs.length - 1) this.index++;
      if (this.random)
        this.index = Math.floor(Math.random() * this.songs.length);
      await this.play();
    }
  }
  async previous(): Promise<void> {
    if (this.url.includes("index")) {
      if (!this.random && this.index < this.songs.length - 1) this.index--;
      if (this.random)
        this.index = Math.floor(Math.random() * this.songs.length);
      await this.play();
    }
  }

  async stop(): Promise<void> {
    this.dis.destroy();
    this.conn.disconnect();
    await client.user.setPresence({ activity: null });
  }

  on<E extends keyof IMusicPlayerEvents>(
    event: E,
    callback: IMusicPlayerEvents[E]
  ): Unsubscribe {
    return this.emitter.on(event, callback);
  }
}
