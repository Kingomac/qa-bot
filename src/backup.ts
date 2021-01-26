import { exec } from "child_process";
import { promisify } from "util";
import { createWriteStream } from "fs";
import { c } from "tar";
import * as dotenv from "dotenv";

export type BackupResponse = {
  message: string;
  path: string;
};

export class Backup {
  static env = dotenv.config();
  static async create(): Promise<BackupResponse> {
    const ex = promisify(exec);
    const res = await ex(
      `${this.env.parsed.MONGODUMP} --host=${this.env.parsed.DB_HOST} --port=${this.env.parsed.DB_PORT} --db=${this.env.parsed.DB_NAME} --out=${this.env.parsed.BACKUP_LOCATION}`
    );
    if (res.stderr) {
      try {
        return {
          message: `${res.stderr}Compression successful`,
          path: await Backup.compress(),
        };
      } catch (e) {
        return { message: `${res.stderr}*${e}`, path: null };
      }
    } else return { message: res.stdout, path: null };
  }
  static async compress(): Promise<string> {
    const date = new Date();
    const path = `${this.env.parsed.BACKUP_LOCATION}/${
      this.env.parsed.DB_NAME
    }-${date.toISOString().split(":").join("_").split(".")[0]}.tgz`;
    c({ gzip: true }, [
      `${this.env.parsed.BACKUP_LOCATION}/${this.env.parsed.DB_NAME}/`,
    ]).pipe(createWriteStream(path));
    return path;
  }
}
