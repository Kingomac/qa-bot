import { exec } from "child_process";
import { promisify } from "util";
import { createWriteStream } from "fs";
import { c } from "tar";
import * as dotenv from "dotenv";

export default class Backup {
  static env = dotenv.config();
  static async create(): Promise<string> {
    const ex = promisify(exec);
    const res = await ex(
      `${this.env.parsed.MONGODUMP} --host=${this.env.parsed.DB_HOST} --port=${this.env.parsed.DB_PORT} --db=${this.env.parsed.DB_NAME} --out=${this.env.parsed.BACKUP_LOCATION}`
    );
    if (res.stderr) {
      try {
        await Backup.compress();
        return `${res.stderr}Compression successful`;
      } catch (e) {
        return `${res.stderr}*${e}`;
      }
    } else return res.stdout;
  }
  static async compress(): Promise<void> {
    const date = new Date();
    c({ gzip: true }, [
      `${this.env.parsed.BACKUP_LOCATION}/${this.env.parsed.DB_NAME}/`,
    ]).pipe(
      createWriteStream(
        `${this.env.parsed.BACKUP_LOCATION}/${this.env.parsed.DB_NAME}-${
          date.toISOString().split(":").join("_").split(".")[0]
        }.tgz`
      )
    );
  }
}
