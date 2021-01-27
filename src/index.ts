import { Client } from "@typeit/discord";
import * as dotenv from "dotenv";
import { DatabaseManager } from "./database/manager";
import RandController from "./database/RandController";

const env = dotenv.config();

if (env.error) throw env.error;

export const client = new Client({
  classes: [
    `${__dirname}/src/modes/reply.ts`,
    `${__dirname}/modes/reply.js`,
    `${__dirname}/src/modes/learn.ts`,
    `${__dirname}/modes/learn.js`,
    `${__dirname}/src/commands/general.ts`,
    `${__dirname}/commands/general.js`,
    `${__dirname}/src/commands/qa.ts`,
    `${__dirname}/commands/qa.js`,
    `${__dirname}/src/commands/rand.ts`,
    `${__dirname}/commands/rand.js`,
    `${__dirname}/src/commands/music.ts`,
    `${__dirname}/commands/music.js`,
  ],
  silent: false,
  variablesChar: ":",
});
client.login(env.parsed.BOT_TOKEN);

export const db = new DatabaseManager(
  env.parsed.DB_HOST,
  parseInt(env.parsed.DB_PORT),
  env.parsed.DB_NAME
);
export const randController = new RandController();
db.on("ready", () => randController.initialize());
