import { ArgsOf, Discord, On } from '@typeit/discord'
import { Client } from 'discord.js';
import * as dotenv from 'dotenv'
import { db } from '..';

@Discord() // Decorate the class
abstract class RepplyMode {
    @On("message")
    private async onMessage([message]: ArgsOf<"message">, client:Client, guardPayload: any) {
        const env = dotenv.config();
        if(message.author.bot || message.channel.id != env.parsed.REPPLY_CHANNEL)
            return;
        message.reply(await db.ask(message.content));
    }
}