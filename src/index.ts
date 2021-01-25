import { Client } from "@typeit/discord";
import * as dotenv from "dotenv";
import { DatabaseConnection } from "./database";
import { RandomReply } from "./randomReply";

async function start(token: string) {
  if (env.error) throw env.error;

  const client = new Client({
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
    ],
    silent: false,
    variablesChar: ":",
  });
  await client.login(token);
}

const env = dotenv.config();
export const db = new DatabaseConnection(env.parsed.DB_URL);
export const randomReplier = new RandomReply();
db.on("ready", () => randomReplier.initialize());

start(env.parsed.BOT_TOKEN);
