import { Client } from '@typeit/discord';
import * as dotenv from 'dotenv';
import { DatabaseConnection } from './database';

async function start(token: string) {
    if(env.error) throw env.error;

    const client  = new Client({
        classes: [
            `${__dirname}/src/modes/repply.ts`,
            `${__dirname}/modes/repply.js`,
            `${__dirname}/src/modes/learn.ts`,
            `${__dirname}/modes/learn.js`,
          ],
          silent: false,
          variablesChar: ":"
    })
    await client.login(token);
}

const env = dotenv.config();
export const db = new DatabaseConnection(env.parsed.DB_URL);

start(env.parsed.BOT_TOKEN);
